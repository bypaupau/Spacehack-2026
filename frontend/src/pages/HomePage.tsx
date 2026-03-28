// ─────────────────────────────────────────────────────────────────────────────
// HomePage — Peak News
// v4: Threads InputMode through AnalyzerInput → useAnalysis → api for smart
//     prototype case routing.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react'
import type { Analysis, InputMode }   from '../types'
import { useAnalysis }                from '../hooks/useAnalysis'
import { AnalyzerInput }              from '../components/analyzer/AnalyzerInput'
import { JournalistResultsView }      from '../components/results/JournalistResultsView'
import { LoadingSpinner }             from '../components/ui/LoadingSpinner'

interface HomePageProps {
  externalResult?:  Analysis | null
  onClearExternal?: () => void
}

export function HomePage({ externalResult, onClearExternal }: HomePageProps) {
  const { state, analysis, error, submit, reset } = useAnalysis()

  useEffect(() => {
    if (externalResult) reset()
  }, [externalResult])            // eslint-disable-line react-hooks/exhaustive-deps

  const displayedResult = analysis ?? externalResult
  const isActive        = state === 'loading' || state === 'success' || state === 'error' || !!externalResult

  const handleNewSubmit = (val: string, mode?: InputMode, platform?: string) => {
    onClearExternal?.()
    submit(val, mode, platform)
  }

  // Back: limpia análisis en curso Y la selección del sidebar
  const handleBack = () => {
    reset()
    onClearExternal?.()
  }

  return (
    <div className="relative min-h-screen">

      {/* ── HERO IDLE ────────────────────────────────────────────────────────── */}
      {!isActive && (
        <AnalyzerInput onSubmit={handleNewSubmit} disabled={false} compact={false} />
      )}

      {/* ── ACTIVE — barra compacta + resultados ──────────────────────────── */}
      {isActive && (
        <div className="relative z-10">
          {/* Compact search bar */}
          <AnalyzerInput
            onSubmit={handleNewSubmit}
            disabled={state === 'loading'}
            compact
          />

          {/* Loading */}
          {state === 'loading' && (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          )}

          {/* Error */}
          {state === 'error' && error && (
            <div className="max-w-2xl mx-auto px-6 py-6">
              <div
                className="card p-5 animate-fade-in"
                style={{
                  borderLeft: '3px solid #FCA5A5',
                  background: '#FEF2F2',
                }}
              >
                <p className="font-label text-[10px] mb-1" style={{ color: '#DC2626' }}>
                  Error al analizar
                </p>
                <p style={{ color: '#64748B', fontSize: '13px', fontFamily: "'IBM Plex Sans', sans-serif" }}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ── RESULTADO ────────────────────────────────────────────────── */}
          {state !== 'loading' && displayedResult && (
            <div className="px-4 py-4 pb-12">
              <JournalistResultsView
                analysis={displayedResult}
                onBack={handleBack}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
