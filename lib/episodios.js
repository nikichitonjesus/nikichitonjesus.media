// =========================================================
// episodios.js — Catálogo para SITIO DE PODCAST
// =========================================================

import { seriesRaw, episodiosRaw, slugify } from './lib/....js';

const seriesMap = Object.fromEntries(seriesRaw.map(s => [s.seriesid, s]));

// Procesar episodios para podcast (solo audio, por ejemplo)
const episodios = episodiosRaw.map(ep => {
  const serie = ep.seriesid ? seriesMap[ep.seriesid] : null;
  
  // Si el podcast solo admite audio, priorizamos mediaUrl
  // Si no tiene audio, quizás ignoramos el episodio o usamos mediaVideo como respaldo
  const audioUrl = ep.mediaUrl || ep.mediaVideo || '';
  const hasAudio = !!audioUrl;
  
  return {
    id: ep.id,
    date: ep.date,
    title: ep.title,
    author: ep.author,
    description: ep.description,
    allowDownload: ep.allowDownload ?? false,
    seriesid: ep.seriesid,
    // Para podcast, el detailUrl podría ser diferente (ej. /podcast/...)
    detailUrl: ep.detailUrl ?? (serie ? `/podcast${serie.url_serie}/${slugify(ep.title)}` : `/podcast/episodio/${ep.id}`),
    mediaUrl: audioUrl,          // solo audio
    coverUrl: ep.coverUrl ?? '',
    bgColor: ep.bgColor ?? serie?.bgColor ?? '#0a0a0a',
    premium: ep.premium ?? false,
    hasAudio,
    // Si el podcast necesita conservar el video por si acaso:
    mediaVideo: ep.mediaVideo || null,
  };
});

export const series = seriesRaw;
export { slugify, episodios };

// Funciones de acceso (idénticas a las del sitio de televisión)
export function getEpisodioById(id) { return episodios.find(ep => ep.id === id); }
export function getEpisodioByDetailUrl(url) {
  const clean = url.replace(/\/$/, '');
  return episodios.find(ep => ep.detailUrl === clean || ep.detailUrl === url);
}
export function getSerieByUrl(url) {
  const clean = url.replace(/\/$/, '');
  return series.find(s => s.url_serie === clean || s.url_serie === url);
}
export function getSerieById(seriesid) { return seriesMap[seriesid]; }
export function getEpisodiosBySerieId(seriesid) {
  return episodios.filter(ep => ep.seriesid === seriesid)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}
export function getEpisodiosBySerieUrl(url) {
  const s = getSerieByUrl(url);
  return s ? getEpisodiosBySerieId(s.seriesid) : [];
}
export function getAllEpisodios() { return episodios; }
export function getAllSeries() { return series; }
