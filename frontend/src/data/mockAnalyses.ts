// ─────────────────────────────────────────────────────────────────────────────
// IbiLens — Mock data for Phase 1 (Frontend Mockup)
// Phase 2: Replace by real API responses from FastAPI backend.
// ─────────────────────────────────────────────────────────────────────────────

import type { Analysis, Source } from '../types'

// Shared active sources (mirrors what the backend will expose in Phase 2)
export const ACTIVE_SOURCES: Source[] = [
  { name: 'Sentinel-2 (ESA)',     url: 'https://sentinel.esa.int',         type: 'Optical satellite · 10m',        reliability: 97, active: true  },
  { name: 'Landsat 8/9 (USGS)',   url: 'https://landsat.usgs.gov',         type: 'Multispectral satellite · 30m',  reliability: 95, active: true  },
  { name: 'GLAMOS Switzerland',   url: 'https://glamos.ch',                type: 'Glacier monitoring network',     reliability: 99, active: true  },
  { name: 'MeteoSwiss',           url: 'https://meteoswiss.admin.ch',      type: 'Meteorological data',            reliability: 96, active: true  },
  { name: 'Semantic Scholar',     url: 'https://semanticscholar.org',      type: 'Scientific literature',          reliability: 88, active: true  },
  { name: 'IPCC AR6',             url: 'https://ipcc.ch/report/ar6',       type: 'Peer-reviewed scientific report', reliability: 100, active: false },
]

// ── Analysis records ──────────────────────────────────────────────────────────

export const MOCK_ANALYSES: Analysis[] = [
  {
    id: 'a001',
    input: 'https://example.com/glaciar-alpino-desaparece',
    headline: 'An Alpine glacier disappears overnight',
    analyzedAt: '2026-03-19T10:32:00Z',
    verdict: 'false',
    score: 23,
    summary:
      'Sentinel-2 imagery shows a gradual 5-year retreat. Glacier physics rules out total loss in 24 h. No climate model or satellite record supports this claim.',
    claims: [
      { id: 1, text: 'The glacier disappeared in 24 hours due to a sudden temperature increase.' },
      { id: 2, text: 'The mass loss was instantaneous and unprecedented in history.' },
      { id: 3, text: 'No prior scientific record of similar events exists.' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 55,
      ndviIndex: 0.45,
      coverageTrend: -29.5,
      baselineYear: 2015,
      images: [
        { date: 'January 2021',     location: 'Aletsch Glacier, Switzerland',   source: 'Landsat 8' },
        { date: 'June 2023',     location: 'Aletsch Glacier, Switzerland',   source: 'Landsat 8' },
        { date: 'December 2025', location: 'Aletsch Glacier, Switzerland',   source: 'Sentinel-2' },
      ],
      chartUrls: [
        '/charts/switzerland/01_tendencia_anual.png',
        '/charts/switzerland/02_cambio_inicio_vs_final.png',
        '/charts/switzerland/03_promedio_por_decada.png',
        '/charts/switzerland/04_anomalia_vs_linea_base.png',
        '/charts/switzerland/05_variacion_interanual.png',
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
      topKeywords: ['disappears', 'sudden', '24 hours', 'crisis', 'catastrophic'],
      narrativeType: 'Alarmist exaggeration',
      scores: [
        { label: 'Direct denial',  value: 85, description: 'Contradicts consolidated scientific evidence' },
        { label: 'Minimisation',          value: 10, description: 'Downplaying of real effects' },
        { label: 'Delayism',            value: 5,  description: '"Let us wait for more data before acting"' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  {
    id: 'a002',
    input: 'https://example.com/mont-blanc-pierde-altura',
    headline: 'Mont Blanc loses 2 meters of altitude due to melting',
    analyzedAt: '2026-03-17T14:15:00Z',
    verdict: 'verified',
    score: 92,
    summary:
      'Confirmed by French IGN measurements and GLAMOS data. Landsat 8 supports mass loss. Data is consistent with IPCC AR6 trends for the Western Alps.',
    claims: [
      { id: 1, text: 'Mont Blanc recorded an altitude decrease of approximately 2 meters.' },
      { id: 2, text: 'The main cause is melting of the surface snow and ice layer.' },
    ],
    satellite: {
      glacierRetreat: 45,
      snowCoverage: 72,
      ndviIndex: 0.38,
      coverageTrend: -12.3,
      baselineYear: 2015,
      images: [
        { date: 'August 2019',    location: 'Mont Blanc, France/Italy', source: 'Landsat 8' },
        { date: 'August 2022',    location: 'Mont Blanc, France/Italy', source: 'Landsat 8' },
        { date: 'August 2025',    location: 'Mont Blanc, France/Italy', source: 'Sentinel-2' },
      ],
      chartUrls: [
        '/charts/france/01_tendencia_anual.png',
        '/charts/france/02_cambio_inicio_vs_final.png',
        '/charts/france/03_promedio_por_decada.png',
        '/charts/france/04_anomalia_vs_linea_base.png',
        '/charts/france/05_variacion_interanual.png',
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
      topKeywords: ['altitude', 'melting', 'loss', 'measurement', 'IGN'],
      narrativeType: 'Verified factual information',
      scores: [
        { label: 'Direct denial',  value: 2,  description: 'No signals of denial' },
        { label: 'Minimisation',          value: 5,  description: 'Factual and neutral language' },
        { label: 'Delayism',            value: 3,  description: 'No delayism patterns' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  {
    id: 'a003',
    input: 'The Alps experience record snowfall this winter',
    headline: 'The Alps experience record snowfall this winter',
    analyzedAt: '2026-03-14T09:00:00Z',
    verdict: 'misleading',
    score: 58,
    summary:
      'Some regions did exceed the average, but total Alpine snowpack is 12% below the historical average. The claim is partially true but omits critical context.',
    claims: [
      { id: 1, text: 'Snowfall this winter is the highest in decades.' },
      { id: 2, text: 'Alpine snowpack has surpassed all historical records.' },
    ],
    satellite: {
      glacierRetreat: 35,
      snowCoverage: 68,
      ndviIndex: 0.52,
      coverageTrend: -8.7,
      baselineYear: 2015,
      images: [
        { date: 'December 2023', location: 'Central Alps',           source: 'Sentinel-2' },
        { date: 'January 2025',     location: 'Central Alps',           source: 'Sentinel-2' },
        { date: 'February 2026',   location: 'Central Alps',           source: 'Sentinel-2' },
      ],
      chartUrls: [
        '/charts/switzerland/01_tendencia_anual.png',
        '/charts/switzerland/02_cambio_inicio_vs_final.png',
        '/charts/switzerland/03_promedio_por_decada.png',
        '/charts/switzerland/04_anomalia_vs_linea_base.png',
        '/charts/switzerland/05_variacion_interanual.png',
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
      topKeywords: ['record', 'snowfall', 'winter', 'exceptional', 'never seen'],
      narrativeType: 'Minimisation through data cherry-picking',
      scores: [
        { label: 'Direct denial',  value: 20, description: 'Uses real data selectively' },
        { label: 'Minimisation',          value: 65, description: 'Omits long-term trend' },
        { label: 'Delayism',            value: 30, description: 'Uses natural variability as argument' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  {
    id: 'a004',
    input: 'Swiss glaciers are growing thanks to low temperatures',
    headline: 'Swiss glaciers growing thanks to low temperatures',
    analyzedAt: '2026-03-27T08:10:00Z',
    verdict: 'false',
    score: 19,
    summary:
      'Sentinel-2 satellite data show sustained glacier retreat of 62 m/year and snow coverage at historic lows (55% vs 78% in 2015). All three claims directly contradict available scientific evidence.',
    claims: [
      { id: 1, text: '"Swiss glaciers are growing this winter thanks to low temperatures"' },
      { id: 2, text: '"Snow cover in the Alps is the highest recorded in the last decade"' },
      { id: 3, text: '"The glacier retreat observed in 2023 was a temporary phenomenon now reversed"' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 55,
      ndviIndex: 0.45,
      coverageTrend: -29.5,
      baselineYear: 2015,
      images: [
        { date: 'January 2021',     location: 'Aletsch Glacier, Switzerland',   source: 'Landsat 8' },
        { date: 'December 2021', location: 'Aletsch Glacier, Switzerland',   source: 'Landsat 8' },
        { date: 'January 2025',     location: 'Aletsch Glacier, Switzerland',   source: 'Sentinel-2' },
      ],
      chartUrls: [
        '/charts/switzerland/01_tendencia_anual.png',
        '/charts/switzerland/02_cambio_inicio_vs_final.png',
        '/charts/switzerland/03_promedio_por_decada.png',
        '/charts/switzerland/04_anomalia_vs_linea_base.png',
        '/charts/switzerland/05_variacion_interanual.png',
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
      topKeywords: ['growing', 'low temperatures', 'reversed', 'temporary', 'highest'],
      narrativeType: 'Glacier denial',
      scores: [
        { label: 'Direct denial',  value: 90, description: 'Contradicts GLAMOS and Sentinel-2 records' },
        { label: 'Minimisation',          value: 20, description: 'Normalizes negative trends' },
        { label: 'Delayism',            value: 15, description: 'Presents temporary data as definitive' },
      ],
    },
    sources: ACTIVE_SOURCES,
  },

  // ── CASE PROTOTYPE 5: Statement — Misleading ────────────────────────────────
  // "Is it true that you can no longer ski in the Alps?"
  {
    id: 'a005',
    input: 'Is it true that you can no longer ski in the Alps because glaciers are melting?',
    inputMode: 'statement',
    headline: 'Misleading claim: Alpine ski tourism has not disappeared, but is threatened',
    analyzedAt: '2026-03-28T09:00:00Z',
    verdict: 'misleading',
    score: 52,
    summary:
      'The claim is partially true but misleading. Landsat 8 imagery from Lake Pasterze (Austria) confirms 62% glacier retreat since 1990. However, ski resorts at altitudes >1800m remain operational with seasonal snow coverage. The threat is real and progressive, but presenting the Alps as already "snow-free" for skiing is inaccurate and omits critical altitude context.',
    sourceCard: undefined,
    claims: [
      { id: 1, text: '"You can no longer ski in the Alps because there is no snow or glaciers"' },
      { id: 2, text: 'Glacier melting makes alpine winter tourism completely unviable' },
      { id: 3, text: 'Alpine glaciers have disappeared or are about to' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 61,
      ndviIndex: 0.41,
      coverageTrend: -29.5,
      baselineYear: 1990,
      images: [
        { date: 'September 1990', location: 'Lake Pasterze, Austria', source: 'Landsat 8' },
        { date: 'September 2025', location: 'Lake Pasterze, Austria', source: 'Sentinel-2' },
      ],
      // ── Real GEE images generated by Landsat 8 / Sentinel-2 scripts ──
      geeBeforeUrl:  '/satellite/austria_pasterze_1990.jpg',
      geeAfterUrl:   '/satellite/austria_pasterze_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Lake Pasterze, Austria · Source: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/charts/austria/01_tendencia_anual.png',
        '/charts/austria/02_cambio_inicio_vs_final.png',
        '/charts/austria/03_promedio_por_decada.png',
        '/charts/austria/04_anomalia_vs_linea_base.png',
        '/charts/austria/05_variacion_interanual.png',
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
      topKeywords: ['no longer', 'impossible', 'disappeared', 'Alps', 'glaciers', 'ski'],
      narrativeType: 'Alarmist exaggeration with partial real basis',
      scores: [
        { label: 'Direct denial',  value: 55, description: 'Presents real glacier loss as total skiing catastrophe' },
        { label: 'Minimisation',          value: 15, description: 'Does not minimise — exaggerates in opposite direction' },
        { label: 'Delayism',            value: 10, description: 'No delayism patterns detected' },
      ],
    },
    sources: ACTIVE_SOURCES,
    // ── Key statistical data (real, extracted from GEE/CSV Tirol_serie_hectareas) ──
    dataStats: [
      { value: '−41.1%', label: 'Snow coverage Tyrol', sublabel: '2000–2025 · GEE / Landsat 8', trend: 'down' },
      { value: '−62%',   label: 'Pasterze glacier retreat', sublabel: '1990–2025 · GLAMOS / Sentinel-2', trend: 'down' },
      { value: '5,937 ha', label: 'Historic minimum 2022', sublabel: '38% of 2000 baseline · record low', trend: 'down' },
      { value: '>1,800 m', label: 'Operational altitude', sublabel: 'Stations with natural snow active · WMO', trend: 'neutral' },
    ],
    // ── Rich narrative Perplexity-style — with numbered source citations ──────────
    richNarrative: `Snow coverage data from Tyrol (Austria) processed with Google Earth Engine shows an unambiguous trend: from **15,603 hectares in 2000 to 9,188 hectares in 2025**, a net decline of **41.1%** [1]. The most critical year was 2022, with only 5,937 ha — barely 38% of the 2000 baseline [1]. Lake Pasterze imagery captured by Sentinel-2 visually confirms this data: the glacier mass has retreated **62% since 1990** according to GLAMOS records [2].

However, the claim that "you can no longer ski in the Alps" is misleading by omission. Nature Climate Change (Zekollari et al., 2019) establishes that Alpine glaciers will maintain seasonal coverage at elevations above **1,800 m** at least until 2050 under the RCP4.5 scenario [3]. IPCC AR6 (Chapter 12) documents with "high confidence" the reduction of snow season in the Alps, explicitly distinguishing between high and low elevation zones [4]. Resorts like Hintertux (2,660 m), Sölden (3,340 m), or Tignes (3,455 m) remain operational with natural snow during the full season.

The threat is real, progressive, and satellite-verified. The original statement contains a partial truth, but by omitting the altitude factor and presenting it as a total collapse of snow tourism, it creates a distorted perception of reality.`,
    relatedMedia: [
      { type: 'article', source: 'The Guardian',    title: 'Alpine glaciers disappearing at shocking speed — 35-year satellite record', url: 'https://theguardian.com/environment/2024/jan/08/alpine-glaciers', date: 'Jan 2024' },
      { type: 'report',  source: 'WGMS / WMO',      title: 'Global Glacier Change Bulletin 2022–2023: Alps lose record mass', url: 'https://wgms.ch/ggcb/', date: '2024' },
      { type: 'video',   source: 'NASA Goddard',     title: '35 Years of Glacier Retreat: Alpine Satellite Evidence (Timelapse)', url: 'https://nasa.gov/glaciers-timelapse', date: 'Mar 2024' },
      { type: 'article', source: 'BBC Science',      title: 'Austrian glaciers: Pasterze retreat documented by Google Earth Engine', url: 'https://bbc.com/future/article/pasterze', date: 'Feb 2024' },
    ],
  },

  // ── CASE PROTOTYPE 6: Article URL — False ─────────────────────────────────
  // Article from unverified source claiming glaciers are growing
  {
    id: 'a006',
    input: 'https://arctic-truth.net/noticias/glaciares-alpes-crecen-invierno-2026',
    inputMode: 'article',
    headline: '"Alpine glaciers growing thanks to record polar cold" — False',
    analyzedAt: '2026-03-28T10:15:00Z',
    verdict: 'false',
    score: 14,
    summary:
      'The article directly contradicts 2025 GLAMOS data and Sentinel-2 imagery. Lake Triftsee (Switzerland) shows a surface reduction of 43% compared to 1990, consistent with the -37 km² glacier mass loss documented by GLAMOS. The source "arctic-truth.net" does not appear in any verified media index. The article selects a 3-month period to infer long-term growth, which is classic statistical manipulation.',
    sourceCard: {
      domain:      'arctic-truth.net',
      publication: 'Arctic Truth News',
      author:      'Staff Reporter',
      publishedAt: '14 January 2026',
      excerpt:     '"New field measurements confirm that glaciers in the central Alps have increased their mass by 3.2% during the 2025-2026 winter quarter, disproving the catastrophist narratives of the climate establishment..."',
    },
    claims: [
      { id: 1, text: '"Alpine glaciers have increased their mass by 3.2% this winter"' },
      { id: 2, text: '"Field measurements contradict official climate models"' },
      { id: 3, text: '"Winter glacier growth disproves global warming"' },
    ],
    satellite: {
      glacierRetreat: 58,
      snowCoverage: 67,
      ndviIndex: 0.37,
      coverageTrend: -43.1,
      baselineYear: 1990,
      images: [
        { date: 'August 1990', location: 'Lake Triftsee, Switzerland', source: 'Landsat 8' },
        { date: 'August 2025', location: 'Lake Triftsee, Switzerland', source: 'Sentinel-2' },
      ],
      geeBeforeUrl:  '/satellite/suiza_triftsee_1990.jpg',
      geeAfterUrl:   '/satellite/suiza_triftsee_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Lake Triftsee, Switzerland · Source: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/charts/switzerland/01_tendencia_anual.png',
        '/charts/switzerland/02_cambio_inicio_vs_final.png',
        '/charts/switzerland/03_promedio_por_decada.png',
        '/charts/switzerland/04_anomalia_vs_linea_base.png',
        '/charts/switzerland/05_variacion_interanual.png',
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
      topKeywords: ['growing', 'record cold', 'establishment', 'contradict', 'disproving'],
      narrativeType: 'Glacier denial with seasonal cherry-picking',
      scores: [
        { label: 'Direct denial',  value: 92, description: 'Directly contradicts verified GLAMOS and Sentinel-2 data' },
        { label: 'Minimisation',          value: 30, description: 'Uses quarterly data to invalidate 35-year trend' },
        { label: 'Delayism',            value: 20, description: 'Questions climate models as "establishment"' },
      ],
    },
    sources: ACTIVE_SOURCES,
    dataStats: [
      { value: '−43%',   label: 'Snow loss Aletsch area', sublabel: '1990–2025 · GEE / Sentinel-2', trend: 'down' },
      { value: '−58%',   label: 'Glacier surface Triftsee', sublabel: '1990–2025 · GLAMOS verified', trend: 'down' },
      { value: '21,458 ha → 15,100 ha', label: 'Coverage Switzerland (Aletsch area)', sublabel: '2000–2023 · GEE/Landsat 8', trend: 'down' },
      { value: '0 sources', label: 'Verification arctic-truth.net', sublabel: 'Not indexed in IFCN nor GLAMOS', trend: 'down' },
    ],
    richNarrative: `The arctic-truth.net article directly contradicts the most comprehensive glacier monitoring data available. GEE data from the Aletsch area (Switzerland) shows snow coverage of **21,458 hectares in 2000 declining to approximately 15,100 hectares in 2023** [1]. Lake Triftsee, direct reference of the article, has lost **58% of its glacier surface since 1990** according to GLAMOS records [2].

The article's methodology is statistically invalid: the 3.2% increase observed corresponds to the **normal winter snow accumulation cycle** (October–February), which occurs every year regardless of long-term trend. Nature (Hugonnet et al., 2021) documents an **acceleration of Alpine glacier mass loss** from 0.8 Gt/year in 2000–2009 to **1.8 Gt/year in 2010–2019** [3], the opposite of what the article claims.

The source "arctic-truth.net" does not appear in the IFCN (International Fact-Checking Network) verified media index, nor in Semantic Scholar or CrossRef databases. Its domain was registered in 2024.`,
    relatedMedia: [
      { type: 'report',  source: 'GLAMOS Switzerland', title: 'Swiss Glacier Monitoring Network: Annual Report 2024', url: 'https://glamos.ch/en/factsheets', date: '2024' },
      { type: 'article', source: 'Nature',              title: 'Accelerated global glacier mass loss in the early twenty-first century', url: 'https://nature.com/articles/s41586-021-03436-z', date: '2021' },
      { type: 'video',   source: 'Copernicus/ESA',      title: 'Sentinel-2: Swiss Alps glacier monitoring 1990-2025 timelapse', url: 'https://climate.copernicus.eu', date: '2025' },
    ],
  },

  // ── CASE PROTOTYPE 8: Social Post (Reddit) — Misleading ───────────────────
  // r/climate post on selective snow coverage (Switzerland, record winter)
  {
    id: 'a008',
    input: 'https://reddit.com/r/climate/comments/1a2b3c/swiss_glaciers_record_snow_2025',
    inputMode: 'social',
    platform: 'reddit',
    headline: 'Viral Reddit post: "Record snow in Switzerland 2025" — Misleading through context omission',
    analyzedAt: '2026-03-28T12:00:00Z',
    verdict: 'misleading',
    score: 38,
    summary:
      'The post uses real December 2025 winter snow accumulation data to suggest Swiss glaciers are "recovering". GEE data confirm that seasonal snow coverage was indeed above average in that period. However, Switzerland\'s net glacier mass in 2025 remains 37% below the 1980 reference level (GLAMOS). One good winter season does not reverse decades of mass loss.',
    sourceCard: {
      subreddit: 'r/climate',
      username:  'AlpineSkier2025',
      content:   'Swiss glaciers are getting more snow this winter than in the past 10 years. I hiked at Jungfrau and the snow reached down to 1,200m. The media only talk about melting but the reality is different. Does anyone else notice that the "official" data doesn\'t match what we see in the field? #ScienceIsNeverSettled',
      upvotes:   3847,
      comments:  412,
    },
    claims: [
      { id: 1, text: 'Swiss glaciers receive more snow this winter than in the past 10 years' },
      { id: 2, text: 'Official data does not reflect what is observed in the field' },
      { id: 3, text: '"Science is never settled" as argument to question glaciological consensus' },
    ],
    satellite: {
      glacierRetreat: 45,
      snowCoverage:   71,
      ndviIndex:      0.49,
      coverageTrend:  -14.2,
      baselineYear:   1980,
      images: [
        { date: 'December 2024', location: 'Jungfrau, Switzerland',    source: 'Sentinel-2' },
        { date: 'December 2025', location: 'Jungfrau, Switzerland',    source: 'Sentinel-2' },
      ],
      geeBeforeUrl:  '/satellite/suiza_jungfrau_1990.jpg',
      geeAfterUrl:   '/satellite/suiza_jungfrau_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Jungfrau, Switzerland · Source: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/charts/switzerland/01_tendencia_anual.png',
        '/charts/switzerland/02_cambio_inicio_vs_final.png',
        '/charts/switzerland/03_promedio_por_decada.png',
        '/charts/switzerland/04_anomalia_vs_linea_base.png',
        '/charts/switzerland/05_variacion_interanual.png',
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
      topKeywords: ['record', 'recovering', 'official data', 'ScienceIsNeverSettled', 'field'],
      narrativeType: 'Minimisation through natural variability — seasonal cherry-picking',
      scores: [
        { label: 'Direct denial', value: 28, description: 'Does not deny climate change, questions it indirectly' },
        { label: 'Minimisation',         value: 72, description: 'Uses positive seasonal anomaly to invalidate 45-year trend' },
        { label: 'Delayism',           value: 38, description: '"Science is never settled" suggests waiting for more evidence' },
      ],
    },
    sources: ACTIVE_SOURCES,
    dataStats: [
      { value: '−37%',  label: 'Glacier mass Switzerland vs 1980', sublabel: 'GLAMOS 2025 · long-term trend', trend: 'down' },
      { value: '+12%',  label: 'Seasonal snow Dec-2025',   sublabel: 'Positive anomaly confirmed · Copernicus C3S', trend: 'up' },
      { value: '63 %',  label: 'Relative glacier mass 2023',  sublabel: 'vs. 1980 reference = 100% · GLAMOS', trend: 'down' },
      { value: '3,847', label: 'Upvotes in 6 hours',          sublabel: 'High reach — r/climate (3.2M members)', trend: 'down' },
    ],
    richNarrative: `The post by u/AlpineSkier2025 contains a real observation but extrapolates it incorrectly. Copernicus C3S confirms that December 2025 was a month with **above-average snow accumulation in the Swiss Alps (+12% above 1991–2020 average)** [1]. The observation at Jungfrau at 1,200m is consistent with Sentinel-2 satellite data from that season.

However, a positive seasonal anomaly cannot be interpreted as evidence against the long-term trend. GLAMOS (Glaciological Reports 2025) documents that **Switzerland's glacier mass in 2025 is 63% of the 1980 reference level** [2], with cumulative loss of 37%. The exceptional year 2022 recorded the largest annual loss ever measured (−6% in a single summer). Nature (Hugonnet et al., 2021) quantifies the **acceleration of Alpine glacier mass loss** at 1.8 Gt/year in the 2010–2019 decade, double that of 2000–2009 [3].

Regarding the claim that "official data do not reflect field reality": GLAMOS data are precisely field measurements taken by Swiss glaciologists who physically traverse glaciers each autumn since 1879. An observation from a ski slope in December cannot substitute for 45 years of systematic monitoring.`,
    relatedMedia: [
      { type: 'report',  source: 'GLAMOS Switzerland', title: 'Swiss Glacier Monitoring Network — Annual Report 2024–2025', url: 'https://glamos.ch/en/factsheets', date: '2025' },
      { type: 'article', source: 'Copernicus C3S',     title: 'Alpine snow cover bulletin: December 2025 anomaly analysis', url: 'https://climate.copernicus.eu/alpine-snow', date: 'Ene 2026' },
      { type: 'video',   source: 'SRF Schweiz',        title: 'Rekordschnee im Winter, aber Gletscher weiterhin auf dem Rückzug', url: 'https://srf.ch/news/schweiz', date: 'Ene 2026' },
    ],
  },

  // ── CASE PROTOTYPE 7: Social Post (X/Twitter) — False ────────────────────
  {
    id: 'a007',
    input: 'https://x.com/Kursed65936965/status/2037960299991499097',
    inputMode: 'social',
    platform: 'twitter',
    headline: 'Viral tweet: "Lake Pasterze GROWING" — Contradicts satellite evidence',
    analyzedAt: '2026-03-28T11:30:00Z',
    verdict: 'false',
    score: 11,
    summary:
      'Landsat 8 images of Lake Pasterze show sustained 62 meters/year retreat since 1990, with glacier surface reduced to 38% of its original extent. The tweet uses a photograph of the lake taken in February (maximum snow accumulation season) to suggest glacier growth, which is an invalid seasonal comparison. The hashtag #ClimateScam was promoted in 2025 by accounts linked to fossil fuel lobbies according to GDELT database.',
    sourceCard: {
      username:  'Kursed65936965',
      handle:    '@Kursed65936965',
      content:   'Lake Pasterze in Austria has GROWN this winter. I was there. The snow reaches all the way down. The "scientists" at the IPCC have been lying to us for 20 years. The satellite images they show us are manipulated. #ClimateScam #Alps #PeakNews',
      likes:     4203,
      retweets:  1847,
      replies:   892,
      postedAt:  '3 hours ago',
    },
    claims: [
      { id: 1, text: '"Lake Pasterze has GROWN this winter"' },
      { id: 2, text: '"IPCC satellite images are manipulated"' },
      { id: 3, text: '"Climate scientists have been lying for 20 years"' },
    ],
    satellite: {
      glacierRetreat: 62,
      snowCoverage: 55,
      ndviIndex: 0.45,
      coverageTrend: -29.5,
      baselineYear: 1990,
      images: [
        { date: 'February 2026',    location: 'Lake Pasterze, Austria', source: 'Sentinel-2' },
        { date: 'September 2025', location: 'Lake Pasterze, Austria', source: 'Sentinel-2' },
      ],
      geeBeforeUrl:  '/satellite/austria_pasterze_1990.jpg',
      geeAfterUrl:   '/satellite/austria_pasterze_2025.jpg',
      geeBeforeYear: 1990,
      geeAfterYear:  2025,
      geeLocation:   'Lake Pasterze, Austria · Source: Landsat 8 / Sentinel-2 via GEE',
      chartUrls: [
        '/charts/austria/01_tendencia_anual.png',
        '/charts/austria/02_cambio_inicio_vs_final.png',
        '/charts/austria/03_promedio_por_decada.png',
        '/charts/austria/04_anomalia_vs_linea_base.png',
        '/charts/austria/05_variacion_interanual.png',
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
      topKeywords: ['GROWN', 'lying', 'manipulated', 'ClimateScam', 'IPCC'],
      narrativeType: 'Aggressive denial with coordinated disinformation',
      scores: [
        { label: 'Direct denial',  value: 95, description: 'Denies public verifiable satellite data from NASA/ESA' },
        { label: 'Minimisation',          value: 15, description: 'Dismisses 35 years of satellite evidence as "manipulation"' },
        { label: 'Delayism',            value: 10, description: 'Hashtag linked to coordinated campaign (source: GDELT 2025)' },
      ],
    },
    sources: ACTIVE_SOURCES,
    dataStats: [
      { value: '−41.1%', label: 'Snow coverage Tyrol', sublabel: '2000–2025 · GEE / Landsat 8', trend: 'down' },
      { value: '−62%',   label: 'Pasterze retreat confirmed', sublabel: '1990–2025 · Sentinel-2 / GLAMOS', trend: 'down' },
      { value: 'Feb. vs Sep.', label: 'Invalid seasonal comparison', sublabel: 'Tweet compares accumulation months vs ablation', trend: 'down' },
      { value: '4,203', label: 'Likes in 3 hours', sublabel: 'Viral reach — mass diffusion risk', trend: 'down' },
    ],
    richNarrative: `The tweet by @Kursed65936965 commits a fundamental methodological error: comparing Lake Pasterze's appearance in **February** (maximum snow accumulation month) with images from **September** (end of summer). This seasonal comparison is invalid for evaluating long-term glacier trends and is a widely documented visual manipulation technique [IFCN].

Lake Pasterze satellite data are public and verifiable across multiple independent databases. Tyrol snow coverage, processed with Google Earth Engine from Landsat 8, fell from **15,603 ha (2000) to 9,188 ha (2025)**, with an absolute minimum of **5,937 ha in 2022** [1]. Sentinel-2 (ESA) imagery shows the expansion of exposed rock (grey/brown color) where active glacier ice once existed [2].

Regarding the claim that "scientists lie": Pasterze Glacier is one of the most monitored in the world, with continuous records since 1879. GLAMOS, NASA, ESA, and Copernicus data are independent of each other and converge on the same conclusions. The hashtag #ClimateScam was tracked by the GDELT Project as part of a coordinated campaign launched in January 2025, with 78% of the diffusing accounts having no activity prior to that month [3].`,
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
  coverage: 'Region: Switzerland · Austria · France · Italy',
}
