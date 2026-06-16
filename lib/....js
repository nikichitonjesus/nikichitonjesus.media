// =========================================================
// data-base.js — Única fuente de verdad (datos brutos)
// =========================================================

export function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

// Series brutas (sin procesar)
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
  },
  {
    seriesid: '05-TCHUSBAL',
    portada_serie: 'https://nikichitonjesus.odoo.com/web/image/1781-b87b5200/Niki%20Chiton%20Jesus%202.webp',
    titulo_serie: 'TCHUSBAL',
    descripcion_serie: 'NIKI CHITON JESUS 2 (TCHUSBAL) -A la luz de la palabra- Un programa que examina la verdad Bíblica y la práctica errada.',
    url_serie: '/TCHUSBAL',
    bgColor: '#0e48ad'
  }
];

// Episodios brutos (sin procesar) - todos los episodios del primer proyecto
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
    title: 'La profecía de Isaías | Nacimiento',
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
    mediaVideo: 'https://archive.org/download/nikichitonjesus/001.mp4',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2024-10-13/389750023-44100-2-64450c94550ab.m4a',
    coverUrl: 'https://s3-us-west-2.amazonaws.com/anchor-generated-image-bank/staging/podcast_uploaded_episode400/42439556/42439556-1731523469735-489eb812305f7.jpg',
    title: '¿Qué es y qué no es el Evangelio?',
    author: 'RC. Sproul',
    categoria: 'Gracia, Evangelio, Jesucristo',
    description: 'Llevamos años estudiando la palabra de Dios. Y en Chajul el Evangelio fue traido hace muchos años. Bueno, podemos decir que el cristianismo comenzó hace siglos con la llegada de los españoles. Y desde el punto de vista de los católicos, el evangelio fue el inicio de la rebelión contra Dios. Y por supuesto, han ido más alla, con la implementación del -evangelio de la prosperidad-',
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
  },
  {
    id: '05-01-01-pablo-apostol',
    date: '2023-01-02',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-5-16/426220631-44100-2-c8ea3b4b37954.m4a',
    mediaVideo: 'https://archive.org/download/vista-previa-kristo/La-vida-del-Ap-stol-Pablo.mp4',
    coverUrl: 'https://nikichitonjesus.odoo.com/web/image/1781-b87b5200/Niki%20Chiton%20Jesus%202.webp',
    title: 'La vida de Pablo - previa',
    author: 'Niki Chiton Jesus',
    categoria: 'TCHUSBAL, Herejías, Vida cristiana',
    description: 'La vida del apóstol Pablo',
    allowDownload: false,
    seriesid: '05-TCHUSBAL',
    bgColor: '#0e48ad'
  },
  {
    id: '05-02-01-vaticano',
    date: '2023-01-08',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-5-16/426221563-44100-2-1c95258d8734d.m4a',
    coverUrl: 'https://nikichitonjesus.odoo.com/web/image/1781-b87b5200/Niki%20Chiton%20Jesus%202.webp',
    title: 'El vaticano - previa',
    author: 'Niki Chiton Jesus',
    categoria: 'TCHUSBAL, El vaticano, Herejías',
    description: '¿En qué consiste la doctrina de la Iglesia Católica Romana? Una pregunta que genera polémicas. Los defensores, citan sus fuentes en el pasado, mientras que los protestantes, las escrituras y las fuentes históricas.',
    allowDownload: false,
    seriesid: '05-TCHUSBAL',
    bgColor: '#0e48ad'
  },
  {
    id: '05-03-01-desobediencia',
    date: '2023-02-26',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-5-16/426221563-44100-2-1c95258d8734d.m4a',
    coverUrl: 'https://nikichitonjesus.odoo.com/web/image/1781-b87b5200/Niki%20Chiton%20Jesus%202.webp',
    title: 'Desobediencia - caso 1',
    author: 'Niki Chiton Jesus',
    categoria: 'TCHUSBAL, Vida cristiana, Herejías, Moralidad',
    description: 'Qué acerca de la persona que dice ser cristiana, porque va a la Iglesia constantemente, acude a visitas y oraciones, apoya a los pobres y dice ser una persona honesta. Entonces, porque somos cristianso y que Dios siempre perdona ¿Tenemos el derecho de desobedecer?',
    allowDownload: false,
    seriesid: '05-TCHUSBAL',
    bgColor: '#0e48ad'
  },
  {
    id: '05-04-01-semana-santa',
    date: '2023-03-13',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2024-10-14/389778524-44100-2-0e54c2945212.m4a',
    coverUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4MnyPXIKyWvPa0PEl0KyKjLw7HGWiyIKgnDUIBQkiMdKPFCM1SnIddpiXLKsNj0TbkPm-3ek7wUkLaDiOpjDQwc4TChpC7qyV8rJN-zR4fUbXw7E9xL2d-FQXhbzol0jb2ejD351cL8ZtDmtl3YJdnFp-3V9jQSg0p5sy_j6AF3N2vYGJOIHA9p0mQ5c/s1920/Captura%20de%20pantalla%202024-04-30%20213134.png',
    title: 'SEMANA SANTA ¿Tradición católica o celebración universal?',
    author: 'Niki Chiton Jesus',
    categoria: 'Historia, Vida, Semana mayor',
    description: 'Conmemorando la vida y resurrección de Jesucristo',
    allowDownload: false,
    seriesid: '05-TCHUSBAL',
    bgColor: '#2596be'
  },
  {
    id: '05-05-01-la-cruz',
    date: '2023-04-01',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-5-16/426221621-44100-2-7bef6770667d4.m4a',
    mediaVideo: 'https://archive.org/download/TCHUSBAL/Jesus001.mp4',
    coverUrl: 'https://i9.ytimg.com/vi_webp/aHiXmiPz0lQ/mqdefault.webp?v=6428ef5a&sqp=CIj9wtEG&rs=AOn4CLBtIZX2WF4UVBbqZEuquxbzOt739w',
    title: 'La historia de la crucifixión de Jesucristo - ep 1',
    author: 'Niki Chiton Jesus',
    categoria: 'TCHUSBAL, Vida cristiana, Cruz, Jesucristo, Semana Santa, Semana mayor',
    description: 'Por qué mataron a Jesucristo',
    allowDownload: false,
    seriesid: '05-TCHUSBAL',
    bgColor: '#0e48ad'
  },
  {
    id: '05-02-02-la-cruz',
    date: '2023-04-19',
    mediaUrl: 'https://d3ctxlq1ktw2nl.cloudfront.net/staging/2026-5-16/426221660-44100-2-4c24fc6af0841.m4a',
    mediaVideo: 'https://archive.org/download/TCHUSBAL/Jesus002.mp4',
    coverUrl: 'https://i9.ytimg.com/vi_webp/tx5zPIwPzOU/mqdefault.webp?sqp=CIj9wtEG&rs=AOn4CLAKWe5-IseKIaTQ0SWnYTFXHVik6g',
    title: 'La historia de la crucifixión de Jesucristo - ep 2',
    author: 'Niki Chiton Jesus',
    categoria: 'TCHUSBAL, Vida cristiana, Cruz, Jesucristo, Semana Santa, Semana mayor',
    description: 'Jesús entre romanos y judíos',
    allowDownload: false,
    seriesid: '05-TCHUSBAL',
    bgColor: '#0e48ad'
  }
];
