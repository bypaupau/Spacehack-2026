# ─────────────────────────────────────────────────────────────────────────────
# journal_service.py — Motor de recomendación de papers científicos
#
# Simula un sistema RAG (Retrieval-Augmented Generation) para la hackathon.
# Filtra papers empíricos basados en el contexto del claim del periodista.
# ─────────────────────────────────────────────────────────────────────────────

JOURNAL_DATABASE = {
    "glacier": [
        {
            "title": "Accelerated global glacier mass loss in the early 21st century",
            "authors": "Hugonnet et al.",
            "journal": "Nature",
            "year": 2021,
            "doi": "10.1038/s41586-021-03436-z",
            "relevance": "Confirma con rigor altimétrico la pérdida masiva de hielo, validando las imágenes de Sentinel-2."
        },
        {
            "title": "Glacier mass-change rates compared to IPCC results",
            "authors": "Zemp et al.",
            "journal": "IPCC AR6 / Nature",
            "year": 2023,
            "doi": "10.1038/s41586",
            "relevance": "Proyecciones críticas sobre cómo el deshielo alpino afectará las reservas de agua dulce."
        }
    ],
    "snow": [
        {
            "title": "Decreasing snow cover in the Alps",
            "authors": "Matiu et al.",
            "journal": "The Cryosphere",
            "year": 2021,
            "doi": "10.5194/tc-15-1365-2021",
            "relevance": "Demuestra una reducción del 5.6% por década en la capa de nieve primaveral, amenazando el turismo local."
        }
    ],
    "temperature": [
        {
            "title": "Amplified warming in the European Alps",
            "authors": "Gobiet et al.",
            "journal": "Science of The Total Environment",
            "year": 2014,
            "doi": "10.1016/j.scitotenv.2013.11.043",
            "relevance": "Documenta que los Alpes se calientan al doble del promedio global, desestabilizando el permafrost."
        }
    ],
    "lakes": [
        {
            "title": "Formation of new glacial lakes in the Swiss Alps",
            "authors": "Haeberli et al.",
            "journal": "Geomorphology",
            "year": 2016,
            "doi": "10.1016/j.geomorph.2016.02.009",
            "relevance": "Alerta sobre el riesgo de inundaciones repentinas (GLOFs) que amenazan infraestructuras hidroeléctricas debido a los nuevos lagos."
        }
    ]
}

def get_related_journals(claim_type: str, news_text: str) -> list:
    """
    Filtra los papers basándose en el tipo de claim y palabras clave específicas en el texto.
    """
    text_lower = news_text.lower()
    recommended_papers = []

    # 1. Reglas específicas por palabras clave (ej. lagos)
    if "lago" in text_lower or "lake" in text_lower or "agua" in text_lower:
        recommended_papers.extend(JOURNAL_DATABASE["lakes"])

    # 2. Añadir papers de la categoría general detectada por GEE
    if claim_type in JOURNAL_DATABASE:
        # Evitar duplicados si por alguna razón coinciden
        for paper in JOURNAL_DATABASE[claim_type]:
            if paper not in recommended_papers:
                recommended_papers.append(paper)

    return recommended_papers