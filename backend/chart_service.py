import io
import base64
from matplotlib.figure import Figure
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas

def generate_trend_chart_base64(years: list, values: list, title: str) -> str:
    """
    Genera el gráfico usando la API de Objetos pura, 100% segura para concurrencia en FastAPI.
    """
    # NO USAR plt.subplots()
    fig = Figure(figsize=(6, 4), dpi=130, facecolor="#FFFFFF")
    canvas = FigureCanvas(fig)
    ax = fig.add_subplot(111)

    # Lógica de ploteo empírico
    ax.plot(years, values, color="#EF4444", linewidth=2, marker="o")
    ax.set_title(title, fontweight="bold")
    ax.set_ylabel("Masa Glaciar / Temperatura")
    ax.grid(True, linestyle="--", alpha=0.5)

    # Renderizado seguro a Base64
    buf = io.BytesIO()
    # bbox_inches="tight" a veces causa recálculos lentos, si falla, quítalo.
    canvas.print_png(buf)
    buf.seek(0)
    encoded = base64.b64encode(buf.read()).decode("utf-8")
    
    # Limpieza rigurosa
    fig.clf()
    return f"data:image/png;base64,{encoded}"