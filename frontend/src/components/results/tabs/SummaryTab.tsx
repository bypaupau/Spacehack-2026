import type { Analysis } from '../../../types'

interface SummaryTabProps { analysis: Analysis }

export function SummaryTab({ analysis }: SummaryTabProps) {
  return (
    <div className="space-y-5 animate-slide-up">
      {/* Extracted claims */}
      <div>
        <p className="section-label">Afirmaciones detectadas por IA</p>
        <ol className="space-y-2.5">
          {analysis.claims.map(claim => (
            <li key={claim.id} className="flex gap-3 items-start">
              <span
                className="font-caption flex-shrink-0 mt-0.5"
                style={{ color: '#38BDF8' }}
              >
                {String(claim.id).padStart(2, '0')}
              </span>
              <p
                className="text-[12px] leading-relaxed italic"
                style={{ color: '#64748B', fontWeight: 400 }}
              >
                {claim.text}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Summary box */}
      <div
        className="rounded-2xl px-4 py-3.5"
        style={{
          background: 'rgba(240, 249, 255, 0.7)',
          border: '1px solid rgba(186, 230, 253, 0.5)',
        }}
      >
        <p
          className="font-label text-[10px] mb-1.5"
          style={{ color: '#0284C7' }}
        >
          Resumen del análisis
        </p>
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: '#334155', fontWeight: 400 }}
        >
          {analysis.summary}
        </p>
      </div>
    </div>
  )
}
