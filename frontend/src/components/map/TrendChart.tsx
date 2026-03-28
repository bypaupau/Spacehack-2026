// ─────────────────────────────────────────────────────────────────────────────
// TrendChart — Gráfico SVG inline de tendencia temporal (100% client-side)
//
// Renderiza la serie histórica con SVG puro: sin backend, sin dependencias.
// Los datos vienen de getTrendChart() en api.ts (sintético o GEE en Fase 2).
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react'
import { TrendingDown, TrendingUp, Loader2, AlertCircle, BarChart2, Database } from 'lucide-react'
import { getTrendChart, type TrendChartResult } from '../../services/api'

interface TrendChartProps {
  claimText: string
  location?: string
}

// ── Inline SVG line chart ─────────────────────────────────────────────────────
function LineChart({ years, values, unit }: { years: number[]; values: number[]; unit: string }) {
  const svgRef   = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<{ x: number; y: number; year: number; val: number } | null>(null)

  const W = 600, H = 180
  const padL = 48, padR = 16, padT = 14, padB = 32
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const minV = Math.min(...values)
  const maxV = Math.max(...values)
  const rangeV = maxV - minV || 1

  // Map year index → SVG coords
  const toX = (i: number) => padL + (i / (years.length - 1)) * chartW
  const toY = (v: number) => padT + chartH - ((v - minV) / rangeV) * chartH

  // Build SVG path
  const linePath = values
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)},${toY(v).toFixed(1)}`)
    .join(' ')

  // Gradient fill path (close below)
  const fillPath = linePath
    + ` L ${toX(values.length - 1).toFixed(1)},${(padT + chartH).toFixed(1)}`
    + ` L ${toX(0).toFixed(1)},${(padT + chartH).toFixed(1)} Z`

  // Y-axis ticks (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minV + (i / 4) * rangeV
    return { y: toY(v), label: v.toFixed(unit === '°C' ? 1 : 0) }
  })

  // X-axis ticks (every ~8 years)
  const step = Math.ceil(years.length / 7)
  const xTicks = years
    .map((yr, i) => ({ i, yr }))
    .filter(({ i }) => i % step === 0 || i === years.length - 1)

  const trendColor = values[values.length - 1] < values[0] ? '#DC2626' : '#059669'
  const gradId = 'trendGrad'

  // Mouse interaction on the SVG overlay
  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * W
    const rel = Math.max(0, Math.min(1, (mx - padL) / chartW))
    const idx = Math.round(rel * (years.length - 1))
    setHover({ x: toX(idx), y: toY(values[idx]), year: years[idx], val: values[idx] })
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', display: 'block', overflow: 'visible' }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor={trendColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={trendColor} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <line key={i} x1={padL} y1={t.y} x2={W - padR} y2={t.y}
            stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="3,3" />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((t, i) => (
          <text key={i} x={padL - 6} y={t.y + 4} textAnchor="end"
            fill="#94A3B8" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
            {t.label}
          </text>
        ))}

        {/* X-axis labels */}
        {xTicks.map(({ i, yr }) => (
          <text key={yr} x={toX(i)} y={H - 4} textAnchor="middle"
            fill="#94A3B8" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
            {yr}
          </text>
        ))}

        {/* Gradient fill */}
        <path d={fillPath} fill={`url(#${gradId})`} />

        {/* Main line */}
        <path d={linePath} fill="none" stroke={trendColor} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover vertical line */}
        {hover && (
          <>
            <line x1={hover.x} y1={padT} x2={hover.x} y2={padT + chartH}
              stroke={trendColor} strokeWidth="1" strokeDasharray="4,2" opacity="0.6" />
            <circle cx={hover.x} cy={hover.y} r="4" fill={trendColor}
              stroke="white" strokeWidth="1.5" />
          </>
        )}

        {/* Invisible hit area */}
        <rect x={padL} y={padT} width={chartW} height={chartH}
          fill="transparent" style={{ cursor: 'crosshair' }}
          onMouseMove={handleMouseMove} />
      </svg>

      {/* Tooltip */}
      {hover && (
        <div style={{
          position:   'absolute',
          top:        0,
          left:       `calc(${(hover.x / W * 100).toFixed(1)}% + 8px)`,
          transform:  hover.x / W > 0.75 ? 'translateX(-110%)' : undefined,
          background: '#0F172A',
          border:     `1px solid ${trendColor}40`,
          borderRadius:'5px',
          padding:    '5px 10px',
          pointerEvents: 'none',
          zIndex:     10,
          whiteSpace: 'nowrap',
        }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#94A3B8' }}>
            {hover.year}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 700, color: trendColor, marginLeft: '8px' }}>
            {hover.val.toFixed(unit === '°C' ? 1 : 0)}{unit}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function TrendChart({ claimText, location = 'Alpes Suizos' }: TrendChartProps) {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [data,   setData]   = useState<TrendChartResult | null>(null)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    if (!claimText) return
    setStatus('loading')
    setData(null)
    getTrendChart(claimText, location).then(res => {
      if (res.ok && res.data) { setData(res.data); setStatus('ok') }
      else { setErrMsg(res.error ?? 'Error'); setStatus('error') }
    })
  }, [claimText, location])

  if (status === 'idle' || status === 'loading') {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '16px', background: '#F8FAFC',
        border: '1px solid #E2E8F0', borderRadius: '8px',
      }}>
        <Loader2 size={14} color="#0284C7" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#475569' }}>
          Generando serie histórica de datos…
        </span>
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div style={{
        display: 'flex', gap: '10px', padding: '14px 16px',
        background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '8px',
      }}>
        <AlertCircle size={15} color="#E53E3E" style={{ flexShrink: 0, marginTop: '1px' }} />
        <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#C53030' }}>
          {errMsg}
        </p>
      </div>
    )
  }

  if (!data) return null

  const isNeg      = data.trend_pct < 0
  const trendColor = isNeg ? '#DC2626' : '#059669'
  const TrendIcon  = isNeg ? TrendingDown : TrendingUp

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', background: '#F8FAFC',
        border: '1px solid #E2E8F0', borderBottom: 'none', borderRadius: '8px 8px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <BarChart2 size={13} color="#64748B" />
          <div>
            <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
              {data.title}
            </p>
            <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10px', color: '#64748B' }}>
              {data.subtitle}
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '3px 10px', background: `${trendColor}10`,
          border: `1px solid ${trendColor}30`, borderRadius: '20px',
        }}>
          <TrendIcon size={12} color={trendColor} strokeWidth={2.5} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 700, color: trendColor }}>
            {data.trend_dir}{Math.abs(data.trend_pct)}%
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#94A3B8' }}>
            ({data.years[0]}→{data.years[data.years.length - 1]})
          </span>
        </div>
      </div>

      {/* Chart */}
      <div style={{
        border: '1px solid #E2E8F0', borderRadius: '0 0 8px 8px',
        background: '#FFFFFF', padding: '12px 8px 6px',
        overflow: 'hidden',
      }}>
        <LineChart years={data.years} values={data.values} unit={data.unit} />

        {/* Source footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', paddingLeft: '48px' }}>
          <Database size={9} color="#94A3B8" />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8.5px', color: '#94A3B8' }}>
            {data.source}
          </span>
        </div>
      </div>

    </div>
  )
}
