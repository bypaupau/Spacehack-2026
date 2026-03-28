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
    const [sidebarOpen,    setSidebarOpen]    = useState(false)
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
                                ← Back to Verify
                            </button>
                            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#8FA3BF', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>Data repositories</p>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 800, color: '#0D1F38', lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.01em' }}>Peak News Sources</h1>
                            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15px', color: '#4A5A72', lineHeight: 1.75, marginBottom: '32px' }}>
                                Peak News cross-references every claim against satellite repositories and peer-reviewed scientific literature. All sources are public and independently verifiable.
                            </p>
                            {[
                                { name: 'Google Earth Engine (GEE)', type: 'Satellite platform', desc: 'Geospatial analysis over Landsat 8/9 (USGS, 30m) and Sentinel-2 (ESA, 10m). GEE scripts generate snow coverage indices, glacier retreat metrics and temporal comparisons.', url: 'https://earthengine.google.com', color: '#1D4ED8' },
                                { name: 'GLAMOS Switzerland', type: 'Glacier monitoring network', desc: 'Glaciological Monitoring and Reports Switzerland. Annual field measurements since 1879. Primary reference for Swiss glacier mass balance.', url: 'https://glamos.ch', color: '#065F46' },
                                { name: 'NASA GIBS / MODIS', type: 'Real satellite imagery', desc: 'Global Imagery Browse Services. MODIS Terra True Color (250m) for temporal snow/glacier comparisons. No authentication required, fully public.', url: 'https://gibs.earthdata.nasa.gov', color: '#B91C1C' },
                                { name: 'Copernicus C3S / ERA5', type: 'Climate data', desc: 'Copernicus Climate Change Service. ERA5-Land reanalysis for temperature and ERA5 for snow coverage. ECMWF reference dataset.', url: 'https://climate.copernicus.eu', color: '#92400E' },
                                { name: 'IPCC AR6', type: 'Peer-reviewed scientific report', desc: 'IPCC Sixth Assessment Report. Chapter 12 documents Alpine snow and glacier trends with high confidence.', url: 'https://ipcc.ch/report/ar6', color: '#0369A1' },
                                { name: 'WMO / WGMS', type: 'Glacier bulletins', desc: 'World Glacier Monitoring Service. Annual Global Glacier Change Bulletin. Primary reference for global glacier mass loss.', url: 'https://wgms.ch', color: '#276749' },
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
                                ← Back to Verify
                            </button>
                            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#8FA3BF', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800, marginBottom: '12px' }}>How it works</p>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 800, color: '#0D1F38', lineHeight: 1.15, marginBottom: '24px', letterSpacing: '-0.01em' }}>Methodology</h1>
                            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15px', color: '#4A5A72', lineHeight: 1.75, marginBottom: '32px' }}>
                                Every verification combines NLP analysis, GEE satellite data and indexed scientific literature to produce a verdict on the IFCN scale.
                            </p>
                            {[
                                { n: '01', title: 'Claim extraction', desc: 'The text, URL or post is processed to extract verifiable claims. Claims are classified by type: glacier, snow coverage or temperature.' },
                                { n: '02', title: 'Satellite query (GEE)', desc: 'Google Earth Engine scripts query Landsat 8 and Sentinel-2 imagery. Snow coverage indices (NDSI), glacier retreat and temporal comparisons are computed. Result JSONs are stored in /satellite/ for monitored Alpine areas.' },
                                { n: '03', title: 'Cross-reference with scientific literature', desc: 'Claims are compared against GLAMOS, IPCC AR6, Hugonnet et al. 2021 (Nature), Fontrodona Bach et al. 2023 (Nature Climate Change) and annual WGMS bulletins.' },
                                { n: '04', title: 'IFCN scoring', desc: 'The score (0–100) is calculated by weighting: consistency with satellite data (40%), peer-reviewed literature support (35%), NLP narrative analysis (25%). Thresholds: Verified ≥80, Mostly True 50–79, Misleading 30–49, False <30.' },
                                { n: '05', title: 'NLP misinformation scale', desc: 'Three patterns are detected: Direct denial (contradicts evidence), Minimisation (cherry-picking favourable data) and Delayism (questions urgency of consensus). Each pattern is scored independently.' },
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