// ─────────────────────────────────────────────────────────────────────────────
// ResultPanel — Soft Alpine Pastel redesign
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { Analysis, VerdictType } from '../../types'
import { VerdictBadge }  from '../ui/VerdictBadge'
import { ScoreBar }      from '../ui/ScoreBar'
import { SummaryTab }    from './tabs/SummaryTab'
import { SatelliteTab }  from './tabs/SatelliteTab'
import { NLPTab }        from './tabs/NLPTab'
import { SourcesTab }    from './tabs/SourcesTab'

type TabId = 'summary' | 'satellite' | 'nlp' | 'sources'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'summary',   label: 'Resumen',  icon: '◎' },
  { id: 'satellite', label: 'Satélite', icon: '◈' },
  { id: 'nlp',       label: 'NLP',      icon: '⟨⟩' },
  { id: 'sources',   label: 'Fuentes',  icon: '⊕' },
]

// Veredictos en tonos pastel encendidos
const VERDICT_CONFIG: Record<VerdictType, {
  label: string; bg: string; color: string; glow: string; pillBg: string
}> = {
  false: {
    label:   'Fake',
    bg:      'linear-gradient(135deg, rgba(248,113,113,0.12) 0%, rgba(248,113,113,0.04) 100%)',
    color:   '#EF4444',
    glow:    'rgba(248,113,113,0.15)',
    pillBg:  'rgba(254,226,226,0.8)',
  },
  verified: {
    label:   'Verified',
    bg:      'linear-gradient(135deg, rgba(52,211,153,0.12) 0%, rgba(52,211,153,0.04) 100%)',
    color:   '#10B981',
    glow:    'rgba(52,211,153,0.15)',
    pillBg:  'rgba(209,250,229,0.8)',
  },
  misleading: {
    label:   'Sneaky',
    bg:      'linear-gradient(135deg, rgba(251,191,36,0.14) 0%, rgba(251,191,36,0.04) 100%)',
    color:   '#D97706',
    glow:    'rgba(251,191,36,0.12)',
    pillBg:  'rgba(254,243,199,0.8)',
  },
  pending: {
    label:   'Analyzing',
    bg:      'linear-gradient(135deg, rgba(148,163,184,0.12) 0%, rgba(148,163,184,0.04) 100%)',
    color:   '#64748B',
    glow:    'transparent',
    pillBg:  'rgba(241,245,249,0.8)',
  },
}

interface ResultPanelProps { analysis: Analysis }

export function ResultPanel({ analysis }: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('summary')
  const { verdict, score, headline, analyzedAt, input, satellite, nlp, sources } = analysis

  const vc = VERDICT_CONFIG[verdict]

  const analyzedDate = new Date(analyzedAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="animate-slide-up space-y-4 mb-6">

      {/* ── Satellite data strip (pastel sky, no dark navy) ─────────────── */}
      <div
        className="overflow-hidden"
        style={{
          borderRadius: '28px',
          border: '1.5px solid rgba(186, 230, 253, 0.6)',
          boxShadow: '0 4px 20px rgba(14,165,233,0.07)',
        }}
      >
        <div
          className="grid grid-cols-3"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #E0F2FE 60%, #F0F9FF 100%)',
          }}
        >
          {[
            { val: `${satellite.glacierRetreat}m`,  sub: 'retroceso glaciar\nprom. 2024' },
            { val: `${satellite.snowCoverage}%`,    sub: `cobertura nieve\nvs 78% en 2015` },
            { val: satellite.ndviIndex.toFixed(2),  sub: 'índice NDVI\nvegetación 2024' },
          ].map((m, i) => (
            <div
              key={i}
              className={`px-5 py-4 ${i < 2 ? 'border-r' : ''}`}
              style={{ borderColor: 'rgba(186, 230, 253, 0.5)' }}
            >
              <p
                className="font-editorial text-[28px] leading-none"
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {m.val}
              </p>
              <p
                className="font-caption mt-1.5 whitespace-pre-line leading-relaxed"
                style={{ color: '#64748B' }}
              >
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Coverage trend bar */}
        <div
          className="px-5 py-3"
          style={{
            background: 'rgba(224, 242, 254, 0.6)',
            backdropFilter: 'blur(8px)',
            borderTop: '1px solid rgba(186,230,253,0.4)',
          }}
        >
          <div className="flex justify-between font-caption mb-1.5" style={{ color: '#64748B' }}>
            <span>NDSI Snow Coverage 2015–2024</span>
            <span style={{ color: '#EF4444' }}>{satellite.coverageTrend}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(186,230,253,0.35)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${satellite.snowCoverage}%`,
                background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
              }}
            />
          </div>
          <div className="flex justify-between font-caption mt-1.5" style={{ color: '#94A3B8' }}>
            <span>78% (2015)</span><span>{satellite.snowCoverage}% (2024)</span>
          </div>
        </div>
      </div>

      {/* ── Veredicto card ────────────────────────────────────────────────── */}
      <div
        className="card overflow-hidden"
        style={{
          boxShadow: `0 8px 32px ${vc.glow}, 0 2px 8px rgba(0,0,0,0.025)`,
        }}
      >
        {/* Verdict header */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{
            background: vc.bg,
            borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse-soft"
              style={{ background: vc.color }}
            />
            <span className="font-caption" style={{ color: vc.color }}>
              VEREDICTO IBILENS
            </span>
          </div>
          <span
            className="font-caption px-2.5 py-1 rounded-full text-[9px]"
            style={{
              background: vc.pillBg,
              color: vc.color,
              border: `1px solid ${vc.color}30`,
            }}
          >
            SCORE: {score} / 100
          </span>
        </div>

        {/* Verdict body */}
        <div className="p-5 space-y-5">
          {/* Big verdict + score */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="font-editorial text-3xl"
                  style={{ color: vc.color }}
                >
                  {vc.label}
                </span>
                <VerdictBadge verdict={verdict} size="md" />
              </div>
              <p
                className="font-editorial text-sm leading-snug mb-1"
                style={{ color: '#1E293B', fontWeight: 700 }}
              >
                {headline}
              </p>
              <p className="font-caption text-[9px]" style={{ color: '#94A3B8' }} title={input}>
                {input.length > 70 ? input.slice(0, 70) + '…' : input}
              </p>
              <p className="font-caption text-[9px] mt-0.5" style={{ color: '#94A3B8' }}>
                Analizado: {analyzedDate}
              </p>
            </div>
          </div>

          {/* Score bar */}
          <div>
            <p className="font-label text-[10px] mb-2" style={{ color: '#64748B' }}>
              Fiabilidad general
            </p>
            <ScoreBar score={score} verdict={verdict} />
          </div>

          {/* Tab bar */}
          <div>
            <div
              className="flex rounded-2xl overflow-hidden mb-4"
              style={{
                background: 'rgba(241, 245, 249, 0.7)',
                padding: '4px',
                gap: '2px',
                border: '1px solid rgba(226,232,240,0.5)',
              }}
            >
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all duration-200 font-caption text-[9px] tracking-widest cursor-pointer border-none"
                  style={{
                    background:  activeTab === tab.id
                      ? 'rgba(255,255,255,0.95)'
                      : 'transparent',
                    color:       activeTab === tab.id ? '#1E293B' : '#94A3B8',
                    boxShadow:   activeTab === tab.id
                      ? '0 2px 8px rgba(0,0,0,0.06)'
                      : 'none',
                    fontWeight:  activeTab === tab.id ? 700 : 400,
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'summary'   && <SummaryTab   analysis={analysis} />}
            {activeTab === 'satellite' && <SatelliteTab satellite={satellite} />}
            {activeTab === 'nlp'       && <NLPTab       nlp={nlp} />}
            {activeTab === 'sources'   && <SourcesTab   sources={sources} />}
          </div>
        </div>
      </div>
    </div>
  )
}
