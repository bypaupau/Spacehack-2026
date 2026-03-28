// ─────────────────────────────────────────────────────────────────────────────
// SatelliteTab — satellite data: stats + image grid + time series chart
//
// Phase 2: Replace placeholder images with real GEE tile URLs.
//          Replace mock timeSeries with live Sentinel-2 / Landsat data.
//          The Leaflet map component is scaffolded at the bottom (commented out).
// ─────────────────────────────────────────────────────────────────────────────

import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine,
} from 'recharts'
import type { SatelliteData } from '../../../types'

interface SatelliteTabProps { satellite: SatelliteData }

// Gradient backgrounds simulating false-color satellite imagery
const SAT_GRADIENTS = [
  'linear-gradient(135deg, #7fb3c8 0%, #4a8fa8 50%, #2d6e84 100%)',
  'linear-gradient(135deg, #5a9db5 0%, #3d7d96 50%, #1e5c73 100%)',
  'linear-gradient(135deg, #4a8fa8 0%, #2d6e84 50%, #1a4f62 100%)',
]

export function SatelliteTab({ satellite }: SatelliteTabProps) {
  const { glacierRetreat, snowCoverage, ndviIndex, coverageTrend,
          baselineYear, images, timeSeries } = satellite

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Key metrics */}
      <div>
        <p className="section-label">
          Datos satelitales · Glaciar Aletsch, Suiza · 2024
        </p>
        <div className="grid grid-cols-3 gap-px bg-border rounded-sm overflow-hidden">
          {[
            { val: `${glacierRetreat}m`,      sub: 'retroceso glaciar\npromedio/año 2024' },
            { val: `${snowCoverage}%`,         sub: `cobertura nieve\nvs ${baselineYear === 2015 ? '78%' : ''} en ${baselineYear}` },
            { val: ndviIndex.toFixed(2),       sub: 'índice NDVI\nvegetación 2024' },
          ].map((m, i) => (
            <div key={i} className="bg-ink text-white px-4 py-3">
              <p className="font-editorial text-[26px] leading-none text-ice">{m.val}</p>
              <p className="font-caption text-[#888] mt-1 whitespace-pre-line leading-relaxed">
                {m.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Coverage trend bar */}
        <div className="mt-3">
          <div className="flex justify-between font-caption text-ghost mb-1">
            <span>NDSI Cobertura Nieve {baselineYear}–2024</span>
            <span className="text-false font-medium">{coverageTrend}%</span>
          </div>
          <div className="h-1.5 bg-border rounded-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ice to-[#2d6e84] rounded-sm transition-all duration-700"
              style={{ width: `${snowCoverage}%` }}
            />
          </div>
          <div className="flex justify-between font-caption text-ghost mt-1">
            <span>78% ({baselineYear})</span>
            <span>{snowCoverage}% (2024)</span>
          </div>
        </div>
      </div>

      {/* Time series chart */}
      <div>
        <p className="section-label">Evolución de cobertura de nieve (%)</p>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={timeSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7fb3c8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#7fb3c8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tick={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, fill: '#aaa' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              domain={[40, 90]}
              tick={{ fontFamily: "'IBM Plex Mono'", fontSize: 9, fill: '#aaa' }}
              axisLine={false} tickLine={false}
            />
            <Tooltip
              contentStyle={{
                fontFamily: "'IBM Plex Mono'", fontSize: 10,
                background: '#1a1a1a', border: 'none', color: '#fff',
                borderRadius: '2px', padding: '6px 10px',
              }}
              formatter={(val: number) => [`${val}%`, 'Cobertura']}
            />
            <ReferenceLine y={snowCoverage} stroke="#c0392b" strokeDasharray="3 3" strokeWidth={1} />
            <Area
              type="monotone" dataKey="coverage"
              stroke="#7fb3c8" strokeWidth={1.5}
              fill="url(#iceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Satellite image grid */}
      <div>
        <p className="section-label">Imágenes satelitales comparativas</p>
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="rounded-sm overflow-hidden border border-border">
              {/* Phase 2: replace with <img src={img.imageUrl} … /> */}
              <div
                className="h-24 relative"
                style={{ background: SAT_GRADIENTS[i % SAT_GRADIENTS.length] }}
              >
                <div className="absolute bottom-0 inset-x-0 bg-black/50 px-2 py-1">
                  <p className="font-caption text-white/90 leading-none">{img.location}</p>
                </div>
              </div>
              <div className="bg-ink px-2 py-1.5 flex justify-between items-center">
                <p className="font-caption text-[#ccc]">{img.date}</p>
                <span className="font-caption text-[8px] bg-[#333] text-[#aaa] px-1.5 py-0.5 rounded-sm">
                  {img.source}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/*
          ── Phase 2: Leaflet / Mapbox map ─────────────────────────────────────
          Uncomment once `npm install leaflet react-leaflet` is done
          and replace TILE_URL with real GEE WMS or Sentinel Hub endpoint.

          import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
          import 'leaflet/dist/leaflet.css'

          const ALETSCH = { lat: 46.4875, lng: 8.0506 }
          const TILE_URL = 'https://tiles.maps.eox.at/wms?...'  // GEE tile

          <MapContainer center={ALETSCH} zoom={11} style={{ height: 260 }}>
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Satellite 2015">
                <TileLayer url={TILE_URL} params={{ year: 2015 }} />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite 2024">
                <TileLayer url={TILE_URL} params={{ year: 2024 }} />
              </LayersControl.BaseLayer>
            </LayersControl>
          </MapContainer>
        */}
      </div>
    </div>
  )
}
