import ee
import os
import json
from google.oauth2.service_account import Credentials

def initialize_earth_engine():
    try:
        if "GEE_CREDENTIALS_JSON" in os.environ:
            creds_dict = json.loads(os.environ["GEE_CREDENTIALS_JSON"])
            credentials = Credentials.from_service_account_info(creds_dict)
            scoped_credentials = credentials.with_scopes([
                'https://www.googleapis.com/auth/earthengine',
                'https://www.googleapis.com/auth/cloud-platform'
            ])
            ee.Initialize(scoped_credentials)
            print("🌎 GEE inicializado vía Variable de Entorno")
        else:
            credentials = ee.ServiceAccountCredentials(
                'AQUÍ_TU_EMAIL_DE_SERVICIO',
                'credentials.json'
            )
            ee.Initialize(credentials)
            print("🌎 GEE inicializado vía archivo local")
    except Exception as e:
        print(f"❌ Error fatal al inicializar GEE: {str(e)}")

initialize_earth_engine()

# Diccionario de ubicaciones alpinas
ALPINE_LOCATIONS = {
    "Lake Pastore": (46.5, 8.5),
    "Mont Blanc": (45.833, 6.865),
    "Matterhorn": (45.976, 7.658),
    "Gran Paradiso": (45.486, 7.180),
}

def resolve_location(text):
    """Extrae coordenadas del texto basado en palabras clave"""
    text_lower = text.lower()

    for location, coords in ALPINE_LOCATIONS.items():
        if location.lower() in text_lower:
            return coords

    # Por defecto, retorna coordenadas del Lago Posterze
    return (46.5, 8.5)

def classify_claim(text):
    """Clasifica el tipo de afirmación según palabras clave"""
    text_lower = text.lower()

    if any(word in text_lower for word in ["glaciar", "glacier", "hielo", "ice", "retreat"]):
        return "glacier"
    elif any(word in text_lower for word in ["nieve", "snow", "snow cover", "sca"]):
        return "snow"
    elif any(word in text_lower for word in ["temperatura", "temperature", "permafrost", "calor"]):
        return "temperature"
    else:
        return "general"

def get_satellite_evidence(claim_text, location_str, before_year, after_year):
    """Obtiene imágenes satelitales de Google Earth Engine"""
    try:
        # Coordenadas por defecto (Lake Pastore)
        coords = ALPINE_LOCATIONS.get(location_str, (46.5, 8.5))

        # Crear una región de búsqueda (buffer de 10km)
        point = ee.Geometry.Point(coords)
        region = point.buffer(10000)

        # Sentinel-2 para BEFORE
        before_collection = ee.ImageCollection("COPERNICUS/S2_SR") \
            .filterBounds(region) \
            .filterDate(f"{before_year}-06-01", f"{before_year}-08-31") \
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20)) \
            .median()

        # Sentinel-2 para AFTER
        after_collection = ee.ImageCollection("COPERNICUS/S2_SR") \
            .filterBounds(region) \
            .filterDate(f"{after_year}-06-01", f"{after_year}-08-31") \
            .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 20)) \
            .median()

        # Crear URLs de visualización
        before_url = before_collection.getThumbURL({
            'min': 0,
            'max': 3000,
            'bands': ['B4', 'B3', 'B2'],
            'region': region,
            'dimensions': 512
        })

        after_url = after_collection.getThumbURL({
            'min': 0,
            'max': 3000,
            'bands': ['B4', 'B3', 'B2'],
            'region': region,
            'dimensions': 512
        })

        return {
            "before_url": before_url,
            "after_url": after_url,
            "years": {"before": before_year, "after": after_year},
            "dataset": "Sentinel-2",
            "palette_info": "Natural Color (B4-B3-B2)"
        }

    except Exception as e:
        print(f"❌ Error obteniendo evidencia satelital: {str(e)}")
        return {
            "before_url": "",
            "after_url": "",
            "years": {"before": before_year, "after": after_year},
            "dataset": "Error",
            "palette_info": "No disponible"
        }