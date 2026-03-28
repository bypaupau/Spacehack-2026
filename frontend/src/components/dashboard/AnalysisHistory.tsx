// ─────────────────────────────────────────────────────────────────────────────
// AnalysisHistory — list of previous analyses in the left content column
// ─────────────────────────────────────────────────────────────────────────────

import type { Analysis } from '../../types'
import { AnalysisCard } from './AnalysisCard'

interface AnalysisHistoryProps {
  analyses:        Analysis[]
  activeId?:       string
  onSelect?:       (a: Analysis) => void
}

export function AnalysisHistory({ analyses, activeId, onSelect }: AnalysisHistoryProps) {
  return (
    <div>
      <p className="section-label">Análisis anteriores</p>
      {analyses.map(a => (
        <AnalysisCard
          key={a.id}
          analysis={a}
          onSelect={onSelect}
          isActive={a.id === activeId}
        />
      ))}
    </div>
  )
}
