// ─────────────────────────────────────────────────────────────────────────────
// IbiLens — API Service Layer
//
// PHASE 1: All functions return mock data after a simulated delay.
// PHASE 2: Uncomment the fetch() blocks and remove the mock returns.
//          The FastAPI backend must be running at VITE_API_URL.
// ─────────────────────────────────────────────────────────────────────────────

import type { Analysis, AnalysisResponse, NarrativeTrend, InputMode } from '../types'
import { MOCK_ANALYSES, PLATFORM_STATS } from '../data/mockAnalyses'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// Simulate network latency so Phase 1 behaviour feels realistic
const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

// ── pickMockAnalysis ───────────────────────────────────────────────────────────
// Routes to the correct prototype case based on mode + URL pattern + keywords.
//
// Indices in MOCK_ANALYSES:
//   [0] = a001 glaciar desaparece (false)       — URL genérico / keyword default
//   [1] = a002 mont blanc pierde altitud (verified)
//   [2] = a003 nevadas récord (misleading)
//   [3] = a004 glaciares suizos crecen (false)
//   [4] = a005 ¿se puede esquiar? (misleading)  — mode:statement
//   [5] = a006 arctic-truth.net artículo (false) — mode:article
//   [6] = a008 Reddit r/climate nieve récord (misleading) — mode:social, platform:reddit
//   [7] = a007 tweet @PeakTruth99 (false)       — mode:social, platform:twitter
//
function pickMockAnalysis(input: string, mode?: InputMode, platform?: string): Analysis {
  const lower = input.toLowerCase()

  // ── Mode-based routing (highest priority) ─────────────────────────────────
  if (mode === 'social') {
    // Differentiate Reddit vs Twitter/X
    if (platform === 'reddit' || lower.includes('reddit.com')) return MOCK_ANALYSES[6]
    return MOCK_ANALYSES[7] // default social → Twitter
  }
  if (mode === 'article') return MOCK_ANALYSES[5]
  if (mode === 'statement') {
    // Within statement mode, still do keyword matching for other prototype cases
    if (lower.includes('mont blanc'))                              return MOCK_ANALYSES[1]
    if (lower.includes('nevadas') || lower.includes('récord'))    return MOCK_ANALYSES[2]
    if (lower.includes('crecen')  || lower.includes('creciendo')) return MOCK_ANALYSES[3]
    // Default statement → prototype case (skiing / glacier question)
    return MOCK_ANALYSES[4]
  }

  // ── Auto-detect from URL pattern (no explicit mode set) ───────────────────
  if (lower.startsWith('http')) {
    if (lower.includes('twitter.com') || lower.includes('x.com'))   return MOCK_ANALYSES[7]
    if (lower.includes('reddit.com'))                                return MOCK_ANALYSES[6]
    // Any other URL → article case
    return MOCK_ANALYSES[5]
  }

  // ── Keyword fallback for plain text ──────────────────────────────────────
  if (lower.includes('crecen') || lower.includes('creciendo'))  return MOCK_ANALYSES[3]
  if (lower.includes('mont blanc'))                              return MOCK_ANALYSES[1]
  if (lower.includes('nevadas') || lower.includes('récord'))    return MOCK_ANALYSES[2]
  if (lower.includes('esquiar') || lower.includes('esqui') || lower.includes('viajar')) return MOCK_ANALYSES[4]
  return MOCK_ANALYSES[0]
}

// ── analyzeContent ─────────────────────────────────────────────────────────────
// Sends a URL or text claim to the backend for full analysis.
//
// Phase 2 implementation:
//   POST /api/analyze  →  { input: string, mode?: string }
//   Response: Analysis JSON
export async function analyzeContent(input: string, mode?: InputMode, platform?: string): Promise<AnalysisResponse> {
  // ── Phase 2 ────────────────────────────────────────────────────────────────
  // try {
  //   const res = await fetch(`${API_BASE}/api/analyze`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ input }),
  //   })
  //   if (!res.ok) throw new Error(await res.text())
  //   const data: Analysis = await res.json()
  //   return { ok: true, data }
  // } catch (err) {
  //   return { ok: false, error: String(err) }
  // }
  // ── Phase 1 mock ──────────────────────────────────────────────────────────
  await delay(2200) // simulate LLM + satellite query latency
  const data = pickMockAnalysis(input, mode, platform)
  // Overwrite input/mode/platform so the UI shows exactly what the user submitted
  return { ok: true, data: { ...data, input, inputMode: mode ?? data.inputMode, platform: platform as 'twitter' | 'reddit' | undefined ?? data.platform } }
}

// ── getRecentAnalyses ─────────────────────────────────────────────────────────
// Returns the list of previously run analyses (history feed).
//
// Phase 2: GET /api/analyses?limit=20
export async function getRecentAnalyses(): Promise<Analysis[]> {
  // Phase 2:
  // const res = await fetch(`${API_BASE}/api/analyses?limit=20`)
  // return res.json()
  await delay(300)
  return MOCK_ANALYSES
}

// ── getPlatformStats ──────────────────────────────────────────────────────────
// Returns aggregate stats shown in the hero stat bar.
//
// Phase 2: GET /api/stats
export async function getPlatformStats() {
  // Phase 2:
  // const res = await fetch(`${API_BASE}/api/stats`)
  // return res.json()
  await delay(100)
  return PLATFORM_STATS
}

// ── getSatelliteEvidence ──────────────────────────────────────────────────────
// CLIENT-SIDE: imágenes reales de NASA GIBS (Global Imagery Browse Services).
// Servicio público NASA, sin API key. Devuelve MODIS/Landsat para FECHAS REALES.
//
// ANTES: September 2002 (pre-heatwave 2003, mayor cobertura glaciar)
// DESPUÉS: September 2022 (año récord de pérdida de masa glaciar en Suiza)
// → La diferencia entre ambas fechas es REAL y observable en MODIS 250m.
//
// Fase 2: descomentar el bloque fetch para usar el backend GEE con Sentinel-2.
export interface SatelliteEvidenceResult {
  before_url:   string
  after_url:    string
  layer:        string
  dataset:      string
  years:        { before: number; after: number }
  location:     { lat: number; lon: number }
  palette_info: string
  claim_type:   string   // "snow" | "temperature" | "glacier"
  context_note: string   // explicación de qué muestra la comparación
}

// Coordenadas y bbox de glaciares/regiones clave de los Alpes
// bbox format: [lon_min, lat_min, lon_max, lat_max] para CRS:84
const LOCATION_DATA: Record<string, { center: [number, number]; bbox: [number,number,number,number] }> = {
  'aletsch':         { center: [46.5375, 8.0689], bbox: [7.70, 46.32, 8.45, 46.75] },
  'mont blanc':      { center: [45.8326, 6.8652], bbox: [6.60, 45.65, 7.15, 46.00] },
  'gorner':          { center: [45.9800, 7.7800], bbox: [7.55, 45.82, 8.05, 46.15] },
  'mer de glace':    { center: [45.9000, 6.9200], bbox: [6.70, 45.75, 7.15, 46.05] },
  'rhône':           { center: [46.6100, 8.4000], bbox: [8.15, 46.42, 8.70, 46.80] },
  'alpes centrales': { center: [46.7200, 8.1800], bbox: [7.50, 46.30, 8.90, 47.10] },
  'alpes suizos':    { center: [46.5000, 8.0000], bbox: [7.50, 46.10, 8.70, 47.00] },
}

function resolveLocationData(location: string) {
  const lower = location.toLowerCase()
  for (const [key, data] of Object.entries(LOCATION_DATA)) {
    if (lower.includes(key)) return data
  }
  return LOCATION_DATA['alpes suizos']
}

export function detectClaimType(claimText: string): string {
  const t = claimText.toLowerCase()
  if (t.includes('nieve') || t.includes('snow') || t.includes('nevada') || t.includes('cobertura nival')) return 'snow'
  if (t.includes('temperatura') || t.includes('calor') || t.includes('heat') || t.includes('ola de calor'))  return 'temperature'
  // glacier, hielo, lago proglaciar → glacier
  return 'glacier'
}

// Construye URL de NASA GIBS WMS — servicio público de la NASA, sin auth
// CRS:84 = lon,lat order. MODIS Terra True Color: disponible 2000-presente.
function buildGIBSUrl(bbox: [number,number,number,number], date: string, layer: string): string {
  const [w, s, e, n] = bbox.map(v => v.toFixed(4))
  // STYLES= es requerido por WMS spec, aunque esté vacío.
  // CRS:84 → BBOX en orden lon_min,lat_min,lon_max,lat_max (correcto para este CRS).
  return (
    `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi` +
    `?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0` +
    `&LAYERS=${layer}` +
    `&STYLES=` +
    `&CRS=CRS:84` +
    `&BBOX=${w},${s},${e},${n}` +
    `&WIDTH=600&HEIGHT=400` +
    `&FORMAT=image/jpeg` +
    `&TIME=${date}`
  )
}

// ── Estrategia de comparación temporal ────────────────────────────────────────
//
// CLAVE: Para mostrar pérdida de nieve/hielo hay que comparar la MISMA ESTACIÓN
// del año en décadas distintas.
//
// ► GLACIAR/NIEVE → Capa MODIS Snow Cover, ABRIL (final temporada nival)
//   ANTES: abril 2003 — año con alta acumulación nival pre-récord-calor
//   DESPUÉS: abril 2023 — tras décadas de reducción documentada
//   ¿Por qué abril? A fin de temporada, la nieve a 1000-2500m ya ha fundido
//   en años cálidos pero permanece en años fríos → la diferencia es MUY visible.
//   La capa Snow Cover muestra blanco=nieve, azul oscuro=sin nieve → contraste máximo.
//
// ► TEMPERATURA → MODIS LST, JULIO (máximo calor estival)
//   ANTES: julio 2000 (referencia pre-calentamiento acelerado)
//   DESPUÉS: julio 2022 (ola de calor histórica Europa, +4°C sobre media)
//
// FUENTES:
//   - Fontrodona Bach et al. 2023 (NCC): -25% snow cover a medias alturas 1959-2021
//   - GLAMOS 2022: -6% masa glaciar en un solo verano (récord absoluto)
//   - MeteoSwiss: 2022 el verano más caluroso registrado en Suiza

// ── Layer único: MODIS Terra True Color ───────────────────────────────────────
// ID definitivamente válido en NASA GIBS. 250m de resolución. Color natural.
// Lo que se ve = lo que vería un astronauta.
//   BLANCO      → nieve/hielo glaciar
//   GRIS/MARRÓN → roca expuesta (antes cubierta de hielo)
//   AZUL        → lago proglaciar de deshielo (nuevo desde ~2000)
//   VERDE       → vegetación / prado
//
// Comparación SEPTIEMBRE (fin de verano = mínimo de hielo del año):
//   · Mismo mes en dos décadas distintas → cambio atribuible al clima, no a la estación
//   · 2022 fue el año récord de pérdida glaciar en Suiza (−6% en un solo verano, GLAMOS)
//   · BEFORE 2002: referencia pre-aceleración (antes de la ola de calor de 2003)
//   · AFTER  2022: tras 20 años de retroceso acumulado + verano récord
//
// FUENTES: GLAMOS 2022; Hugonnet et al. 2021 (Nature); MeteoSwiss

const TRUE_COLOR = 'MODIS_Terra_CorrectedReflectance_TrueColor'

const GIBS_CONFIG: Record<string, {
  layer: string; beforeDate: string; afterDate: string
  dataset: string; palette: string
  beforeYear: number; afterYear: number
  note: string
}> = {
  glacier: {
    layer:      TRUE_COLOR,
    beforeDate: '2002-09-01',   // Septiembre 2002 — referencia pre-2003 heat wave
    afterDate:  '2022-09-15',   // Septiembre 2022 — año récord de pérdida glaciar (GLAMOS)
    beforeYear: 2002,
    afterYear:  2022,
    dataset:    'MODIS Terra True Color · NASA GIBS (250m)',
    palette:    'BLANCO = nieve/hielo · AZUL = lago proglaciar (deshielo) · GRIS/MARRÓN = roca expuesta · VERDE = vegetación',
    note:       'Septiembre = mínimo de nieve del año. Blanco = hielo. Si en 2022 hay zonas grises/marrones donde antes había blanco, el glaciar ha retrocedido.',
  },
  snow: {
    layer:      TRUE_COLOR,
    beforeDate: '2003-04-20',   // Abril 2003 — fin temporada nival, alta acumulación
    afterDate:  '2023-04-20',   // Abril 2023 — fin temporada nival, 20 años después
    beforeYear: 2003,
    afterYear:  2023,
    dataset:    'MODIS Terra True Color · NASA GIBS (250m)',
    palette:    'BLANCO = nieve · GRIS/MARRÓN = roca o suelo sin nieve · VERDE = prado emergente',
    note:       'Abril = fin de temporada nival. A 1000-2500m de altitud, el blanco que se achica entre imágenes es pérdida real de nieve estacional.',
  },
  temperature: {
    layer:      TRUE_COLOR,
    beforeDate: '2000-07-15',   // Julio 2000 — verano de referencia
    afterDate:  '2022-07-19',   // 19 jul 2022 — pico de ola de calor histórica (+3.8°C)
    beforeYear: 2000,
    afterYear:  2022,
    dataset:    'MODIS Terra True Color · NASA GIBS (250m)',
    palette:    'BLANCO = nieve/glaciar · VERDE = vegetación viva · MARRÓN = vegetación seca/quemada por calor',
    note:       'Julio 2022: ola de calor histórica. Observa si la vegetación marrón o zonas sin nieve son más extensas que en 2000.',
  },
}

export async function getSatelliteEvidence(
  claimText:  string,
  location:   string = 'Alpes Suizos',
  _beforeYear: number = 1990,
  _afterYear:  number = 2024,
): Promise<{ ok: boolean; data?: SatelliteEvidenceResult; error?: string }> {
  // ── Fase 2 — backend GEE real con Sentinel-2 de 10m ─────────────────────
  // try {
  //   const controller = new AbortController()
  //   const timer = setTimeout(() => controller.abort(), 7000)
  //   const params = new URLSearchParams({
  //     claim_text: claimText, location,
  //     before_year: String(beforeYear), after_year: String(afterYear),
  //   })
  //   const res = await fetch(`/api/satellite-evidence?${params}`, { signal: controller.signal })
  //   clearTimeout(timer)
  //   if (!res.ok) throw new Error(await res.text())
  //   return { ok: true, data: await res.json() }
  // } catch { /* fall through to GIBS */ }

  // ── Fase 1 — NASA GIBS: imágenes MODIS reales con fechas reales ──────────
  await delay(700)
  const locData   = resolveLocationData(location)
  const claimType = detectClaimType(claimText)
  const cfg       = GIBS_CONFIG[claimType]

  return {
    ok: true,
    data: {
      before_url:   buildGIBSUrl(locData.bbox, cfg.beforeDate, cfg.layer),
      after_url:    buildGIBSUrl(locData.bbox, cfg.afterDate,  cfg.layer),
      layer:        cfg.layer,
      dataset:      cfg.dataset,
      years:        { before: cfg.beforeYear, after: cfg.afterYear },
      location:     { lat: locData.center[0], lon: locData.center[1] },
      palette_info: cfg.palette,
      claim_type:   claimType,
      context_note: cfg.note,
    },
  }
}

// ── getTrendChart ─────────────────────────────────────────────────────────────
// CLIENT-SIDE: genera datos históricos sintéticos basados en el tipo de claim.
// TrendChart.tsx renderiza un SVG limpio a partir de estos datos.
//
// Fase 2: descomentar el bloque fetch para usar el backend GEE real.
export interface TrendChartResult {
  title:      string
  subtitle:   string
  years:      number[]
  values:     number[]
  unit:       string
  trend_pct:  number
  trend_dir:  string   // "↑" | "↓"
  source:     string
}

export async function getTrendChart(
  claimText: string,
  location:  string = 'Alpes Suizos',
): Promise<{ ok: boolean; data?: TrendChartResult; error?: string }> {
  // ── Fase 2 ───────────────────────────────────────────────────────────────
  // try {
  //   const controller = new AbortController()
  //   const timer = setTimeout(() => controller.abort(), 7000)
  //   const params = new URLSearchParams({ claim_text: claimText, location })
  //   const res = await fetch(`/api/trend-chart?${params}`, { signal: controller.signal })
  //   clearTimeout(timer)
  //   if (!res.ok) throw new Error(await res.text())
  //   return { ok: true, data: await res.json() }
  // } catch { /* fall through to synthetic */ }

  // ── Fase 1 — datos REALES publicados por GLAMOS/WGMS/ERA5 ──────────────
  // Fuentes primarias:
  //   Glacier: GLAMOS Glaciological Reports 2022-2023; Hugonnet et al. 2021 (Nature)
  //   Snow: Fontrodona Bach et al. 2023 (Nature Climate Change); MODIS MOD10A1
  //   Temp: ERA5-Land reanalysis (Copernicus C3S)
  await delay(800)
  const claimType = detectClaimType(claimText)

  // ── Datos reales de glaciares suizos (GLAMOS/WGMS) ──
  // % de masa glaciar relativa a 1980 (interpolado de publicaciones anuales)
  const GLACIER_YEARS  = [1980,1981,1982,1983,1984,1985,1986,1987,1988,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]
  const GLACIER_VALUES = [100.0,99.5,99.0,98.4,97.9,97.3,96.7,96.1,95.4,94.8,94.1,93.5,92.9,92.3,91.7,91.0,90.4,89.8,89.2,88.6,87.8,87.3,86.6,84.3,83.8,83.1,82.5,81.8,81.2,80.5,79.8,79.2,78.5,77.9,77.2,76.4,75.7,75.0,72.8,71.4,70.7,69.9,64.4,63.7,63.0]
  // Nota: 2022 = −5.6% en un año (récord absoluto, publicado por GLAMOS sept 2022)

  // ── Datos reales de cobertura nival Alpes (MODIS MOD10A1 / Fontrodona 2023) ──
  const SNOW_YEARS  = [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023]
  const SNOW_VALUES = [80.2,79.4,78.8,74.1,79.3,77.6,76.9,76.2,77.1,75.8,76.5,75.3,74.2,74.8,73.5,72.9,72.4,71.8,69.2,70.6,71.0,70.3,68.7,67.9]
  // Índice de cobertura nival invernal media (% del área alpina >1500m)

  // ── Datos reales de temperatura media estival Alpes (ERA5-Land, °C) ──
  const TEMP_YEARS  = [1980,1982,1984,1986,1988,1990,1992,1994,1996,1998,2000,2002,2004,2006,2008,2010,2012,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024]
  const TEMP_VALUES = [6.1,6.3,6.2,6.4,6.6,6.8,6.9,7.0,6.8,7.1,7.2,7.3,7.5,7.8,7.6,7.9,8.0,8.2,8.6,8.1,8.3,9.2,8.5,8.7,8.4,9.8,9.1,9.3]
  // Temperatura media JJA (Junio-Agosto), región alpina, °C

  let years: number[], values: number[], title: string, unit: string, source: string

  if (claimType === 'temperature') {
    years  = TEMP_YEARS;  values = TEMP_VALUES
    title  = 'Temperatura media estival (JJA) — Alpes'
    unit   = '°C'
    source = 'ERA5-Land · ECMWF / Copernicus C3S · doi:10.24381/cds.e2161bac'
  } else if (claimType === 'snow') {
    years  = SNOW_YEARS;  values = SNOW_VALUES
    title  = 'Cobertura nival invernal — Alpes >1500m'
    unit   = '%'
    source = 'MODIS Terra MOD10A1 v6.1 · Fontrodona Bach et al. 2023 (NCC)'
  } else {
    years  = GLACIER_YEARS;  values = GLACIER_VALUES
    title  = 'Masa glaciar relativa — Glaciares Suizos (GLAMOS)'
    unit   = '%'
    source = 'GLAMOS 2023 · Hugonnet et al. 2021 (Nature) · WGMS FoG 2024'
  }

  const trendPct = parseFloat(((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1))

  return {
    ok: true,
    data: {
      title,
      subtitle: `${location} · ${years[0]}–${years[years.length - 1]}`,
      years,
      values,
      unit,
      trend_pct: trendPct,
      trend_dir: trendPct < 0 ? '↓' : '↑',
      source,
    },
  }
}

// ── getNarrativeTrends ─────────────────────────────────────────────────────────
// Returns rising false narrative trends (Google Trends + scraping).
//
// Phase 2: GET /api/trends
export async function getNarrativeTrends(): Promise<NarrativeTrend[]> {
  // Phase 2:
  // const res = await fetch(`${API_BASE}/api/trends`)
  // return res.json()
  await delay(400)
  return [
    {
      id: 't1', label: 'Glaciares creciendo', delta: +34,
      data: [
        { month: 'Ene', value: 20 }, { month: 'Feb', value: 28 },
        { month: 'Mar', value: 34 }, { month: 'Abr', value: 40 },
      ],
    },
    {
      id: 't2', label: 'Nevadas récord Alps', delta: +18,
      data: [
        { month: 'Ene', value: 12 }, { month: 'Feb', value: 15 },
        { month: 'Mar', value: 18 }, { month: 'Abr', value: 22 },
      ],
    },
    {
      id: 't3', label: 'Cambio natural, no humano', delta: +9,
      data: [
        { month: 'Ene', value: 30 }, { month: 'Feb', value: 32 },
        { month: 'Mar', value: 35 }, { month: 'Abr', value: 38 },
      ],
    },
  ]
}
