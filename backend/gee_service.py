# ─────────────────────────────────────────────────────────────────────────────
# gee_service.py — Servicio de imágenes satelitales contextuales
#
# Dada una afirmación climática, detecta el tipo (snow / temperature / glacier)
# y genera dos imágenes reales de comparación temporal (before/after).
#
# Datasets:
#   - Nieve:       MODIS/061/MOD10A1              (500m, desde 2000)
#   - Temperatura: ECMWF/ERA5_LAND/MONTHLY_AGGR   (9km,  desde 1950)
#   - Glaciar:     COPERNICUS/S2_SR_HARMONIZED     (10m,  desde 2017)
#                  LANDSAT/LC08/C02/T1_L2          (30m,  desde 2013)
# ─────────────────────────────────────────────────────────────────────────────

import ee
import os


# ── Inicialización con Service Account ───────────────────────────────────────
def init_gee():
    """Autentica con GEE usando el Service Account. Llamar una sola vez al arrancar."""
    sa_email   = os.environ.get("GEE_SERVICE_ACCOUNT",
                                "peak-news-gee@calcium-aria-419017.iam.gserviceaccount.com")
    creds_path = os.environ.get("GEE_CREDENTIALS_PATH", "./credentials.json")
    project_id = os.environ.get("GEE_PROJECT_ID", "calcium-aria-419017")

    credentials = ee.ServiceAccountCredentials(email=sa_email, key_file=creds_path)
    ee.Initialize(credentials, project=project_id)
    print(f"✅ GEE inicializado — proyecto: {project_id}")


# ── Lookup de coordenadas por topónimo alpino ─────────────────────────────────
ALPINE_LOCATIONS = {
    "aletsch":         [46.4375, 8.0389],
    "mont blanc":      [45.8326, 6.8652],
    "jungfrau":        [46.5371, 7.9624],
    "matterhorn":      [45.9766, 7.6586],
    "gorner":          [45.9800, 7.7800],
    "rhône":           [46.6100, 8.4000],
    "mer de glace":    [45.9000, 6.9200],
    "alpes centrales": [46.7200, 8.1800],
    "alpes suizos":    [46.5200, 8.0500],
    "austria":         [47.2000, 11.5000],
    "italia":          [45.8000, 7.5000],
    "default":         [46.5200, 8.0500],
}

def resolve_location(location_str: str) -> list[float]:
    loc = location_str.lower()
    for key, coords in ALPINE_LOCATIONS.items():
        if key in loc:
            return coords
    return ALPINE_LOCATIONS["default"]


# ── Clasificador de tipo de claim ─────────────────────────────────────────────
CLAIM_KEYWORDS = {
    "snow":        ["nieve", "snow", "cobertura", "snowpack", "nevadas", "ndsi",
                    "blanco", "nevada", "nieva"],
    "temperature": ["temperatura", "temperature", "calor", "frío", "grados", "celsius",
                    "era5", "warming", "calentamiento", "anomalía", "grado", "frio"],
    "glacier":     ["glaciar", "glacier", "retroceso", "deshielo", "masa", "aletsch",
                    "jungfrau", "gorner", "retreat", "hielo", "altitud", "deshela"],
}

def classify_claim(text: str) -> str:
    text_lower = text.lower()
    scores = {t: 0 for t in CLAIM_KEYWORDS}
    for claim_type, keywords in CLAIM_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                scores[claim_type] += 1
    return max(scores, key=scores.get) if max(scores.values()) > 0 else "glacier"


# ── Generador de imágenes GEE ─────────────────────────────────────────────────
def get_satellite_evidence(
    claim_text:   str,
    location_str: str = "Alpes Suizos",
    before_year:  int = 2003,
    after_year:   int = 2023,
) -> dict:
    coords     = resolve_location(location_str)
    lat, lon   = coords
    claim_type = classify_claim(claim_text)

    # Bounding box centrado en el glaciar/región (±0.6° ≈ ~60km)
    bbox = ee.Geometry.Rectangle([lon - 0.6, lat - 0.4, lon + 0.6, lat + 0.4])
    thumb_params = {"region": bbox, "dimensions": 512, "format": "jpg"}

    # ── NIEVE: MODIS/061/MOD10A1 ──────────────────────────────────────────────
    if claim_type == "snow":
        # MODIS disponible desde 2000; la temporada invernal cruza el año:
        # diciembre de `year` → febrero de `year+1`
        eff_before = max(before_year, 2001)
        eff_after  = min(after_year, 2024)

        col_before = (
            ee.ImageCollection("MODIS/061/MOD10A1")
            .filterDate(f"{eff_before}-12-01", f"{eff_before + 1}-02-28")
            .filterBounds(bbox)
            .select("NDSI_Snow_Cover")
            .mean()
        )
        col_after = (
            ee.ImageCollection("MODIS/061/MOD10A1")
            .filterDate(f"{eff_after}-12-01", f"{eff_after + 1}-02-28")
            .filterBounds(bbox)
            .select("NDSI_Snow_Cover")
            .mean()
        )

        viz          = {"min": 0, "max": 100,
                        "palette": ["#1E293B", "#1D4ED8", "#93C5FD", "#FFFFFF"]}
        dataset      = "MODIS/061/MOD10A1"
        layer        = "NDSI_Snow_Cover"
        palette_info = "Negro=Sin nieve · Azul=Nieve parcial · Blanco=Cobertura total"
        year_before  = eff_before
        year_after   = eff_after

    # ── TEMPERATURA: ERA5 Land ────────────────────────────────────────────────
    elif claim_type == "temperature":
        # ERA5 disponible desde 1950; verano alpino = junio–agosto
        eff_before = max(before_year, 1950)
        eff_after  = min(after_year, 2024)

        col_before = (
            ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY_AGGR")
            .filterDate(f"{eff_before}-06-01", f"{eff_before}-08-31")
            .filterBounds(bbox)
            .select("temperature_2m")
            .mean()
            .subtract(273.15)   # Kelvin → Celsius
        )
        col_after = (
            ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY_AGGR")
            .filterDate(f"{eff_after}-06-01", f"{eff_after}-08-31")
            .filterBounds(bbox)
            .select("temperature_2m")
            .mean()
            .subtract(273.15)
        )

        viz          = {"min": -5, "max": 25,
                        "palette": ["#1D4ED8", "#38BDF8", "#FFFFFF", "#FDE68A", "#DC2626"]}
        dataset      = "ECMWF/ERA5_LAND/MONTHLY_AGGR"
        layer        = "temperature_2m"
        palette_info = "Azul=Frío (< 0°C) · Blanco=~10°C · Rojo=Calor (> 25°C)"
        year_before  = eff_before
        year_after   = eff_after

    # ── GLACIAR: Sentinel-2 NDSI (verano para ver hielo sin nieve) ────────────
    else:  # glacier
        # Para "before": Landsat 8 si < 2017, Sentinel-2 si >= 2017
        # Temporada: julio–septiembre (menos nieve, más hielo glaciar visible)
        eff_before = max(before_year, 2013)   # Landsat 8 mínimo 2013
        eff_after  = min(after_year, 2023)    # Sentinel-2 datos estables

        if eff_before < 2017:
            col_before = (
                ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
                .filterDate(f"{eff_before}-07-01", f"{eff_before}-09-30")
                .filterBounds(bbox)
                .select(["SR_B3", "SR_B6"])        # Green, SWIR
                .map(lambda img: img.normalizedDifference(["SR_B3", "SR_B6"])
                                    .rename("NDSI"))
                .mean()
            )
            dataset_before = "LANDSAT/LC08/C02/T1_L2"
        else:
            col_before = (
                ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
                .filterDate(f"{eff_before}-07-01", f"{eff_before}-09-30")
                .filterBounds(bbox)
                .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
                .select(["B3", "B11"])              # Green, SWIR
                .map(lambda img: img.normalizedDifference(["B3", "B11"])
                                    .rename("NDSI"))
                .mean()
            )
            dataset_before = "COPERNICUS/S2_SR_HARMONIZED"

        col_after = (
            ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")
            .filterDate(f"{eff_after}-07-01", f"{eff_after}-09-30")
            .filterBounds(bbox)
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20))
            .select(["B3", "B11"])
            .map(lambda img: img.normalizedDifference(["B3", "B11"])
                                .rename("NDSI"))
            .mean()
        )

        viz          = {"min": -0.5, "max": 1.0,
                        "palette": ["#7C3AED", "#1E293B", "#38BDF8", "#FFFFFF"]}
        dataset      = "COPERNICUS/S2_SR_HARMONIZED"
        layer        = "NDSI"
        palette_info = "Blanco=Hielo/Nieve · Azul=Agua · Negro=Roca · Púrpura=Vegetación"
        year_before  = eff_before
        year_after   = eff_after

    # ── Generar thumbnails ────────────────────────────────────────────────────
    before_url = col_before.visualize(**viz).getThumbURL(thumb_params)
    after_url  = col_after.visualize(**viz).getThumbURL(thumb_params)

    return {
        "before_url":   before_url,
        "after_url":    after_url,
        "claim_type":   claim_type,
        "layer":        layer,
        "dataset":      dataset,
        "palette_info": palette_info,
        "years": {
            "before": year_before,
            "after":  year_after,
        },
        "location": {
            "name": location_str,
            "lat":  lat,
            "lon":  lon,          # ← "lon" (no "lng") para que coincida con el frontend
        },
    }
