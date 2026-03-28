// ─────────────────────────────────────────────────────────────────────────────
// AnalysisCard — Soft Alpine Pastel
// ─────────────────────────────────────────────────────────────────────────────

import type { Analysis } from '../../types'
import { VerdictBadge } from '../ui/VerdictBadge'

interface AnalysisCardProps {
  analysis:  Analysis
  onSelect?: (a: Analysis) => void
  isActive?: boolean
}

// Pastel dot color por veredicto
const VERDICT_COLOR: Record<string, string> = {
  false:      '#F87171',
  verified:   '#34D399',
  misleading: '#FBBF24',
  pending:    '#94A3B8',
}

// Pastel left-border color por veredicto
const VERDICT_BORDER: Record<string, string> = {
  false:      '#FCA5A5',
  verified:   '#6EE7B7',
  misleading: '#FDE68A',
  pending:    '#CBD5E1',
}

export function AnalysisCard({ analysis, onSelect, isActive }: AnalysisCardProps) {
  const { verdict, score, headline, summary, analyzedAt } = analysis

  const dateStr = new Date(analyzedAt).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const dotColor    = VERDICT_COLOR[verdict]
  const borderColor = VERDICT_BORDER[verdict]

  return (
    <div
      className="card card-hover p-4 flex gap-3 items-start mb-3"
      style={{
        borderRadius: '24px',
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: isActive
          ? `0 0 0 2px ${dotColor}30, 0 8px 30px rgba(0,0,0,0.05)`
          : undefined,
      }}
      onClick={() => onSelect?.(analysis)}
    >
      {/* Colored dot indicator */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
        style={{ background: dotColor }}
      />

      <div className="flex-1 min-w-0">
        {/* Headline */}
        <p
          className="font-editorial text-[13.5px] leading-snug mb-1.5 line-clamp-2"
          style={{ color: '#1E293B', fontWeight: 700 }}
        >
          {headline}
        </p>

        {/* Snippet */}
        <p
          className="text-[11px] leading-relaxed line-clamp-2 mb-2.5"
          style={{ color: '#64748B', fontWeight: 400 }}
        >
          {summary}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-caption text-[9px]" style={{ color: '#94A3B8' }}>
            {dateStr}
          </span>
          <span
            className="font-caption text-[9px]"
            style={{ color: dotColor, fontWeight: 600 }}
          >
            {score} / 100
          </span>
          <VerdictBadge verdict={verdict} />
        </div>
      </div>
    </div>
  )
}
