import { useState, useEffect, Suspense, lazy } from 'react'

const ICFHouseModel = lazy(() => import('./ICFHouseModel'))
import { Box, FileImage, LayoutGrid, RotateCcw, ZoomIn, ZoomOut, Layers, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import useAppStore from '../../store/useAppStore'
import { MANUFACTURERS } from '../../data/manufacturers'
import { ACTIVE_PROJECT } from '../../data/projectData'

const CORE_OPTIONS = [
  { value: '4', label: '4" Core' },
  { value: '6', label: '6" Core' },
  { value: '8', label: '8" Core' },
  { value: '10', label: '10" Core' },
  { value: '12', label: '12" Core' },
]

const MFR_OPTIONS = MANUFACTURERS.map((m) => ({ value: m.id, label: m.shortName }))

const LAYER_KEYS = ['blocks', 'rebar', 'openings', 'bracing']

function ViewToggle({ view, setView }) {
  const opts = [
    { id: '3d', label: '3D View', icon: Box },
    { id: 'plan', label: 'Plan View', icon: FileImage },
    { id: 'split', label: 'Split View', icon: LayoutGrid },
  ]
  return (
    <div className="flex gap-1 bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-600 rounded-lg p-1">
      {opts.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setView(id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
            view === id
              ? 'bg-teal-500/20 text-teal-500 dark:text-teal-400 border border-teal-500/40'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Icon size={13} />
          {label}
        </button>
      ))}
    </div>
  )
}

function LayerPanel({ layers, toggle }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <Layers size={14} className="text-teal-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-white">Layers</span>
      </div>
      <div className="space-y-2">
        {LAYER_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className="w-full flex items-center justify-between py-1 cursor-pointer"
          >
            <span className="text-xs capitalize text-gray-600 dark:text-gray-300">{key}</span>
            {layers[key]
              ? <Eye size={13} className="text-teal-500" />
              : <EyeOff size={13} className="text-gray-400" />}
          </button>
        ))}
      </div>
    </div>
  )
}

function PlanView({ coreSize }) {
  const wallColor = '#2dd4bf'
  return (
    <div className="w-full h-full flex items-center justify-center bg-white dark:bg-navy-950 rounded-xl overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-full max-w-2xl" style={{ maxHeight: 420 }}>
        {/* Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a2633" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#grid)" />

        {/* Exterior walls */}
        <rect x="60" y="50" width="280" height="200" fill="none" stroke={wallColor} strokeWidth={coreSize * 0.8} rx="2" />

        {/* Interior walls */}
        <line x1="200" y1="50" x2="200" y2="170" stroke={wallColor} strokeWidth={coreSize * 0.6} />
        <line x1="130" y1="50" x2="130" y2="250" stroke={wallColor} strokeWidth={coreSize * 0.6} />

        {/* Door openings */}
        <rect x="60" y="175" width="30" height="1" fill="#0d1117" />
        <line x1="60" y1="155" x2="90" y2="155" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,2" />

        {/* Window openings */}
        {[[110, 50, 40, 0], [240, 50, 40, 0], [340, 100, 0, 40], [340, 180, 0, 40]].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w || 4} height={h || 4} fill="#1a3a5c" stroke="#3b82f6" strokeWidth="1.5" />
        ))}

        {/* Dimension lines */}
        <line x1="60" y1="270" x2="340" y2="270" stroke="#4a5568" strokeWidth="0.8" />
        <text x="200" y="285" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Inter, sans-serif">48&apos;-0&quot;</text>
        <line x1="30" y1="50" x2="30" y2="250" stroke="#4a5568" strokeWidth="0.8" />
        <text x="18" y="155" textAnchor="middle" fill="#6b7280" fontSize="9" fontFamily="Inter, sans-serif" transform="rotate(-90 18 155)">34&apos;-0&quot;</text>

        {/* North arrow */}
        <g transform="translate(370, 30)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#4a5568" strokeWidth="1" />
          <text x="0" y="-4" textAnchor="middle" fill="#14b8a6" fontSize="8" fontWeight="bold" fontFamily="Inter, sans-serif">N</text>
          <path d="M 0 -10 L 3 2 L 0 -1 L -3 2 Z" fill="#14b8a6" />
        </g>

        {/* Core size label */}
        <text x="200" y="155" textAnchor="middle" fill="#14b8a6" fontSize="8" fontFamily="Inter, sans-serif" opacity="0.7">
          {coreSize}&quot; Core
        </text>
      </svg>
    </div>
  )
}

export default function ModelPage() {
  const navigate = useNavigate()
  const { activeProject } = useAppStore()
  const project = ACTIVE_PROJECT

  const [view, setView] = useState('3d')
  const [coreSize, setCoreSize] = useState(String(project.coreSize))
  const [manufacturer, setManufacturer] = useState(project.manufacturer)
  const [autoOrbit, setAutoOrbit] = useState(false)
  const [showLayers, setShowLayers] = useState(false)
  const [layers, setLayers] = useState({ blocks: true, rebar: true, openings: true, bracing: false })

  const toggleLayer = (key) => setLayers((l) => ({ ...l, [key]: !l[key] }))

  const [show3D, setShow3D] = useState(false)
  useEffect(() => { const t = setTimeout(() => setShow3D(true), 150); return () => clearTimeout(t) }, [])

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main viewport */}
      <div className="flex-1 flex flex-col overflow-hidden bg-navy-950">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-gray-800 dark:text-white">3D Model</h1>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{project.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Select value={coreSize} onChange={setCoreSize} options={CORE_OPTIONS} className="w-28" />
            <Select value={manufacturer} onChange={setManufacturer} options={MFR_OPTIONS} className="w-32" />
            <ViewToggle view={view} setView={setView} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAutoOrbit((v) => !v)}
              className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer border ${
                autoOrbit
                  ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                  : 'border-gray-200 dark:border-navy-600 text-gray-500 dark:text-gray-400'
              }`}
              title="Auto-orbit"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              onClick={() => setShowLayers((v) => !v)}
              className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                showLayers
                  ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                  : 'border-gray-200 dark:border-navy-600 text-gray-500 dark:text-gray-400'
              }`}
              title="Layers"
            >
              <Layers size={13} />
            </button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 relative overflow-hidden">
          {/* Layer panel overlay */}
          {showLayers && (
            <div className="absolute top-4 right-4 z-20 w-44">
              <LayerPanel layers={layers} toggle={toggleLayer} />
            </div>
          )}

          {/* 3D / Plan / Split */}
          {view === '3d' && (
            <div className="w-full h-full">
              {show3D ? (
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-teal-400 text-sm animate-pulse">Loading 3D model…</div>
                  </div>
                }>
                  {/* Dynamically imported to avoid SSR issues */}
                  <ICFHouseModel autoOrbit={autoOrbit} />
                </Suspense>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-teal-400 text-sm animate-pulse">Initializing…</div>
                </div>
              )}
            </div>
          )}

          {view === 'plan' && (
            <div className="w-full h-full p-6">
              <PlanView coreSize={parseInt(coreSize)} />
            </div>
          )}

          {view === 'split' && (
            <div className="w-full h-full grid grid-cols-2 gap-0">
              <div className="h-full border-r border-navy-700">
                {show3D && (
                  <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-teal-400 text-xs animate-pulse">Loading…</div>}>
                    <ICFHouseModel autoOrbit={false} />
                  </Suspense>
                )}
              </div>
              <div className="h-full p-4 bg-navy-950">
                <PlanView coreSize={parseInt(coreSize)} />
              </div>
            </div>
          )}

          {/* Coordinates / status bar */}
          <div className="absolute bottom-3 left-4 text-xs text-gray-500 dark:text-gray-600 font-mono">
            {parseInt(coreSize)}&quot; Core · {MANUFACTURERS.find(m => m.id === manufacturer)?.shortName ?? 'Unknown'} · {project.sf.toLocaleString()} SF
          </div>
        </div>
      </div>

      {/* Right sidebar — model info */}
      <div className="w-60 flex-shrink-0 border-l border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 overflow-y-auto p-5 flex flex-col gap-5">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Model Info</h3>
          <div className="space-y-2">
            {[
              { label: 'Wall Area', value: `${project.sf.toLocaleString()} SF` },
              { label: 'Core Size', value: `${coreSize}"` },
              { label: 'Max Height', value: `${project.maxWallHeightFt}'` },
              { label: 'Levels', value: project.levels },
              { label: 'Openings', value: project.openings },
              { label: 'Corners', value: project.corners },
              { label: 'T-Walls', value: project.tWalls },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Block Specs</h3>
          <div className="space-y-2">
            {[
              { label: 'Height (Course)', value: '18"' },
              { label: 'Length', value: '96"' },
              { label: 'SF per Block', value: '12.0' },
              { label: 'R-Value', value: 'R-24' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-navy-700 pt-4 space-y-2">
          <Button
            className="w-full"
            onClick={() => navigate('/preconstruction/takeoff')}
          >
            View Takeoff
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/preconstruction/estimates')}
          >
            View Estimate
          </Button>
        </div>
      </div>
    </div>
  )
}

