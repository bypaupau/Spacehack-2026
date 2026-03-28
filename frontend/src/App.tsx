// ─────────────────────────────────────────────────────────────────────────────
// App — Layout raíz de Peak News
// v4: Reset real del HomePage al hacer click en el Logo usando "resetKey"
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import { Topbar }              from './components/layout/Topbar'
import { CollapsibleSidebar }  from './components/layout/CollapsibleSidebar'
import { AnimatedBackground }  from './components/background/AnimatedBackground'
import { HomePage }            from './pages/HomePage'
import type { Analysis }       from './types'

type Page = 'verify' | 'sources' | 'methodology'

export default function App() {
    const [activePage,     setActivePage]     = useState<Page>('verify')
    const [sidebarOpen,    setSidebarOpen]    = useState(true)
    const [externalResult, setExternalResult] = useState<Analysis | null>(null)

    // Este estado es el "truco" para reiniciar la página de inicio
    const [resetKey,       setResetKey]       = useState(0)

    const handleHistorySelect = (a: Analysis) => {
        setExternalResult(a)
        setActivePage('verify')
    }

    // Volver al inicio: limpia el resultado y fuerza el reinicio del componente
    const handleLogoClick = useCallback(() => {
        setExternalResult(null)
        setActivePage('verify')
        setResetKey(prev => prev + 1) // Fuerza a HomePage a desmontarse y montarse limpio
    }, [])

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AnimatedBackground />

            <Topbar
                activePage={activePage}
                onNavigate={p => p && setActivePage(p as Page)}
                onLogoClick={handleLogoClick}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen(s => !s)}
            />

            <div style={{ display: 'flex', flex: 1 }}>
                <CollapsibleSidebar
                    open={sidebarOpen}
                    onSelectAnalysis={handleHistorySelect}
                    selectedId={externalResult?.id}
                />

                <main style={{ flex: 1, minWidth: 0, position: 'relative' }}>
                    {activePage === 'verify' && (
                        <HomePage
                            key={`home-${resetKey}`} // Cuando resetKey cambia, esta página vuelve a cero
                            externalResult={externalResult}
                            onClearExternal={() => setExternalResult(null)}
                        />
                    )}

                    {activePage === 'sources' && (
                        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>
                            <button
                                onClick={() => setActivePage('verify')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 600, color: '#8FA3BF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '32px', padding: '6px 0' }}
                            >
                                ← Volver a Verificar
                            </button>
                            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#8FA3BF', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>Repositorios de datos</p>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 800, color: '#0D1F38', lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.01em' }}>Fuentes de Peak News</h1>
                            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15px', color: '#4A5A72', lineHeight: 1.75, marginBottom: '32px' }}>
                                Peak News cruza cada afirmación contra repositorios satelitales y literatura científica revisada por pares. Todas las fuentes son públicas y verificables de forma independiente.
                            </p>
                            {[
                                { name: 'Google Earth Engine (GEE)', type: 'Plataforma satelital', desc: 'Análisis geoespacial sobre Landsat 8/9 (USGS, 30m) y Sentinel-2 (ESA, 10m). Scripts GEE generan índices de cobertura nival, retroceso glaciar y comparaciones temporales.', url: 'https://earthengine.google.com', color: '#1D4ED8' },
                                { name: 'GLAMOS Switzerland', type: 'Red de monitoreo glaciar', desc: 'Glaciological Monitoring and Reports Switzerland. Mediciones de campo anuales desde 1879. Referencia principal para masa glaciar suiza.', url: 'https://glamos.ch', color: '#065F46' },
                                { name: 'NASA GIBS / MODIS', type: 'Imágenes satelitales reales', desc: 'Global Imagery Browse Services. MODIS Terra True Color (250m) para comparaciones temporales de nieve/glaciar. Sin autenticación, público.', url: 'https://gibs.earthdata.nasa.gov', color: '#B91C1C' },
                                { name: 'Copernicus C3S / ERA5', type: 'Datos climáticos', desc: 'Copernicus Climate Change Service. ERA5-Land reanalysis para temperatura y ERA5 para cobertura nival. Referencia ECMWF.', url: 'https://climate.copernicus.eu', color: '#92400E' },
                                { name: 'IPCC AR6', type: 'Informe científico', desc: 'Sixth Assessment Report del IPCC. Capítulo 12 documenta tendencias de nieve y glaciares alpinos con alta confianza.', url: 'https://ipcc.ch/report/ar6', color: '#0369A1' },
                                { name: 'WMO / WGMS', type: 'Boletines glaciares', desc: 'World Glacier Monitoring Service. Global Glacier Change Bulletin anual. Principal referencia de pérdida de masa global.', url: 'https://wgms.ch', color: '#276749' },
                            ].map(s => (
                                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                                    style={{ display: 'flex', gap: '16px', padding: '18px 20px', marginBottom: '10px', borderRadius: '12px', background: '#FFFFFF', boxShadow: '0 1px 4px rgba(13,28,56,0.05), 0 4px 16px rgba(13,28,56,0.04)', textDecoration: 'none', transition: 'box-shadow 0.14s' }}
                                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(13,28,56,0.08), 0 8px 24px rgba(13,28,56,0.07)' }}
                                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(13,28,56,0.05), 0 4px 16px rgba(13,28,56,0.04)' }}
                                >
                                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.color, flexShrink: 0, marginTop: '5px' }} />
                                    <div>
                                        <p style={{ margin: '0 0 3px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0D1F38' }}>{s.name}</p>
                                        <p style={{ margin: '0 0 6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: s.color, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 700 }}>{s.type}</p>
                                        <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#4A5A72', lineHeight: 1.6 }}>{s.desc}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {activePage === 'methodology' && (
                        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }}>
                            <button
                                onClick={() => setActivePage('verify')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 600, color: '#8FA3BF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '32px', padding: '6px 0' }}
                            >
                                ← Volver a Verificar
                            </button>
                            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#8FA3BF', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>Cómo funciona</p>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 800, color: '#0D1F38', lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.01em' }}>Metodología</h1>
                            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15px', color: '#4A5A72', lineHeight: 1.75, marginBottom: '32px' }}>
                                Cada verificación combina análisis NLP, datos satelitales GEE y literatura científica indexada para emitir un veredicto en la escala IFCN.
                            </p>
                            {[
                                { n: '01', title: 'Extracción de afirmaciones', desc: 'El texto, URL o post se procesa para extraer las afirmaciones verificables. Las afirmaciones se clasifican por tipo: glaciar, cobertura nival o temperatura.' },
                                { n: '02', title: 'Consulta satelital (GEE)', desc: 'Scripts de Google Earth Engine consultan imágenes Landsat 8 y Sentinel-2. Se calculan índices de cobertura nival (NDSI), retroceso glaciar y comparaciones temporales. Los JSONs resultantes están almacenados en /satellite/ para las áreas Alps monitoreadas.' },
                                { n: '03', title: 'Cruce con literatura científica', desc: 'Las afirmaciones se comparan contra GLAMOS, IPCC AR6, Hugonnet et al. 2021 (Nature), Fontrodona Bach et al. 2023 (Nature Climate Change) y los boletines WGMS anuales.' },
                                { n: '04', title: 'Puntuación IFCN', desc: 'El score (0–100) se calcula ponderando: coherencia con datos satelitales (40%), respaldo en literatura peer-reviewed (35%), análisis NLP de narrativa (25%). Los umbrales son: Verificado ≥80, Mayormente cierto 50–79, Engañoso 30–49, Falso <30.' },
                                { n: '05', title: 'Escala de desinformación NLP', desc: 'Se detectan tres patrones: Negacionismo directo (contradice evidencia), Minimización (selección de datos favorable) y Retardismo (cuestiona urgencia del consenso). Cada patrón se puntúa independientemente.' },
                            ].map(step => (
                                <div key={step.n} style={{ display: 'flex', gap: '18px', padding: '20px 0', borderBottom: '1px solid #F0F4FA' }}>
                                    <span style={{ flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 800, color: '#1D4ED8', minWidth: '28px', paddingTop: '2px' }}>{step.n}</span>
                                    <div>
                                        <p style={{ margin: '0 0 6px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0D1F38' }}>{step.title}</p>
                                        <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#4A5A72', lineHeight: 1.65 }}>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}