// Topbar — Peak News · Scientific Newsroom edition
// v4: Navegación por pestañas sutiles (tabs) y mejor alineación de marca.

import { Logo } from '../ui/Logo'

interface TopbarProps {
    activePage?:      'verify' | 'history' | 'sources' | 'methodology'
    onNavigate?:      (page: TopbarProps['activePage']) => void
    onLogoClick?:     () => void
    sidebarOpen?:     boolean
    onToggleSidebar?: () => void
}

const NAV = [
    { id: 'verify',      label: 'Verificar'   },
    { id: 'sources',     label: 'Fuentes'     },
    { id: 'methodology', label: 'Metodología' },
] as const

export function Topbar({ activePage = 'verify', onNavigate, onLogoClick, sidebarOpen, onToggleSidebar }: TopbarProps) {
    return (
        <header
            className="sticky top-0 z-50 flex items-center justify-between px-5 transition-all duration-300"
            style={{
                background:    'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(12px)',
                borderBottom:  '1px solid #E2E8F0',
                height:        '56px',
            }}
        >
            {/* Izquierda: Menú + Logo */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    style={{
                        width: '32px', height: '32px', borderRadius: '6px', border: 'none',
                        background: sidebarOpen ? '#EEF2F7' : 'transparent', color: sidebarOpen ? '#0D1F38' : '#8FA3BF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="3"   width={sidebarOpen ? 8  : 12} height="1.4" rx="0.7" fill="currentColor"/>
                        <rect x="1" y="6.3" width="12" height="1.4" rx="0.7" fill="currentColor"/>
                        <rect x="1" y="9.6" width={sidebarOpen ? 10 : 12} height="1.4" rx="0.7" fill="currentColor"/>
                    </svg>
                </button>

                <button
                    onClick={onLogoClick}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    <Logo size={32} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#0F172A', lineHeight: 1 }}>
              PEAK NEWS
            </span>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: '#64748B', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '3px' }}>
              Alpine Fact Checker
            </span>
                    </div>
                </button>
            </div>

            {/* Centro: Navegación estilo Tabs editoriales */}
            <nav className="flex gap-8 h-full">
                {NAV.map(item => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate?.(item.id)}
                            style={{
                                fontFamily:  "'IBM Plex Mono', monospace",
                                fontSize:    '11px',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontWeight:  isActive ? 600 : 400,
                                color:       isActive ? '#0284C7' : '#64748B',
                                border:      'none',
                                background:  'transparent',
                                borderBottom: isActive ? '2px solid #0284C7' : '2px solid transparent',
                                cursor:      'pointer',
                                height:      '100%',
                                display:     'flex',
                                alignItems:  'center',
                                transition:  'color 0.2s',
                            }}
                        >
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            {/* Derecha: Estado */}
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#64748B', fontWeight: 500 }}>
          Live · Alpes
        </span>
            </div>
        </header>
    )
}