// =========================================================
// data-base.js — Única fuente de verdad (series y episodios)
// =========================================================

// Slugify simple y común
function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

// ---------- SERIES (solo las del sitio de televisión por ahora) ----------
export const seriesRaw = [
  {
    seriesid: '01-himnario',
    portada_serie: 'https://nikichitonjesus.odoo.com/web/image/1663-46157754/Niki%2520Chiton%2520Jesus%2520%281%29.webp',
    titulo_serie: 'Himnario Niki Chiton Jesus',
    descripcion_serie: 'Himnología — Cristiana',
    url_serie: '/himnario/nikichitonjesus',
    bgColor: '#46210a'
  },
  {
    seriesid: '02-la-historia-del-nacimiento',
    portada_serie: 'https://i.pinimg.com/736x/80/c3/2d/80c32dea2e940ddc4de74810277638c0.jpg',
    titulo_serie: 'La historia del nacimiento de jesucristo',
    descripcion_serie: 'Esta es la historia más grande, que Jesucristo dejó su trono y corona por los pecadores para morir por sus pecados y salvarlos.',
    url_serie: '/la-historia-del-nacimiento',
    bgColor: '#cc04ab'
  },
  {
    seriesid: '03-el-evangelio-verdadero',
    portada_serie: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_episode400/42439556/42439556-1731523469735-489eb812305f7.jpg',
    titulo_serie: 'El evangelio verdadero',
    descripcion_serie: 'El Evangelio según Jesucristo, no es anunciar el enriquecimiento terrenal.',
    url_serie: '/el-evangelio-verdadero',
    bgColor: '#0097e3'
  },
  {
    seriesid: '04-semana-santa',
    portada_serie: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4MnyPXIKyWvPa0PEl0KyKjLw7HGWiyIKgnDUIBQkiMdKPFCM1SnIddpiXLKsNj0TbkPm-3ek7wUkLaDiOpjDQwc4TChpC7qyV8rJN-zR4fUbXw7E9xL2d-FQXhbzol0jb2ejD351cL8ZtDmtl3YJdnFp-3V9jQSg0p5sy_j6AF3N2vYGJOIHA9p0mQ5c/s1920/Captura%20de%20pantalla%202024-04-30%20213134.png',
    titulo_serie: 'Semana Santa',
    descripcion_serie: 'Es una de las celebraciones más importantes del mundo cristiano. En esta serie exploramos qué hay detrás.',
    url_serie: '/semana-santa',
    bgColor: '#0097e3'
  }
];

// ---------- EPISODIOS (datos brutos, sin procesar) ----------
export const episodiosRaw = [
  {
    id: '01-01-jesus-saves',
    date: '2026-02-10',
    mediaUrl: 'https://www.hymnal.net/Hymns/Hymnal/mp3/e0991_i.mp3',
    coverUrl: 'https://nikichitonjesus.odoo.com/web/image/1668-134717bf/Comp%20Logo%20con%20fondo.svg',
    title: 'Niki Chiton Jesus | Himno #1',
    author: 'Grace Church',
    categoria: 'Himno, gracia, salvación, cristo',
    description: 'Himno de la evangelización compuesto por Priscilla Jane Owens para la gloria de Dios.',
    allowDownload: false,
    seriesid: '01-himnario',
    bgColor: '#0097e3'
  },
  {
    id: '02-01-introducción',
    date: '2026-02-03',
    mediaVideo: 'https://archive.org/download/nikichitonjesus/Navidad001.mp4',
    coverUrl: 'https://i.pinimg.com/736x/80/c3/2d/80c32dea2e940ddc4de74810277638c0.jpg',
    title: 'La historia del Nacimiento | Introducción',
    author: 'NCHJ',
    categoria: 'Navidad, Jesús, Nacimiento',
    description: 'La historia del nacimiento de Jesucristo es una de las más impresionantes de la historia de la humanidad.',
    allowDownload: false,
    seriesid: '02-la-historia-del-nacimiento',
    bgColor: '#46210a'
  },
  {
    id: '02-02-balaam',
    date: '2026-02-03',
    mediaVideo: 'https://archive.org/download/nikichitonjesus/Navidad002.mp4',
    coverUrl: 'https://i.pinimg.com/736x/80/c3/2d/80c32dea2e940ddc4de74810277638c0.jpg',
    title: 'La profecía de Balaam',
    author: 'NCHJ',
    categoria: 'Navidad, Jesús, Nacimiento',
    description: 'La historia del nacimiento de Jesucristo es una de las más impresionantes de la historia de la humanidad.',
    allowDownload: false,
    seriesid: '02-la-historia-del-nacimiento',
    bgColor: '#46210a'
  },
  {
    id: '02-03-isaias',
    date: '2026-02-03',
    mediaVideo: 'https://archive.org/download/nikichitonjesus/Navidad003.mp4',
    coverUrl: 'https://i.pinimg.com/736x/80/c3/2d/80c32dea2e940ddc4de74810277638c0.jpg',
    title: 'La profesía de Isaías | Nacimiento',
    author: 'NCHJ',
    categoria: 'Navidad, Jesús, Nacimiento',
    description: 'La historia del nacimiento de Jesucristo es una de las más impresionantes de la historia de la humanidad.',
    allowDownload: false,
    seriesid: '02-la-historia-del-nacimiento',
    bgColor: '#46210a'
  },
  {
    id: '03-01-que-es-y-que-no-es',
    date: '2026-02-04',
    mediaVideo: 'https://archive.org/download/nikichitonjesus/001',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2024-10-13/389750023-44100-2-64450c94550ab.m4a',
    coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_episode400/42439556/42439556-1731523469735-489eb812305f7.jpg',
    title: '¿Qué es y qué no es el Evangelio?',
    author: 'RC. Sproul',
    categoria: 'Gracia, Evangelio, Jesucristo',
    description: 'Llevamos años estudiando la palabra de Dios. Y en Chajul el Evangelio fue traido hace muchos años...',
    allowDownload: false,
    seriesid: '03-el-evangelio-verdadero',
    bgColor: '#0097e3'
  },
  {
    id: '04-01-semana-santa',
    date: '2026-05-05',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2024-10-14/389778524-44100-2-0e54c2945212.m4a',
    coverUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4MnyPXIKyWvPa0PEl0KyKjLw7HGWiyIKgnDUIBQkiMdKPFCM1SnIddpiXLKsNj0TbkPm-3ek7wUkLaDiOpjDQwc4TChpC7qyV8rJN-zR4fUbXw7E9xL2d-FQXhbzol0jb2ejD351cL8ZtDmtl3YJdnFp-3V9jQSg0p5sy_j6AF3N2vYGJOIHA9p0mQ5c/s1920/Captura%20de%20pantalla%202024-04-30%20213134.png',
    title: '¿Qué hay detrás de la Semana Santa?',
    author: 'Niki Chiton Jesus',
    categoria: 'Historia, Vida, Semana mayor',
    description: 'Conmemorando la vida y resurrección de Jesucristo',
    allowDownload: false,
    seriesid: '04-semana-santa',
    bgColor: '#2596be'
  }
];

export { slugify };
