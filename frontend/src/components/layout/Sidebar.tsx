// ─────────────────────────────────────────────────────────────────────────────
// Sidebar — right column: active sources + how-it-works + metadata
// ─────────────────────────────────────────────────────────────────────────────

import { ACTIVE_SOURCES, PLATFORM_STATS } from '../../data/mockAnalyses'

export function Sidebar() {
  return (
    <aside className="py-6 px-5 space-y-6">
      {/* Active sources */}
      <div className="card p-4">
        <p className="section-label">Active Sources</p>
        <ul className="space-y-3">
          {ACTIVE_SOURCES.map(src => (
            <li key={src.name} className="flex items-start gap-2.5">
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 ${src.active ? 'bg-[#1A8A5A]' : 'bg-[#8AAFC4]'}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#041A2E] leading-tight">{src.name}</p>
                <p className="font-caption text-[#8AAFC4] mt-0.5">{src.type}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* How it works */}
      <div className="card p-4">
        <p className="section-label">CHow it works</p>
        <ol className="space-y-3">
          {[
            ['Extrae afirmaciones climáticas', '①'],
            ['Consulta imágenes Sentinel-2',    '②'],
            ['Contrasta con papers científicos', '③'],
            ['Emite score 0–100 con evidencia',  '④'],
          ].map(([step, num]) => (
            <li key={step} className="flex gap-2.5 items-start">
              <span className="font-caption text-[#5AAFD9] flex-shrink-0 mt-0.5">{num}</span>
              <p className="text-[11px] text-[#4A7A96] leading-relaxed font-light">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Metadata footer */}
      <div
        className="rounded-xl px-4 py-3 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(90,175,217,0.12) 0%, rgba(26,138,90,0.08) 100%)',
          border: '1px solid rgba(90,175,217,0.2)',
        }}
      >
        <p className="font-caption text-[#8AAFC4]">Updated Data</p>
        <p className="font-label text-[#041A2E] mt-1 text-[10px]">{PLATFORM_STATS.updatedAt}</p>
        <p className="font-caption text-[#8AAFC4] mt-2">Coverage</p>
        <p className="font-caption text-[#4A7A96] mt-0.5">Switzerland · Austria · Italy</p>
      </div>
    </aside>
  )
}
