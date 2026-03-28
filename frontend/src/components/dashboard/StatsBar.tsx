// StatsBar — shown only in compact (post-analysis) mode above the results
import { PLATFORM_STATS } from '../../data/mockAnalyses'

export function StatsBar() {
  return (
    <div className="flex justify-center gap-3 mb-6 flex-wrap">
      {[
        { val: PLATFORM_STATS.totalVerified, label: 'verificados',       color: '#1A8A5A' },
        { val: PLATFORM_STATS.falseDetected, label: 'falsos detectados', color: '#E8572A' },
        { val: `${PLATFORM_STATS.accuracy}%`,label: 'precisión',         color: '#2D8BC4' },
      ].map((s, i) => (
        <div
          key={i}
          className="card px-4 py-3 flex items-center gap-2.5"
          style={{ borderRadius: '16px', minWidth: '140px' }}
        >
          <span
            className="font-editorial text-2xl leading-none"
            style={{
              background: `linear-gradient(135deg, #041A2E, ${s.color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {s.val}
          </span>
          <span className="font-caption text-[#8AAFC4]">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
