// ─────────────────────────────────────────────────────────────────────────────
// SatelliteCompare — Comparación satelital contextual para periodistas
//
// Diseño: periodista-first. Explica QUÉ es la imagen, QUÉ ha cambiado y
// POR QUÉ importa — sin requerir conocimientos de teledetección.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { AlertCircle, Loader2, Satellite, Info, ArrowRight, Download, ExternalLink } from 'lucide-react'
import { getSatelliteEvidence, type SatelliteEvidenceResult } from '../../services/api'

// ── Textos explicativos por tipo de claim ─────────────────────────────────────
// Todos los tipos usan MODIS True Color (250m, color natural, NASA GIBS)
const CLAIM_CONTEXT: Record<string, {
  what:    string
  howto:   string
  legend:  Array<{ color: string; label: string; hex: string }>
  source:  string
}> = {
  glacier: {
    what:   'Imagen MODIS Terra en color real (NASA GIBS, 250m). Comparación septiembre — mínimo anual de hielo. Lo que ves es exactamente lo que vería un astronauta desde el espacio.',
    howto:  'BLANCO/AZUL CLARO = nieve o hielo glaciar. AZUL OSCURO = lago proglaciar (agua de deshielo, señal clara de retroceso). GRIS/MARRÓN = roca expuesta antes cubierta de hielo. Si hay más zonas grises en la imagen derecha, el glaciar ha retrocedido.',
    legend: [
      { color: '■', label: 'Nieve / hielo glaciar',      hex: '#E8F4FF' },
      { color: '■', label: 'Lago proglaciar (deshielo)',  hex: '#3B82F6' },
      { color: '■', label: 'Roca expuesta (antes hielo)', hex: '#78716C' },
      { color: '■', label: 'Vegetación / pradera',        hex: '#4D7C4D' },
    ],
    source: 'MODIS Terra True Color (250m) · NASA GIBS · earthdata.nasa.gov',
  },
  snow: {
    what:   'Imagen MODIS Terra en color real (NASA GIBS, 250m). Comparación abril — fin de temporada nival. La diferencia de manto blanco entre años es directamente observable.',
    howto:  'BLANCO = nieve completa. GRIS/MARRÓN = suelo o roca sin nieve. VERDE = vegetación emergente. Si la mancha blanca es más pequeña a la derecha, hay menos nieve estacional.',
    legend: [
      { color: '■', label: 'Nieve total',       hex: '#F0F9FF' },
      { color: '■', label: 'Nieve parcial',     hex: '#BAE6FD' },
      { color: '■', label: 'Suelo / roca',      hex: '#78716C' },
      { color: '■', label: 'Vegetación',        hex: '#4D7C4D' },
    ],
    source: 'MODIS Terra True Color (250m) · NASA GIBS · earthdata.nasa.gov',
  },
  temperature: {
    what:   'Imagen MODIS Terra en color real (NASA GIBS, 250m). Comparación julio — máximo calor estival. Muestra el estado del paisaje alpino en los dos veranos comparados.',
    howto:  'BLANCO = nieve/hielo que aún queda en verano. MARRÓN/AMARILLO SECO = vegetación quemada por el calor. VERDE VIVO = zonas con humedad normal. Más marrón = más calor/sequía.',
    legend: [
      { color: '■', label: 'Nieve / glaciar residual', hex: '#F0F9FF' },
      { color: '■', label: 'Vegetación viva',          hex: '#4D7C4D' },
      { color: '■', label: 'Vegetación seca/quemada',  hex: '#A16207' },
      { color: '■', label: 'Roca / suelo árido',       hex: '#78716C' },
    ],
    source: 'MODIS Terra True Color (250m) · NASA GIBS · earthdata.nasa.gov',
  },
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Callout skeleton */}
      <div style={{
        height: '48px', borderRadius: '6px',
        background: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)',
        backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite',
      }} />
      {/* Images skeleton */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            flex: 1, height: '220px', borderRadius: '8px',
            background: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)',
            backgroundSize: '200% 100%', animation: `shimmer 1.6s ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      {/* Legend skeleton */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            height: '20px', flex: 1, borderRadius: '4px',
            background: '#F1F5F9', animation: `shimmer 1.6s ${i*0.1}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface SatelliteCompareProps {
  claimText:   string
  location?:   string
  beforeYear?: number
  afterYear?:  number
}

// ── Main ─────────────────────────────────────────────────────────────────────
export function SatelliteCompare({
  claimText,
  location   = 'Alpes Suizos',
  beforeYear = 2003,
  afterYear  = 2023,
}: SatelliteCompareProps) {
  const [status,   setStatus]   = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [evidence, setEvidence] = useState<SatelliteEvidenceResult | null>(null)
  const [errMsg,   setErrMsg]   = useState('')
  const [expanded, setExpanded] = useState<'before'|'after'|null>(null)

  useEffect(() => {
    if (!claimText) return
    setStatus('loading')
    setEvidence(null)
    getSatelliteEvidence(claimText, location, beforeYear, afterYear).then(res => {
      if (res.ok && res.data) { setEvidence(res.data); setStatus('ok') }
      else { setErrMsg(res.error ?? 'Error'); setStatus('error') }
    })
  }, [claimText, location, beforeYear, afterYear])

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (status === 'idle' || status === 'loading') {
    return (
      <div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          marginBottom: '14px', padding: '8px 12px',
          background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px',
        }}>
          <Loader2 size={13} color="#0284C7" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#475569' }}>
            Consultando Google Earth Engine · generando imágenes satelitales reales…
          </span>
        </div>
        <Skeleton />
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div style={{
        display: 'flex', gap: '10px', alignItems: 'flex-start',
        padding: '14px 16px', background: '#FFF5F5',
        border: '1px solid #FED7D7', borderRadius: '8px',
      }}>
        <AlertCircle size={16} color="#E53E3E" style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <p style={{ margin: '0 0 4px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#C53030' }}>
            No se pudo conectar con Google Earth Engine
          </p>
          <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#742A2A', lineHeight: 1.5 }}>
            {errMsg.includes('fetch') || errMsg.includes('Network')
              ? 'El backend no está corriendo. Ejecuta: uvicorn main:app --reload en /backend'
              : errMsg}
          </p>
        </div>
      </div>
    )
  }

  if (!evidence) return null

  const ctx = CLAIM_CONTEXT[evidence.claim_type] ?? CLAIM_CONTEXT.glacier
  const { before_url, after_url, years, claim_type, context_note } = evidence

  const accentColor = claim_type === 'snow' ? '#0284C7' : claim_type === 'temperature' ? '#EA580C' : '#059669'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* ── 1. Callout explicativo ──────────────────────────────────────────── */}
      <div style={{
        display:      'flex',
        gap:          '10px',
        padding:      '12px 14px',
        background:   `${accentColor}08`,
        border:       `1px solid ${accentColor}25`,
        borderLeft:   `3px solid ${accentColor}`,
        borderRadius: '6px',
      }}>
        <Info size={14} color={accentColor} style={{ flexShrink: 0, marginTop: '1px' }} />
        <div>
          <p style={{
            margin:     '0 0 4px',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize:   '12px',
            fontWeight: 700,
            color:      '#0F172A',
            letterSpacing: '0.01em',
          }}>
            ¿Qué estás viendo?
          </p>
          <p style={{
            margin:     '0 0 6px',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize:   '12px',
            color:      '#334155',
            lineHeight: 1.55,
          }}>
            {ctx.what}
          </p>
          {context_note && (
            <p style={{
              margin:     0,
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize:   '11.5px',
              color:      accentColor,
              fontWeight: 600,
              lineHeight: 1.45,
            }}>
              ↳ {context_note}
            </p>
          )}
        </div>
      </div>

      {/* ── 2. Imágenes antes/después ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>

        {/* ANTES */}
        <ImagePanel
          url={before_url}
          year={years.before}
          label="ANTES"
          expanded={expanded === 'before'}
          onClick={() => setExpanded(expanded === 'before' ? null : 'before')}
          accentColor="#64748B"
          isAfter={false}
        />

        {/* Flecha central */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          color:          accentColor,
        }}>
          <ArrowRight size={20} strokeWidth={1.5} />
        </div>

        {/* DESPUÉS */}
        <ImagePanel
          url={after_url}
          year={years.after}
          label="DESPUÉS"
          expanded={expanded === 'after'}
          onClick={() => setExpanded(expanded === 'after' ? null : 'after')}
          accentColor={accentColor}
          isAfter={true}
        />
      </div>

      {/* ── 3. Cómo leer esta imagen ────────────────────────────────────────── */}
      <div style={{
        padding:      '10px 14px',
        background:   '#F8FAFC',
        border:       '1px solid #E2E8F0',
        borderRadius: '6px',
      }}>
        <p style={{
          margin:        '0 0 8px',
          fontFamily:    "'IBM Plex Sans', sans-serif",
          fontSize:      '11px',
          fontWeight:    700,
          color:         '#64748B',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Guía de lectura
        </p>
        <p style={{
          margin:     '0 0 10px',
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize:   '12px',
          color:      '#334155',
          lineHeight: 1.6,
        }}>
          {ctx.howto}
        </p>

        {/* Leyenda de colores */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
          {ctx.legend.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{
                width:        '12px',
                height:       '12px',
                borderRadius: '2px',
                background:   item.hex,
                border:       item.hex === '#FFFFFF' ? '1px solid #CBD5E1' : 'none',
                flexShrink:   0,
              }} />
              <span style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize:   '11px',
                color:      '#475569',
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Fuente y metadata ────────────────────────────────────────────── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '6px',
        padding:        '8px 12px',
        background:     '#F8FAFC',
        border:         '1px solid #E2E8F0',
        borderRadius:   '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Satellite size={11} color="#94A3B8" />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize:   '10px',
            color:      '#64748B',
            fontWeight: 600,
          }}>
            {ctx.source}
          </span>
        </div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize:   '9px',
          color:      '#94A3B8',
        }}>
          NASA GIBS · {evidence.location.lat.toFixed(2)}°N {evidence.location.lon.toFixed(2)}°E
        </span>
      </div>

    </div>
  )
}

// ── ImagePanel ────────────────────────────────────────────────────────────────
function ImagePanel({
  url, year, label, expanded, onClick, accentColor, isAfter,
}: {
  url: string; year: number; label: string
  expanded: boolean; onClick: () => void
  accentColor: string; isAfter: boolean
}) {
  const [imgState, setImgState] = useState<'loading'|'ok'|'error'>('loading')

  // Abrir imagen en nueva pestaña (download real o vista ampliada)
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div
        onClick={onClick}
        style={{
          borderRadius: '8px',
          overflow:     'hidden',
          border:       `1px solid ${isAfter ? accentColor + '60' : '#E2E8F0'}`,
          cursor:       imgState === 'ok' ? 'zoom-in' : 'default',
          background:   '#0F172A',
          transition:   'box-shadow 0.15s',
          boxShadow:    isAfter ? `0 0 0 1px ${accentColor}20` : 'none',
        }}
      >
        {/* Label bar */}
        <div style={{
          padding:        '6px 10px',
          background:     isAfter ? `${accentColor}15` : 'rgba(15,23,42,0.6)',
          borderBottom:   `1px solid ${isAfter ? accentColor + '30' : 'rgba(255,255,255,0.06)'}`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
        }}>
          <span style={{
            fontFamily:    "'IBM Plex Sans', sans-serif",
            fontSize:      '11px',
            fontWeight:    700,
            color:         isAfter ? accentColor : '#94A3B8',
            letterSpacing: '0.04em',
          }}>
            {label}
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize:   '13px',
            fontWeight: 700,
            color:      isAfter ? accentColor : '#64748B',
          }}>
            {year}
          </span>
        </div>

        {/* Image area */}
        <div style={{ position: 'relative', minHeight: '200px' }}>
          {/* Loading state */}
          {imgState === 'loading' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: '#0F172A',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '8px',
            }}>
              <Loader2 size={18} color="#334155" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#334155' }}>
                Loading NASA GIBS…
              </span>
            </div>
          )}

          {/* Error state */}
          {imgState === 'error' && (
            <div style={{
              position: 'absolute', inset: 0,
              background: '#0F172A',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '6px', padding: '12px', textAlign: 'center',
            }}>
              <AlertCircle size={16} color="#475569" />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10px', color: '#475569', lineHeight: 1.4 }}>
                Sin datos para esta fecha.
              </span>
              <button
                onClick={handleOpen}
                style={{
                  marginTop: '4px', padding: '4px 10px',
                  background: 'transparent', border: '1px solid #334155',
                  borderRadius: '4px', cursor: 'pointer',
                  fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10px', color: '#64748B',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <ExternalLink size={10} /> Abrir en NASA GIBS
              </button>
            </div>
          )}

          {/* Actual image — no loading="lazy" para carga inmediata */}
          <img
            src={url}
            alt={`Imagen satelital MODIS ${year}`}
            onLoad={() => setImgState('ok')}
            onError={() => setImgState('error')}
            style={{
              width:      '100%',
              display:    'block',
              maxHeight:  expanded ? '380px' : '220px',
              minHeight:  '200px',
              objectFit:  'cover',
              transition: 'max-height 0.3s ease',
              opacity:    imgState === 'ok' ? 1 : 0,
            }}
          />

          {/* Badges — solo cuando imagen cargada */}
          {imgState === 'ok' && (
            <>
              <div style={{
                position: 'absolute', bottom: '6px', right: '6px',
                padding: '2px 7px', background: 'rgba(15,23,42,0.75)',
                borderRadius: '3px', fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '8px', color: '#64748B',
              }}>
                {expanded ? 'click para reducir' : 'click para ampliar'}
              </div>
              <div style={{
                position: 'absolute', top: '6px', left: '6px',
                padding: '2px 7px', background: 'rgba(15,23,42,0.85)',
                borderRadius: '3px', fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '8px', color: isAfter ? '#38BDF8' : '#FCD34D',
              }}>
                NASA GIBS · MODIS · {year}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Botón descarga / abrir — siempre visible */}
      <button
        onClick={handleOpen}
        title="Abrir imagen original NASA GIBS en nueva pestaña"
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '5px',
          padding:        '5px 8px',
          background:     'transparent',
          border:         `1px solid ${isAfter ? accentColor + '40' : '#E2E8F0'}`,
          borderRadius:   '5px',
          cursor:         'pointer',
          fontFamily:     "'IBM Plex Sans', sans-serif",
          fontSize:       '10.5px',
          color:          isAfter ? accentColor : '#64748B',
          transition:     'background 0.15s',
          width:          '100%',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = isAfter ? `${accentColor}10` : '#F8FAFC')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <Download size={11} />
        Descargar imagen · {year}
      </button>
    </div>
  )
}
