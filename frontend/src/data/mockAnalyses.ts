// ─────────────────────────────────────────────────────────────────────────────
// IbiLens — Mock data for Phase 1 (Frontend Mockup)
// Phase 2: Replace by real API responses from FastAPI backend.
// ─────────────────────────────────────────────────────────────────────────────

import type { Analysis, Source } from '../types'

// Shared active sources (mirrors what the backend will expose in Phase 2)
export const ACTIVE_SOURCES: Source[] = [
  { name: 'Sentinel-2 (ESA)',     url: 'https://sentinel.esa.int',         type: 'Satélite óptico · 10m',        reliability: 97, active: true  },
  { name: 'Landsat 8/9 (USGS)',   url: 'https://landsat.usgs.gov',         type: 'Satélite multibanda · 30m',    reliability: 95, active: true  },
  { name: 'GLAMOS Switzerland',   url: 'https://glamos.ch',                type: 'Red monitoreo glaciar',        reliability: 99, active: true  },
  { name: 'MeteoSwiss',           url: 'https://meteoswiss.admin.ch',      type: 'Datos meteorológicos',         reliability: 96, active: true  },
  { name: 'Semantic Scholar',     url: 'https://semanticscholar.org',      type: 'Literatura científica',        reliability: 88, active: true  },
  { name: 'IPCC AR6',             url: 'https://ipcc.ch/report/ar6',       type: 'Informe científico peer-rev.', reliability: 100, active: false },
]

// ── Analysis records ──────────────────────────────────────────────────────────

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: 'a001',
    input: 'https://example.com/glaciar-alpino-desaparece',
    headline: 'Un glaciar alpino desaparece de la noche a la mañana',
    analyzedAt: '2026-03-19T10:32:00Z',
    verdict: 'false',
    score: 23,
    summary:
      'Las imágenes Sentinel-2 muestran un retroceso gradual de 5 años. La física glacial descarta pérdida total en 24 h. Ningún modelo climático ni registro satelital respalda la afirmación.',
    claims: [
      { id: 1, text: 'El glaciar desapareció en 24 horas por incremento súbito de temperatura.' },
      { id: 2, text: 'La pérdida de masa fue instantánea y sin precedentes históricos.' },
      { id: 3, text: 'No existe ningún registro científico previo de eventos similares.' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 55,
      ndviIndex: 0.45,
      coverageTrend: -29.5,
      baselineYear: 2015,
      images: [
        { date: 'Enero 2021',     location: 'Glaciar Aletsch, Suiza',   source: 'Landsat 8' },
        { date: 'Junio 2023',     location: 'Glaciar Aletsch, Suiza',   source: 'Landsat 8' },
        { date: 'Diciembre 2025', location: 'Glaciar Aletsch, Suiza',   source: 'Sentinel-2' },
      ],
      timeSeries: [
        { year: 2015, coverage: 78 },
        { year: 2016, coverage: 76 },
        { year: 2017, coverage: 74 },
        { year: 2018, coverage: 71 },
        { year: 2019, coverage: 69 },
        { year: 2020, coverage: 67 },
        { year: 2021, coverage: 64 },
        { year: 2022, coverage: 61 },
        { year: 2023, coverage: 59 },
        { year: 2024, coverage: 55 },
      ],
    },
    nlp: {
      minimizationScore: 10,
      delayismScore: 5,
      denialismScore: 85,
      topKeywords: ['desaparece', 'súbito', '24 horas', 'crisis', 'catastrófico'],
      narrativeType: 'Exageración alarmista',
      scores: [
        { label: 'Negacionismo directo',  value: 85, description: 'Contradice evidencia científica consolidada' },
        { label: 'Minimización',          value: 10, description: 'Downplaying de efectos reales' },
        { label: 'Retardismo',            value: 5,  description: '"Esperemos más datos antes de actuar"' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  {
    id: 'a002',
    input: 'https://example.com/mont-blanc-pierde-altura',
    headline: 'El Mont Blanc pierde 2 metros de altitud por el deshielo',
    analyzedAt: '2026-03-17T14:15:00Z',
    verdict: 'verified',
    score: 92,
    summary:
      'Confirmado por mediciones IGN Francia y datos GLAMOS. Landsat 8 respalda la pérdida de masa. Los datos son consistentes con tendencias del IPCC AR6 para los Alpes Occidentales.',
    claims: [
      { id: 1, text: 'El Mont Blanc registró una disminución de altitud de aproximadamente 2 metros.' },
      { id: 2, text: 'La causa principal es el deshielo de la capa de nieve y hielo superficial.' },
    ],
    satellite: {
      glacierRetreat: 45,
      snowCoverage: 72,
      ndviIndex: 0.38,
      coverageTrend: -12.3,
      baselineYear: 2015,
      images: [
        { date: 'Agosto 2019',    location: 'Mont Blanc, Francia/Italia', source: 'Landsat 8' },
        { date: 'Agosto 2022',    location: 'Mont Blanc, Francia/Italia', source: 'Landsat 8' },
        { date: 'Agosto 2025',    location: 'Mont Blanc, Francia/Italia', source: 'Sentinel-2' },
      ],
      timeSeries: [
        { year: 2015, coverage: 85 },
        { year: 2016, coverage: 84 },
        { year: 2017, coverage: 83 },
        { year: 2018, coverage: 82 },
        { year: 2019, coverage: 80 },
        { year: 2020, coverage: 79 },
        { year: 2021, coverage: 77 },
        { year: 2022, coverage: 76 },
        { year: 2023, coverage: 74 },
        { year: 2024, coverage: 72 },
      ],
    },
    nlp: {
      minimizationScore: 5,
      delayismScore: 3,
      denialismScore: 2,
      topKeywords: ['altitud', 'deshielo', 'pérdida', 'medición', 'IGN'],
      narrativeType: 'Información factual verificada',
      scores: [
        { label: 'Negacionismo directo',  value: 2,  description: 'Sin señales de negación' },
        { label: 'Minimización',          value: 5,  description: 'Lenguaje factual y neutro' },
        { label: 'Retardismo',            value: 3,  description: 'Sin patrones de retardismo' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  {
    id: 'a003',
    input: 'Los Alpes experimentan nevadas récord este invierno',
    headline: 'Los Alpes experimentan nevadas récord este invierno',
    analyzedAt: '2026-03-14T09:00:00Z',
    verdict: 'misleading',
    score: 58,
    summary:
      'Algunas regiones sí superaron la media, pero el snowpack alpino total está 12% por debajo del promedio histórico. La afirmación es parcialmente verdadera pero omite contexto crítico.',
    claims: [
      { id: 1, text: 'Las nevadas de este invierno son las más altas en décadas.' },
      { id: 2, text: 'El snowpack alpino ha superado todos los registros históricos.' },
    ],
    satellite: {
      glacierRetreat: 35,
      snowCoverage: 68,
      ndviIndex: 0.52,
      coverageTrend: -8.7,
      baselineYear: 2015,
      images: [
        { date: 'Diciembre 2023', location: 'Alpes Centrales',           source: 'Sentinel-2' },
        { date: 'Enero 2025',     location: 'Alpes Centrales',           source: 'Sentinel-2' },
        { date: 'Febrero 2026',   location: 'Alpes Centrales',           source: 'Sentinel-2' },
      ],
      timeSeries: [
        { year: 2015, coverage: 76 },
        { year: 2016, coverage: 78 },
        { year: 2017, coverage: 73 },
        { year: 2018, coverage: 71 },
        { year: 2019, coverage: 74 },
        { year: 2020, coverage: 70 },
        { year: 2021, coverage: 69 },
        { year: 2022, coverage: 72 },
        { year: 2023, coverage: 71 },
        { year: 2024, coverage: 68 },
      ],
    },
    nlp: {
      minimizationScore: 65,
      delayismScore: 30,
      denialismScore: 20,
      topKeywords: ['récord', 'nevadas', 'invierno', 'excepcional', 'nunca visto'],
      narrativeType: 'Minimización por selección de datos',
      scores: [
        { label: 'Negacionismo directo',  value: 20, description: 'Usa datos reales selectivamente' },
        { label: 'Minimización',          value: 65, description: 'Omite tendencia de largo plazo' },
        { label: 'Retardismo',            value: 30, description: 'Usa variabilidad natural como argumento' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  {
    id: 'a004',
    input: 'Los glaciares suizos están creciendo gracias a las bajas temperaturas',
    headline: 'Los glaciares suizos crecen gracias a las bajas temperaturas',
    analyzedAt: '2026-03-27T08:10:00Z',
    verdict: 'false',
    score: 19,
    summary:
      'Los datos satelitales Sentinel-2 muestran un retroceso glaciar sostenido de 62 m/año y una cobertura de nieve en mínimos históricos (55% vs 78% en 2015). Las tres afirmaciones contradicen directamente la evidencia científica disponible.',
    claims: [
      { id: 1, text: '"Los glaciares suizos están creciendo este invierno gracias a las bajas temperaturas"' },
      { id: 2, text: '"La cobertura de nieve en los Alpes es la más alta registrada en la última década"' },
      { id: 3, text: '"El retroceso glaciar observado en 2023 fue un fenómeno temporal ya revertido"' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 55,
      ndviIndex: 0.45,
      coverageTrend: -29.5,
      baselineYear: 2015,
      images: [
        { date: 'Enero 2021',     location: 'Glaciar Aletsch, Suiza',   source: 'Landsat 8' },
        { date: 'Diciembre 2021', location: 'Glaciar Aletsch, Suiza',   source: 'Landsat 8' },
        { date: 'Enero 2025',     location: 'Glaciar Aletsch, Suiza',   source: 'Sentinel-2' },
      ],
      timeSeries: [
        { year: 2015, coverage: 78 },
        { year: 2016, coverage: 76 },
        { year: 2017, coverage: 74 },
        { year: 2018, coverage: 71 },
        { year: 2019, coverage: 68 },
        { year: 2020, coverage: 65 },
        { year: 2021, coverage: 62 },
        { year: 2022, coverage: 59 },
        { year: 2023, coverage: 57 },
        { year: 2024, coverage: 55 },
      ],
    },
    nlp: {
      minimizationScore: 20,
      delayismScore: 15,
      denialismScore: 90,
      topKeywords: ['creciendo', 'bajas temperaturas', 'revertido', 'temporal', 'más alta'],
      narrativeType: 'Negacionismo glacial',
      scores: [
        { label: 'Negacionismo directo',  value: 90, description: 'Contradice registros GLAMOS y Sentinel-2' },
        { label: 'Minimización',          value: 20, description: 'Normaliza tendencias negativas' },
        { label: 'Retardismo',            value: 15, description: 'Presenta datos temporales como definitivos' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  // ── CASO PROTOTIPO 5: Statement — Engañoso ────────────────────────────────
  // "¿Es verdad que ya no se puede esquiar en los Alpes?"
  {
    id: 'a005',
    input: '¿Es verdad que ya no se puede esquiar en los Alpes porque los glaciares se están derritiendo?',
    inputMode: 'statement',
    headline: 'Afirmación engañosa: el turismo de esquí alpino no ha desaparecido, pero está amenazado',
    analyzedAt: '2026-03-28T09:00:00Z',
    verdict: 'misleading',
    score: 52,
    summary:
      'La afirmación es parcialmente verdadera pero engañosa. Las imágenes Landsat 8 del Lago Pasterze (Austria) confirman un retroceso glaciar del 62% desde 1990. Sin embargo, las estaciones de esquí a altitudes >1800m siguen operativas con cobertura nival estacional. La amenaza es real y progresiva, pero presentar los Alpes como ya "sin nieve" para el esquí es inexacto y omite contexto crítico de altitudes.',
    sourceCard: undefined,
    claims: [
      { id: 1, text: '"Ya no se puede esquiar en los Alpes porque no hay nieve ni glaciares"' },
      { id: 2, text: 'El deshielo glaciar hace completamente inviable el turismo invernal alpino' },
      { id: 3, text: 'Los glaciares de los Alpes han desaparecido o están a punto de hacerlo' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 61,
      ndviIndex: 0.41,
      coverageTrend: -29.5,
      baselineYear: 1990,
      images: [
        { date: 'Septiembre 1990', location: 'Lago Pasterze, Austria', source: 'Landsat 8' },
        { date: 'Septiembre 2025', location: 'Lago Pasterze, Austria', source: 'Sentinel-2' },
      ],
      // ── Imágenes GEE reales generadas por scripts Landsat 8 / Sentinel-2 ──
      geeBeforeUrl:  '/satellite/austria_pasterze_1990.jpg',
      geeAfterUrl:   '/satellite/austria_pasterze_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Lago Pasterze, Austria · Fuente: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/satellite/austria_01_tendencia.png',
        '/satellite/austria_02_cambio.png',
        '/satellite/austria_03_decada.png',
        '/satellite/austria_10_factcheck.png',
      ],
      timeSeries: [
        { year: 1990, coverage: 100 }, { year: 1995, coverage: 94 },
        { year: 2000, coverage: 87  }, { year: 2005, coverage: 81 },
        { year: 2010, coverage: 79  }, { year: 2015, coverage: 74 },
        { year: 2018, coverage: 71  }, { year: 2020, coverage: 68 },
        { year: 2022, coverage: 64  }, { year: 2024, coverage: 61 },
      ],
    },
    nlp: {
      minimizationScore: 15,
      delayismScore: 10,
      denialismScore: 55,
      topKeywords: ['ya no', 'imposible', 'desaparecido', 'Alpes', 'glaciares', 'esquiar'],
      narrativeType: 'Exageración alarmista con base real parcial',
      scores: [
        { label: 'Negacionismo directo',  value: 55, description: 'Presenta pérdida glaciar real como catástrofe total del esquí' },
        { label: 'Minimización',          value: 15, description: 'No minimiza — exagera en dirección opuesta' },
        { label: 'Retardismo',            value: 10, description: 'Sin patrones de retardismo detectados' },
      ],
    },
    sources: ACTIVE_SOURCES,
    // ── Datos estadísticos clave (reales, extraídos de GEE/CSV Tirol_serie_hectareas) ──
    dataStats: [
      { value: '−41.1%', label: 'Cobertura nival Tirol', sublabel: '2000–2025 · GEE / Landsat 8', trend: 'down' },
      { value: '−62%',   label: 'Retroceso glaciar Pasterze', sublabel: '1990–2025 · GLAMOS / Sentinel-2', trend: 'down' },
      { value: '5,937 ha', label: 'Mínimo histórico 2022', sublabel: '38% del nivel base 2000 · récord negativo', trend: 'down' },
      { value: '>1,800 m', label: 'Altitud operativa', sublabel: 'Estaciones con nieve natural activas · WMO', trend: 'neutral' },
    ],
    // ── Narrativa rica tipo Perplexity — con citas a fuentes numeradas ──────────
    richNarrative: `Los datos de cobertura nival del Tirol (Austria) procesados con Google Earth Engine muestran una tendencia inequívoca: de **15,603 hectáreas en el año 2000 a 9,188 hectáreas en 2025**, una caída neta del **41.1%** [1]. El año más crítico fue 2022, con solo 5,937 ha — apenas el 38% del nivel base del año 2000 [1]. Las imágenes del Lago Pasterze captadas por Sentinel-2 confirman visualmente este dato: la masa glaciar ha retrocedido un **62% desde 1990** según los registros GLAMOS [2].

Sin embargo, la afirmación de que "ya no es posible esquiar en los Alpes" es engañosa por omisión. Nature Climate Change (Zekollari et al., 2019) establece que los glaciares alpinos mantendrán cobertura estacional en cotas superiores a **1,800 m** hasta al menos 2050 bajo el escenario RCP4.5 [3]. El IPCC AR6 (Capítulo 12) documenta con "alta confianza" la reducción de la temporada de nieve en los Alpes, distinguiendo explícitamente entre zonas de alta y baja cota [4]. Estaciones como Hintertux (2,660 m), Sölden (3,340 m) o Tignes (3,455 m) siguen operativas con nieve natural durante la temporada completa.

La amenaza es real, progresiva y verificada por satélite. La afirmación original contiene una verdad parcial, pero al omitir el factor altitudinal y presentarlo como colapso total del turismo de nieve, genera una percepción distorsionada de la realidad.`,
    relatedMedia: [
      { type: 'article', source: 'The Guardian',    title: 'Alpine glaciers disappearing at shocking speed — 35-year satellite record', url: 'https://theguardian.com/environment/2024/jan/08/alpine-glaciers', date: 'Ene 2024' },
      { type: 'report',  source: 'WGMS / WMO',      title: 'Global Glacier Change Bulletin 2022–2023: Alps lose record mass', url: 'https://wgms.ch/ggcb/', date: '2024' },
      { type: 'video',   source: 'NASA Goddard',     title: '35 Years of Glacier Retreat: Alpine Satellite Evidence (Timelapse)', url: 'https://nasa.gov/glaciers-timelapse', date: 'Mar 2024' },
      { type: 'article', source: 'BBC Science',      title: 'Austrian glaciers: Pasterze retreat documented by Google Earth Engine', url: 'https://bbc.com/future/article/pasterze', date: 'Feb 2024' },
    ],
  },

  // ── CASO PROTOTIPO 6: Article URL — Falso ─────────────────────────────────
  // Artículo de fuente no verificada que afirma que los glaciares crecen
  {
    id: 'a006',
    input: 'https://arctic-truth.net/noticias/glaciares-alpes-crecen-invierno-2026',
    inputMode: 'article',
    headline: '"Los glaciares alpinos crecen gracias al frío polar récord" — Falso',
    analyzedAt: '2026-03-28T10:15:00Z',
    verdict: 'false',
    score: 14,
    summary:
      'El artículo contradice directamente los datos GLAMOS 2025 y las imágenes Sentinel-2. El Lago Triftsee (Suiza) muestra una reducción de superficie del 43% respecto a 1990, consistente con la tendencia de -37 km² de masa glaciar documentada por GLAMOS. La fuente "arctic-truth.net" no aparece en ningún índice de medios verificados. El artículo selecciona un período de 3 meses para inferir crecimiento a largo plazo, lo cual es una manipulación estadística clásica.',
    sourceCard: {
      domain:      'arctic-truth.net',
      publication: 'Arctic Truth News',
      author:      'Staff Reporter',
      publishedAt: '14 enero 2026',
      excerpt:     '"Nuevas mediciones de campo confirman que los glaciares de los Alpes centrales han aumentado su masa en un 3,2% durante el trimestre de invierno 2025-2026, desmintiendo las narrativas catastrofistas del establishment climático..."',
    },
    claims: [
      { id: 1, text: '"Los glaciares alpinos han aumentado su masa en un 3.2% este invierno"' },
      { id: 2, text: '"Las mediciones de campo contradicen los modelos climáticos oficiales"' },
      { id: 3, text: '"El crecimiento glaciar invernal desmiente el calentamiento global"' },
    ],
    satellite: {
      glacierRetreat: 58,
      snowCoverage: 67,
      ndviIndex: 0.37,
      coverageTrend: -43.1,
      baselineYear: 1990,
      images: [
        { date: 'Agosto 1990', location: 'Lago Triftsee, Suiza', source: 'Landsat 8' },
        { date: 'Agosto 2025', location: 'Lago Triftsee, Suiza', source: 'Sentinel-2' },
      ],
      geeBeforeUrl:  '/satellite/suiza_triftsee_1990.jpg',
      geeAfterUrl:   '/satellite/suiza_triftsee_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Lago Triftsee, Suiza · Fuente: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/satellite/suiza_01_tendencia.png',
        '/satellite/suiza_10_factcheck.png',
      ],
      timeSeries: [
        { year: 1990, coverage: 100 }, { year: 1995, coverage: 93 },
        { year: 2000, coverage: 86  }, { year: 2005, coverage: 80 },
        { year: 2010, coverage: 78  }, { year: 2015, coverage: 74 },
        { year: 2019, coverage: 70  }, { year: 2021, coverage: 68 },
        { year: 2023, coverage: 67  }, { year: 2024, coverage: 67 },
      ],
    },
    nlp: {
      minimizationScore: 30,
      delayismScore: 20,
      denialismScore: 92,
      topKeywords: ['crecen', 'récord frío', 'establishment', 'contradicen', 'desmintiendo'],
      narrativeType: 'Negacionismo glacial con cherry-picking estacional',
      scores: [
        { label: 'Negacionismo directo',  value: 92, description: 'Contradice directamente datos GLAMOS y Sentinel-2 verificados' },
        { label: 'Minimización',          value: 30, description: 'Usa dato trimestral para invalidar tendencia de 35 años' },
        { label: 'Retardismo',            value: 20, description: 'Cuestiona modelos climáticos como "establishment"' },
      ],
    },
    sources: ACTIVE_SOURCES,
    dataStats: [
      { value: '−43%',   label: 'Pérdida nival zona Aletsch', sublabel: '1990–2025 · GEE / Sentinel-2', trend: 'down' },
      { value: '−58%',   label: 'Superficie glaciar Triftsee', sublabel: '1990–2025 · GLAMOS verificado', trend: 'down' },
      { value: '21,458 ha → 15,100 ha', label: 'Cobertura Suiza (Aletsch area)', sublabel: '2000–2023 · GEE/Landsat 8', trend: 'down' },
      { value: '0 fuentes', label: 'Verificación arctic-truth.net', sublabel: 'No indexada en IFCN ni GLAMOS', trend: 'down' },
    ],
    richNarrative: `El artículo de arctic-truth.net contradice directamente los datos de monitoreo glaciar más exhaustivos disponibles. Los datos GEE de la zona de Aletsch (Suiza) muestran una cobertura nival de **21,458 hectáreas en 2000 descendiendo a aproximadamente 15,100 hectáreas en 2023** [1]. El Lago Triftsee, referencia directa del artículo, ha perdido un **58% de su superficie glaciar desde 1990** según registros GLAMOS [2].

La metodología del artículo es estadísticamente inválida: el aumento del 3.2% observado corresponde al **ciclo de acumulación nival invernal normal** (octubre–febrero), que ocurre cada año independientemente de la tendencia a largo plazo. Nature (Hugonnet et al., 2021) documenta una **aceleración de la pérdida de masa glaciar alpina** de 0.8 Gt/año en 2000–2009 a **1.8 Gt/año en 2010–2019** [3], lo opuesto a lo que afirma el artículo.

La fuente "arctic-truth.net" no aparece en el índice de medios verificados por la IFCN (International Fact-Checking Network), ni en las bases de datos Semantic Scholar o CrossRef. Su dominio fue registrado en 2024.`,
    relatedMedia: [
      { type: 'report',  source: 'GLAMOS Switzerland', title: 'Swiss Glacier Monitoring Network: Annual Report 2024', url: 'https://glamos.ch/en/factsheets', date: '2024' },
      { type: 'article', source: 'Nature',              title: 'Accelerated global glacier mass loss in the early twenty-first century', url: 'https://nature.com/articles/s41586-021-03436-z', date: '2021' },
      { type: 'video',   source: 'Copernicus/ESA',      title: 'Sentinel-2: Swiss Alps glacier monitoring 1990-2025 timelapse', url: 'https://climate.copernicus.eu', date: '2025' },
    ],
  },

  // ── CASO PROTOTIPO 8: Social Post (Reddit) — Engañoso ───────────────────
  // r/climate post sobre cobertura nival selectiva (Suiza, invierno récord)
  {
    id: 'a008',
    input: 'https://reddit.com/r/climate/comments/1a2b3c/swiss_glaciers_record_snow_2025',
    inputMode: 'social',
    platform: 'reddit',
    headline: 'Post viral en Reddit: "Nieve récord en Suiza 2025" — Engañoso por omisión de contexto',
    analyzedAt: '2026-03-28T12:00:00Z',
    verdict: 'misleading',
    score: 38,
    summary:
      'El post usa datos reales de acumulación nival invernal de diciembre 2025 para sugerir que los glaciares suizos están "recuperándose". Los datos GEE confirman que la cobertura de nieve estacional fue efectivamente superior a la media en ese período. Sin embargo, la masa glaciar neta de Suiza en 2025 sigue un 37% por debajo del nivel de referencia de 1980 (GLAMOS). Una buena temporada invernal no revierte décadas de pérdida de masa.',
    sourceCard: {
      subreddit: 'r/climate',
      username:  'AlpineSkier2025',
      content:   'Los glaciares suizos están recibiendo más nieve este invierno que en los últimos 10 años. He hecho senderismo en el Jungfrau y la nieve llegaba hasta los 1,200m. Los medios solo hablan de deshielo pero la realidad es diferente. ¿Alguien más nota que los datos "oficiales" no reflejan lo que vemos en el campo? #ScienceIsNeverSettled',
      upvotes:   3847,
      comments:  412,
    },
    claims: [
      { id: 1, text: 'Los glaciares suizos reciben más nieve este invierno que en los últimos 10 años' },
      { id: 2, text: 'Los datos oficiales no reflejan lo que se observa en el campo' },
      { id: 3, text: '"La ciencia nunca está establecida" como argumento para cuestionar el consenso glaciológico' },
    ],
    satellite: {
      glacierRetreat: 45,
      snowCoverage:   71,
      ndviIndex:      0.49,
      coverageTrend:  -14.2,
      baselineYear:   1980,
      images: [
        { date: 'Diciembre 2024', location: 'Jungfrau, Suiza',    source: 'Sentinel-2' },
        { date: 'Diciembre 2025', location: 'Jungfrau, Suiza',    source: 'Sentinel-2' },
      ],
      geeBeforeUrl:  '/satellite/suiza_jungfrau_1990.jpg',
      geeAfterUrl:   '/satellite/suiza_jungfrau_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Jungfrau, Suiza · Fuente: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/satellite/suiza_01_tendencia.png',
        '/satellite/suiza_10_factcheck.png',
      ],
      timeSeries: [
        { year: 1980, coverage: 100 }, { year: 1985, coverage: 98 },
        { year: 1990, coverage: 95 },  { year: 1995, coverage: 91 },
        { year: 2000, coverage: 87 },  { year: 2005, coverage: 84 },
        { year: 2010, coverage: 80 },  { year: 2015, coverage: 76 },
        { year: 2020, coverage: 69 },  { year: 2022, coverage: 64 },
        { year: 2023, coverage: 63 },  { year: 2024, coverage: 71 }, // anomalía positiva 2024/25
      ],
    },
    nlp: {
      minimizationScore: 72,
      delayismScore:     38,
      denialismScore:    28,
      topKeywords: ['récord', 'recuperándose', 'datos oficiales', 'ScienceIsNeverSettled', 'campo'],
      narrativeType: 'Minimización por variabilidad natural — cherry-picking estacional',
      scores: [
        { label: 'Negacionismo directo', value: 28, description: 'No niega el cambio climático, lo cuestiona indirectamente' },
        { label: 'Minimización',         value: 72, description: 'Usa anomalía estacional positiva para invalidar tendencia de 45 años' },
        { label: 'Retardismo',           value: 38, description: '"La ciencia no está establecida" sugiere esperar más evidencia' },
      ],
    },
    sources: ACTIVE_SOURCES,
    dataStats: [
      { value: '−37%',  label: 'Masa glaciar Suiza vs 1980', sublabel: 'GLAMOS 2025 · tendencia a largo plazo', trend: 'down' },
      { value: '+12%',  label: 'Nieve estacional dic-2025',   sublabel: 'Anomalía positiva confirmada · Copernicus C3S', trend: 'up' },
      { value: '63 %',  label: 'Masa glaciar relativa 2023',  sublabel: 'vs. referencia 1980 = 100% · GLAMOS', trend: 'down' },
      { value: '3,847', label: 'Upvotes en 6 horas',          sublabel: 'Alcance elevado — r/climate (3.2M miembros)', trend: 'down' },
    ],
    richNarrative: `El post de u/AlpineSkier2025 contiene una observación real pero la extrapola incorrectamente. Copernicus C3S confirma que diciembre 2025 fue un mes con **acumulación nival superior a la media en los Alpes suizos (+12% sobre la media 1991–2020)** [1]. La observación en Jungfrau a 1,200m coincide con los datos satelitales Sentinel-2 de esa temporada.

Sin embargo, una anomalía estacional positiva no puede interpretarse como evidencia contra la tendencia a largo plazo. GLAMOS (Glaciological Reports 2025) documenta que la **masa glaciar suiza en 2025 es el 63% del nivel de referencia de 1980** [2], con pérdida acumulada del 37%. El año excepcional 2022 registró la mayor pérdida anual jamás medida (−6% en un solo verano). Nature (Hugonnet et al., 2021) cuantifica la **aceleración de pérdida de masa glaciar alpina** a 1.8 Gt/año en la década 2010–2019, el doble que en 2000–2009 [3].

Respecto a la afirmación de que "los datos oficiales no reflejan la realidad de campo": los datos GLAMOS son precisamente mediciones de campo realizadas por glaciólogos suizos que recorren físicamente los glaciares cada otoño desde 1879. La observación desde una pista de esquí en diciembre no puede substituir 45 años de monitoreo sistemático.`,
    relatedMedia: [
      { type: 'report',  source: 'GLAMOS Switzerland', title: 'Swiss Glacier Monitoring Network — Annual Report 2024–2025', url: 'https://glamos.ch/en/factsheets', date: '2025' },
      { type: 'article', source: 'Copernicus C3S',     title: 'Alpine snow cover bulletin: December 2025 anomaly analysis', url: 'https://climate.copernicus.eu/alpine-snow', date: 'Ene 2026' },
      { type: 'video',   source: 'SRF Schweiz',        title: 'Rekordschnee im Winter, aber Gletscher weiterhin auf dem Rückzug', url: 'https://srf.ch/news/schweiz', date: 'Ene 2026' },
    ],
  },

  // ── CASO PROTOTIPO 7: Social Post (X/Twitter) — Falso ────────────────────
  {
    id: 'a007',
    input: 'https://x.com/PeakTruth99/status/1766234598001234567',
    inputMode: 'social',
    platform: 'twitter',
    headline: 'Tweet viral: "El Lago Pasterze CRECE" — Contradice la evidencia satelital',
    analyzedAt: '2026-03-28T11:30:00Z',
    verdict: 'false',
    score: 11,
    summary:
      'Las imágenes Landsat 8 del Lago Pasterze muestran un retroceso de 62 metros/año sostenido desde 1990, con la superficie glaciar reducida a un 38% de su extensión original. El tweet usa una fotografía del lago tomada en febrero (temporada de acumulación nival máxima) para sugerir crecimiento glaciar, lo cual es una comparación estacional inválida. El hashtag #ClimateScam fue promovido en 2025 por cuentas vinculadas a lobbies de energía fósil según la base GDELT.',
    sourceCard: {
      username:  'PeakTruth99',
      handle:    '@PeakTruth99',
      content:   'El Lago Pasterze en Austria ha CRECIDO este invierno. Estuve allí. La nieve llega hasta abajo. Los "científicos" del IPCC llevan 20 años mintiéndonos. Las imágenes satelitales que nos muestran están manipuladas. #ClimateScam #Alpes #PeakNews',
      likes:     4203,
      retweets:  1847,
      replies:   892,
      postedAt:  'hace 3 horas',
    },
    claims: [
      { id: 1, text: '"El Lago Pasterze ha CRECIDO este invierno"' },
      { id: 2, text: '"Las imágenes satelitales del IPCC están manipuladas"' },
      { id: 3, text: '"Los científicos climáticos llevan 20 años mintiendo"' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 55,
      ndviIndex: 0.45,
      coverageTrend: -29.5,
      baselineYear: 1990,
      images: [
        { date: 'Febrero 2026',    location: 'Lago Pasterze, Austria', source: 'Sentinel-2' },
        { date: 'Septiembre 2025', location: 'Lago Pasterze, Austria', source: 'Sentinel-2' },
      ],
      geeBeforeUrl:  '/satellite/austria_pasterze_1990.jpg',
      geeAfterUrl:   '/satellite/austria_pasterze_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Lago Pasterze, Austria · Fuente: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/satellite/austria_01_tendencia.png',
        '/satellite/austria_10_factcheck.png',
      ],
      timeSeries: [
        { year: 1990, coverage: 100 }, { year: 1995, coverage: 94 },
        { year: 2000, coverage: 87  }, { year: 2005, coverage: 81 },
        { year: 2010, coverage: 79  }, { year: 2015, coverage: 74 },
        { year: 2020, coverage: 68  }, { year: 2022, coverage: 64 },
        { year: 2023, coverage: 57  }, { year: 2024, coverage: 55 },
      ],
    },
    nlp: {
      minimizationScore: 15,
      delayismScore: 10,
      denialismScore: 95,
      topKeywords: ['CRECIDO', 'mintiendo', 'manipuladas', 'ClimateScam', 'IPCC'],
      narrativeType: 'Negacionismo agresivo con desinformación organizada',
      scores: [
        { label: 'Negacionismo directo',  value: 95, description: 'Niega datos satelitales públicos y verificables de la NASA/ESA' },
        { label: 'Minimización',          value: 15, description: 'Descarta 35 años de evidencia satelital como "manipulación"' },
        { label: 'Retardismo',            value: 10, description: 'Hashtag vinculado a campaña coordinada (fuente: GDELT 2025)' },
      ],
    },
    sources: ACTIVE_SOURCES,
    dataStats: [
      { value: '−41.1%', label: 'Cobertura nival Tirol', sublabel: '2000–2025 · GEE / Landsat 8', trend: 'down' },
      { value: '−62%',   label: 'Retroceso Pasterze confirmado', sublabel: '1990–2025 · Sentinel-2 / GLAMOS', trend: 'down' },
      { value: 'Feb. vs Sep.', label: 'Comparación estacional inválida', sublabel: 'El tweet compara meses de acumulación vs ablación', trend: 'down' },
      { value: '4,203', label: 'Likes en 3 horas', sublabel: 'Alcance viral — riesgo de difusión masiva', trend: 'down' },
    ],
    richNarrative: `El tweet de @PeakTruth99 comete un error metodológico fundamental: comparar la apariencia del Lago Pasterze en **febrero** (mes de máxima acumulación nival) con imágenes de **septiembre** (fin del verano). Esta comparación estacional es inválida para evaluar tendencias glaciares a largo plazo y es una técnica de manipulación visual ampliamente documentada [IFCN].

Los datos satelitales del Lago Pasterze son públicos y verificables en múltiples bases independientes. La cobertura nival del Tirol, procesada con Google Earth Engine a partir de Landsat 8, cayó de **15,603 ha (2000) a 9,188 ha (2025)**, con un mínimo absoluto de **5,937 ha en 2022** [1]. Las imágenes Sentinel-2 (ESA) muestran la expansión de roca expuesta (color gris/marrón) donde antes había hielo glaciar activo [2].

Respecto a la afirmación de que "los científicos mienten": el Glaciar Pasterze es uno de los más monitoreados del mundo, con registros continuos desde 1879. Los datos GLAMOS, NASA, ESA y Copernicus son independientes entre sí y convergen en las mismas conclusiones. El hashtag #ClimateScam fue rastreado por el Proyecto GDELT como parte de una campaña coordinada iniciada en enero 2025, con un 78% de las cuentas difusoras sin actividad previa a ese mes [3].`,
    relatedMedia: [
      { type: 'article', source: 'Copernicus / ESA', title: 'Pasterze glacier: 35 years of continuous satellite monitoring', url: 'https://climate.copernicus.eu/pasterze', date: 'Feb 2025' },
      { type: 'report',  source: 'GDELT Project',    title: 'Climate disinformation tracking: #ClimateScam campaign analysis 2025', url: 'https://gdeltproject.org', date: 'Mar 2025' },
      { type: 'video',   source: 'NASA Goddard',     title: 'Time-lapse: Pasterze Glacier retreat 1990–2025 (Landsat)', url: 'https://nasa.gov', date: '2024' },
    ],
  },
]

// Platform-level stats (Phase 2: replace with /api/stats endpoint)
export const PLATFORM_STATS = {
  totalVerified: 131,
  falseDetected: 46,
  accuracy: 94,
  updatedAt: '28 MAR 2026',
  coverage: 'Región: Suiza · Austria · Francia · Italia',
}
