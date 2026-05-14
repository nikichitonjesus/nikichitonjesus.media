// show/utils.js - Utilidades y DATA global (versión espiritual)
import { getEpisodiosConSerie } from '../lib/episodios.js';

// ---------- SISTEMA DE CLASIFICACIÓN POR PALABRAS CLAVE (RELIGIOSO) ----------
const CATEGORY_PATTERNS = {
    "Dios": /\b(dios|señor|jehová|yahvé|todopoderoso|creador|el altísimo|divinidad|soberano|padre celestial)\b/i,
    "Espíritu Santo": /\b(espíritu santo|espiritu santo|paracleto|consolador|dones espirituales|fruto del espíritu|soplo divino)\b/i,
    "Jesucristo": /\b(jesús|jesucristo|cristo|mesías|salvador|hijo de dios|redentor|emmanuel|nazareno)\b/i,
    "Salvación y Gracia": /\b(salvación|salvacion|gracia|perdón|arrepentimiento|redención|justificación|sangre de cristo|nuevo nacimiento|conversión)\b/i,
    "Obediencia y Fe": /\b(obediencia|fe|confianza|seguir a dios|mandamientos|discipulado|fidelidad|confesar|creer)\b/i,
    "Vida Cristiana": /\b(vida cristiana|santidad|consagración|testimonio|carácter|cristiano|andar con dios|devocional|discípulo)\b/i,
    "Familia y Matrimonio": /\b(familia|matrimonio|esposos|hijos|padres|hogar|conyugal|paternidad|maternidad|educación cristiana)\b/i,
    "Adoración y Alabanza": /\b(adoración|alabanza|louvor|himno|cántico|cantar a dios|alabar|exaltar|salmo|coro)\b/i,
    "Enseñanzas y Doctrina": /\b(doctrina|teología|dogma|enseñanza|predicación|sermón|estudio bíblico|exégesis|hermenéutica|apologética)\b/i,
    "Profecía y Escatología": /\b(profecía|escatología|apocalipsis|fin de los tiempos|segunda venida|milenio|armagedón|señales)\b/i,
    "Ciencia y Fe": /\b(ciencia y fe|evolución|creación|genética|cosmos|diseño inteligente|orígenes|biología|astrofísica|darwinismo)\b/i,
    "Conferencias y Expositores": /\b(conferencia|congreso|seminario|expositor|pastor|apóstol|profeta|evangelista|maestro|orador)\b/i,
    "Infantil": /\b(niños|infantil|escuela dominical|pequeños|juegos bíblicos|historias bíblicas|títeres|aventuras cristianas)\b/i,
    "Testimonios": /\b(testimonio|experiencia personal|milagro|sanidad|liberación|cambio de vida|transformación|como conocí a dios)\b/i,
    "Oración y Ayuno": /\b(oración|ayuno|intercesión|clamar|suplicar|petición|devoción|vigilia)\b/i
};

export function determineCategories(ep) {
    const cats = new Set();
    const text = (
        (ep.title || '') + ' ' + 
        (ep.description || '') + ' ' + 
        (ep.series?.titulo_serie || '') + ' ' + 
        (ep.series?.descripcion_serie || '')
    ).toLowerCase();

    // Clasificación basada en patrones
    for (const [cat, regex] of Object.entries(CATEGORY_PATTERNS)) {
        if (regex.test(text)) cats.add(cat);
    }

    // Si no hay ninguna categoría, asignamos "Vida Cristiana" por defecto
    if (cats.size === 0) cats.add("Vida Cristiana");
    
    return Array.from(cats);
}

// ---------- DATA GLOBAL ----------
export const DATA = getEpisodiosConSerie().map(ep => ({
    ...ep,
    categories: determineCategories(ep)
}));

// ---------- UTILIDADES ----------
export function getRandomSafe(count, filterFn = () => true) {
    const filtered = DATA.filter(filterFn);
    if (filtered.length === 0) return [];
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, filtered.length));
}

export function showCustomAlert(title, message) {
    const fullMessage = `"${title}" ${message}`;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-zinc-900 rounded-2xl p-6 max-w-md w-[90%] border border-zinc-700 shadow-2xl">
            <h3 class="text-xl font-bold text-white mb-4">${fullMessage}</h3>
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
                <a href="https://www.baltaanay.org/error" target="_blank" class="px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium text-center transition">Reportar</a>
                <a href="https://www.baltaanay.org/contactus" target="_blank" class="px-5 py-2.5 btn-primary rounded-lg text-white font-medium text-center transition">Solicitar</a>
                <button onclick="this.closest('.fixed').remove()" class="px-5 py-2.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium transition">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// ---------- SISTEMA DE RECOMENDACIONES PERSONALIZADAS ----------
// Almacenamiento de historial (vistas/reproducciones) en localStorage
const STORAGE_KEYS = {
    VIEW_HISTORY: 'user_view_history',
    MAX_HISTORY: 50
};

export function addToHistory(episodioId) {
    let history = getViewHistory();
    history = [episodioId, ...history.filter(id => id !== episodioId)];
    if (history.length > STORAGE_KEYS.MAX_HISTORY) history.pop();
    localStorage.setItem(STORAGE_KEYS.VIEW_HISTORY, JSON.stringify(history));
}

export function getViewHistory() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEW_HISTORY)) || [];
    } catch {
        return [];
    }
}

function getWordFrequency(text) {
    const words = text.toLowerCase().split(/\W+/);
    const freq = {};
    for (const w of words) {
        if (w.length > 3) freq[w] = (freq[w] || 0) + 1;
    }
    return freq;
}

export function getPersonalizedRecommendations(limit = 10, excludeId = null) {
    const history = getViewHistory();
    if (history.length === 0) {
        // Si no hay historial, recomendar los más recientes
        return [...DATA].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
    }

    // Obtener episodios vistos para extraer categorías y palabras clave preferidas
    const viewedEpisodes = DATA.filter(ep => history.includes(ep.id));
    const categoryScores = {};
    const wordScores = {};

    viewedEpisodes.forEach(ep => {
        // Ponderar más los vistos recientemente (índice bajo en history = reciente)
        const position = history.indexOf(ep.id);
        const weight = 1 / (position + 1); // más peso a los recientes

        ep.categories.forEach(cat => {
            categoryScores[cat] = (categoryScores[cat] || 0) + weight;
        });

        const text = `${ep.title} ${ep.description} ${ep.series?.titulo_serie || ''}`.toLowerCase();
        const freq = getWordFrequency(text);
        for (const [word, count] of Object.entries(freq)) {
            wordScores[word] = (wordScores[word] || 0) + (count * weight);
        }
    });

    // Función para puntuar un episodio candidato
    function scoreEpisode(ep) {
        if (excludeId && ep.id === excludeId) return -Infinity;
        if (history.includes(ep.id)) return -Infinity; // no recomendar ya vistos

        let catScore = 0;
        ep.categories.forEach(cat => {
            catScore += categoryScores[cat] || 0;
        });

        const text = `${ep.title} ${ep.description} ${ep.series?.titulo_serie || ''}`.toLowerCase();
        let wordScore = 0;
        for (const [word, weight] of Object.entries(wordScores)) {
            if (text.includes(word)) wordScore += weight;
        }

        // Normalización aproximada
        return (catScore * 2) + wordScore;
    }

    const candidates = DATA.filter(ep => !history.includes(ep.id));
    candidates.sort((a, b) => scoreEpisode(b) - scoreEpisode(a));
    return candidates.slice(0, limit);
}
