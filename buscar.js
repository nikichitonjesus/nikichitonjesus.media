// buscar.js - Búsqueda profesional con categorías espirituales y recomendaciones personalizadas
import { DATA, getPersonalizedRecommendations, addToHistory } from '../show/utils.js';
import { CATEGORIES, ICONS } from '../show/constants.js';
import { userStorage } from '../storage.js';

// ---------- CONSTANTES LOCALES ----------
const SEARCH_HISTORY_KEY = 'sh_history';
let searchHistory = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
let searchTimeout = null;
let currentView = 'home';
let lastScrollTop = 0;
let isHeaderHidden = false;

// ---------- UTILIDADES ----------
function safeToString(value) {
    return value ? String(value).toLowerCase() : '';
}

function checkInPlaylist(ep) {
    return userStorage.playlist.has(ep.id);
}

// ---------- GESTIÓN DE VISTAS ----------
function switchView(viewName) {
    ['view-home', 'view-results', 'view-category'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(`view-${viewName}`);
    if (target) target.classList.remove('hidden');
    currentView = viewName;
    window.scrollTo(0, 0);
    const header = document.getElementById('mainHeader');
    if (header) {
        header.classList.remove('hidden');
        isHeaderHidden = false;
    }
    closeMobileSearch();
}

function goHome() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    const mobileInput = document.getElementById('mobileSearchInput');
    if (mobileInput) mobileInput.value = '';
    switchView('home');
    renderHistory();
}

// ---------- HISTORIAL DE BÚSQUEDAS ----------
function renderHistory() {
    const container = document.getElementById('historyGrid');
    const section = document.getElementById('historySection');
    if (!container || !section) return;
    if (searchHistory.length === 0) {
        section.classList.add('hidden');
        return;
    }
    section.classList.remove('hidden');
    container.innerHTML = searchHistory.map(term => `
        <div class="history-tag" onclick="useHistory('${term.replace(/'/g, "\\'")}')">
            <span class="material-symbols-rounded text-sm">history</span> ${escapeHtml(term)}
        </div>
    `).join('');
}

function useHistory(term) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = term;
    const mobileInput = document.getElementById('mobileSearchInput');
    if (mobileInput) mobileInput.value = term;
    executeSearch();
}

function clearHistory() {
    searchHistory = [];
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify([]));
    renderHistory();
}

function addToSearchHistory(term) {
    if (!term) return;
    searchHistory = searchHistory.filter(t => t !== term);
    searchHistory.unshift(term);
    if (searchHistory.length > 8) searchHistory.pop();
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
    renderHistory();
}

// ---------- BÚSQUEDA Y SUGERENCIAS ----------
function performQuickSearch(query) {
    if (!query || query.trim() === '') return [];
    const qLow = safeToString(query);
    return DATA.filter(ep => {
        const title = safeToString(ep.title);
        const author = safeToString(ep.author);
        const seriesTitle = ep.series ? safeToString(ep.series.titulo_serie) : '';
        const description = safeToString(ep.description);
        const categories = (ep.categories || []).map(c => safeToString(c));
        return title.includes(qLow) || author.includes(qLow) || seriesTitle.includes(qLow) ||
               description.includes(qLow) || categories.some(cat => cat.includes(qLow));
    }).slice(0, 5);
}

function showSuggestions(items, query) {
    const suggestionsBox = document.getElementById('suggestionsBox');
    if (!suggestionsBox) return;
    if (items.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }
    suggestionsBox.innerHTML = items.map(item => `
        <div class="suggestion-item" onclick="selectSuggestion('${escapeHtml(item.title)}')">
            <img src="${item.coverUrl}" class="w-8 h-8 rounded object-cover" onerror="this.src='https://via.placeholder.com/32/333/666?text=Img'">
            <div class="flex flex-col">
                <span class="text-sm font-bold text-white truncate max-w-[200px]">${escapeHtml(item.title)}</span>
                <span class="text-xs text-zinc-500">${escapeHtml(item.author)}</span>
            </div>
        </div>
    `).join('');
    suggestionsBox.style.display = 'block';
}

function selectSuggestion(title) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = title;
    const mobileInput = document.getElementById('mobileSearchInput');
    if (mobileInput) mobileInput.value = title;
    executeSearch();
}

// ---------- BÚSQUEDA PRINCIPAL (ponderada + recomendaciones) ----------
function executeSearch(query = null) {
    const searchQuery = query ||
                       document.getElementById('searchInput')?.value.trim() ||
                       document.getElementById('mobileSearchInput')?.value.trim();
    if (!searchQuery) return;

    const suggestionsBox = document.getElementById('suggestionsBox');
    if (suggestionsBox) suggestionsBox.style.display = 'none';
    addToSearchHistory(searchQuery);

    showLoadingState(true);

    setTimeout(() => {
        const qLow = safeToString(searchQuery);
        let results = DATA.map(ep => {
            let score = 0;
            const title = safeToString(ep.title);
            const author = safeToString(ep.author);
            const seriesTitle = ep.series ? safeToString(ep.series.titulo_serie) : '';
            const description = safeToString(ep.description);
            const categories = (ep.categories || []).map(c => safeToString(c));

            if (title.includes(qLow)) score += 15;
            if (author.includes(qLow)) score += 12;
            if (seriesTitle.includes(qLow)) score += 10;
            if (categories.some(cat => cat.includes(qLow))) score += 8;
            if (description.includes(qLow)) score += 5;
            if (title === qLow) score += 20;
            if (author === qLow) score += 15;

            return { ep, score };
        }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).map(r => r.ep);

        const isFallback = results.length === 0;
        if (isFallback) {
            document.getElementById('resultsTitle').innerHTML = `Sin resultados exactos para "<span class="text-blue-500">${escapeHtml(searchQuery)}</span>"`;
            document.getElementById('resultsSubtitle').innerText = "Pero encontramos contenido relacionado";
            document.getElementById('topSectionTitle').innerText = "Recomendaciones basadas en tu búsqueda";
            document.getElementById('gridSectionTitle').innerText = "Más contenido que te podría interesar";
            results = getPersonalizedRecommendations(40);
        } else {
            document.getElementById('resultsTitle').innerHTML = `Resultados para "<span class="text-blue-500">${escapeHtml(searchQuery)}</span>"`;
            document.getElementById('resultsSubtitle').innerText = `${results.length} coincidencias encontradas`;
            document.getElementById('topSectionTitle').innerText = "Mejor Coincidencia";
            document.getElementById('gridSectionTitle').innerText = "Todos los resultados";
            if (results.length < 30) {
                const recos = getPersonalizedRecommendations(30 - results.length).filter(r => !results.some(ex => ex.id === r.id));
                results.push(...recos);
            }
        }

        renderSearchResults(results, isFallback);
        showLoadingState(false);
    }, 150);
}

function showLoadingState(show) {
    const loader = document.getElementById('loadingState');
    if (loader) loader.classList.toggle('hidden', !show);
}

// ---------- RENDERIZADO DE RESULTADOS ----------
function renderSearchResults(episodes, isFallback) {
    switchView('results');

    if (episodes.length === 0) episodes = getPersonalizedRecommendations(30);

    const topHit = episodes[0];
    const nextHits = episodes.slice(1, 6);

    // Top result (izquierda)
    const topHitContainer = document.getElementById('topHitContainer');
    if (topHitContainer && topHit) {
        const inPlaylist = checkInPlaylist(topHit);
        const addIcon = inPlaylist ? ICONS.added : ICONS.add;
        const dlIcon = topHit.allowDownload !== false ? ICONS.dl : ICONS.noDl;
        const typeClass = topHit.initialMode === 'video' ? 'video' : 'audio';
        const category = topHit.categories?.[0] || 'Vida Cristiana';

        topHitContainer.innerHTML = `
            <div class="top-result-card group hover-trigger">
                <div onclick="goToDetail('${topHit.detailUrl}')" class="cursor-pointer">
                    <img src="${topHit.coverUrl}" class="top-result-img" onerror="this.src='https://via.placeholder.com/600x400/333/666?text=Imagen'">
                    <div class="type-badge ${typeClass}">${topHit.initialMode === 'video' ? 'VIDEO' : 'AUDIO'}</div>
                    <div class="p-6 md:p-8 flex-1 flex flex-col justify-center relative">
                        ${isFallback ? '<span class="absolute top-4 right-4 bg-yellow-600/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-600/30">RELACIONADO</span>' : ''}
                        <div class="flex items-center gap-2 mb-3">
                            <span class="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-blue-600/20">${escapeHtml(category)}</span>
                        </div>
                        <h3 class="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">${escapeHtml(topHit.title)}</h3>
                        <p class="text-zinc-400 text-sm line-clamp-2 mb-4">${escapeHtml(topHit.description)}</p>
                        <p class="text-white font-bold text-sm flex items-center gap-2">
                            <span class="material-symbols-rounded text-lg text-zinc-500">mic</span> ${escapeHtml(topHit.author)}
                        </p>
                    </div>
                </div>
                <div class="overlay-actions">
                    <img src="${addIcon}" class="action-btn" onclick="handleAddSearch(event, '${topHit.id}')" data-episode-id="${topHit.id}" data-added="${inPlaylist}">
                    <img src="${ICONS.play}" class="w-16 h-16 md:w-20 md:h-20 hover:scale-110 transition cursor-pointer" onclick="handlePlaySearch(event, '${topHit.id}')">
                    <img src="${dlIcon}" class="action-btn" onclick="handleDlSearch(event, '${topHit.id}')" title="${topHit.allowDownload !== false ? 'Descargar' : 'No disponible'}">
                </div>
                <div class="mobile-play-button" onclick="handlePlaySearch(event, '${topHit.id}')">
                    <img src="${ICONS.play}" alt="Play">
                </div>
            </div>`;
    }

    // Lista lateral (derecha)
    const listContainer = document.getElementById('topListContainer');
    if (listContainer) {
        listContainer.innerHTML = '';
        nextHits.forEach(ep => {
            const inPlaylist = checkInPlaylist(ep);
            const addIcon = inPlaylist ? ICONS.added : ICONS.add;
            const typeClass = ep.initialMode === 'video' ? 'video' : 'audio';
            const category = ep.categories?.[0] || 'Vida Cristiana';
            listContainer.innerHTML += `
                <div class="list-row group hover-trigger">
                    <div class="relative flex-shrink-0" onclick="goToDetail('${ep.detailUrl}')">
                        <img src="${ep.coverUrl}" class="list-row-img" onerror="this.src='https://via.placeholder.com/72/333/666?text=Img'">
                        <div class="type-badge ${typeClass}" style="top: 4px; left: 4px; font-size: 8px; padding: 2px 4px;">${ep.initialMode === 'video' ? 'VID' : 'AUD'}</div>
                        <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded-xl">
                            <span class="material-symbols-rounded text-white text-3xl">play_arrow</span>
                        </div>
                        <div class="mobile-play-button" onclick="handlePlaySearch(event, '${ep.id}')">
                            <img src="${ICONS.play}" alt="Play">
                        </div>
                    </div>
                    <div class="flex-1 min-w-0" onclick="goToDetail('${ep.detailUrl}')">
                        <h4 class="font-bold text-base md:text-lg text-white truncate mb-0.5">${escapeHtml(ep.title)}</h4>
                        <p class="text-sm text-zinc-400 truncate">${escapeHtml(ep.author)}</p>
                        <span class="inline-block mt-1 bg-zinc-800/50 text-zinc-300 text-[10px] px-2 py-0.5 rounded">${escapeHtml(category)}</span>
                    </div>
                    <div class="px-2 opacity-0 group-hover:opacity-100 transition">
                        <img src="${addIcon}" class="w-6 h-6 md:w-8 md:h-8 invert opacity-70 hover:opacity-100" onclick="handleAddSearch(event, '${ep.id}')" data-episode-id="${ep.id}" data-added="${inPlaylist}">
                    </div>
                </div>`;
        });
    }

    // Episodios relacionados (carrusel doble)
    const relatedItems = episodes.slice(6, 26);
    const relatedSection = document.getElementById('relatedSectionWrapper');
    if (relatedSection && relatedItems.length) {
        const relatedHTML = relatedItems.map(ep => {
            const inPlaylist = checkInPlaylist(ep);
            const addIcon = inPlaylist ? ICONS.added : ICONS.add;
            const typeClass = ep.initialMode === 'video' ? 'video' : 'audio';
            const category = ep.categories?.[0] || 'Vida Cristiana';
            return `
                <div class="w-[300px] md:w-[340px] flex gap-3 md:gap-4 items-center p-3 rounded-2xl hover:bg-white/5 cursor-pointer group hover-trigger border border-transparent hover:border-white/5 transition">
                    <div class="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-lg" onclick="goToDetail('${ep.detailUrl}')">
                        <img src="${ep.coverUrl}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/80/333/666?text=Img'">
                        <div class="type-badge ${typeClass}" style="top: 4px; left: 4px; font-size: 8px; padding: 2px 4px;">${ep.initialMode === 'video' ? 'VID' : 'AUD'}</div>
                        <div class="overlay-actions">
                            <img src="${ICONS.play}" class="w-10 h-10 md:w-12 md:h-12 hover:scale-110 cursor-pointer" onclick="handlePlaySearch(event, '${ep.id}')">
                        </div>
                        <div class="mobile-play-button" onclick="handlePlaySearch(event, '${ep.id}')">
                            <img src="${ICONS.play}" alt="Play">
                        </div>
                    </div>
                    <div class="flex-1 min-w-0" onclick="goToDetail('${ep.detailUrl}')">
                        <h4 class="font-bold text-sm truncate text-white mb-1">${escapeHtml(ep.title)}</h4>
                        <p class="text-xs text-zinc-500 truncate">${escapeHtml(ep.author)}</p>
                        <span class="inline-block mt-1 bg-zinc-800/30 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded">${escapeHtml(category)}</span>
                    </div>
                    <div class="opacity-0 group-hover:opacity-100 transition">
                        <img src="${addIcon}" class="w-5 h-5 md:w-6 md:h-6 invert opacity-70 hover:opacity-100" onclick="handleAddSearch(event, '${ep.id}')" data-episode-id="${ep.id}" data-added="${inPlaylist}">
                    </div>
                </div>`;
        }).join('');
        relatedSection.innerHTML = `
            <h3 class="text-sm font-bold mb-4 md:mb-6 text-zinc-500 uppercase tracking-widest">
                ${isFallback ? 'Contenido Relacionado' : 'Episodios Similares'}
            </h3>
            <div class="carousel-wrapper relative group/car">
                <div class="carousel-btn left" onclick="document.getElementById('rel-car').scrollLeft -= 600">
                    <div class="carousel-arrow"><span class="material-symbols-rounded">chevron_left</span></div>
                </div>
                <div id="rel-car" class="flex flex-col flex-wrap h-[260px] md:h-[280px] gap-4 overflow-x-auto no-scrollbar scroll-smooth px-1">
                    ${relatedHTML}
                </div>
                <div class="carousel-btn right" onclick="document.getElementById('rel-car').scrollLeft += 600">
                    <div class="carousel-arrow"><span class="material-symbols-rounded">chevron_right</span></div>
                </div>
            </div>`;
    } else if (relatedSection) relatedSection.innerHTML = '';

    // Programas (series)
    const uniqueSeries = [...new Map(
        episodes.filter(ep => ep.series && ep.series.titulo_serie)
            .map(ep => [ep.series.titulo_serie, ep.series])
    ).values()].slice(0, 10);
    const programsSection = document.getElementById('programsSectionWrapper');
    if (programsSection && uniqueSeries.length) {
        const programsHTML = uniqueSeries.map(s => `
            <div class="series-card-container" onclick="goToDetail('${s.url_serie}')">
                <div class="series-cover">
                    <img src="${s.portada_serie}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/200/333/666?text=Serie'">
                    <div class="absolute inset-0 bg-black/0 hover:bg-black/20 transition duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <span class="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase">Ver</span>
                    </div>
                </div>
                <h4 class="mt-3 text-center font-bold text-sm text-zinc-300 group-hover:text-white truncate px-1">${escapeHtml(s.titulo_serie)}</h4>
            </div>
        `).join('');
        programsSection.innerHTML = `
            <h3 class="text-sm font-bold mb-4 md:mb-6 text-zinc-500 uppercase tracking-widest">
                ${isFallback ? 'Series Populares' : 'Series Relacionadas'}
            </h3>
            ${wrapInCarousel(programsHTML, '-programs')}
        `;
    } else if (programsSection) programsSection.innerHTML = '';

    // Grid final (todos los episodios)
    const remaining = episodes.slice(26);
    const allResultsGrid = document.getElementById('allResultsGrid');
    if (allResultsGrid) {
        let gridEpisodes = remaining;
        if (gridEpisodes.length < 12) {
            const extra = getPersonalizedRecommendations(12 - gridEpisodes.length).filter(r => !episodes.some(e => e.id === r.id));
            gridEpisodes = [...gridEpisodes, ...extra];
        }
        allResultsGrid.innerHTML = gridEpisodes.map(ep => {
            const inPlaylist = checkInPlaylist(ep);
            const addIcon = inPlaylist ? ICONS.added : ICONS.add;
            const dlIcon = ep.allowDownload !== false ? ICONS.dl : ICONS.noDl;
            const typeClass = ep.initialMode === 'video' ? 'video' : 'audio';
            const category = ep.categories?.[0] || 'Vida Cristiana';
            return `
                <div class="group hover-trigger cursor-pointer flex flex-col gap-3">
                    <div class="relative aspect-square rounded-2xl overflow-hidden bg-zinc-800 shadow-lg border border-white/5 group-hover:border-white/20 transition-colors">
                        <div onclick="goToDetail('${ep.detailUrl}')" class="cursor-pointer">
                            <img src="${ep.coverUrl}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/300/333/666?text=Img'">
                            <div class="type-badge ${typeClass}">${ep.initialMode === 'video' ? 'VIDEO' : 'AUDIO'}</div>
                        </div>
                        <div class="overlay-actions">
                            <img src="${addIcon}" class="action-btn" onclick="handleAddSearch(event, '${ep.id}')" data-episode-id="${ep.id}" data-added="${inPlaylist}">
                            <img src="${ICONS.play}" class="w-12 h-12 md:w-14 md:h-14 hover:scale-110 cursor-pointer" onclick="handlePlaySearch(event, '${ep.id}')">
                            <img src="${dlIcon}" class="action-btn" onclick="handleDlSearch(event, '${ep.id}')" title="${ep.allowDownload !== false ? 'Descargar' : 'No disponible'}">
                        </div>
                        <div class="mobile-play-button" onclick="handlePlaySearch(event, '${ep.id}')">
                            <img src="${ICONS.play}" alt="Play">
                        </div>
                    </div>
                    <div onclick="goToDetail('${ep.detailUrl}')" class="cursor-pointer">
                        <h4 class="font-bold text-sm truncate text-white">${escapeHtml(ep.title)}</h4>
                        <p class="text-xs text-zinc-500 truncate">${escapeHtml(ep.author)}</p>
                        <span class="inline-block mt-1 bg-zinc-800/30 text-zinc-300 text-[9px] px-1.5 py-0.5 rounded">${escapeHtml(category)}</span>
                    </div>
                </div>`;
        }).join('');
    }
}

// ---------- VISTA CATEGORÍA ----------
function openCategory(cat) {
    switchView('category');
    document.getElementById('catHeaderTitle').innerText = cat.name;
    const colorClass = cat.color || 'cat-otras';
    document.getElementById('catHeaderBg').className = `absolute inset-0 ${colorClass} z-0 scale-100 group-hover:scale-105 transition-transform duration-1000`;

    const items = DATA.filter(ep => (ep.categories || []).includes(cat.name));
    const container = document.getElementById('catContent');
    if (!container) return;
    container.innerHTML = '';

    // Destacados
    const highlighted = items.slice(0, 10);
    if (highlighted.length) {
        const stdHTML = highlighted.map(ep => {
            const inPlaylist = checkInPlaylist(ep);
            const addIcon = inPlaylist ? ICONS.added : ICONS.add;
            const typeClass = ep.initialMode === 'video' ? 'video' : 'audio';
            return `
                <div class="min-w-[200px] md:min-w-[240px] w-[200px] md:w-[240px] group hover-trigger cursor-pointer">
                    <div class="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-zinc-800 border border-white/5" onclick="goToDetail('${ep.detailUrl}')">
                        <img src="${ep.coverUrl}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/240/333/666?text=Img'">
                        <div class="type-badge ${typeClass}">${ep.initialMode === 'video' ? 'VID' : 'AUD'}</div>
                        <div class="overlay-actions">
                            <img src="${addIcon}" class="action-btn" onclick="handleAddSearch(event, '${ep.id}')" data-episode-id="${ep.id}" data-added="${inPlaylist}">
                            <img src="${ICONS.play}" class="w-14 h-14 md:w-16 md:h-16 hover:scale-110" onclick="handlePlaySearch(event, '${ep.id}')">
                        </div>
                        <div class="mobile-play-button" onclick="handlePlaySearch(event, '${ep.id}')">
                            <img src="${ICONS.play}" alt="Play">
                        </div>
                    </div>
                    <div onclick="goToDetail('${ep.detailUrl}')" class="cursor-pointer">
                        <h4 class="font-bold text-sm md:text-base truncate">${escapeHtml(ep.title)}</h4>
                        <p class="text-xs text-zinc-500 truncate">${escapeHtml(ep.author)}</p>
                    </div>
                </div>`;
        }).join('');
        container.innerHTML += `<section><h3 class="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">Destacados en ${cat.name}</h3>${wrapInCarousel(stdHTML, '-highlighted')}</section>`;
    }

    // Series únicas
    const uniqueSeries = [...new Map(
        items.filter(ep => ep.series && ep.series.titulo_serie)
            .map(ep => [ep.series.titulo_serie, ep.series])
    ).values()].slice(0, 10);
    if (uniqueSeries.length) {
        const seriesHTML = uniqueSeries.map(s => `
            <div class="series-card-container" onclick="goToDetail('${s.url_serie}')">
                <div class="series-cover">
                    <img src="${s.portada_serie}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/200/333/666?text=Serie'">
                </div>
                <h4 class="mt-3 text-center font-bold text-sm text-zinc-300 truncate">${escapeHtml(s.titulo_serie)}</h4>
            </div>
        `).join('');
        container.innerHTML += `<section><h3 class="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">Programas</h3>${wrapInCarousel(seriesHTML, '-series')}</section>`;
    }

    // Grid completo (al menos 15)
    let gridItems = items.slice(10, 30);
    if (gridItems.length < 15) {
        const recos = getPersonalizedRecommendations(15 - gridItems.length).filter(r => !items.some(i => i.id === r.id));
        gridItems.push(...recos);
    }
    if (gridItems.length) {
        container.innerHTML += `
            <section>
                <h3 class="text-lg md:text-xl font-bold mb-4 md:mb-6 text-white">Explorar Todo</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
                    ${gridItems.map(ep => {
                        const inPlaylist = checkInPlaylist(ep);
                        const addIcon = inPlaylist ? ICONS.added : ICONS.add;
                        const typeClass = ep.initialMode === 'video' ? 'video' : 'audio';
                        return `
                            <div class="cursor-pointer group hover-trigger">
                                <div class="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-zinc-800" onclick="goToDetail('${ep.detailUrl}')">
                                    <img src="${ep.coverUrl}" class="w-full h-full object-cover" onerror="this.src='https://via.placeholder.com/200/333/666?text=Img'">
                                    <div class="type-badge ${typeClass}" style="top: 8px; left: 8px; font-size: 9px; padding: 2px 6px;">${ep.initialMode === 'video' ? 'VID' : 'AUD'}</div>
                                    <div class="overlay-actions">
                                        <img src="${addIcon}" class="w-8 h-8 md:w-10 md:h-10" onclick="handleAddSearch(event, '${ep.id}')" data-episode-id="${ep.id}" data-added="${inPlaylist}">
                                        <img src="${ICONS.play}" class="w-10 h-10 md:w-12 md:h-12" onclick="handlePlaySearch(event, '${ep.id}')">
                                    </div>
                                    <div class="mobile-play-button" onclick="handlePlaySearch(event, '${ep.id}')">
                                        <img src="${ICONS.play}" alt="Play">
                                    </div>
                                </div>
                                <div onclick="goToDetail('${ep.detailUrl}')" class="cursor-pointer">
                                    <h4 class="font-bold text-sm truncate text-zinc-200 group-hover:text-white">${escapeHtml(ep.title)}</h4>
                                </div>
                            </div>`;
                    }).join('')}
                </div>
            </section>`;
    }
}

// ---------- HANDLERS (playlist, reproducción, descarga) ----------
function handleAddSearch(e, id) {
    e.stopPropagation();
    const ep = DATA.find(x => x.id == id);
    if (!ep) return;
    const button = e.target.closest('img');
    if (!button) return;
    if (userStorage.playlist.has(ep.id)) {
        userStorage.playlist.remove(ep.id);
        button.src = ICONS.add;
        button.dataset.added = 'false';
        button.title = 'Añadir a lista';
    } else {
        userStorage.playlist.add(ep.id);
        button.src = ICONS.added;
        button.dataset.added = 'true';
        button.title = 'Añadido';
    }
    button.style.transform = 'scale(1.2)';
    setTimeout(() => button.style.transform = 'scale(1)', 200);
}

function handlePlaySearch(e, id) {
    e.stopPropagation();
    const ep = DATA.find(x => x.id == id);
    if (!ep) return;
    addToHistory(ep.id);
    if (typeof window.playEpisodeExpanded === 'function') {
        window.playEpisodeExpanded(
            ep.mediaUrl,
            ep.initialMode === 'video' ? 'video' : 'audio',
            ep.coverUrl,
            ep.coverUrl,
            ep.title,
            ep.detailUrl,
            ep.author,
            [],
            ep.description || '',
            ep.allowDownload !== false
        );
    } else {
        window.location.href = ep.detailUrl;
    }
}

function handleDlSearch(e, id) {
    e.stopPropagation();
    const ep = DATA.find(x => x.id == id);
    if (!ep || ep.allowDownload === false) {
        alert('Descarga no disponible');
        return;
    }
    const ext = ep.initialMode === 'video' ? 'mp4' : 'mp3';
    const filename = `${ep.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.${ext}`;
    const a = document.createElement('a');
    a.href = ep.mediaUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
        if (!a.href.startsWith('blob:')) window.open(ep.mediaUrl, '_blank');
    }, 1000);
}

function goToDetail(url) {
    if (url && url !== '#' && url !== '/') window.location.href = url;
}

// ---------- CARRUSEL ----------
function wrapInCarousel(contentHTML, idSuffix = '') {
    const id = `c-${Math.random().toString(36).substr(2, 9)}${idSuffix}`;
    return `
        <div class="carousel-wrapper relative group/car">
            <div class="carousel-btn left" onclick="document.getElementById('${id}').scrollLeft -= 600">
                <div class="carousel-arrow"><span class="material-symbols-rounded">chevron_left</span></div>
            </div>
            <div id="${id}" class="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-1">
                ${contentHTML}
            </div>
            <div class="carousel-btn right" onclick="document.getElementById('${id}').scrollLeft += 600">
                <div class="carousel-arrow"><span class="material-symbols-rounded">chevron_right</span></div>
            </div>
        </div>
    `;
}

// ---------- RENDER PRINCIPAL (home con categorías) ----------
export function render(container) {
    container.innerHTML = `
        <div class="max-w-7xl mx-auto py-6 md:py-10 px-4">
            <!-- Header búsqueda -->
            <div class="mb-8">
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <div class="relative flex-1 w-full">
                        <span class="material-symbols-rounded absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">search</span>
                        <input type="text" id="searchInput" placeholder="Buscar episodios, series, autores..." class="w-full bg-white/5 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all" autocomplete="off">
                        <div id="suggestionsBox" class="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl hidden z-50"></div>
                    </div>
                    <button id="searchButton" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full transition-colors whitespace-nowrap">Buscar</button>
                </div>
                <div id="historyContainer" class="mt-4 flex flex-wrap gap-2"></div>
            </div>
            <div id="searchContent">
                <div id="view-home">
                    <div id="historySection" class="hidden mb-8 md:mb-12">
                        <div class="flex items-center justify-between mb-4">
                            <h2 class="text-sm font-bold text-zinc-400 uppercase tracking-widest">Búsquedas Recientes</h2>
                            <button onclick="clearHistory()" class="text-xs text-zinc-500 hover:text-white">Borrar</button>
                        </div>
                        <div id="historyGrid" class="flex flex-wrap gap-2 md:gap-3"></div>
                    </div>
                    <div class="mb-8 md:mb-12">
                        <h2 class="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 text-white">Explorar por Categorías</h2>
                        <div id="categoriesGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"></div>
                    </div>
                </div>
                <div id="view-results" class="hidden space-y-12 md:space-y-20">
                    <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 md:pb-6 gap-4">
                        <div><h1 class="text-2xl md:text-3xl font-extrabold text-white" id="resultsTitle">Resultados</h1><p class="text-zinc-400 text-sm mt-1 md:mt-2" id="resultsSubtitle">Mejores coincidencias</p></div>
                        <button onclick="goHome()" class="text-sm font-bold bg-zinc-800 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full hover:bg-zinc-700 transition self-start md:self-auto">Volver a Explorar</button>
                    </div>
                    <section id="topResultsSection">
                        <h3 class="text-sm font-bold mb-4 md:mb-6 text-zinc-500 uppercase tracking-widest flex items-center gap-2" id="topSectionTitle"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Principal</h3>
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 h-auto lg:h-[400px] md:h-[460px]">
                            <div class="lg:col-span-1 h-full" id="topHitContainer"></div>
                            <div class="lg:col-span-2 flex flex-col gap-3 overflow-y-auto no-scrollbar pr-2 h-full" id="topListContainer"></div>
                        </div>
                    </section>
                    <section id="relatedSectionWrapper"></section>
                    <section id="programsSectionWrapper"></section>
                    <section>
                        <h3 class="text-sm font-bold mb-4 md:mb-6 text-zinc-500 uppercase tracking-widest" id="gridSectionTitle">Todos los Episodios</h3>
                        <div id="allResultsGrid" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"></div>
                        <div id="loadingState" class="hidden text-center py-10"><div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mb-4"></div><p class="text-zinc-400">Cargando más episodios...</p></div>
                    </section>
                </div>
                <div id="view-category" class="hidden space-y-10 md:space-y-16 pb-10 md:pb-20">
                    <div class="category-header rounded-[30px] md:rounded-[40px] relative overflow-hidden flex items-end p-6 md:p-12 shadow-2xl group">
                        <div class="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 z-0 scale-100 group-hover:scale-105 transition-transform duration-1000" id="catHeaderBg"></div>
                        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 40px 40px;"></div>
                        <div class="relative z-10 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-0">
                            <div><span class="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest text-white mb-3 md:mb-4">Colección</span><h1 class="text-4xl md:text-7xl font-black tracking-tighter text-white drop-shadow-lg" id="catHeaderTitle">Categoría</h1></div>
                            <button onclick="goHome()" class="close-category-btn bg-black/20 backdrop-blur-xl border border-white/10 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-white hover:text-black transition self-start md:self-auto">Cerrar</button>
                        </div>
                    </div>
                    <div id="catContent" class="space-y-12 md:space-y-20"></div>
                </div>
            </div>
        </div>
    `;

    renderCategories();
    renderHistory();
    attachSearchEvents();
    initScrollHeader();
}

function renderCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    CATEGORIES.filter(c => c !== "Todos").forEach(cat => {
        const colorClass = getColorClassForCategory(cat);
        const iconUrl = getIconUrlForCategory(cat);
        const card = document.createElement('div');
        card.className = `cat-card ${colorClass}`;
        card.onclick = () => openCategory({ name: cat, color: colorClass });
        card.innerHTML = `
            <span class="cat-title">${cat}</span>
            <img src="${iconUrl}" alt="${cat}" class="cat-icon" onerror="this.style.display='none'">
        `;
        grid.appendChild(card);
    });
}

function getColorClassForCategory(cat) {
    const map = {
        "Dios": "cat-dios", "Espíritu Santo": "cat-espiritu", "Jesucristo": "cat-jesus",
        "Salvación y Gracia": "cat-salvacion", "Obediencia y Fe": "cat-fe", "Vida Cristiana": "cat-vida",
        "Familia y Matrimonio": "cat-familia", "Adoración y Alabanza": "cat-adoracion",
        "Enseñanzas y Doctrina": "cat-ensenanza", "Profecía y Escatología": "cat-profecia",
        "Ciencia y Fe": "cat-cienciafe", "Conferencias y Expositores": "cat-conferencias",
        "Infantil": "cat-infantil", "Testimonios": "cat-testimonios", "Oración y Ayuno": "cat-oracion"
    };
    return map[cat] || "cat-otras";
}

function getIconUrlForCategory(cat) {
    const base = "https://www.baltaanay.org/web/image/";
    const map = {
        "Dios": "984-0117ef91/derecho.webp",
        "Espíritu Santo": "988-326dfd1d/mate.webp",
        "Jesucristo": "993-e89dd1bd/fisica.webp",
        "Salvación y Gracia": "987-46c4f529/historia.webp",
        "Obediencia y Fe": "997-bd88d736/filosofia.webp",
        "Vida Cristiana": "995-e7b9293a/Economia.webp",
        "Familia y Matrimonio": "992-8520c3e9/social.webp",
        "Adoración y Alabanza": "982-467eeb06/arte.webp",
        "Enseñanzas y Doctrina": "994-8563f40f/literatura.webp",
        "Profecía y Escatología": "983-eddfff89/cine.webp",
        "Ciencia y Fe": "996-efa5c61e/documental.webp",
        "Conferencias y Expositores": "990-f3ecf514/naturaleza.webp",
        "Infantil": "989-01ff4645/tecnologia.webp",
        "Testimonios": "985-2d88e694/otros.webp",
        "Oración y Ayuno": "985-2d88e694/otros.webp"
    };
    return base + (map[cat] || "985-2d88e694/otros.webp");
}

function attachSearchEvents() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const suggestionsBox = document.getElementById('suggestionsBox');
    if (!searchInput || !searchButton) return;

    searchInput.addEventListener('input', (e) => {
        const val = e.target.value.trim();
        clearTimeout(searchTimeout);
        if (val.length > 1) {
            searchTimeout = setTimeout(() => {
                const matches = performQuickSearch(val);
                showSuggestions(matches, val);
            }, 300);
        } else {
            if (suggestionsBox) suggestionsBox.style.display = 'none';
        }
    });
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') executeSearch(); });
    searchButton.addEventListener('click', () => executeSearch());

    document.addEventListener('click', (e) => {
        if (suggestionsBox && searchInput && !suggestionsBox.contains(e.target) && !searchInput.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

function initScrollHeader() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const st = window.pageYOffset || document.documentElement.scrollTop;
                const header = document.getElementById('mainHeader');
                if (header && (currentView === 'results' || currentView === 'category')) {
                    if (st > lastScrollTop && st > 100) {
                        if (!isHeaderHidden) { header.classList.add('hidden'); isHeaderHidden = true; }
                    } else if (st < lastScrollTop || st <= 50) {
                        if (isHeaderHidden) { header.classList.remove('hidden'); isHeaderHidden = false; }
                    }
                } else if (header) { header.classList.remove('hidden'); isHeaderHidden = false; }
                lastScrollTop = st <= 0 ? 0 : st;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function closeMobileSearch() {
    const mobileBar = document.getElementById('mobileSearchBar');
    if (mobileBar) mobileBar.classList.remove('open');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ---------- EXPORTS PARA EL ROUTER ----------
export function renderSearch(container, query) {
    if (query) window.history.replaceState(null, null, `/buscar?q=${encodeURIComponent(query)}`);
    render(container);
    if (query) setTimeout(() => executeSearch(query), 100);
}

export function renderCategory(container, category) {
    render(container);
    const catObj = { name: category, color: getColorClassForCategory(category) };
    setTimeout(() => openCategory(catObj), 100);
}

// Hacer accesibles globalmente algunas funciones (para onclick inline)
window.goToDetail = goToDetail;
window.handleAddSearch = handleAddSearch;
window.handlePlaySearch = handlePlaySearch;
window.handleDlSearch = handleDlSearch;
window.executeSearch = executeSearch;
window.goHome = goHome;
window.useHistory = useHistory;
window.clearHistory = clearHistory;
window.selectSuggestion = selectSuggestion;
window.openCategory = openCategory;
