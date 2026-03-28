// ─────────────────────────────────────────────────────────────────────────────
// SatelliteMap — Mapa satelital real con Leaflet + ESRI World Imagery
//
// Tiles: ESRI World Imagery (gratis, sin API key) + ESRI Labels overlay
// Coordenadas: lookup por nombre de glaciar/región
// Abre Copernicus Browser en nueva pestaña para análisis profundo
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import { ExternalLink, Layers, MapPin, Satellite, TrendingDown } from 'lucide-react'

// ── Fix Leaflet marker icons con bundlers ─────────────────────────────────────
// react-leaflet no resuelve las URLs de iconos automáticamente con Vite.
// Usamos un DivIcon custom para evitar el problema sin imports extra.
const createGlacierIcon = (trend: number) => L.divIcon({
  className: '',
  html: `
    <div style="
      width: 28px; height: 28px;
      background: ${trend < -20 ? '#DC2626' : trend < -10 ? '#D97706' : '#059669'};
      border: 2.5px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>
  `,
  iconSize:   [28, 28],
  iconAnchor: [14, 28],
  popupAnchor:[0, -30],
})

// ── Lookup de coordenadas por nombre de lugar ─────────────────────────────────
const LOCATION_COORDS: Record<string, [number, number]> = {
  'Aletsch':          [46.5375, 8.0689],
  'Mont Blanc':       [45.8326, 6.8652],
  'Alpes Centrales':  [46.7200, 8.1800],
  'Alpes Suizos':     [46.5000, 8.0000],
  'Rhône':            [46.6100, 8.4000],
  'Gorner':           [45.9800, 7.7800],
  'Trient':           [46.0500, 7.0100],
  'Mer de Glace':     [45.9000, 6.9200],
}

function resolveCoords(location: string): [number, number] {
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (location.toLowerCase().includes(key.toLowerCase())) return coords
  }
  return [46.52, 8.05] // Centro Alpes Suizos como fallback
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface SatelliteMapProps {
  location:      string
  glacierRetreat: number
  snowCoverage:  number
  coverageTrend: number
  baselineYear:  number
}

export function SatelliteMap({
  location, glacierRetreat, snowCoverage, coverageTrend, baselineYear
}: SatelliteMapProps) {
  const coords    = resolveCoords(location)
  const mapRef    = useRef<L.Map | null>(null)

  // Copernicus EO Browser link — parametrizado con las coordenadas reales
  const copLink = `https://browser.dataspace.copernicus.eu/?zoom=11&lat=${coords[0].toFixed(4)}&lng=${coords[1].toFixed(4)}&themeId=DEFAULT-THEME`

  // Sentinel Hub EO Browser (NDSI Snow Cover visualization)
  const ndsiLink = `https://apps.sentinel-hub.com/eo-browser/?zoom=11&lat=${coords[0].toFixed(4)}&lng=${coords[1].toFixed(4)}&themeId=DEFAULT-THEME&datasetId=S2L2A&layerId=3_NDSI`

  const trendColor = coverageTrend < -20 ? '#DC2626' : coverageTrend < -10 ? '#D97706' : '#059669'

  return (
    <div style={{
      position:     'relative',
      borderRadius: '8px',
      overflow:     'hidden',
      border:       '1px solid #E2E8F0',
      background:   '#0F172A',
    }}>
      {/* ── Header strip ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '7px 12px',
        background:     'rgba(15,23,42,0.92)',
        borderBottom:   '1px solid rgba(255,255,255,0.1)',
        gap:            '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Satellite size={11} strokeWidth={2} color="#38BDF8" />
          <span style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      '9px',
            color:         '#94A3B8',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight:    600,
          }}>
            ESRI World Imagery · Sentinel-2
          </span>
          <span style={{
            background:    '#1E40AF',
            color:         '#93C5FD',
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      '7.5px',
            fontWeight:    600,
            padding:       '1px 6px',
            borderRadius:  '3px',
            letterSpacing: '0.06em',
          }}>
            LIVE
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <a
            href={ndsiLink} target="_blank" rel="noopener noreferrer"
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '4px',
              padding:        '3px 8px',
              borderRadius:   '4px',
              background:     'rgba(56,189,248,0.15)',
              border:         '1px solid rgba(56,189,248,0.3)',
              textDecoration: 'none',
              fontFamily:     "'IBM Plex Mono', monospace",
              fontSize:       '8px',
              color:          '#38BDF8',
              fontWeight:     600,
              letterSpacing:  '0.05em',
              textTransform:  'uppercase',
              transition:     'all 0.15s',
            }}
            title="Ver NDSI en Sentinel Hub EO Browser"
          >
            <Layers size={9} />
            NDSI
          </a>
          <a
            href={copLink} target="_blank" rel="noopener noreferrer"
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '4px',
              padding:        '3px 8px',
              borderRadius:   '4px',
              background:     'rgba(255,255,255,0.08)',
              border:         '1px solid rgba(255,255,255,0.15)',
              textDecoration: 'none',
              fontFamily:     "'IBM Plex Mono', monospace",
              fontSize:       '8px',
              color:          '#94A3B8',
              fontWeight:     600,
              letterSpacing:  '0.05em',
              textTransform:  'uppercase',
            }}
            title="Abrir en Copernicus Browser"
          >
            <ExternalLink size={9} />
            Copernicus
          </a>
        </div>
      </div>

      {/* ── Leaflet Map ── */}
      <div style={{ height: '220px', width: '100%', position: 'relative' }}>
        <MapContainer
          center={coords}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
          ref={mapRef}
        >
          {/* Base: ESRI World Imagery — satélite real, sin API key */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
            maxNativeZoom={17}
          />
          {/* Overlay: Labels de ciudades/picos sobre la imagen */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
            opacity={0.75}
          />
          {/* Marker del glaciar */}
          <Marker
            position={coords}
            icon={createGlacierIcon(coverageTrend)}
          >
            <Popup>
              <div style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize:   '12px',
                lineHeight: 1.5,
                minWidth:   '160px',
              }}>
                <strong style={{ color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  {location.split(',')[0]}
                </strong>
                <span style={{ color: trendColor, fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', fontWeight: 700 }}>
                  {coverageTrend}% cobertura nieve
                </span>
                <br/>
                <span style={{ color: '#64748B', fontSize: '11px' }}>
                  Retroceso: {glacierRetreat}m/año
                </span>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Zoom controls custom (top-right) */}
        <ZoomControls mapRef={mapRef} />
      </div>

      {/* ── Footer KPI strip ── */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '6px 12px',
        background:     'rgba(15,23,42,0.88)',
        borderTop:      '1px solid rgba(255,255,255,0.08)',
        gap:            '8px',
        flexWrap:       'wrap',
      }}>
        {/* Coords */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={9} color="#64748B" />
          <span style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      '8px',
            color:         '#64748B',
          }}>
            {coords[0].toFixed(2)}°N · {coords[1].toFixed(2)}°E
          </span>
        </div>

        {/* KPIs inline */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { label: `Ret. glaciar`, val: `${glacierRetreat}m/año`,  color: '#F87171' },
            { label: `Nieve vs ${baselineYear}`, val: `${snowCoverage}%`, color: '#38BDF8' },
            { label: 'Tendencia NDSI', val: `${coverageTrend}%`,      color: trendColor },
          ].map((kpi, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <span style={{
                fontFamily:    "'IBM Plex Mono', monospace",
                fontSize:      '10px',
                fontWeight:    700,
                color:         kpi.color,
                display:       'block',
                lineHeight:    1,
              }}>
                {kpi.val}
              </span>
              <span style={{
                fontFamily:    "'IBM Plex Mono', monospace",
                fontSize:      '7px',
                color:         '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {kpi.label}
              </span>
            </div>
          ))}
        </div>

        {/* Attribution */}
        <span style={{
          fontFamily:  "'IBM Plex Mono', monospace",
          fontSize:    '7px',
          color:       '#334155',
        }}>
          © Esri · Copernicus/ESA
        </span>
      </div>
    </div>
  )
}

// ── Zoom controls custom ──────────────────────────────────────────────────────
function ZoomControls({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const zoom   = (d: number) => () => mapRef.current?.setZoom((mapRef.current.getZoom() ?? 11) + d)
  const btnStyle: React.CSSProperties = {
    width:          '26px',
    height:         '26px',
    background:     'rgba(15,23,42,0.82)',
    border:         '1px solid rgba(255,255,255,0.15)',
    borderRadius:   '4px',
    color:          '#E2E8F0',
    fontFamily:     "'IBM Plex Mono', monospace",
    fontSize:       '14px',
    fontWeight:     600,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    cursor:         'pointer',
    lineHeight:     1,
    transition:     'background 0.15s',
  }

  return (
    <div style={{
      position: 'absolute',
      top:      '8px',
      right:    '8px',
      zIndex:   1000,
      display:  'flex',
      flexDirection: 'column',
      gap:      '3px',
    }}>
      <button style={btnStyle} onClick={zoom(+1)}>+</button>
      <button style={btnStyle} onClick={zoom(-1)}>−</button>
    </div>
  )
}
