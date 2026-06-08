// =========================================================
// episodios.js — Base de datos para SITIO DE PODCAST
// (modernizada 2025-2026)
// =========================================================

import { seriesRaw, episodiosRaw, slugify } from 'https://podcast.nikichitonjesus.org/lib/....js';

const seriesMap = Object.fromEntries(seriesRaw.map(s => [s.seriesid, s]));

// Procesar episodios EXACTAMENTE como en el archivo original del podcast
const episodios = episodiosRaw.map(ep => {
  const hasVideo = !!ep.mediaVideo;
  const hasAudio = !!ep.mediaUrl;

  return {
    id: ep.id,
    date: ep.date,
    title: ep.title,
    author: ep.author,
    description: ep.description,
    allowDownload: ep.allowDownload ?? false,
    seriesid: ep.seriesid,
    detailUrl: ep.detailUrl ?? 
        (seriesMap[ep.seriesid]?.url_serie 
            ? `${seriesMap[ep.seriesid].url_serie}/${slugify(ep.title)}` 
            : '/'),

    // ── Campos para el reproductor (exactamente como en el original) ──
    mediaUrl:     ep.mediaUrl    ?? '',
    mediaVideo:   ep.mediaVideo  ?? '',
    initialMode:  ep.initialMode ?? (hasVideo ? 'video' : (hasAudio ? 'audio' : 'audio')),

    coverUrl:     ep.coverUrl    ?? '',
    coverInfo:    ep.coverUrl    ?? '',   // copia automática como en el original
    text:         ep.description ?? '',
    subtitlesUrl: ep.subtitlesUrl ?? '',
    bgColor:      ep.bgColor     ?? seriesMap[ep.seriesid]?.bgColor ?? '#0a0a0a',
    premium:      ep.premium     ?? false   // NOTA: en el original ponía 'false' string, lo dejo como boolean por coherencia, pero si necesitas string cambia a `?? 'false'`
  };
});

export { episodios };

// Exportar series (tal cual)
export const series = seriesRaw;
export { slugify };

// ---------- FUNCIONES DE ACCESO (idénticas al original del podcast) ----------
export function getEpisodioById(id) {
  return episodios.find(ep => ep.id === id);
}

export function getEpisodioByDetailUrl(url) {
  return episodios.find(ep => ep.detailUrl === url);
}

export function getSerieByUrl(url) {
  return series.find(s => s.url_serie === url);
}

export function getSerieById(seriesid) {
  return seriesMap[seriesid];
}

export function getEpisodiosBySerieId(seriesid) {
  return episodios.filter(ep => ep.seriesid === seriesid);
}

export function getEpisodiosBySerieUrl(url) {
  const serie = getSerieByUrl(url);
  return serie ? getEpisodiosBySerieId(serie.seriesid) : [];
}

export function getAllEpisodios() {
  return episodios;
}

// Función extra que tiene el podcast original
export function getEpisodiosConSerie() {
  return episodios.map(ep => ({
    ...ep,
    series: getSerieById(ep.seriesid) || null
  }));
}
