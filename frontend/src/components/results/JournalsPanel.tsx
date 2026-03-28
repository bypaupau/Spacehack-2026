// ─────────────────────────────────────────────────────────────────────────────
// JournalsPanel — Peak News · Apple-style journal thumbnails
//
// Columna derecha, encima de "Fuentes Científicas".
// Muestra papers relevantes al contexto del claim + noticias GDELT.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { BookOpen, ExternalLink, Newspaper, Loader2, AlertCircle, ArrowUpRight } from 'lucide-react'
import {
  getRelevantPapers, buildGDELTQuery, GDELT_TIMESPAN,
  type ScientificPaper,
} from '../../services/journalService'

// ── Types ─────────────────────────────────────────────────────────────────────
interface GDELTArticle {
  url:         string
  title:       string
  seendate:    string
  domain:      string
  socialimage: string
}

// ── Journal Thumbnail — colored gradient with abbreviation ────────────────────
function JournalThumb({ abbr, color }: { abbr: string; color: string }) {
  const lines = abbr.includes(' ') ? abbr.split(' ') : [abbr]
  const fs    = lines[0].length > 4 ? '7px' : lines[0].length > 3 ? '8.5px' : '10px'

  return (
    <div style={{
      width:        '48px',
      height:       '48px',
      borderRadius: '10px',
      background:   `linear-gradient(145deg, ${color}EE 0%, ${color}88 100%)`,
      display:      'flex',
      alignItems:   'center',
      justifyContent:'center',
      flexShrink:   0,
      boxShadow:    `0 3px 10px ${color}35, 0 1px 3px rgba(0,0,0,0.12)`,
      flexDirection:'column',
      gap:          '1px',
    }}>
      {lines.map((line, i) => (
        <span key={i} style={{
          fontFamily:  line.length <= 3 ? "'Playfair Display', serif" : "'IBM Plex Sans', sans-serif",
          fontSize:    fs,
          fontWeight:  700,
          color:       'rgba(255,255,255,0.97)',
          lineHeight:  1.1,
          letterSpacing: '0.02em',
          textAlign:   'center',
        }}>
          {line}
        </span>
      ))}
    </div>
  )
}

// ── Paper Card — Apple News / Perplexity hybrid ───────────────────────────────
function PaperCard({ paper, index }: { paper: ScientificPaper; index: number }) {
  const [hov, setHov] = useState(false)
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      borderRadius: '10px',
      background:   hov ? '#F8FAFC' : '#FFFFFF',
      border:       `1px solid ${hov ? '#CBD5E1' : '#E2E8F0'}`,
      transition:   'all 0.15s',
      overflow:     'hidden',
      boxShadow:    hov ? '0 4px 16px rgba(15,23,42,0.07)' : '0 1px 3px rgba(15,23,42,0.04)',
    }}
    onMouseEnter={() => setHov(true)}
    onMouseLeave={() => setHov(false)}
    >
      {/* ── Main row ── */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px', cursor: 'pointer' }}
      >
        {/* Thumbnail */}
        <JournalThumb abbr={paper.journalAbbr} color={paper.accentColor} />

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Index + year + citations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{
              width: '16px', height: '16px', borderRadius: '4px',
              background: `${paper.accentColor}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px',
              fontWeight: 700, color: paper.accentColor, flexShrink: 0,
            }}>
              {index + 1}
            </span>
            <span style={{
              fontFamily:  "'IBM Plex Sans', sans-serif",
              fontSize:    '10px', fontWeight: 600, color: paper.accentColor,
              background:  `${paper.accentColor}10`,
              padding:     '1px 6px', borderRadius: '3px',
            }}>
              {paper.journal} · {paper.year}
            </span>
            <span style={{
              marginLeft:  'auto',
              fontFamily:  "'IBM Plex Mono', monospace",
              fontSize:    '9px', color: '#94A3B8',
              flexShrink:  0,
            }}>
              {paper.citationCount >= 1000
                ? `${(paper.citationCount/1000).toFixed(1)}k`
                : paper.citationCount} citas
            </span>
          </div>

          {/* Title */}
          <p style={{
            margin:      0,
            fontFamily:  "'IBM Plex Sans', sans-serif",
            fontSize:    '12.5px', fontWeight: 600, color: '#0F172A',
            lineHeight:  1.35,
            display:     '-webkit-box',
            WebkitLineClamp: open ? 99 : 2,
            WebkitBoxOrient: 'vertical',
            overflow:    'hidden',
          }}>
            {paper.title}
          </p>

          {/* Authors */}
          <p style={{
            margin:     '3px 0 0',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize:   '10px', color: '#64748B', fontStyle: 'italic',
          }}>
            {paper.authors}
          </p>
        </div>
      </div>

      {/* ── Expandable abstract + DOI ── */}
      {open && (
        <div style={{
          padding:    '0 12px 12px',
          borderTop:  '1px solid #F1F5F9',
          paddingTop: '10px',
          animation:  'fadeIn 0.2s ease',
        }}>
          <p style={{
            margin:     '0 0 10px',
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize:   '12px', color: '#334155', lineHeight: 1.6,
          }}>
            {paper.abstract}
          </p>
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display:        'inline-flex', alignItems: 'center', gap: '4px',
              fontFamily:     "'IBM Plex Mono', monospace",
              fontSize:       '9.5px', color: '#0284C7',
              textDecoration: 'none',
              padding:        '3px 8px', borderRadius: '4px',
              background:     '#EFF6FF', border: '1px solid #DBEAFE',
            }}
          >
            <ExternalLink size={9} />
            doi:{paper.doi}
            <ArrowUpRight size={9} />
          </a>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  )
}

// ── GDELT News ────────────────────────────────────────────────────────────────
function formatDate(seendate: string): string {
  try {
    const s = seendate.replace('T','').replace('Z','')
    return new Date(`${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  } catch { return '' }
}

function GDELTCard({ article }: { article: GDELTArticle }) {
  const [hov, setHov] = useState(false)
  const [imgErr, setImgErr] = useState(false)

  return (
    <a
      href={article.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', gap: '10px', alignItems: 'flex-start',
        padding: '10px', borderRadius: '8px',
        background: hov ? '#F8FAFC' : '#FFFFFF',
        border: '1px solid #E2E8F0',
        textDecoration: 'none', transition: 'all 0.14s',
        boxShadow: hov ? '0 2px 8px rgba(15,23,42,0.06)' : 'none',
      }}
    >
      {/* Thumbnail */}
      <div style={{
        width: '48px', height: '40px', flexShrink: 0,
        borderRadius: '6px', overflow: 'hidden',
        background: '#EFF6FF', border: '1px solid #DBEAFE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {article.socialimage && !imgErr
          ? <img src={article.socialimage} alt="" onError={() => setImgErr(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Newspaper size={14} color="#93C5FD" />
        }
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: '0 0 4px',
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: '11.5px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.title}
        </p>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#0284C7',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px',
          }}>
            {article.domain}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#94A3B8' }}>
            {formatDate(article.seendate)}
          </span>
        </div>
      </div>
    </a>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function JournalsPanel({ claimText }: { claimText: string }) {
  const papers = getRelevantPapers(claimText, 4)

  const [gdeltStatus,   setGdeltStatus]   = useState<'idle'|'loading'|'ok'|'error'>('idle')
  const [gdeltArticles, setGdeltArticles] = useState<GDELTArticle[]>([])

  useEffect(() => {
    if (!claimText) return
    setGdeltStatus('loading')
    const query   = buildGDELTQuery(claimText)
    const url     = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=4&format=json&TIMESPAN=${GDELT_TIMESPAN}&SORTBY=relevance`
    const ctrl    = new AbortController()
    const timer   = setTimeout(() => ctrl.abort(), 6000)
    fetch(url, { signal: ctrl.signal })
      .then(r => { clearTimeout(timer); return r.json() })
      .then((d: { articles?: GDELTArticle[] }) => {
        const arts = (d.articles ?? []).filter(a => a.title && a.url)
        setGdeltArticles(arts.slice(0, 4))
        setGdeltStatus(arts.length > 0 ? 'ok' : 'error')
      })
      .catch(() => { clearTimeout(timer); setGdeltStatus('error') })
  }, [claimText])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ── Papers ────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: '10px', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <BookOpen size={13} color="#64748B" strokeWidth={2} />
          <span style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '11px', fontWeight: 700, color: '#64748B',
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Literatura Científica Relevante
          </span>
          <span style={{
            marginLeft: 'auto',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px', color: '#0284C7',
            background: '#EFF6FF', padding: '2px 7px', borderRadius: '10px',
            fontWeight: 600,
          }}>
            {papers.length} papers
          </span>
        </div>
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {papers.map((p, i) => <PaperCard key={p.id} paper={p} index={i} />)}
        </div>
      </div>

      {/* ── GDELT ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: '10px', boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid #E2E8F0',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <Newspaper size={13} color="#64748B" strokeWidth={2} />
          <div>
            <span style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: '11px', fontWeight: 700, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              display: 'block',
            }}>
              Contexto Noticioso
            </span>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '9.5px', color: '#94A3B8' }}>
              Últimos {GDELT_TIMESPAN} días · GDELT Project
            </span>
          </div>
        </div>
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {gdeltStatus === 'loading' && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '10px', color: '#64748B' }}>
              <Loader2 size={12} color="#0284C7" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px' }}>Consultando GDELT…</span>
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {gdeltStatus === 'ok' && gdeltArticles.map((a, i) => <GDELTCard key={i} article={a} />)}
          {(gdeltStatus === 'error' || (gdeltStatus === 'ok' && !gdeltArticles.length)) && (
            <div style={{
              display: 'flex', gap: '8px', alignItems: 'flex-start',
              padding: '10px 12px', background: '#FFF7ED',
              border: '1px solid #FED7AA', borderRadius: '6px',
            }}>
              <AlertCircle size={12} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#92400E' }}>
                Sin resultados en GDELT para este tema en los últimos 30 días.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
