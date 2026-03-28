import matplotlib.pyplot as plt
import io
import base64

def generate_trend_chart_base64(claim_type, location):
    """Genera un gráfico de tendencias en base64"""
    try:
        fig, ax = plt.subplots(figsize=(8, 5))

        # Datos de ejemplo según tipo de afirmación
        if claim_type == "glacier":
            years = [2000, 2005, 2010, 2015, 2020, 2025]
            values = [100, 95, 85, 70, 55, 40]
            ax.set_ylabel("Glacier Area (%)")
            ax.set_title(f"Glacier Retreat Trend - {location}")
        elif claim_type == "snow":
            years = [2000, 2005, 2010, 2015, 2020, 2025]
            values = [95, 90, 80, 70, 60, 50]
            ax.set_ylabel("Snow Cover Area (%)")
            ax.set_title(f"Snow Cover Decline - {location}")
        else:
            years = [2000, 2005, 2010, 2015, 2020, 2025]
            values = [0, 1.2, 2.5, 3.8, 4.5, 5.2]
            ax.set_ylabel("Temperature Anomaly (°C)")
            ax.set_title(f"Temperature Trend - {location}")

        ax.plot(years, values, marker='o', linewidth=2, color='#FF6B6B')
        ax.set_xlabel("Year")
        ax.grid(True, alpha=0.3)

        # Convertir a base64
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', dpi=100, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode()
        plt.close()

        return f"data:image/png;base64,{image_base64}"

    except Exception as e:
        print(f"Error generando gráfico: {str(e)}")
        return ""