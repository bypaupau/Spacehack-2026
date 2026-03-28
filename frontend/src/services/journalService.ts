// ─────────────────────────────────────────────────────────────────────────────
// journalService.ts — Peak News
//
// Servicio de matching contextual: dado el texto de un claim, retorna los
// papers científicos más relevantes de la base de datos curada.
//
// Fase 2: reemplazar con llamada a backend que use Semantic Scholar API
// + embeddings de similitud.
// ─────────────────────────────────────────────────────────────────────────────

export interface ScientificPaper {
  id:            string
  title:         string
  authors:       string          // "Apellido et al."
  journal:       string
  journalAbbr:   string
  year:          number
  doi:           string
  url:           string
  abstract:      string
  topics:        string[]        // keywords para matching
  accentColor:   string          // color del journal
  citationCount: number
}

// ── Base de datos curada de papers reales ────────────────────────────────────
const PAPERS_DB: ScientificPaper[] = [

  // ── GLACIARES / HIELO ────────────────────────────────────────────────────
  {
    id: 'hugonnet2021',
    title: 'Accelerated global glacier mass loss in the early twenty-first century',
    authors: 'Hugonnet et al.',
    journal: 'Nature',
    journalAbbr: 'Nature',
    year: 2021,
    doi: '10.1038/s41586-021-03436-z',
    url: 'https://doi.org/10.1038/s41586-021-03436-z',
    abstract: 'Global glacier mass loss accelerated from 227 ± 32 Gt yr⁻¹ during 2000–2009 to 298 ± 28 Gt yr⁻¹ during 2010–2019, representing a major contribution to sea-level rise.',
    topics: ['glaciar', 'glacier', 'hielo', 'ice', 'masa', 'retroceso', 'retreat'],
    accentColor: '#E53E3E',
    citationCount: 1840,
  },
  {
    id: 'zemp2019',
    title: 'Global glacier mass changes and their contributions to sea-level rise',
    authors: 'Zemp et al.',
    journal: 'Nature',
    journalAbbr: 'Nature',
    year: 2019,
    doi: '10.1038/s41586-019-1071-0',
    url: 'https://doi.org/10.1038/s41586-019-1071-0',
    abstract: 'Glaciers contributed 27 ± 22 mm to global mean sea-level rise from 1961 to 2016. The rate of loss increased from 0.4 mm yr⁻¹ in the 1980s to 1.0 mm yr⁻¹ during 2006–2016.',
    topics: ['glaciar', 'glacier', 'nivel del mar', 'sea level', 'hielo', 'alpes'],
    accentColor: '#E53E3E',
    citationCount: 2210,
  },
  {
    id: 'glamos2022',
    title: 'The Swiss Glaciers 2019/20 and 2020/21 — Glaciological Report',
    authors: 'GLAMOS / Bauder et al.',
    journal: 'VAW-ETH Zürich',
    journalAbbr: 'GLAMOS',
    year: 2022,
    doi: '10.18752/glrep_93-94',
    url: 'https://www.glamos.ch/en/downloads#reports',
    abstract: 'El Glaciar Aletsch perdió 4.4 km² de superficie en 2019-2021. El 2022 registró la mayor pérdida de masa desde el inicio de las mediciones sistemáticas en Suiza.',
    topics: ['glaciar', 'glacier', 'aletsch', 'suiza', 'swiss', 'retroceso', 'alpes'],
    accentColor: '#2B6CB0',
    citationCount: 87,
  },
  {
    id: 'sommer2020',
    title: 'Exceptionally warm summers 2003 and 2018 reduced glacier ice, area, volume',
    authors: 'Sommer et al.',
    journal: 'The Cryosphere',
    journalAbbr: 'Cryosphere',
    year: 2020,
    doi: '10.5194/tc-14-3183-2020',
    url: 'https://doi.org/10.5194/tc-14-3183-2020',
    abstract: 'Los veranos excepcionales de 2003 y 2018 provocaron pérdidas de masa 2-3 veces superiores a la media en los glaciares alpinos, acelerando su retroceso pluridecadal.',
    topics: ['glaciar', 'glacier', 'temperatura', 'heat wave', 'alpes', 'deshielo'],
    accentColor: '#276749',
    citationCount: 312,
  },

  // ── NIEVE / SNOW COVER ───────────────────────────────────────────────────
  {
    id: 'fontrodona2023',
    title: 'Decrease in mid-mountain snowfall in Europe between 1959 and 2021',
    authors: 'Fontrodona Bach et al.',
    journal: 'Nature Climate Change',
    journalAbbr: 'NCC',
    year: 2023,
    doi: '10.1038/s41558-023-01622-5',
    url: 'https://doi.org/10.1038/s41558-023-01622-5',
    abstract: 'La capa de nieve a altitudes intermedias en Europa disminuyó significativamente entre 1959 y 2021, con reducciones de hasta el 25% en los Alpes centrales.',
    topics: ['nieve', 'snow', 'nevada', 'cobertura nival', 'alpes', 'invierno'],
    accentColor: '#E53E3E',
    citationCount: 456,
  },
  {
    id: 'beniston2018',
    title: 'The European mountain cryosphere: a review of its current state, trends, and future challenges',
    authors: 'Beniston et al.',
    journal: 'The Cryosphere',
    journalAbbr: 'Cryosphere',
    year: 2018,
    doi: '10.5194/tc-12-759-2018',
    url: 'https://doi.org/10.5194/tc-12-759-2018',
    abstract: 'Revisión integral del estado de la criosfera europea: retroceso glaciar, reducción de nieve, deshielo de permafrost y sus impactos socioeconómicos en los Alpes.',
    topics: ['nieve', 'snow', 'glaciar', 'alpes', 'criósfera', 'temperatura', 'cambio climático'],
    accentColor: '#276749',
    citationCount: 678,
  },

  // ── TEMPERATURA / CALOR ──────────────────────────────────────────────────
  {
    id: 'ipcc2021ch11',
    title: 'Climate Change 2021: The Physical Science Basis — Chapter 11 (Extremes)',
    authors: 'Seneviratne et al. (IPCC AR6)',
    journal: 'IPCC AR6 WG1',
    journalAbbr: 'IPCC',
    year: 2021,
    doi: '10.1017/9781009157896.013',
    url: 'https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-11/',
    abstract: 'Los eventos de calor extremo se han vuelto más frecuentes, intensos y de mayor duración desde 1950. Es prácticamente seguro que la frecuencia de las olas de calor aumentará con el calentamiento global.',
    topics: ['temperatura', 'calor', 'heat wave', 'extremo', 'cambio climático'],
    accentColor: '#C05621',
    citationCount: 9800,
  },
  {
    id: 'rebetez2006',
    title: 'Heat and drought 2003 in Europe: a climate synthesis',
    authors: 'Rebetez et al.',
    journal: 'Annals of Forest Science',
    journalAbbr: 'AFS',
    year: 2006,
    doi: '10.1051/forest:2006030',
    url: 'https://doi.org/10.1051/forest:2006030',
    abstract: 'La ola de calor de 2003 fue la más intensa de los últimos 500 años en Europa central. Las temperaturas estivales superaron la media en +6°C en algunas regiones alpinas.',
    topics: ['temperatura', 'calor', 'ola de calor', '2003', 'alpes', 'europa'],
    accentColor: '#C05621',
    citationCount: 445,
  },

  // ── LAGOS PROGLACIARES ───────────────────────────────────────────────────
  {
    id: 'shugar2020',
    title: 'Rapid worldwide growth of glacial lakes since 1990',
    authors: 'Shugar et al.',
    journal: 'Nature Climate Change',
    journalAbbr: 'NCC',
    year: 2020,
    doi: '10.1038/s41558-020-0855-4',
    url: 'https://doi.org/10.1038/s41558-020-0855-4',
    abstract: 'Los lagos glaciares mundiales crecieron un 51% en área y un 48% en volumen entre 1990 y 2018, impulsados por el acelerado retroceso glaciar.',
    topics: ['lago', 'lake', 'proglaciar', 'glaciar', 'deshielo', 'agua'],
    accentColor: '#E53E3E',
    citationCount: 891,
  },
  {
    id: 'buckel2018',
    title: 'Glacial lake inventory of the Eastern Alps: development since the Little Ice Age',
    authors: 'Buckel et al.',
    journal: 'Earth System Science Data',
    journalAbbr: 'ESSD',
    year: 2018,
    doi: '10.5194/essd-10-2031-2018',
    url: 'https://doi.org/10.5194/essd-10-2031-2018',
    abstract: 'Inventario de 1555 lagos glaciares en los Alpes Orientales. El número de lagos creció un 85% y la superficie total un 23% desde la Pequeña Edad de Hielo.',
    topics: ['lago', 'lake', 'proglaciar', 'alpes', 'glaciar', 'inventario'],
    accentColor: '#285E61',
    citationCount: 167,
  },

  // ── NIVEL DEL MAR ────────────────────────────────────────────────────────
  {
    id: 'oppenheimer2019',
    title: 'Sea Level Rise and Implications for Low-Lying Islands, Coasts and Communities',
    authors: 'Oppenheimer et al. (IPCC SROCC)',
    journal: 'IPCC SROCC',
    journalAbbr: 'IPCC',
    year: 2019,
    doi: '10.1017/9781009157964.006',
    url: 'https://www.ipcc.ch/srocc/chapter/chapter-4/',
    abstract: 'El nivel medio global del mar subió 0.16 m entre 1902 y 2015. Las proyecciones para 2100 van de 0.29 a 1.10 m según el escenario de emisiones.',
    topics: ['nivel del mar', 'sea level', 'inundación', 'costa', 'cambio climático'],
    accentColor: '#C05621',
    citationCount: 3200,
  },

  // ── PERMAFROST ───────────────────────────────────────────────────────────
  {
    id: 'etzelmüller2022',
    title: 'Recent changes and future projections of permafrost in Europe',
    authors: 'Etzelmüller et al.',
    journal: 'Nature Reviews Earth & Environment',
    journalAbbr: 'NRE&E',
    year: 2022,
    doi: '10.1038/s43017-022-00290-3',
    url: 'https://doi.org/10.1038/s43017-022-00290-3',
    abstract: 'El permafrost europeo ha sufrido un calentamiento de hasta +2.5°C en los últimos 30 años. Para 2100 podría perderse entre el 35% y el 90% del permafrost alpino.',
    topics: ['permafrost', 'montaña', 'alpes', 'suelo', 'temperatura', 'cambio climático'],
    accentColor: '#E53E3E',
    citationCount: 234,
  },
]

// ── Scoring function ──────────────────────────────────────────────────────────
function scorePaper(paper: ScientificPaper, claimText: string): number {
  const lower = claimText.toLowerCase()
  let score = 0
  for (const topic of paper.topics) {
    if (lower.includes(topic.toLowerCase())) score += 10
    // partial match bonus
    if (lower.split(' ').some(w => topic.toLowerCase().startsWith(w.slice(0, 4)) && w.length > 3)) score += 3
  }
  // Citation boost (more cited = more authoritative)
  score += Math.min(5, Math.floor(paper.citationCount / 500))
  return score
}

// ── Public API ────────────────────────────────────────────────────────────────
export function getRelevantPapers(claimText: string, maxResults = 4): ScientificPaper[] {
  const scored = PAPERS_DB
    .map(p => ({ paper: p, score: scorePaper(p, claimText) }))
    .sort((a, b) => b.score - a.score)

  // Always return at least 3 results even if score is 0
  return scored.slice(0, maxResults).map(s => s.paper)
}

// ── GDELT integration helper ─────────────────────────────────────────────────
// Construye queries en INGLÉS para GDELT (la mayoría de artículos indexados son en inglés).
// Usa términos amplios para maximizar resultados, priorizando temas alpinos/climáticos.
export function buildGDELTQuery(claimText: string): string {
  const lower = claimText.toLowerCase()

  // Detectar tema principal y devolver query optimizada en inglés
  if (lower.includes('glaciar') || lower.includes('glacier') || lower.includes('hielo'))
    return '"glacier" "Alps" OR "Swiss glacier" OR "alpine glacier" climate'

  if (lower.includes('nieve') || lower.includes('snow') || lower.includes('nevada'))
    return '"snow cover" "Alps" OR "snowfall" Switzerland climate change'

  if (lower.includes('temperatura') || lower.includes('calor') || lower.includes('heat'))
    return 'heatwave Europe Alps "climate change" temperature record'

  if (lower.includes('lago') || lower.includes('lake') || lower.includes('proglaciar'))
    return '"glacial lake" Alps OR "proglacial" Switzerland melt'

  if (lower.includes('inundación') || lower.includes('flood'))
    return 'flood Alps Switzerland "climate change"'

  if (lower.includes('permafrost'))
    return 'permafrost Alps mountain "climate change"'

  // Fallback: query climática general sobre los Alpes
  return '"climate change" "Alps" Switzerland glacier OR snow OR temperature'
}

// GDELT API parameters optimizados:
// - TIMESPAN=90 (90 días en lugar de 30 — más resultados)
// - SORTBY=relevance
// - maxrecords=5
export const GDELT_TIMESPAN = '90'
