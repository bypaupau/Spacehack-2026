// ─────────────────────────────────────────────────────────────────────────────
// CollapsibleSidebar — Sidebar izquierdo con historial de análisis
// Cambios: Escala de fuente aumentada (13px para títulos) para equilibrar con el layout
// ─────────────────────────────────────────────────────────────────────────────

import { History, MapPin, CalendarDays, BookOpen, FlaskConical } from 'lucide-react'
import type { Analysis, VerdictType } from '../../types'
import { MOCK_ANALYSES } from '../../data/mockAnalyses'

interface CollapsibleSidebarProps {
  open:             boolean
  onSelectAnalysis: (a: Analysis) => void
  selectedId?:      string
  activePage?:      'verify' | 'sources' | 'methodology'
  onNavigate?:      (page: 'verify' | 'sources' | 'methodology') => void
}

const VERDICT_CONFIG: Record<VerdictType, { color: string; label: string; bar: string }> = {
  false:      { color: '#EF4444', label: 'FALSO',      bar: '#FCA5A5' },
  verified:   { color: '#10B981', label: 'VERIFICADO', bar: '#6EE7B7' },
  misleading: { color: '#D97706', label: 'ENGAÑOSO',   bar: '#FCD34D' },
  pending:    { color: '#94A3B8', label: 'PENDIENTE',  bar: '#CBD5E1' },
}

function ScorePill({ score, verdict }: { score: number; verdict: VerdictType }) {
  const vc = VERDICT_CONFIG[verdict]
  return (
      <span style={{
        fontFamily:   "'IBM Plex Mono', monospace",
        fontSize:     '10px',
        fontWeight:   700,
        color:         vc.color,
        background:   `${vc.color}18`,
        border:       `1px solid ${vc.color}2E`,
        borderRadius: '100px',
        padding:      '2px 8px',
        flexShrink:   0,
      }}>
      {score}
    </span>
  )
}

export function CollapsibleSidebar({ open, onSelectAnalysis, selectedId, activePage = 'verify', onNavigate }: CollapsibleSidebarProps) {
  const today = new Date()

  const formatDate = (iso: string) => {
    const d    = new Date(iso)
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
    if (diff === 0) return 'Hoy'
    if (diff === 1) return 'Ayer'
    if (diff < 7)   return `Hace ${diff}d`
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
      <aside
          style={{
            width:               open ? '280px' : '0px', // Aumentamos un poco el ancho
            minWidth:            open ? '280px' : '0px',
            overflow:            'hidden',
            transition:          'width 0.32s ease, min-width 0.32s ease',
            background:          'rgba(255, 255, 255, 0.60)',
            backdropFilter:      'blur(28px) saturate(1.5)',
            WebkitBackdropFilter:'blur(28px) saturate(1.5)',
            borderRight:         '1px solid rgba(226, 232, 240, 0.80)',
            position:            'sticky',
            top:                 '52px',
            height:              'calc(100vh - 52px)',
            flexShrink:          0,
            zIndex:              10,
          }}
      >
        <div style={{ width: '280px', height: '100%', overflowY: 'auto', overflowX: 'hidden', padding: '24px 16px', scrollbarWidth: 'thin' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <History size={15} strokeWidth={2.2} color="#8FA3BF" />
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8FA3BF', fontWeight: 700 }}>
              Analysis History
            </span>
          </div>

          {/* Lista */}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_ANALYSES.map(a => {
              const vc       = VERDICT_CONFIG[a.verdict]
              const isActive = a.id === selectedId

              return (
                  <li key={a.id}>
                    <button
                        onClick={() => onSelectAnalysis(a)}
                        style={{
                          width: '100%', textAlign: 'left',
                          background: isActive ? '#FFFFFF' : 'transparent',
                          border: 'none',
                          borderLeft: isActive ? `3px solid ${vc.color}` : '3px solid transparent',
                          borderRadius: '8px', padding: '11px 14px', cursor: 'pointer', transition: 'all 0.18s ease',
                          boxShadow: isActive ? '0 2px 10px rgba(13,28,56,0.06)' : 'none',
                          display: 'flex', flexDirection: 'column', gap: '8px',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) { e.currentTarget.style.background = 'transparent'; }
                        }}
                    >
                      <p style={{
                        fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#0D1F38' : '#4A5A72', lineHeight: 1.4, margin: 0, fontFamily: "'IBM Plex Sans', sans-serif",
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {a.headline}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CalendarDays size={12} color="#94A3B8" />
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#64748B' }}>
                        {formatDate(a.analyzedAt)}
                      </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ScorePill score={a.score} verdict={a.verdict} />
                        </div>
                      </div>
                    </button>
                  </li>
              )
            })}
          </ul>

          {/* ── Nav links (útiles en móvil donde el topbar los oculta) ── */}
          <div style={{ marginTop: '8px', borderTop: '1px solid #F0F4FA', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {([
              { id: 'sources'     as const, label: 'Sources',     Icon: BookOpen      },
              { id: 'methodology' as const, label: 'Methodology', Icon: FlaskConical  },
            ]).map(({ id, label, Icon }) => {
              const isActive = activePage === id
              return (
                <button
                  key={id}
                  onClick={() => onNavigate?.(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    width: '100%', textAlign: 'left',
                    background: isActive ? '#EEF2F7' : 'transparent',
                    border: 'none', borderRadius: '8px',
                    padding: '10px 12px', cursor: 'pointer',
                    color: isActive ? '#0D1F38' : '#4A5A72',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(238,242,247,0.7)' }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                >
                  <Icon size={13} strokeWidth={2.2} />
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: isActive ? 700 : 500, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: '24px', padding: '14px', borderRadius: '10px', background: '#EEF2F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <MapPin size={12} color="#64748B" />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Cobertura activa
            </span>
            </div>
            <p style={{ fontSize: '12px', color: '#334155', fontWeight: 500, fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 12px 0' }}>
              Switzerland · Austria · Italy
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <CalendarDays size={12} color="#64748B" />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Updated
            </span>
            </div>
            <p style={{ fontSize: '12px', color: '#334155', fontWeight: 500, fontFamily: "'IBM Plex Sans', sans-serif", margin: 0 }}>
              27 MAR 2026
            </p>
          </div>
        </div>
      </aside>
  )
}