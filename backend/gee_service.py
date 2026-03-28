import ee

def _generate_thumb(image_or_col, bbox, viz_params):
    """
    Motor Analítico - Generador de Telemetría Visual
    """
    try:
        # 1. Blindaje Geométrico: Asegurar que bbox sea un ee.Geometry
        # Si bbox viene como una lista [lon, lat], lo convertimos a un polígono de 5km
        if isinstance(bbox, list) and len(bbox) == 2:
            geom = ee.Geometry.Point(bbox).buffer(5000).bounds()
        elif isinstance(bbox, ee.Geometry):
            geom = bbox
        else:
            # Si ya es un Feature o algo raro, intentamos extraer la geometría
            geom = bbox.geometry() if hasattr(bbox, 'geometry') else ee.Geometry.Rectangle(bbox)

        # 2. Reducción y Recorte Empírico
        if isinstance(image_or_col, ee.ImageCollection):
            # Comprobamos si la colección está vacía antes de reducirla
            count = image_or_col.size().getInfo()
            if count == 0:
                print("⚠️ Motor Analítico: La colección satelital está vacía (posible nubosidad severa).")
                return ""
            img = image_or_col.median()
        elif isinstance(image_or_col, ee.Image):
            img = image_or_col
        else:
            raise ValueError("El formato de datos satelitales no es válido para GEE.")

        img_clipped = img.clip(geom)

        # 3. Solicitud a la API REST de Earth Engine
        thumb_params = viz_params.copy()
        thumb_params['dimensions'] = 800
        thumb_params['region'] = geom
        thumb_params['format'] = 'png'

        url = img_clipped.getThumbURL(thumb_params)
        print(f"✅ Telemetría generada con éxito: {url[:60]}...") # Log de éxito

        return url

    except Exception as e:
        # AQUÍ VERÁS EL VERDADERO PROBLEMA EN TU TERMINAL
        print(f"🚨 Error Crítico en GEE (_generate_thumb): {str(e)}")
        return ""