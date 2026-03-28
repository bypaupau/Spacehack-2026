import type { Source } from '../../../types'

interface SourcesTabProps { sources: Source[] }

export function SourcesTab({ sources }: SourcesTabProps) {
  const reliabilityColor = (r: number) =>
    r >= 90 ? '#059669' : r >= 70 ? '#D97706' : '#DC2626'

  const reliabilityBg = (r: number) =>
    r >= 90 ? 'rgba(209,250,229,0.7)' : r >= 70 ? 'rgba(254,243,199,0.7)' : 'rgba(254,226,226,0.7)'

  return (
    <div className="space-y-4 animate-slide-up">
      <p className="section-label">Fuentes consultadas</p>

      <ul className="space-y-2.5">
        {sources.map(src => (
          <li
            key={src.name}
            className="flex gap-3 items-start px-3.5 py-3 rounded-2xl transition-colors"
            style={{
              background: 'rgba(248, 250, 252, 0.8)',
              border: '1px solid rgba(226, 232, 240, 0.6)',
            }}
          >
            {/* Reliability dot */}
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{ background: reliabilityColor(src.reliability) }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p
                  className="text-[12px] font-medium"
                  style={{ color: '#1E293B', fontWeight: 600 }}
                >
                  {src.name}
                </p>
                <span
                  className="font-caption text-[9px] px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    background: reliabilityBg(src.reliability),
                    color: reliabilityColor(src.reliability),
                    border: `1px solid ${reliabilityColor(src.reliability)}30`,
                    fontWeight: 600,
                  }}
                >
                  {src.reliability}%
                </span>
              </div>
              <p
                className="font-caption text-[9px] mt-0.5"
                style={{ color: '#94A3B8' }}
              >
                {src.type}
              </p>
              {src.url && (
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-caption text-[9px] mt-0.5 inline-block hover:underline"
                  style={{ color: '#0284C7' }}
                >
                  {src.url.replace('https://', '')}
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="font-caption text-[9px]" style={{ color: '#94A3B8' }}>
        Datos satelitales disponibles bajo licencias Creative Commons / dominio público (ESA, USGS).
      </p>
    </div>
  )
}
