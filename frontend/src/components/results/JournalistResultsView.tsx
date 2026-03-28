// ─────────────────────────────────────────────────────────────────────────────
// JournalistResultsView — Peak News · Scientific Newsroom edition
//
// v6 — Perplexity-style layout:
//   - Verdict strip + inline key stats (real GEE/CSV data)
//   - Rich narrative paragraphs with inline [n] citations
//   - Satellite before/after (full-width, prominent)
//   - Charts gallery with numbered scientific explanations (wireframe-inspired)
//   - Related articles & videos section
//   - Collapsible sources panel
//   - Zero purple, zero box-itis
// ─────────────────────────────────────────────────────────────────────────────

import { useState }            from 'react'
import {
  Brain, BookOpen, FileSearch, Newspaper,
  ExternalLink, AlertTriangle, CheckCircle2, AlertCircle, Clock,
  Layers, ArrowLeft, ArrowRight, Satellite, Repeat2, Heart, MessageCircle,
  ArrowUp, ChevronDown, ChevronUp, PlayCircle, type LucideIcon
} from 'lucide-react'
import type { Analysis, VerdictType, SourceCardData } from '../../types'
import { SatelliteMap }     from '../map/SatelliteMap'
import { SatelliteCompare } from '../map/SatelliteCompare'
import { TrendChart }       from '../map/TrendChart'
import { JournalsPanel }    from './JournalsPanel'

// ── Verdict config ─────────────────────────────────────────────────────────────
const VC: Record<VerdictType, {
  label: string; Icon: LucideIcon; color: string; bg: string; stripe: string
}> = {
  false:      { label: 'FALSO',      Icon: AlertTriangle, color: '#B91C1C', bg: '#FFF5F5', stripe: '#C0392B' },
  verified:   { label: 'VERIFICADO', Icon: CheckCircle2,  color: '#065F46', bg: '#F0FDF9', stripe: '#059669' },
  misleading: { label: 'ENGAÑOSO',   Icon: AlertCircle,   color: '#92400E', bg: '#FFFBEB', stripe: '#D97706' },
  pending:    { label: 'ANALIZANDO', Icon: Clock,         color: '#4A5A72', bg: '#F5F7FA', stripe: '#8FA3BF' },
}

const floatCard: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 1px 4px rgba(13,28,56,0.04), 0 6px 20px rgba(13,28,56,0.06)',
}

const TRUSTED_JOURNALS = [
  { abbr: 'Nature',     full: 'Nature Climate Change',            url: 'https://nature.com/nclimate',              color: '#E53E3E' },
  { abbr: 'IPCC',       full: 'IPCC Sixth Assessment Report',     url: 'https://ipcc.ch/report/ar6',               color: '#2B6CB0' },
  { abbr: 'WMO',        full: 'World Meteorological Organization', url: 'https://wmo.int',                          color: '#276749' },
  { abbr: 'Copernicus', full: 'Copernicus C3S',                   url: 'https://climate.copernicus.eu',            color: '#6B46C1' },
  { abbr: 'Science',    full: 'Science / AAAS',                   url: 'https://science.org',                      color: '#C05621' },
  { abbr: 'AGU',        full: 'Geophysical Research Letters',     url: 'https://agupubs.onlinelibrary.wiley.com',  color: '#285E61' },
]

// ── SectionLabel ───────────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, children }: { icon: LucideIcon, children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '16px' }}>
      <Icon size={14} strokeWidth={2.2} color="#4A5A72" />
      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#4A5A72', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800 }}>
        {children}
      </span>
    </div>
  )
}

// ── SourceCard ─────────────────────────────────────────────────────────────────
function SourceCard({ analysis }: { analysis: Analysis }) {
  const { inputMode, platform, input, sourceCard } = analysis

  if (inputMode === 'social' && platform === 'twitter' && sourceCard) {
    const sc = sourceCard as SourceCardData
    return (
      <div style={{ ...floatCard, padding: '18px 22px', marginBottom: '16px', background: '#FAFAFA' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#0D1F38', color: '#fff', fontSize: '13px', fontWeight: 900, flexShrink: 0, fontFamily: 'serif' }}>𝕏</span>
          <div>
            <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', fontWeight: 700, color: '#0D1F38' }}>{sc.username}</p>
            <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#8FA3BF' }}>{sc.handle} · {sc.postedAt}</p>
          </div>
          <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#8FA3BF', letterSpacing: '0.07em', textTransform: 'uppercase' }}>Post original · analizado</span>
        </div>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15px', color: '#1A2E47', lineHeight: 1.65, margin: '0 0 14px 0' }}>{sc.content}</p>
        <div style={{ display: 'flex', gap: '18px', paddingTop: '10px', borderTop: '1px solid #F0F0F0' }}>
          {[
            { Icon: Repeat2, val: sc.retweets?.toLocaleString('es-ES') ?? '—', label: 'Reposts' },
            { Icon: Heart,   val: sc.likes?.toLocaleString('es-ES')    ?? '—', label: 'Likes'   },
            { Icon: MessageCircle, val: sc.replies?.toLocaleString('es-ES')  ?? '—', label: 'Replies' },
          ].map(m => (
            <span key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#4A5A72' }}>
              <m.Icon size={13} strokeWidth={1.8} color="#8FA3BF" />
              <strong style={{ color: '#0D1F38' }}>{m.val}</strong>
              <span style={{ color: '#8FA3BF', fontSize: '11px' }}>{m.label}</span>
            </span>
          ))}
          <a href={input} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#1D4ED8', fontSize: '11px', fontFamily: "'IBM Plex Sans', sans-serif", textDecoration: 'none' }}>
            <ExternalLink size={11} /> Ver post
          </a>
        </div>
      </div>
    )
  }

  if (inputMode === 'social' && platform === 'reddit' && sourceCard) {
    const sc = sourceCard as SourceCardData
    return (
      <div style={{ ...floatCard, padding: '18px 22px', marginBottom: '16px', background: '#FFF8F5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 800, color: '#C2410C' }}>r/{(sc.subreddit ?? 'climate').replace('r/', '')}</span>
          <span style={{ color: '#8FA3BF', fontSize: '12px' }}>· u/{sc.username}</span>
        </div>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15px', color: '#1A2E47', lineHeight: 1.65, margin: '0 0 10px 0' }}>{sc.content}</p>
        <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', borderTop: '1px solid #F5EDE8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#4A5A72', fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <ArrowUp size={13} strokeWidth={1.8} color="#C2410C" />
            <strong style={{ color: '#0D1F38' }}>{sc.upvotes?.toLocaleString('es-ES')}</strong>
            <span style={{ color: '#8FA3BF', fontSize: '11px' }}>upvotes</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#4A5A72', fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <MessageCircle size={13} strokeWidth={1.8} color="#8FA3BF" />
            <strong style={{ color: '#0D1F38' }}>{sc.comments?.toLocaleString('es-ES')}</strong>
            <span style={{ color: '#8FA3BF', fontSize: '11px' }}>comments</span>
          </span>
        </div>
      </div>
    )
  }

  if (inputMode === 'article' && sourceCard) {
    const sc = sourceCard as SourceCardData
    return (
      <div style={{ ...floatCard, padding: '18px 22px', marginBottom: '16px', background: '#F8FAFE' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#EFF6FF', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#1D4ED8', fontWeight: 700 }}>{sc.domain}</span>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#8FA3BF' }}>{sc.publication} · {sc.publishedAt}</span>
          {sc.author && <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#8FA3BF' }}>· {sc.author}</span>}
          <a href={input} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: '#1D4ED8', fontSize: '11px', fontFamily: "'IBM Plex Sans', sans-serif", textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <ExternalLink size={11} /> Ver artículo
          </a>
        </div>
        {sc.excerpt && (
          <blockquote style={{ margin: 0, padding: '12px 16px', background: '#F0F4FC', borderRadius: '8px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14px', color: '#334155', lineHeight: 1.70, fontStyle: 'normal', fontWeight: 400, borderLeft: '3px solid #BFCDE0' }}>
            {sc.excerpt}
          </blockquote>
        )}
      </div>
    )
  }

  // Statement — no purple: neutral tint
  return (
    <div style={{ ...floatCard, padding: '18px 22px', marginBottom: '16px', background: '#F8FAFC' }}>
      <p style={{ margin: '0 0 10px 0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#8FA3BF', textTransform: 'uppercase', letterSpacing: '0.09em', fontWeight: 700 }}>
        Afirmación analizada
      </p>
      <blockquote style={{ margin: 0, padding: '12px 16px', background: '#EEF2F7', borderRadius: '8px', fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#1E293B', lineHeight: 1.65, fontStyle: 'italic' }}>
        "{input}"
      </blockquote>
    </div>
  )
}

// ── GEEImagePanel ─────────────────────────────────────────────────────────────
function GEEImagePanel({ beforeUrl, afterUrl, beforeYear, afterYear, location }: {
  beforeUrl: string; afterUrl: string; beforeYear: number; afterYear: number; location: string
}) {
  const [expanded, setExpanded] = useState<'before' | 'after' | null>(null)

  const Panel = ({ url, year, label, isAfter }: { url: string; year: number; label: string; isAfter: boolean }) => {
    const [loaded, setLoaded] = useState(false)
    const accentColor = isAfter ? '#B91C1C' : '#1D4ED8'
    return (
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          onClick={() => setExpanded(prev => prev === (isAfter ? 'after' : 'before') ? null : (isAfter ? 'after' : 'before'))}
          style={{ borderRadius: '10px', overflow: 'hidden', cursor: 'zoom-in', background: '#0D1F38', boxShadow: isAfter ? '0 2px 12px rgba(185,28,28,0.18)' : '0 2px 12px rgba(29,78,216,0.14)' }}
        >
          <div style={{ padding: '7px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: isAfter ? 'rgba(185,28,28,0.12)' : 'rgba(29,78,216,0.10)' }}>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', fontWeight: 700, color: accentColor, letterSpacing: '0.04em' }}>{label}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', fontWeight: 700, color: accentColor }}>{year}</span>
          </div>
          <div style={{ position: 'relative', minHeight: '200px' }}>
            <img src={url} alt={`Imagen satelital ${year}`} onLoad={() => setLoaded(true)}
              style={{ width: '100%', display: 'block', maxHeight: expanded === (isAfter ? 'after' : 'before') ? '380px' : '240px', minHeight: '200px', objectFit: 'cover', transition: 'max-height 0.3s ease', opacity: loaded ? 1 : 0 }}
            />
            {loaded && (
              <>
                <div style={{ position: 'absolute', top: '6px', left: '6px', padding: '2px 7px', background: 'rgba(13,31,56,0.80)', borderRadius: '4px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: isAfter ? '#FCA5A5' : '#93C5FD' }}>
                  GEE · Landsat 8 / Sentinel-2 · {year}
                </div>
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', padding: '2px 7px', background: 'rgba(13,31,56,0.70)', borderRadius: '4px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', color: '#8FA3BF' }}>
                  click para ampliar
                </div>
              </>
            )}
          </div>
        </div>
        <button onClick={() => window.open(url, '_blank')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', padding: '6px 8px', background: '#F5F7FA', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '10.5px', color: '#4A5A72', transition: 'background 0.15s', width: '100%' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#EEF2F7')}
          onMouseLeave={e => (e.currentTarget.style.background = '#F5F7FA')}
        >
          <ExternalLink size={10} color="#8FA3BF" /> Descargar imagen · {year}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ padding: '10px 14px', background: '#EFF6FF', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 2px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', fontWeight: 700, color: '#0D1F38' }}>Imágenes satelitales reales — Google Earth Engine</p>
        <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#4A5A72', lineHeight: 1.5 }}>
          {location}. BLANCO/AZUL = nieve o hielo · GRIS/MARRÓN = roca expuesta (antes glaciar) · AZUL OSCURO = lago de deshielo formado tras el retroceso.
        </p>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch' }}>
        <Panel url={beforeUrl} year={beforeYear} label="ANTES"   isAfter={false} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#8FA3BF' }}>
          <ArrowRight size={20} strokeWidth={1.5} />
        </div>
        <Panel url={afterUrl}  year={afterYear}  label="DESPUÉS" isAfter={true} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', background: '#F5F7FA', borderRadius: '6px' }}>
        <Satellite size={11} color="#8FA3BF" />
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#8FA3BF', fontWeight: 600 }}>
          Google Earth Engine · Landsat 8 (USGS) / Sentinel-2 (ESA) · Scripts GEE para Peak News
        </span>
      </div>
    </div>
  )
}

// ── SourceChip ─────────────────────────────────────────────────────────────────
function SourceChip({ n, name, url, type, reliability }: { n: number; name: string; url: string; type: string; reliability: number }) {
  const [hov, setHov] = useState(false)
  const rColor = reliability >= 90 ? '#065F46' : reliability >= 70 ? '#92400E' : '#B91C1C'
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '11px', borderRadius: '8px', background: hov ? '#F5F7FA' : '#FFFFFF', boxShadow: hov ? '0 2px 10px rgba(13,28,56,0.08)' : '0 1px 4px rgba(13,28,56,0.04)', textDecoration: 'none', transition: 'all 0.14s' }}
    >
      <span style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '4px', background: '#EFF6FF', color: '#1D4ED8', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0D1F38', fontFamily: "'IBM Plex Sans', sans-serif", margin: '0 0 3px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
        <p style={{ fontSize: '10px', color: '#8FA3BF', fontFamily: "'IBM Plex Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px 0', fontWeight: 600 }}>{type}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ExternalLink size={10} color="#1D4ED8" />
          <span style={{ fontSize: '11px', color: '#1D4ED8', fontFamily: "'IBM Plex Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>{url.replace('https://', '').split('/')[0]}</span>
          <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '11px', color: rColor, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>{reliability}%</span>
        </div>
      </div>
    </a>
  )
}

// ── RichNarrative — renders bold (**text**) and citation markers ([n]) ─────────
function RichNarrative({ text }: { text: string }) {
  // Split paragraphs then render each with inline bold + citations
  const paragraphs = text.split('\n\n')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {paragraphs.map((para, pi) => {
        // tokenize: **bold**, [n] citations, rest plain
        const parts: React.ReactNode[] = []
        let remaining = para
        let key = 0
        while (remaining.length > 0) {
          const boldMatch  = remaining.match(/\*\*(.+?)\*\*/)
          const citeMatch  = remaining.match(/\[(\d+)\]/)
          const firstBold  = boldMatch  ? remaining.indexOf(boldMatch[0])  : Infinity
          const firstCite  = citeMatch  ? remaining.indexOf(citeMatch[0])  : Infinity
          const first      = Math.min(firstBold, firstCite)

          if (first === Infinity) {
            parts.push(<span key={key++}>{remaining}</span>)
            break
          }
          if (first > 0) {
            parts.push(<span key={key++}>{remaining.slice(0, first)}</span>)
          }
          if (firstBold <= firstCite && boldMatch) {
            parts.push(<strong key={key++} style={{ color: '#0D1F38', fontWeight: 700 }}>{boldMatch[1]}</strong>)
            remaining = remaining.slice(first + boldMatch[0].length)
          } else if (citeMatch) {
            parts.push(
              <sup key={key++} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#1D4ED8', fontWeight: 700, marginLeft: '1px', cursor: 'default' }}>
                [{citeMatch[1]}]
              </sup>
            )
            remaining = remaining.slice(first + citeMatch[0].length)
          } else {
            break
          }
        }
        return (
          <p key={pi} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15.5px', color: '#1A2E47', lineHeight: 1.70, fontWeight: 400, margin: 0 }}>
            {parts}
          </p>
        )
      })}
    </div>
  )
}

// ── RelatedMedia — thumbnail cards ─────────────────────────────────────────────
function RelatedMediaSection({ items }: { items: NonNullable<Analysis['relatedMedia']> }) {
  // Deterministic gradient per source initial
  const thumbGradient = (source: string, type: string) => {
    if (type === 'video')  return 'linear-gradient(135deg, #1E3A5F 0%, #1D4ED8 100%)'
    if (type === 'report') return 'linear-gradient(135deg, #064E3B 0%, #059669 100%)'
    // article — vary by source
    const h = source.charCodeAt(0) % 4
    const grads = [
      'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
      'linear-gradient(135deg, #422006 0%, #92400E 100%)',
      'linear-gradient(135deg, #1E1B4B 0%, #3730A3 100%)',
      'linear-gradient(135deg, #0C1A2E 0%, #1D4ED8 100%)',
    ]
    return grads[h]
  }
  const typeColor = (t: string) => {
    if (t === 'video')  return '#1D4ED8'
    if (t === 'report') return '#065F46'
    return                     '#92400E'
  }
  const typeBg = (t: string) => {
    if (t === 'video')  return '#EFF6FF'
    if (t === 'report') return '#F0FDF9'
    return                     '#FFFBEB'
  }
  const typeLabel = (t: string) => ({ video: 'Video', report: 'Informe', article: 'Artículo' }[t] ?? t)
  const typeIcon = (t: string) => {
    if (t === 'video')  return <PlayCircle size={11} color={typeColor(t)} />
    if (t === 'report') return <BookOpen   size={11} color={typeColor(t)} />
    return                     <Newspaper  size={11} color={typeColor(t)} />
  }

  return (
    <div style={{ ...floatCard, padding: '20px 24px' }}>
      <SectionLabel icon={Newspaper}>Artículos y Medios Relacionados</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'stretch', gap: '0', borderRadius: '10px', background: '#FFFFFF', textDecoration: 'none', overflow: 'hidden', boxShadow: '0 1px 3px rgba(13,28,56,0.05)', transition: 'box-shadow 0.14s, transform 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(13,28,56,0.10)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(13,28,56,0.05)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            {/* Thumbnail — colored gradient block */}
            <div style={{ width: '76px', flexShrink: 0, background: thumbGradient(item.source, item.type), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', minHeight: '72px' }}>
              {/* Source initial */}
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: 800, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>
                {item.source.charAt(0).toUpperCase()}
              </span>
              {item.type === 'video' && (
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayCircle size={12} color="rgba(255,255,255,0.9)" />
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px', borderLeft: '1px solid #F0F4FA' }}>
              {/* Type badge */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', background: typeBg(item.type), alignSelf: 'flex-start' }}>
                {typeIcon(item.type)}
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '8px', fontWeight: 800, color: typeColor(item.type), textTransform: 'uppercase', letterSpacing: '0.07em' }}>{typeLabel(item.type)}</span>
              </span>
              <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0D1F38', lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{item.title}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#8FA3BF', fontWeight: 600 }}>{item.source}</span>
                {item.date && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#C8D3E0' }}>· {item.date}</span>}
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', paddingRight: '14px', color: '#C8D3E0', flexShrink: 0 }}>
              <ExternalLink size={13} />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── CollapsibleSources ─────────────────────────────────────────────────────────
function CollapsibleSources({ sources, journals }: { sources: Analysis['sources']; journals: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ ...floatCard, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(s => !s)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <BookOpen size={14} strokeWidth={2} color="#4A5A72" />
        <span style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#4A5A72', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 800 }}>
          Fuentes utilizadas · {sources.length} repositorios + literatura peer-reviewed
        </span>
        {open
          ? <ChevronUp   size={16} color="#8FA3BF" />
          : <ChevronDown size={16} color="#8FA3BF" />
        }
      </button>
      {open && (
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.2s ease' }}>
          {/* Scientific sources */}
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#C8D3E0', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Datos satelitales y monitoreo</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {sources.map((src, i) => <SourceChip key={src.name} n={i + 1} name={src.name} url={src.url} type={src.type} reliability={src.reliability} />)}
            </div>
          </div>

          {/* Journals panel embedded */}
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#C8D3E0', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Literatura científica relevante</p>
            {journals}
          </div>

          {/* Trusted repos */}
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#C8D3E0', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '10px' }}>Repositorios de confianza</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {TRUSTED_JOURNALS.map(j => (
                <a key={j.abbr} href={j.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 10px', borderRadius: '6px', background: '#F5F7FA', textDecoration: 'none', transition: 'background 0.14s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#EEF2F7')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#F5F7FA')}
                >
                  <span style={{ flexShrink: 0, width: '8px', height: '8px', borderRadius: '50%', background: j.color }} />
                  <span style={{ flex: 1, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#0D1F38' }}>{j.full}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 700, color: j.color, flexShrink: 0 }}>{j.abbr}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function JournalistResultsView({ analysis, onBack }: { analysis: Analysis, onBack?: () => void }) {
  const { verdict, score, headline, summary, claims, satellite, sources, nlp, input, dataStats, richNarrative, relatedMedia } = analysis
  const vc = VC[verdict]; const VerdictIcon = vc.Icon
  const analyzedDate = new Date(analysis.analyzedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  const hasRealImages = !!(satellite.geeBeforeUrl && satellite.geeAfterUrl)

  // Chart explanations based on chartUrls count
  const chartDescriptions = [
    { n: 1, text: 'Tendencia anual de cobertura nival (hectáreas). La línea naranja es la regresión lineal que confirma el descenso estadísticamente significativo a lo largo del período de estudio.' },
    { n: 2, text: 'Cambio neto de inicio vs. final del período. Las barras muestran el volumen inicial (año base) frente al volumen final, con el porcentaje de pérdida neta calculado a partir de los píxeles Landsat 8.' },
    { n: 3, text: 'Comparación por década. Cada barra agrupa el promedio de cobertura nival de una década completa, permitiendo visualizar la aceleración del declive entre los años 2000 y 2020.' },
    { n: 4, text: 'Fact-check visual. Mapa de calor generado con GEE que superpone la zona de retroceso glaciar (rojo) sobre la imagen satelital actual. La extensión roja indica el área de roca expuesta donde antes había hielo.' },
  ]

  return (
    <div className="animate-slide-up" style={{ maxWidth: '1100px', margin: '0 auto' }}>

      {/* ── BACK ─────────────────────────────────────────────────────────────── */}
      {onBack && (
        <div style={{ marginBottom: '14px' }}>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 600, color: '#8FA3BF', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#1D4ED8'; el.style.background = '#EFF6FF' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = '#8FA3BF'; el.style.background = 'transparent' }}
          >
            <ArrowLeft size={11} strokeWidth={2.2} /> Nueva verificación
          </button>
        </div>
      )}

      {/* ── SOURCE CARD ──────────────────────────────────────────────────────── */}
      <SourceCard analysis={analysis} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>

        {/* ════════ COLUMNA PRINCIPAL ════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── VERDICT HERO — colored left accent (verdict indicator) ───────── */}
          <div style={{ ...floatCard, borderLeft: `5px solid ${vc.stripe}`, padding: '22px 28px' }}>
            {/* Verdict badge + score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: vc.bg, borderRadius: '6px', padding: '5px 12px', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', fontWeight: 800, color: vc.color, letterSpacing: '0.05em' }}>
                <VerdictIcon size={14} strokeWidth={2.5} /> {vc.label}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '14px', color: vc.color, fontWeight: 700 }}>{score}/100</span>
              <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#8FA3BF' }}>
                Analizado: {analyzedDate}
              </span>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: '#0D1F38', lineHeight: 1.28, margin: '0 0 18px 0', letterSpacing: '-0.01em' }}>
              {headline}
            </h2>

            {/* ── Key stats strip — real GEE data ── */}
            {dataStats && dataStats.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {dataStats.map((s, i) => (
                  <div key={i} style={{ flex: '1 1 140px', padding: '10px 14px', background: '#F5F7FA', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '2px' }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 800, color: s.trend === 'down' ? vc.color : '#065F46', lineHeight: 1 }}>
                        {s.value}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#1A2E47', lineHeight: 1.3 }}>{s.label}</p>
                    {s.sublabel && <p style={{ margin: '1px 0 0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#8FA3BF', lineHeight: 1.4 }}>{s.sublabel}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── NARRATIVE — Perplexity-style, data-dense with citations ─────── */}
          <div style={{ ...floatCard, padding: '22px 28px' }}>
            <SectionLabel icon={Brain}>Análisis</SectionLabel>
            {richNarrative
              ? <RichNarrative text={richNarrative} />
              : <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '15.5px', color: '#1A2E47', lineHeight: 1.70, margin: 0 }}>{summary}</p>
            }
          </div>

          {/* ── SATELLITE IMAGES ─────────────────────────────────────────────── */}
          <div style={{ ...floatCard, padding: '20px 24px' }}>
            <SectionLabel icon={Satellite}>Evidencia Satelital · Comparación Temporal</SectionLabel>
            {hasRealImages ? (
              <GEEImagePanel
                beforeUrl={satellite.geeBeforeUrl!}
                afterUrl={satellite.geeAfterUrl!}
                beforeYear={satellite.geeBeforeYear ?? satellite.baselineYear}
                afterYear={satellite.geeAfterYear ?? 2025}
                location={satellite.geeLocation ?? satellite.images?.[0]?.location ?? 'Alpes'}
              />
            ) : (
              <SatelliteCompare
                claimText={input}
                location={satellite.images?.[0]?.location ?? 'Alpes Suizos'}
                beforeYear={satellite.baselineYear ?? 1990}
                afterYear={2024}
              />
            )}
          </div>

          {/* ── CHARTS + NUMBERED EXPLANATIONS (wireframe-inspired) ──────────── */}
          {satellite.chartUrls && satellite.chartUrls.length > 0 && (
            <div style={{ ...floatCard, padding: '20px 24px' }}>
              <SectionLabel icon={Brain}>Gráficos GEE · Análisis Estadístico</SectionLabel>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#4A5A72', marginBottom: '14px', lineHeight: 1.5 }}>
                Gráficos generados con Google Earth Engine a partir de datos Landsat 8 y Sentinel-2. Desplaza para ver el análisis completo.
              </p>
              {/* Chart gallery */}
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px' }}>
                {satellite.chartUrls.map((url, i) => (
                  <img key={i} src={url} alt={`Análisis GEE ${i + 1}`} onClick={() => window.open(url, '_blank')}
                    style={{ height: '210px', width: 'auto', borderRadius: '10px', flexShrink: 0, cursor: 'zoom-in', boxShadow: '0 1px 4px rgba(13,28,56,0.06)', transition: 'box-shadow 0.15s, transform 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,28,56,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(13,28,56,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  />
                ))}
              </div>

              {/* Numbered chart explanations — exactly like the wireframe */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {satellite.chartUrls.slice(0, chartDescriptions.length).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', fontWeight: 800, color: '#1D4ED8' }}>
                      {chartDescriptions[i].n}
                    </span>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', color: '#4A5A72', lineHeight: 1.6, margin: 0 }}>
                      {chartDescriptions[i].text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HISTORICAL TREND CHART ───────────────────────────────────────── */}
          <div style={{ ...floatCard, padding: '20px 24px' }}>
            <SectionLabel icon={Brain}>Serie Histórica · Cobertura Nival</SectionLabel>
            <TrendChart claimText={input} location={satellite.images?.[0]?.location ?? 'Alpes Suizos'} />
          </div>

          {/* ── LOCATION MAP ─────────────────────────────────────────────────── */}
          <div style={{ ...floatCard, padding: '20px 24px' }}>
            <SectionLabel icon={Layers}>{`Localización · ${satellite.images?.[0]?.location ?? 'Alpes'}`}</SectionLabel>
            <SatelliteMap location={satellite.images?.[0]?.location ?? 'Alpes Suizos'} glacierRetreat={satellite.glacierRetreat} snowCoverage={satellite.snowCoverage} coverageTrend={satellite.coverageTrend} baselineYear={satellite.baselineYear} />
          </div>

          {/* ── NLP ANALYSIS ─────────────────────────────────────────────────── */}
          <div style={{ ...floatCard, padding: '22px 28px' }}>
            <SectionLabel icon={Brain}>Análisis Narrativo · Patrón de Desinformación</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#8FA3BF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Tipo detectado</span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '13px', fontWeight: 700, color: vc.color, background: vc.bg, borderRadius: '5px', padding: '4px 12px' }}>
                {nlp.narrativeType}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {nlp.scores.map(s => {
                const barColor = s.value > 60 ? '#B91C1C' : s.value > 30 ? '#92400E' : '#065F46'
                return (
                  <div key={s.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#4A5A72', fontWeight: 600 }}>{s.label}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontWeight: 700, color: barColor }}>{s.value}%</span>
                    </div>
                    <div style={{ height: '5px', borderRadius: '3px', background: '#EEF2F7', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '3px', width: `${s.value}%`, background: barColor, transition: 'width 0.9s ease-out' }} />
                    </div>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '11px', color: '#8FA3BF', marginTop: '3px' }}>{s.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── CLAIMS ───────────────────────────────────────────────────────── */}
          <div style={{ ...floatCard, padding: '22px 28px' }}>
            <SectionLabel icon={FileSearch}>Afirmaciones Detectadas</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {claims.map((claim, i) => (
                <div key={claim.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', padding: '13px 15px', borderRadius: '8px', background: vc.bg }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 800, color: vc.color, flexShrink: 0, minWidth: '24px' }}>#{i + 1}</span>
                  <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '14.5px', color: '#1A2E47', lineHeight: 1.5, margin: 0 }}>{claim.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLLAPSIBLE SOURCES (antes de related news — son cosas distintas) ── */}
          <CollapsibleSources sources={sources} journals={<JournalsPanel claimText={input} />} />

          {/* ── RELATED MEDIA ────────────────────────────────────────────────── */}
          {relatedMedia && relatedMedia.length > 0 && (
            <RelatedMediaSection items={relatedMedia} />
          )}

        </div>

        {/* ════════ COLUMNA DERECHA ════════ */}
        <div style={{ position: 'sticky', top: '72px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Quick satellite stats */}
          <div style={{ ...floatCard, padding: '18px 20px' }}>
            <SectionLabel icon={Satellite}>Indicadores Satelitales</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Retroceso glaciar', value: `${satellite.glacierRetreat}%`, note: `desde ${satellite.baselineYear}` },
                { label: 'Cobertura nival',   value: `${satellite.snowCoverage}%`,   note: 'año actual' },
                { label: 'Tendencia',         value: `${satellite.coverageTrend > 0 ? '+' : ''}${satellite.coverageTrend}%`, note: `vs. ${satellite.baselineYear}` },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#4A5A72', fontWeight: 500 }}>{m.label}</p>
                    <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#C8D3E0' }}>{m.note}</p>
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px', fontWeight: 800, color: parseFloat(m.value) < 0 ? '#B91C1C' : '#065F46' }}>
                    {m.value}
                  </span>
                </div>
              ))}
              {/* NDVI */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <p style={{ margin: 0, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', color: '#4A5A72', fontWeight: 500 }}>Índice NDVI</p>
                  <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#C8D3E0' }}>vegetación / hielo</p>
                </div>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '16px', fontWeight: 800, color: '#1D4ED8' }}>{satellite.ndviIndex}</span>
              </div>
            </div>
          </div>

          {/* NLP keywords */}
          <div style={{ ...floatCard, padding: '18px 20px' }}>
            <SectionLabel icon={Brain}>Palabras Clave Detectadas</SectionLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {nlp.topKeywords.map(kw => (
                <span key={kw} style={{ padding: '3px 10px', borderRadius: '20px', background: vc.bg, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: vc.color }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Veracity standard scale */}
          <div style={{ ...floatCard, padding: '18px 20px' }}>
            <SectionLabel icon={AlertCircle}>Escala de Veracidad</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { min: 80, label: 'Verificado',         color: '#065F46', bg: '#F0FDF9' },
                { min: 50, label: 'Mayormente cierto',  color: '#0369A1', bg: '#EFF6FF' },
                { min: 30, label: 'Engañoso',           color: '#92400E', bg: '#FFFBEB' },
                { min:  0, label: 'Falso',              color: '#B91C1C', bg: '#FFF5F5' },
              ].map(tier => {
                const isActive = score >= tier.min && (
                  tier.min === 80 ? score >= 80 :
                  tier.min === 50 ? score >= 50 && score < 80 :
                  tier.min === 30 ? score >= 30 && score < 50 :
                  score < 30
                )
                return (
                  <div key={tier.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '7px', background: isActive ? tier.bg : 'transparent', transition: 'background 0.2s' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isActive ? tier.color : '#E4EAF2', flexShrink: 0 }} />
                    <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: '12px', fontWeight: isActive ? 700 : 400, color: isActive ? tier.color : '#8FA3BF' }}>
                      {tier.label}
                    </span>
                    {isActive && (
                      <span style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 700, color: tier.color }}>{score}/100</span>
                    )}
                  </div>
                )
              })}
            </div>
            <p style={{ marginTop: '10px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '9px', color: '#C8D3E0', lineHeight: 1.5 }}>
              Escala basada en metodología IFCN · International Fact-Checking Network
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
