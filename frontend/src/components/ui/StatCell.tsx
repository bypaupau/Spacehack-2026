// ─────────────────────────────────────────────────────────────────────────────
// StatCell — one metric block in the hero stats bar
// ─────────────────────────────────────────────────────────────────────────────

interface StatCellProps {
  value: string | number
  label: string
}

export function StatCell({ value, label }: StatCellProps) {
  return (
    <div className="card text-center px-3 py-3">
      <p className="font-editorial text-[22px] text-ink leading-none">{value}</p>
      <p className="font-caption text-ghost mt-1">{label}</p>
    </div>
  )
}
