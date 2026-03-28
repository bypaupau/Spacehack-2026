// ─────────────────────────────────────────────────────────────────────────────
// LoadingSpinner — Peak News (Editorial Style)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'

const STEPS = [
  'Extracting climate affirmations from text...',
  'Consulting satellites Sentinel-2 and Landsat...',
  'Fact checking through Journals..',
  'Calculating Veracity Score...'
]

export function LoadingSpinner() {
  const [activeStep, setActiveStep] = useState(0)

  // Efecto para simular el avance de los pasos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev))
    }, 800)
    return () => clearInterval(interval)
  }, [])

  return (
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '40px auto' }}>
        <div style={{
          background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px',
          padding: '32px', boxShadow: '0 4px 20px rgba(15,23,42,0.04)', display: 'flex',
          flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>

          {/* Spinner elegante */}
          <div style={{ position: 'relative', width: '48px', height: '48px', marginBottom: '20px' }}>
            <svg style={{ animation: 'spin 1.5s linear infinite', width: '100%', height: '100%', color: '#0284C7' }} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#E0F2FE" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h3 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 700,
            color: '#0F172A', marginBottom: '8px', lineHeight: 1.2
          }}>
            Analysing content
          </h3>
          <p style={{
            fontFamily: "system-ui, sans-serif", fontSize: '13px', color: '#64748B', marginBottom: '24px'
          }}>
            Cross-referencing with real-time satellite records
          </p>

          {/* Pasos animados */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            {STEPS.map((step, i) => {
              const isActive = i === activeStep
              const isDone = i < activeStep
              return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    opacity: isActive || isDone ? 1 : 0.4, transition: 'opacity 0.3s'
                  }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                      background: isDone ? '#059669' : isActive ? '#E0F2FE' : '#F1F5F9',
                      border: isActive ? '2px solid #0284C7' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {isDone && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <span style={{
                      fontFamily: "system-ui, sans-serif", fontSize: '13px',
                      color: isActive ? '#0F172A' : '#64748B', fontWeight: isActive ? 500 : 400
                    }}>
                  {step}
                </span>
                  </div>
              )
            })}
          </div>
        </div>
      </div>
  )
}