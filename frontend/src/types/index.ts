// ─────────────────────────────────────────────────────────────────────────────
// Peak News — Core TypeScript interfaces
// All API responses (Phase 2) should conform to these shapes.
// ─────────────────────────────────────────────────────────────────────────────

export type VerdictType = 'false' | 'verified' | 'misleading' | 'pending';

// ── Input Mode — how the user submitted the content ───────────────────────────
export type InputMode = 'statement' | 'article' | 'social';

export interface Claim {
  id: number;
  text: string;
}

// ── Source Card — rich preview of the analyzed source ─────────────────────────
// Shown at the top of the results panel to show where the content came from.
export interface SourceCardData {
  // Article fields
  domain?:      string;   // e.g. "arctic-truth.net"
  publication?: string;   // e.g. "Arctic Truth News"
  author?:      string;   // e.g. "John Doe"
  publishedAt?: string;   // human-readable, e.g. "15 enero 2026"
  excerpt?:     string;   // short article snippet

  // Social fields (Twitter / X)
  username?:  string;   // e.g. "PeakTruth99"
  handle?:    string;   // e.g. "@PeakTruth99"
  content?:   string;   // tweet/post text
  likes?:     number;
  retweets?:  number;
  replies?:   number;
  postedAt?:  string;   // e.g. "hace 2 horas"

  // Reddit fields
  subreddit?: string;   // e.g. "r/climate"
  upvotes?:   number;
  comments?:  number;
}

// ── Satellite ─────────────────────────────────────────────────────────────────

export interface SatelliteImage {
  date: string;          // e.g. "January 14, 2021"
  location: string;      // e.g. "Aletsch Glacier, Switzerland"
  source: 'Landsat 8' | 'Sentinel-2';
  imageUrl?: string;     // Phase 2: real GEE tile URL
}

export interface TimeSeriesPoint {
  year: number;
  coverage: number; // snow coverage % (0–100)
}

export interface SatelliteData {
  glacierRetreat: number;        // meters/year
  snowCoverage: number;          // % current year
  ndviIndex: number;             // vegetation index
  coverageTrend: number;         // % change since baseline (negative = loss)
  baselineYear: number;          // e.g. 2015
  images: SatelliteImage[];
  timeSeries: TimeSeriesPoint[];

  // ── Real GEE assets (generated from Google Earth Engine scripts) ──────────
  // When present, these replace the NASA GIBS comparison with real local imagery.
  geeBeforeUrl?:  string;   // e.g. "/satellite/austria_pasterze_1990.jpg"
  geeAfterUrl?:   string;   // e.g. "/satellite/austria_pasterze_2025.jpg"
  geeBeforeYear?: number;   // e.g. 1990
  geeAfterYear?:  number;   // e.g. 2025
  geeLocation?:   string;   // e.g. "Lago Pasterze, Austria · Sentinel-2 / Landsat 8"
  chartUrls?:     string[]; // GEE-generated analysis charts (01_tendencia, 02_cambio…)
}

// ── NLP / Narrative Analysis ──────────────────────────────────────────────────

export interface NLPScore {
  label: string;
  value: number; // 0–100
  description: string;
}

export interface NLPAnalysis {
  minimizationScore: number;   // 0–100: downplaying severity
  delayismScore: number;       // 0–100: "we should wait and see"
  denialismScore: number;      // 0–100: direct climate denial
  topKeywords: string[];
  narrativeType: string;       // e.g. "Minimización glaciar"
  scores: NLPScore[];
}

// ── Sources ───────────────────────────────────────────────────────────────────

export interface Source {
  name: string;
  url: string;
  type: string;        // e.g. "Satélite óptico", "Red de monitoreo glaciar"
  reliability: number; // 0–100
  active: boolean;
}

// ── Key data stats — displayed as inline metric strip ─────────────────────────
export interface DataStat {
  value:     string;   // e.g. "−41.1%"
  label:     string;   // e.g. "Cobertura nival Tirol"
  sublabel?: string;   // e.g. "2000–2025 · GEE/Landsat 8"
  trend:     'down' | 'up' | 'neutral';
}

// ── Related media items ───────────────────────────────────────────────────────
export interface RelatedMediaItem {
  type:   'video' | 'article' | 'report';
  title:  string;
  source: string;   // e.g. "The Guardian", "NASA Goddard"
  url:    string;
  date?:  string;
}

// ── Main Analysis object ──────────────────────────────────────────────────────

export interface Analysis {
  id: string;
  input: string;               // The URL or text the user submitted
  inputMode?: InputMode;       // How the content was submitted
  platform?: 'twitter' | 'reddit'; // For social mode
  sourceCard?: SourceCardData; // Rich preview of the analyzed source
  headline: string;
  analyzedAt: string;          // ISO date string
  verdict: VerdictType;
  score: number;               // 0–100 veracity score (0 = completely false)
  summary: string;
  claims: Claim[];
  satellite: SatelliteData;
  nlp: NLPAnalysis;
  sources: Source[];
  dataStats?: DataStat[];           // Key numbers shown inline in the verdict hero
  richNarrative?: string;           // Multi-paragraph Perplexity-style analysis
  relatedMedia?: RelatedMediaItem[]; // Related articles / videos
}

// ── Trends (Phase 2: Google Trends / scraping) ────────────────────────────────

export interface TrendPoint {
  month: string;
  value: number;
}

export interface NarrativeTrend {
  id: string;
  label: string;
  delta: number;        // % change (positive = rising)
  data: TrendPoint[];
}

// ── API response wrappers ──────────────────────────────────────────────────────

export interface AnalysisResponse {
  ok: boolean;
  data?: Analysis;
  error?: string;
}
