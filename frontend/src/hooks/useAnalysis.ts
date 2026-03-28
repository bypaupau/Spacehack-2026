// ─────────────────────────────────────────────────────────────────────────────
// useAnalysis — manages the full lifecycle of a single analysis request
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import type { Analysis, InputMode } from '../types'
import { analyzeContent } from '../services/api'

export type AnalysisState = 'idle' | 'loading' | 'success' | 'error'

interface UseAnalysisReturn {
  state:    AnalysisState
  analysis: Analysis | null
  error:    string | null
  submit:   (input: string, mode?: InputMode, platform?: string) => Promise<void>
  reset:    () => void
}

export function useAnalysis(): UseAnalysisReturn {
  const [state,    setState]    = useState<AnalysisState>('idle')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error,    setError]    = useState<string | null>(null)

  const submit = useCallback(async (input: string, mode?: InputMode, platform?: string) => {
    if (!input.trim()) return
    setState('loading')
    setAnalysis(null)
    setError(null)

    const res = await analyzeContent(input, mode, platform)

    if (res.ok && res.data) {
      setAnalysis(res.data)
      setState('success')
    } else {
      setError(res.error ?? 'Error desconocido al analizar el contenido.')
      setState('error')
    }
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setAnalysis(null)
    setError(null)
  }, [])

  return { state, analysis, error, submit, reset }
}
