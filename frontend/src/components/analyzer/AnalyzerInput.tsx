// ─────────────────────────────────────────────────────────────────────────────
// AnalyzerInput — Peak News · Newsroom Hero
// v4: 3 input modes — Statement / Article URL / Social Post
//     Each mode routes to its own prototype case via the api.ts mock router.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, type KeyboardEvent } from 'react'
import { Logo } from '../ui/Logo'
import { PLATFORM_STATS } from '../../data/mockAnalyses'
import type { InputMode } from '../../types'

// ── Validation ────────────────────────────────────────────────────────────────
function getValidationError(val: string, mode: InputMode, platform: string): string | null {
  const trimmed = val.trim()
  if (!trimmed) return null // empty → button disabled handles it

  if (mode === 'article') {
    const isUrl = /^https?:\/\/.{4,}/i.test(trimmed)
    if (!isUrl) return 'Pega una URL válida que empiece por https://…'
  }

  if (mode === 'social') {
    const validDomains = platform === 'reddit'
      ? /https?:\/\/(www\.)?reddit\.com\//i
      : /https?:\/\/(www\.)?(twitter\.com|x\.com)\//i
    if (!validDomains.test(trimmed)) {
      return platform === 'reddit'
        ? 'Pega un enlace de Reddit (reddit.com/r/…)'
        : 'Pega un enlace de X / Twitter (x.com o twitter.com)'
    }
  }

  if (mode === 'statement') {
    if (trimmed.length < 12) return 'La afirmación debe tener al menos 12 caracteres'
    // Detect obvious gibberish: no vowels, no spaces, all non-word chars
    const vowels   = /[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/
    const hasSpace = trimmed.includes(' ')
    if (!vowels.test(trimmed) && !hasSpace) {
      return 'Por favor, escribe una afirmación real para verificar'
    }
  }

  return null
}

interface AnalyzerInputProps {
  onSubmit:  (input: string, mode?: InputMode, platform?: string) => void
  disabled?: boolean
  compact?:  boolean
}

// ── Mode config ───────────────────────────────────────────────────────────────
const MODES: { id: InputMode; label: string; placeholder: string }[] = [
  {
    id:          'statement',
    label:       'Statement',
    placeholder: 'Write a claim to verify… e.g. "Are the Alps losing their glaciers?"',
  },
  {
    id:          'article',
    label:       'Article URL',
    placeholder: 'Paste a news article URL… e.g. https://example.com/glaciers-growing',
  },
  {
    id:          'social',
    label:       'Social Post',
    placeholder: 'Paste a link from X or Reddit… e.g. https://x.com/user/status/…',
  },
]

const SOCIAL_PLATFORMS: { id: 'twitter' | 'reddit'; label: string }[] = [
  { id: 'twitter', label: 'X / Twitter' },
  { id: 'reddit',  label: 'Reddit' },
]

// ── Mode pill — filled when active, ghost when not; zero borders ──────────────
function ModePill({
  mode, active, onClick,
}: { mode: typeof MODES[number]; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        padding:       '5px 14px',
        borderRadius:  '20px',
        border:        'none',
        background:    active ? '#1D4ED8' : '#EEF2F7',
        color:         active ? '#FFFFFF'  : '#4A5A72',
        fontFamily:    "'IBM Plex Sans', sans-serif",
        fontSize:      '12px',
        fontWeight:    active ? 700 : 500,
        cursor:        'pointer',
        transition:    'all 0.15s',
        whiteSpace:    'nowrap',
        boxShadow:     active ? '0 2px 8px rgba(29,78,216,0.22)' : 'none',
      }}
    >
      {mode.label}
    </button>
  )
}

export function AnalyzerInput({ onSubmit, disabled, compact }: AnalyzerInputProps) {
  const [value,       setValue]       = useState('')
  const [mode,        setMode]        = useState<InputMode>('statement')
  const [platform,    setPlatform]    = useState<'twitter' | 'reddit'>('twitter')
  const [inputError,  setInputError]  = useState<string | null>(null)
  const [showError,   setShowError]   = useState(false)

  const currentMode = MODES.find(m => m.id === mode)!

  // Clear error when user types
  const handleChange = (val: string) => {
    setValue(val)
    if (showError) {
      const err = getValidationError(val, mode, platform)
      setInputError(err)
      if (!err) setShowError(false)
    }
  }

  // Clear error on mode/platform switch
  const handleModeChange = (m: InputMode) => {
    setMode(m)
    setInputError(null)
    setShowError(false)
  }
  const handlePlatformChange = (p: 'twitter' | 'reddit') => {
    setPlatform(p)
    setInputError(null)
    setShowError(false)
  }

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    const err = getValidationError(value, mode, platform)
    if (err) {
      setInputError(err)
      setShowError(true)
      return
    }
    setInputError(null)
    setShowError(false)
    onSubmit(value.trim(), mode, mode === 'social' ? platform : undefined)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  const errorBorder = showError && inputError ? '1.5px solid #EF4444' : undefined

  // ── COMPACT mode ─────────────────────────────────────────────────────────────
  if (compact) {
    return (
      <div
        className="px-6 py-3 flex justify-center animate-fade-in"
        style={{
          borderBottom: '1px solid #E2E8F0',
          background:   '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '580px' }}>
          {/* Mode pills — compact */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {MODES.map(m => (
              <ModePill key={m.id} mode={m} active={mode === m.id} onClick={() => handleModeChange(m.id)} />
            ))}
          </div>

          {/* Input row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" viewBox="0 0 15 15" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="#94A3B8" strokeWidth="1.4"/>
                  <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <input
                  className="pl-9 text-sm"
                  style={{
                    width: '100%', padding: '10px 14px 10px 34px',
                    borderRadius: '6px', border: errorBorder ?? '1.5px solid #E2E8F0',
                    outline: 'none', fontFamily: "'IBM Plex Sans', sans-serif", color: '#0F172A',
                    fontSize: '13px', transition: 'border-color 0.15s',
                  }}
                  type="text"
                  placeholder={currentMode.placeholder}
                  value={value}
                  onChange={e => handleChange(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={disabled}
                />
              </div>
              <button className="btn-primary" onClick={handleSubmit} disabled={disabled || !value.trim()}>
                {disabled ? '…' : '→'}
              </button>
            </div>
            {showError && inputError && (
              <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#EF4444', paddingLeft: '2px' }}>
                {inputError}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── FULL HERO mode ────────────────────────────────────────────────────────────
  return (
    <section
      className="flex flex-col items-center justify-center text-center px-6"
      style={{ minHeight: 'calc(100vh - 52px)', paddingTop: '2rem', paddingBottom: '5rem' }}
    >
      {/* Logo */}
      <div className="mb-4 animate-fade-in" style={{ animationDelay: '0s' }}>
        <Logo size={130} />
      </div>

      {/* Brand name */}
      <div
        className="animate-slide-up"
        style={{ animationDelay: '0.08s', animationFillMode: 'both', marginBottom: '24px' }}
      >
        <h1
          style={{
            fontFamily:    "'Playfair Display', Georgia, serif",
            fontSize:      'clamp(42px, 6vw, 64px)',
            fontWeight:    700,
            lineHeight:    1.08,
            letterSpacing: '-0.02em',
            color:         '#0F172A',
          }}
        >
          What does <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#0284C7' }}>science</em><br/>say about this?
        </h1>
      </div>

      {/* Tagline */}
      <p
        className="animate-slide-up"
        style={{
          fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '16px', color: '#475569',
          fontWeight: 400, maxWidth: '520px', lineHeight: 1.6, marginBottom: '28px',
          letterSpacing: '-0.01em', animationDelay: '0.16s', animationFillMode: 'both',
        }}
      >
        Fact check claims about Alpine climate change with trusted sources such as{' '}
        <span style={{ color: '#0284C7', fontWeight: 600 }}>Sentinel-2, Copernicus</span>
        {' '}and top science journals.
      </p>

      {/* ── Mode pills ──────────────────────────────────────────────────────── */}
      <div
        className="animate-slide-up"
        style={{ animationDelay: '0.20s', animationFillMode: 'both', marginBottom: '14px' }}
      >
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {MODES.map(m => (
            <ModePill key={m.id} mode={m} active={mode === m.id} onClick={() => handleModeChange(m.id)} />
          ))}
        </div>

        {/* Social sub-pills */}
        {mode === 'social' && (
          <div
            style={{
              display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: "'IBM Plex Mono', monospace", alignSelf: 'center' }}>
              PLATAFORMA:
            </span>
            {SOCIAL_PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => handlePlatformChange(p.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '4px 14px', borderRadius: '20px',
                  border: 'none',
                  background: platform === p.id ? '#1D4ED8' : '#EEF2F7',
                  color: platform === p.id ? '#FFFFFF' : '#8FA3BF',
                  fontSize: '12px', fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: platform === p.id ? 700 : 500, cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Search input ────────────────────────────────────────────────────── */}
      <div
        className="w-full max-w-2xl animate-slide-up"
        style={{ animationDelay: '0.26s', animationFillMode: 'both' }}
      >
        <div
          style={{
            display: 'flex', gap: '8px', padding: '6px',
            background: '#FFFFFF', borderRadius: '10px',
            border: showError && inputError ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
            boxShadow: showError && inputError ? '0 0 0 3px rgba(239,68,68,0.10)' : '0 4px 16px rgba(15,23,42,0.06)',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocusCapture={e => {
            if (showError && inputError) return
            const el = e.currentTarget as HTMLDivElement
            el.style.borderColor = '#0284C7'
            el.style.boxShadow   = '0 0 0 3px rgba(2,132,199,0.10), 0 4px 16px rgba(15,23,42,0.06)'
          }}
          onBlurCapture={e => {
            if (showError && inputError) return
            const el = e.currentTarget as HTMLDivElement
            el.style.borderColor = '#E2E8F0'
            el.style.boxShadow   = '0 4px 16px rgba(15,23,42,0.06)'
          }}
        >
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 15 15" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#94A3B8" strokeWidth="1.4"/>
              <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#94A3B8" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder={currentMode.placeholder}
              value={value}
              onChange={e => handleChange(e.target.value)}
              onKeyDown={handleKey}
              disabled={disabled}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                padding: '10px 12px 10px 38px',
                fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 400,
                fontSize: '15px', color: '#0F172A',
              }}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            style={{
              background:    value.trim() && !disabled ? '#1D4ED8' : '#EEF2F7',
              color:         value.trim() && !disabled ? '#FFFFFF'  : '#8FA3BF',
              border:        'none', borderRadius: '7px', padding: '10px 20px',
              fontFamily:    "'IBM Plex Mono', monospace", fontWeight: 600,
              fontSize:      '11px', letterSpacing: '0.06em', textTransform: 'uppercase',
              cursor:        value.trim() && !disabled ? 'pointer' : 'not-allowed',
              whiteSpace:    'nowrap', transition: 'all 0.18s',
              boxShadow:     value.trim() && !disabled ? '0 2px 8px rgba(29,78,216,0.25)' : 'none',
            }}
          >
            {disabled ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg style={{ animation: 'spin 1s linear infinite', width: 11, height: 11 }} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Analizando
              </span>
            ) : 'Verificar →'}
          </button>
        </div>

        {/* Inline validation error */}
        {showError && inputError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '8px 12px', background: '#FEF2F2', borderRadius: '7px', border: '1px solid #FECACA' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="0.8" fill="#EF4444" stroke="#EF4444" strokeWidth="1.5"/>
            </svg>
            <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#B91C1C', fontWeight: 500 }}>
              {inputError}
            </p>
          </div>
        )}
      </div>

      {/* Stat pills */}
      <div
        className="flex items-center gap-3 mt-5 flex-wrap justify-center animate-fade-in"
        style={{ animationDelay: '0.44s', animationFillMode: 'both' }}
      >
        {[
          { val: PLATFORM_STATS.totalVerified, label: 'verificados',       bg: '#F0FDF9', color: '#065F46' },
          { val: PLATFORM_STATS.falseDetected, label: 'falsos detectados', bg: '#FFF5F5', color: '#B91C1C' },
          { val: `${PLATFORM_STATS.accuracy}%`,label: 'precisión',         bg: '#EFF6FF', color: '#1D4ED8' },
        ].map((s, i) => (
          <span
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: s.bg, border: 'none',
              borderRadius: '6px', padding: '5px 12px',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', letterSpacing: '0.04em',
            }}
          >
            <strong style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', fontWeight: 700, letterSpacing: 0, color: s.color }}>
              {s.val}
            </strong>
            <span style={{ color: '#94A3B8', textTransform: 'uppercase' }}>{s.label}</span>
          </span>
        ))}
      </div>

      {/* Trusted by */}
      <div
        className="animate-fade-in"
        style={{ animationDelay: '0.6s', animationFillMode: 'both', marginTop: '40px' }}
      >
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px',
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CBD5E1', marginBottom: '10px',
        }}>
          Repositorios científicos de referencia
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {['Nature', 'IPCC', 'WMO', 'Copernicus', 'Science', 'AGU', 'GLAMOS'].map(j => (
            <span key={j} style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
              fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em',
            }}>
              {j}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
