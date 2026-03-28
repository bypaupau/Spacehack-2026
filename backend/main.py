# ─────────────────────────────────────────────────────────────────────────────
# main.py — API de Peak News
#
# Endpoints:
#   GET  /api/health                → healthcheck
#   GET  /api/satellite-evidence    → imágenes GEE reales (before/after)
#   POST /api/analyze               → stub para análisis LLM (Fase 2)
# ─────────────────────────────────────────────────────────────────────────────

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from gee_service import init_gee, get_satellite_evidence

# ── Cargar variables de entorno ───────────────────────────────────────────────
load_dotenv()


# ── Lifespan: inicializa GEE al arrancar el servidor ─────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Se ejecuta una sola vez al arrancar. Inicializa GEE."""
    try:
        init_gee()
    except Exception as e:
        print(f"⚠️  No se pudo inicializar GEE: {e}")
        print("    El servidor arrancará, pero /api/satellite-evidence fallará.")
    yield
    # (limpieza al apagar, si fuera necesario)


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Peak News API",
    description="Fact-checking climático con datos de Observación de la Tierra",
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS: permite peticiones desde el frontend Vite ──────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev
        "http://localhost:4173",   # Vite preview
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/health
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    """Verifica que el servidor está funcionando."""
    return {"status": "ok", "service": "Peak News API v0.1"}


# ─────────────────────────────────────────────────────────────────────────────
# GET /api/satellite-evidence
#
# Parámetros (query string):
#   claim_text  — texto de la afirmación a verificar
#   location    — nombre del lugar (ej. "Aletsch", "Mont Blanc")
#   before_year — año de comparación "antes"  (default: 1990)
#   after_year  — año de comparación "después" (default: 2024)
#
# Respuesta:
#   { before_url, after_url, layer, dataset, years, location, palette_info }
# ─────────────────────────────────────────────────────────────────────────────
@app.get("/api/satellite-evidence")
def satellite_evidence(
    claim_text: str  = Query(..., description="Texto de la afirmación"),
    location:   str  = Query("Alpes Suizos", description="Lugar geográfico"),
    before_year: int = Query(1990, description="Año 'antes'"),
    after_year:  int = Query(2024, description="Año 'después'"),
):
    try:
        data = get_satellite_evidence(
            claim_text=claim_text,
            location_str=location,
            before_year=before_year,
            after_year=after_year,
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────────────────────────────────────
# POST /api/analyze
#
# Stub — Fase 2 conectará con OpenAI / Claude para:
#   - Extraer afirmaciones del texto de la noticia
#   - Clasificar cada afirmación
#   - Generar el veredicto con evidencia
#
# Body: { "news_text": "..." }
# ─────────────────────────────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    news_text: str

@app.post("/api/analyze")
def analyze(body: AnalyzeRequest):
    """
    [STUB — Fase 2]
    Por ahora retorna datos mockeados para que el frontend pueda probarse.
    """
    text = body.news_text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="news_text no puede estar vacío")

    # ── Mock response (se reemplazará con LLM en Fase 2) ─────────────────────
    return {
        "claims": [
            {
                "id": "claim-1",
                "text": text[:120] + ("..." if len(text) > 120 else ""),
                "verdict": "INVERIFICABLE",
                "confidence": 0.61,
                "summary": "Afirmación recibida. El análisis automático con LLM estará disponible en la Fase 2.",
                "satellite_hint": {
                    "claim_type": "glacier",
                    "location": "Alpes Suizos",
                    "before_year": 1990,
                    "after_year": 2024,
                },
            }
        ],
        "overall_verdict": "INVERIFICABLE",
        "sources_searched": ["MODIS", "ERA5", "Copernicus Sentinel-2"],
        "note": "Stub — conectar con LLM en Fase 2",
    }
