// ─────────────────────────────────────────────────────────────────────────────
// VerdictBadge — Peak News · Semantic Color edition
// Badges sólidos y de alto contraste. Colores usados SOLO para semántica.
// ─────────────────────────────────────────────────────────────────────────────

import type { VerdictType } from '../../types'

interface VerdictBadgeProps {
  verdict: VerdictType
  size?: 'sm' | 'md'
}

const CONFIG: Record<VerdictType, { label: string; bg: string; color: string; border: string }> = {
  false: {
    label:  'FALSO',
    bg:     '#FEF2F2',
    color:  '#DC2626',
    border: '#FECACA',
  },
  verified: {
    label:  'VERIFICADO',
    bg:     '#ECFDF5',
    color:  '#059669',
    border: '#6EE7B7',
  },
  misleading: {
    label:  'ENGAÑOSO',
    bg:     '#FFFBEB',
    color:  '#D97706',
    border: '#FCD34D',
  },
  pending: {
    label:  'ANALIZANDO',
    bg:     '#F8FAFC',
    color:  '#64748B',
    border: '#E2E8F0',
  },
}

export function VerdictBadge({ verdict, size = 'sm' }: VerdictBadgeProps) {
  const { label, bg, color, border } = CONFIG[verdict]
  return (
    <span
      style={{
        display:       'inline-block',
        padding:       size === 'sm' ? '2px 8px' : '4px 12px',
        borderRadius:  '4px',
        background:    bg,
        color,
        border:        `1.5px solid ${border}`,
        fontFamily:    "'IBM Plex Mono', monospace",
        fontSize:      size === 'sm' ? '8px' : '10px',
        fontWeight:    700,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
      }}
    >
      {label}
    </span>
  )
}
