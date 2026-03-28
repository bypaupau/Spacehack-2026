// ─────────────────────────────────────────────────────────────────────────────
// ScoreBar — animated horizontal bar for veracity score 0–100
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import type { VerdictType } from '../../types'

interface ScoreBarProps {
  score:       number
  verdict:     VerdictType
  showLabels?: boolean
}

const FILL: Record<VerdictType, string> = {
  false:      'linear-gradient(90deg, #E8572A, #F4A261)',
  verified:   'linear-gradient(90deg, #1A6FA3, #1A8A5A)',
  misleading: 'linear-gradient(90deg, #B8900C, #D4A810)',
  pending:    'linear-gradient(90deg, #8AAFC4, #5AAFD9)',
}

const SCORE_COLOR: Record<VerdictType, string> = {
  false:      '#E8572A',
  verified:   '#1A8A5A',
  misleading: '#B8900C',
  pending:    '#8AAFC4',
}

export function ScoreBar({ score, verdict, showLabels = true }: ScoreBarProps) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 100)
    return () => clearTimeout(t)
  }, [score])

  return (
    <div className="w-full">
      <div className="flex justify-end mb-1.5">
        <span
          className="font-label text-base font-medium"
          style={{ color: SCORE_COLOR[verdict] }}
        >
          {score}%
        </span>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${width}%`, background: FILL[verdict] }}
        />
      </div>

      {showLabels && (
        <div className="flex justify-between mt-1.5">
          <span className="font-caption" style={{ color: '#E8572A' }}>Falso</span>
          <span className="font-caption" style={{ color: '#1A8A5A' }}>Verificado</span>
        </div>
      )}
    </div>
  )
}
