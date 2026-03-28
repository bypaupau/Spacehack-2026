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

                    {activePage !== 'verify' && (
                        <div
                            style={{
                                display:        'flex',
                                flexDirection:  'column',
                                alignItems:     'center',
                                justifyContent: 'center',
                                textAlign:      'center',
                                minHeight:      'calc(100vh - 56px)',
                                padding:        '0 24px',
                            }}
                        >
                            <div
                                style={{
                                    width: '48px', height: '48px', borderRadius: '10px', background: '#EEF2F7',
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', marginBottom: '16px',
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8FA3BF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    {activePage === 'sources'
                                      ? <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></>
                                      : <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>
                                    }
                                </svg>
                            </div>
                            <p className="font-editorial" style={{ fontSize: '28px', color: '#0F172A', marginBottom: '8px' }}>
                                {activePage === 'sources' ? 'Fuentes' : 'Metodología'}
                            </p>
                            <p style={{ color: '#94A3B8', maxWidth: '260px', fontSize: '13px', fontWeight: 400, lineHeight: 1.6, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                                Esta sección se conectará al backend en la Fase 2.
                            </p>
                            <button className="btn-ghost" onClick={() => setActivePage('verify')} style={{ marginTop: '20px' }}>
                                ← Volver a Verificar
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}