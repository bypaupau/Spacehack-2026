import type { NLPAnalysis } from '../../../types'

interface NLPTabProps { nlp: NLPAnalysis }

// Pastel bar gradients para cada patrón
const BAR_FILL: Record<string, string> = {
  'Negacionismo directo': 'linear-gradient(90deg, #F87171, #FCA5A5)',
  'Minimización':         'linear-gradient(90deg, #FBBF24, #FDE68A)',
  'Retardismo':           'linear-gradient(90deg, #A78BFA, #C4B5FD)',
}

export function NLPTab({ nlp }: NLPTabProps) {
  return (
    <div className="space-y-5 animate-slide-up">
      {/* Narrative type */}
      <div className="flex items-center gap-2">
        <span className="kicker">{nlp.narrativeType}</span>
      </div>

      {/* Score bars */}
      <div>
        <p className="section-label">Patrones de desinformación detectados</p>
        <div className="space-y-4">
          {nlp.scores.map(score => (
            <div key={score.label}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span
                  className="font-label text-[10px]"
                  style={{ color: '#1E293B' }}
                >
                  {score.label}
                </span>
                <span
                  className="font-label text-[10px]"
                  style={{ color: '#94A3B8' }}
                >
                  {score.value}/100
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(226, 232, 240, 0.5)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${score.value}%`,
                    background: BAR_FILL[score.label] ?? 'linear-gradient(90deg, #38BDF8, #7DD3FC)',
                    transitionDelay: '100ms',
                  }}
                />
              </div>
              <p
                className="font-caption mt-1"
                style={{ color: '#94A3B8' }}
              >
                {score.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <p className="section-label">Palabras clave identificadas</p>
        <div className="flex flex-wrap gap-1.5">
          {nlp.topKeywords.map(kw => (
            <span
              key={kw}
              className="font-caption text-[9px] px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(224, 242, 254, 0.7)',
                border: '1px solid rgba(186, 230, 253, 0.5)',
                color: '#0284C7',
                fontWeight: 500,
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Methodology note */}
      <div
        className="rounded-2xl px-3.5 py-3"
        style={{
          background: 'rgba(240, 249, 255, 0.6)',
          borderLeft: '3px solid rgba(56, 189, 248, 0.5)',
        }}
      >
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: '#334155', fontWeight: 400 }}
        >
          <strong style={{ fontWeight: 700, color: '#1E293B' }}>Metodología NLP: </strong>
          Fine-tuned en el corpus del Global Disinformation Index y literatura académica
          peer-reviewed sobre cambio climático alpino.
        </p>
      </div>
    </div>
  )
}
