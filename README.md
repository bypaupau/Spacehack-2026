# 🏔️ Peak News — Alpine Fact-Checker

> **Space Hack 2026** · AI-powered collaborative fact-checking platform using Earth Observation data from the Alps.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-spacehack--2026.vercel.app-blue?style=flat-square)](https://spacehack-2026.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-Sentinel--2%20%2F%20Landsat%208-4285F4?style=flat-square&logo=google)](https://earthengine.google.com)

---

## What is Peak News?

Peak News is a journalistic infrastructure tool for **fact-checking climate claims about the Alps**. It takes a news statement, article URL, or social media post and cross-references it against:

- 🛰️ **Real satellite imagery** — Sentinel-2 (ESA) and Landsat 8/9 (USGS) via Google Earth Engine
- 📊 **Statistical analysis** — GEE-generated glacier retreat and snow coverage data
- 📚 **Peer-reviewed literature** — Semantic Scholar, IPCC AR6, Nature Climate Change, WMO

Every analysis produces a **rigorous three-state verdict**:

| Verdict | Meaning |
|---|---|
| ✅ **Verified** | Backed by satellite evidence and scientific consensus |
| ⚠️ **Misleading** | Partially true but omits critical context |
| ❌ **False** | Directly contradicts satellite and scientific evidence |

---

## Key Features

**For journalists:**
- Submit a statement, article URL, or social post (Twitter/X, Reddit)
- Get a Perplexity-style report with inline citations `[1]` `[2]` `[3]`
- Interactive before/after satellite imagery comparison (1990 vs 2025)
- Exportable `<iframe>` embed code — paste directly into any digital newspaper
- Citizen trust micro-survey: *"Did this satellite image change your perception?"*

**Under the hood:**
- NLP narrative classification (denial / minimisation / delayism scoring)
- Real GEE charts: annual trend, decade average, anomaly vs baseline
- Keyword detection highlighting climate disinformation signals
- Truthfulness scale with confidence score (0–100)

---

## Screenshots

| Home | Verified Result | False Result |
|---|---|---|
| Submit a claim | Before/after satellite evidence | Verdict + disinformation signals |

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React 18 + Vite | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling (Soft Alpine Pastel design system) |
| Recharts | Time-series snow coverage charts |
| Lucide React | Icons |
| React Router | Navigation |

### Backend
| Tool | Purpose |
|---|---|
| Python + FastAPI | REST API |
| Google Earth Engine API | Satellite imagery + statistical analysis |
| OpenAI / Claude API | NLP claim analysis |
| Semantic Scholar | Scientific literature search |
| python-dotenv | Environment configuration |

### Data Sources
| Source | Type | Reliability |
|---|---|---|
| Sentinel-2 (ESA) | Optical satellite · 10m resolution | 97% |
| Landsat 8/9 (USGS) | Multispectral satellite · 30m resolution | 95% |
| GLAMOS Switzerland | Glacier monitoring network | 99% |
| MeteoSwiss | Meteorological data | 96% |
| IPCC AR6 | Peer-reviewed scientific report | 100% |
| Semantic Scholar | Scientific literature index | 88% |

---

## Project Structure

```
Ibilens/
├── frontend/                  # React + Vite app
│   ├── public/
│   │   ├── satellite/         # Real GEE satellite images (JPG)
│   │   └── charts/            # GEE statistical analysis charts (PNG)
│   │       ├── austria/
│   │       ├── france/
│   │       ├── italy/
│   │       └── switzerland/
│   └── src/
│       ├── components/
│       │   ├── layout/        # Navbar, page shell
│       │   ├── map/           # SatelliteCompare, SatelliteMap, TrendChart
│       │   ├── results/       # JournalistResultsView, tabs (Satellite, NLP, Sources)
│       │   └── ui/            # Logo, LoadingSpinner, shared primitives
│       ├── data/
│       │   └── mockAnalyses.ts  # Phase 1 mock data (8 real demo cases)
│       ├── pages/             # VerifyPage, SourcesPage, MethodologyPage
│       ├── services/          # api.ts — connects to FastAPI backend
│       └── types/             # Core TypeScript interfaces
├── backend/                   # FastAPI + GEE
│   ├── main.py                # API endpoints
│   ├── gee_service.py         # Google Earth Engine integration
│   ├── chart_service.py       # GEE chart generation
│   └── journal_service.py     # Scientific literature search
├── PeakNews Graphics/         # Raw GEE exports (TIF + JPG per region)
│   ├── Austria/               # Lago Pasterze, Tirol Ötztal
│   ├── Francia/               # Mont Blanc, Haute-Savoie
│   ├── Italia/                # Torino snow persistence
│   └── Suiza/                 # Aletsch, Triftsee
└── vercel.json                # Vercel deployment config
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Google Earth Engine account with service account credentials
- OpenAI or Anthropic API key

### Frontend (Phase 1 — fully working with mock data)

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` with 8 pre-built demo cases covering real Alpine glacier data.

### Backend (Phase 2 — live GEE integration)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `/backend`:

```env
OPENAI_API_KEY=sk-...
GOOGLE_APPLICATION_CREDENTIALS=credentials.json
```

Start the API:

```bash
uvicorn main:app --reload
```

API available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

---

## Demo Cases

The app ships with 8 pre-built real analysis cases:

| Case | Type | Verdict |
|---|---|---|
| "Alpine glacier disappears overnight" | Statement | ❌ False |
| "Mont Blanc loses 2m altitude due to melting" | Article URL | ✅ Verified |
| "The Alps experience record snowfall" | Statement | ⚠️ Misleading |
| "Swiss glaciers growing thanks to low temperatures" | Statement | ❌ False |
| "Alpine ski tourism has not disappeared" | Statement | ⚠️ Misleading |
| "Alpine glaciers growing thanks to record polar cold" | Article URL | ❌ False |
| "Record snow in Switzerland 2025" | Reddit post | ⚠️ Misleading |
| "Lake Pasterze GROWING" | Tweet @Kursed65936965 | ❌ False |

All cases include real satellite imagery generated from Google Earth Engine scripts.

---

## Deployment

The frontend is deployed on **Vercel** with automatic deploys from `main`.

```bash
# Vercel picks up vercel.json automatically
git push origin main
```

Key `vercel.json` settings handle SPA routing so React Router works on all paths.

---

## Roadmap

- [x] Phase 1 — Frontend mockup with real GEE imagery
- [x] Before/after satellite comparison viewer (click to expand)
- [x] Journalist iframe embed widget
- [x] Citizen trust micro-survey
- [ ] Phase 2 — Live FastAPI backend connected to GEE
- [ ] Real-time claim analysis via OpenAI/Claude
- [ ] Italy (Torino) satellite data integration
- [ ] User-submitted corrections & collaborative annotation

---

## Team

Built in under 48 hours for **Space Hack 2026** 🚀

---

## License

MIT
