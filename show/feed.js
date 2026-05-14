// show/feed.js - Vista del feed principal (home) con contenido espiritual
import { createCarousel, createSeriesCarousel } from './carousel.js';
import { getRandomSafe, DATA } from './utils.js';
import { CATEGORIES } from './constants.js';

export function renderFeed(container) {
    let feedView = document.getElementById('feed-view');
    let gridView = document.getElementById('grid-view');
    if (!feedView) {
        container.innerHTML = `
            <div id="feed-view" class="space-y-8 sm:space-y-12 transition-opacity duration-300"></div>
            <div id="grid-view" class="hidden transition-opacity duration-300">
                <div class="flex items-center justify-between mb-6 sm:mb-8 mt-4 sm:mt-6">
                    <h2 id="grid-title" class="text-xl sm:text-2xl font-bold">Resultados</h2>
                    <button id="closeGridBtn" class="text-sm font-bold text-gray-400 hover:text-white flex items-center gap-1">
                        <span class="text-xl">×</span> Cerrar búsqueda
                    </button>
                </div>
                <div id="results-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6"></div>
                <div id="empty-state" class="hidden py-8 sm:py-10 text-center">
                    <p class="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8" id="empty-msg">No encontramos nada...</p>
                    <h3 class="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-white">Quizás te interese esto:</h3>
                    <div id="recommendations-grid" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6"></div>
                </div>
            </div>
        `;
        feedView = document.getElementById('feed-view');
        gridView = document.getElementById('grid-view');
    }

    feedView.innerHTML = '';

    // 1. Destacados del día
    feedView.innerHTML += createCarousel("Destacados del Día", "vertical",
        getRandomSafe(15), "Todos", 'items');

    // 2. Nuevos lanzamientos (últimos 30 días)
    feedView.innerHTML += createCarousel("Nuevos Lanzamientos", "standard",
        getRandomSafe(15, ep => new Date(ep.date) > new Date(Date.now() - 30*24*60*60*1000)), "Todos", 'items');

    // 3. Series en video
    feedView.innerHTML += createCarousel("Series en Video", "expand",
        getRandomSafe(10, e => e.initialMode === 'video'), "Dios", 'category');

    // 4. Top semanal (más populares - simulamos con random)
    feedView.innerHTML += createCarousel("Top Semanal", "list",
        getRandomSafe(16), "Todos", 'items');

    // 5. Para estudio bíblico (contenido doctrinal)
    feedView.innerHTML += createCarousel("Para Estudio Bíblico", "double",
        getRandomSafe(20, e => e.categories.includes("Enseñanzas y Doctrina") || e.categories.includes("Teología")), "Enseñanzas y Doctrina", 'category');

    // 6. Teología y Doctrina
    feedView.innerHTML += createCarousel("Teología y Doctrina", "standard",
        getRandomSafe(15, e => e.categories.includes("Enseñanzas y Doctrina")), "Enseñanzas y Doctrina", 'category');

    // 7. Adoración y Alabanza (especiales en video)
    feedView.innerHTML += createCarousel("Adoración y Alabanza", "expand",
        getRandomSafe(10, e => e.initialMode === 'video' && e.categories.includes("Adoración y Alabanza")), "Adoración y Alabanza", 'category');

    // 8. Vida Cristiana
    feedView.innerHTML += createCarousel("Vida Cristiana", "standard",
        getRandomSafe(15, e => e.categories.includes("Vida Cristiana")), "Vida Cristiana", 'category');

    // 9. Familia y Matrimonio
    feedView.innerHTML += createCarousel("Familia y Matrimonio", "double",
        getRandomSafe(20, e => e.categories.some(c => ["Familia y Matrimonio", "Infantil"].includes(c))), "Familia y Matrimonio", 'category');

    // 10. Ciencia y Fe
    feedView.innerHTML += createCarousel("Ciencia y Fe", "standard",
        getRandomSafe(15, e => e.categories.includes("Ciencia y Fe")), "Ciencia y Fe", 'category');

    // 11. Serie de carruseles generales
    feedView.innerHTML += createSeriesCarousel();

    // 12. Testimonios y Experiencias
    feedView.innerHTML += createCarousel("Testimonios", "standard",
        getRandomSafe(15, e => e.categories.includes("Testimonios")), "Testimonios", 'category');

    // 13. Oración y Ayuno
    feedView.innerHTML += createCarousel("Oración y Ayuno", "list",
        getRandomSafe(16, e => e.categories.includes("Oración y Ayuno")), "Oración y Ayuno", 'items');

    // 14. Podcasts de Espiritualidad
    feedView.innerHTML += createCarousel("Podcasts Cristianos", "standard",
        getRandomSafe(15, e => e.initialMode === 'audio'), "Todos", 'items');

    // 15. Conferencias y Expositores
    feedView.innerHTML += createCarousel("Conferencias y Expositores", "expand",
        getRandomSafe(10, e => e.categories.includes("Conferencias y Expositores")), "Conferencias y Expositores", 'category');

    // 16. Profecía y Escatología
    feedView.innerHTML += createCarousel("Profecía y Escatología", "standard",
        getRandomSafe(15, e => e.categories.includes("Profecía y Escatología")), "Profecía y Escatología", 'category');

    // 17. Mix espiritual
    feedView.innerHTML += createCarousel("Mix Espiritual", "double",
        getRandomSafe(20), "Todos", 'items');
}
