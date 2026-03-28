import ee
import os
import json
from google.oauth2.service_account import Credentials

def initialize_earth_engine():
    try:
        # 1. Modo Producción (Vercel)
        if "GEE_CREDENTIALS_JSON" in os.environ:
            # Leemos el JSON completo desde Vercel
            creds_dict = json.loads(os.environ["GEE_CREDENTIALS_JSON"])
            credentials = Credentials.from_service_account_info(creds_dict)
            scoped_credentials = credentials.with_scopes([
                'https://www.googleapis.com/auth/earthengine',
                'https://www.googleapis.com/auth/cloud-platform'
            ])
            ee.Initialize(scoped_credentials)
            print("🌎 GEE inicializado vía Variable de Entorno")

        # 2. Modo Local (Tu computadora)
        else:
            # Aquí pones el código que ya usabas con tu archivo físico
            credentials = ee.ServiceAccountCredentials(
                'AQUÍ_TU_EMAIL_DE_SERVICIO',
                'credentials.json'
            )
            ee.Initialize(credentials)
            print("🌎 GEE inicializado vía archivo local")

    except Exception as e:
        print(f"❌ Error fatal al inicializar GEE: {str(e)}")

# Llamar a la función
initialize_earth_engine()