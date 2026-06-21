import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, AlertCircle, XCircle, ArrowRight, Cpu,
  ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Edit3, Trash2,
  ChevronDown, ChevronRight, Info,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { ACTIVE_PROJECT } from '../../data/projectData'

// ── Detection results ──────────────────────────────────────────────────────
const INITIAL_DETECTIONS = [
  // Exterior walls
  { id: 'w1', type: 'wall', label: 'Front Wall', subLabel: 'Exterior · North', conf: 99, lf: 60, status: 'confirmed', x1: 100, y1: 80, x2: 700, y2: 80, thickness: 10 },
  { id: 'w2', type: 'wall', label: 'Right Wall', subLabel: 'Exterior · East', conf: 98, lf: 44, status: 'confirmed', x1: 700, y1: 80, x2: 700, y2: 520, thickness: 10 },
  { id: 'w3', type: 'wall', label: 'Rear Wall', subLabel: 'Exterior · South', conf: 99, lf: 60, status: 'confirmed', x1: 100, y1: 520, x2: 700, y2: 520, thickness: 10 },
  { id: 'w4', type: 'wall', label: 'Left Wall', subLabel: 'Exterior · West', conf: 97, lf: 44, status: 'confirmed', x1: 100, y1: 80, x2: 100, y2: 520, thickness: 10 },
  { id: 'w5', type: 'wall', label: 'Garage Front', subLabel: 'Exterior · North', conf: 96, lf: 26, status: 'confirmed', x1: 30, y1: 250, x2: 30, y2: 440, thickness: 10 },
  { id: 'w6', type: 'wall', label: 'Garage West', subLabel: 'Exterior · West', conf: 95, lf: 20, status: 'confirmed', x1: 30, y1: 250, x2: 100, y2: 250, thickness: 10 },
  // Interior walls
  { id: 'w7', type: 'wall', label: 'Interior Partition A', subLabel: 'Interior · ICF', conf: 91, lf: 36, status: 'confirmed', x1: 380, y1: 80, x2: 380, y2: 340, thickness: 7 },
  { id: 'w8', type: 'wall', label: 'Interior Partition B', subLabel: 'Interior · ICF', conf: 87, lf: 28, status: 'review', x1: 100, y1: 340, x2: 700, y2: 340, thickness: 7 },

  // Openings
  { id: 'o1', type: 'opening', label: 'Entry Door', subLabel: '3.5′ × 6′–10″', conf: 98, status: 'confirmed', cx: 160, cy: 80, w: 30, h: 12 },
  { id: 'o2', type: 'opening', label: 'Window A', subLabel: '4′ × 4′', conf: 97, status: 'confirmed', cx: 330, cy: 80, w: 40, h: 12 },
  { id: 'o3', type: 'opening', label: 'Window B', subLabel: '4′ × 4′', conf: 95, status: 'confirmed', cx: 490, cy: 80, w: 40, h: 12 },
  { id: 'o4', type: 'opening', label: 'Patio Door', subLabel: '6′ × 6′–10″', conf: 96, status: 'confirmed', cx: 700, cy: 190, w: 12, h: 50 },
  { id: 'o5', type: 'opening', label: 'Window C', subLabel: '4′ × 4′', conf: 93, status: 'confirmed', cx: 700, cy: 380, w: 12, h: 40 },
  { id: 'o6', type: 'opening', label: 'Back Door', subLabel: '3′ × 6′–10″', conf: 94, status: 'confirmed', cx: 220, cy: 520, w: 30, h: 12 },
  { id: 'o7', type: 'opening', label: 'Window D', subLabel: '3′ × 3′–6″', conf: 91, status: 'confirmed', cx: 450, cy: 520, w: 30, h: 12 },
  { id: 'o8', type: 'opening', label: 'Overhead Door', subLabel: '16′ × 7′', conf: 99, status: 'confirmed', cx: 30, cy: 340, w: 12, h: 80 },
  { id: 'o9', type: 'opening', label: 'Unknown Opening', subLabel: 'Unclassified', conf: 62, status: 'review', cx: 580, cy: 80, w: 20, h: 12 },

  // Corners
  { id: 'c1', type: 'corner', label: 'Corner NW', subLabel: '90°', conf: 99, status: 'confirmed', cx: 100, cy: 80 },
  { id: 'c2', type: 'corner', label: 'Corner NE', subLabel: '90°', conf: 99, status: 'confirmed', cx: 700, cy: 80 },
  { id: 'c3', type: 'corner', label: 'Corner SE', subLabel: '90°', conf: 98, status: 'confirmed', cx: 700, cy: 520 },
  { id: 'c4', type: 'corner', label: 'Corner SW', subLabel: '90°', conf: 98, status: 'confirmed', cx: 100, cy: 520 },
  { id: 'c5', type: 'corner', label: 'Garage NE', subLabel: '90°', conf: 95, status: 'confirmed', cx: 100, cy: 250 },
  { id: 'c6', type: 'corner', label: 'Garage SE', subLabel: '90°', conf: 94, status: 'confirmed', cx: 100, cy: 440 },
  { id: 'c7', type: 'corner', label: 'Garage NW', subLabel: '90°', conf: 93, status: 'confirmed', cx: 30, cy: 250 },
  { id: 'c8', type: 'corner', label: 'Garage SW', subLabel: '90°', conf: 92, status: 'review', cx: 30, cy: 440 },
  { id: 'c9', type: 'corner', label: 'T-Wall A', subLabel: 'T-intersection', conf: 88, status: 'review', cx: 380, cy: 340 },
  { id: 'c10', type: 'corner', label: 'T-Wall B', subLabel: 'T-intersection', conf: 83, status: 'review', cx: 380, cy: 80 },
]

const TYPE_CONFIG = {
  wall:    { color: '#14b8a6', label: 'Walls',    icon: '▬' },
  opening: { color: '#3b82f6', label: 'Openings', icon: '▭' },
  corner:  { color: '#f59e0b', label: 'Corners',  icon: '◢' },
}

const STATUS_CONFIG = {
  confirmed: { color: 'text-teal-500',   bg: 'bg-teal-500/10',  icon: CheckCircle,  label: 'Confirmed' },
  review:    { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: AlertCircle,  label: 'Review' },
  rejected:  { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: XCircle,      label: 'Rejected' },
}

// ── Detection overlay on the SVG plan ──────────────────────────────────────
function PlanOverlay({ detections, visibleTypes, selectedId, onSelect, zoom }) {
  return (
    <svg
      viewBox="0 0 800 600"
      style={{ width: `${zoom}%`, maxWidth: 'none', minWidth: 500, transition: 'width 0.2s' }}
      className="drop-shadow-2xl"
    >
      {/* Dark background */}
      <rect width="800" height="600" fill="#0d1117" rx="4" />
      <defs>
        <pattern id="ai-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a2633" strokeWidth="0.5" />
        </pattern>
        <filter id="sel-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="800" height="600" fill="url(#ai-grid)" />

      {/* Base plan lines (always visible, dimmed) */}
      <g stroke="#1e3a4a" strokeWidth="10" fill="none" strokeLinejoin="round" opacity="0.4">
        <polyline points="100,80 700,80 700,520 100,520 100,80" />
        <polyline points="100,250 30,250 30,440 100,440" />
      </g>
      <g stroke="#1e3a4a" strokeWidth="7" fill="none" opacity="0.3">
        <line x1="380" y1="80" x2="380" y2="340" />
        <line x1="100" y1="340" x2="700" y2="340" />
      </g>

      {/* ── Wall detections ── */}
      {visibleTypes.wall && detections.filter((d) => d.type === 'wall').map((d) => {
        const cfg = STATUS_CONFIG[d.status]
        const color = d.status === 'rejected' ? '#6b7280'
          : d.status === 'review' ? '#f59e0b'
          : '#14b8a6'
        const isSelected = selectedId === d.id
        return (
          <line
            key={d.id}
            x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2}
            stroke={color}
            strokeWidth={isSelected ? d.thickness + 4 : d.thickness}
            strokeOpacity={d.status === 'rejected' ? 0.3 : 0.85}
            strokeLinecap="round"
            filter={isSelected ? 'url(#sel-glow)' : undefined}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(d.id)}
          />
        )
      })}

      {/* ── Opening detections ── */}
      {visibleTypes.opening && detections.filter((d) => d.type === 'opening').map((d) => {
        const color = d.status === 'rejected' ? '#6b7280'
          : d.status === 'review' ? '#f59e0b' : '#3b82f6'
        const isSelected = selectedId === d.id
        const isH = d.w > d.h // horizontal opening
        return (
          <rect
            key={d.id}
            x={d.cx - d.w / 2} y={d.cy - d.h / 2}
            width={d.w} height={d.h}
            fill={color}
            fillOpacity={isSelected ? 0.5 : d.status === 'review' ? 0.4 : 0.25}
            stroke={color}
            strokeWidth={isSelected ? 2 : 1}
            filter={isSelected ? 'url(#sel-glow)' : undefined}
            style={{ cursor: 'pointer' }}
            onClick={() => onSelect(d.id)}
          />
        )
      })}

      {/* ── Corner / T-wall detections ── */}
      {visibleTypes.corner && detections.filter((d) => d.type === 'corner').map((d) => {
        const isT = d.subLabel.includes('T-intersection')
        const color = d.status === 'rejected' ? '#6b7280'
          : d.status === 'review' ? '#f59e0b' : '#f59e0b'
        const isSelected = selectedId === d.id
        return (
          <g key={d.id} onClick={() => onSelect(d.id)} style={{ cursor: 'pointer' }}>
            {isT
              ? <rect x={d.cx - 8} y={d.cy - 8} width={16} height={16}
                  fill={color} fillOpacity={isSelected ? 0.7 : 0.3}
                  stroke={color} strokeWidth={isSelected ? 2 : 1}
                  filter={isSelected ? 'url(#sel-glow)' : undefined} />
              : <circle cx={d.cx} cy={d.cy} r={isSelected ? 10 : 7}
                  fill={color} fillOpacity={isSelected ? 0.7 : 0.3}
                  stroke={color} strokeWidth={isSelected ? 2 : 1}
                  filter={isSelected ? 'url(#sel-glow)' : undefined} />
            }
          </g>
        )
      })}

      {/* Scale bar */}
      <g transform="translate(30,570)">
        <line x1="0" y1="0" x2="60" y2="0" stroke="#4a5568" strokeWidth="2" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#4a5568" strokeWidth="1.5" />
        <line x1="60" y1="-3" x2="60" y2="3" stroke="#4a5568" strokeWidth="1.5" />
        <text x="30" y="12" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="Inter,sans-serif">10′–0″</text>
      </g>

      {/* North arrow */}
      <g transform="translate(755,40)">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#374151" strokeWidth="1" />
        <text x="0" y="-3" textAnchor="middle" fill="#14b8a6" fontSize="9" fontWeight="bold" fontFamily="Inter,sans-serif">N</text>
        <path d="M0,-11 L3,4 L0,0 L-3,4 Z" fill="#14b8a6" />
      </g>

      {/* Confidence badge on selected */}
      {(() => {
        const sel = detections.find((d) => d.id === selectedId)
        if (!sel) return null
        const cx = sel.type === 'wall' ? (sel.x1 + sel.x2) / 2 : sel.cx
        const cy = sel.type === 'wall' ? (sel.y1 + sel.y2) / 2 : sel.cy
        return (
          <g transform={`translate(${cx},${cy - 18})`}>
            <rect x="-18" y="-10" width="36" height="14" fill="#0d1117" rx="3" opacity="0.9" />
            <text x="0" y="1" textAnchor="middle" fill="#14b8a6" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="bold">
              {sel.conf}%
            </text>
          </g>
        )
      })()}
    </svg>
  )
}

// ── Detection list row ─────────────────────────────────────────────────────
function DetRow({ d, isSelected, onSelect, onStatus }) {
  const sc = STATUS_CONFIG[d.status]
  const tc = TYPE_CONFIG[d.type]
  const StatusIcon = sc.icon
  return (
    <div
      onClick={() => onSelect(d.id === isSelected ? null : d.id)}
      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors text-xs rounded-md mx-1 ${
        isSelected
          ? 'bg-teal-500/10 border border-teal-500/30'
          : 'hover:bg-gray-50 dark:hover:bg-navy-800/50 border border-transparent'
      }`}
    >
      <span style={{ color: tc.color }} className="flex-shrink-0 text-sm">{tc.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 dark:text-white truncate">{d.label}</p>
        <p className="text-gray-400 dark:text-gray-500 truncate">{d.subLabel}</p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`font-mono text-[10px] font-medium ${
          d.conf >= 90 ? 'text-teal-500' : d.conf >= 75 ? 'text-orange-400' : 'text-red-400'
        }`}>{d.conf}%</span>
        <div className="flex gap-0.5">
          <button type="button" title="Confirm" onClick={(e) => { e.stopPropagation(); onStatus(d.id, 'confirmed') }}
            className={`p-0.5 rounded cursor-pointer ${d.status === 'confirmed' ? 'text-teal-500' : 'text-gray-300 dark:text-gray-600 hover:text-teal-400'}`}>
            <CheckCircle size={12} />
          </button>
          <button type="button" title="Flag for review" onClick={(e) => { e.stopPropagation(); onStatus(d.id, 'review') }}
            className={`p-0.5 rounded cursor-pointer ${d.status === 'review' ? 'text-orange-400' : 'text-gray-300 dark:text-gray-600 hover:text-orange-400'}`}>
            <AlertCircle size={12} />
          </button>
          <button type="button" title="Reject" onClick={(e) => { e.stopPropagation(); onStatus(d.id, 'rejected') }}
            className={`p-0.5 rounded cursor-pointer ${d.status === 'rejected' ? 'text-red-400' : 'text-gray-300 dark:text-gray-600 hover:text-red-400'}`}>
            <XCircle size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function AIDetection() {
  const navigate = useNavigate()
  const project = ACTIVE_PROJECT
  const [detections, setDetections] = useState(INITIAL_DETECTIONS)
  const [selectedId, setSelectedId] = useState(null)
  const [zoom, setZoom] = useState(100)
  const [visibleTypes, setVisibleTypes] = useState({ wall: true, opening: true, corner: true })
  const [filterStatus, setFilterStatus] = useState('all')
  const [expandedGroups, setExpandedGroups] = useState({ wall: true, opening: true, corner: true })

  const setStatus = (id, status) =>
    setDetections((ds) => ds.map((d) => (d.id === id ? { ...d, status } : d)))

  const confirmed = detections.filter((d) => d.status === 'confirmed').length
  const review = detections.filter((d) => d.status === 'review').length
  const rejected = detections.filter((d) => d.status === 'rejected').length
  const total = detections.length

  const avgConf = Math.round(detections.filter((d) => d.status !== 'rejected')
    .reduce((s, d) => s + d.conf, 0) / (total - rejected || 1))

  const readyForTakeoff = review === 0 && rejected === 0

  const filtered = detections.filter((d) => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false
    return true
  })

  const toggleGroup = (type) =>
    setExpandedGroups((g) => ({ ...g, [type]: !g[type] }))

  const toggleType = (type) =>
    setVisibleTypes((v) => ({ ...v, [type]: !v[type] }))

  const selected = detections.find((d) => d.id === selectedId)

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── Left: detection list ── */}
      <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-gray-200 dark:border-navy-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detections</span>
            <span className="text-xs text-gray-400">{total} found</span>
          </div>
          {/* Status filter */}
          <div className="flex gap-1">
            {['all', 'confirmed', 'review', 'rejected'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                className={`flex-1 py-1 rounded text-[10px] font-medium capitalize cursor-pointer transition-colors ${
                  filterStatus === s
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-navy-600'
                }`}
              >
                {s === 'all' ? `All` : s === 'confirmed' ? `✓ ${confirmed}` : s === 'review' ? `! ${review}` : `✕ ${rejected}`}
              </button>
            ))}
          </div>
        </div>

        {/* Grouped list */}
        <div className="flex-1 overflow-y-auto py-1">
          {(['wall', 'opening', 'corner'] ).map((type) => {
            const items = filtered.filter((d) => d.type === type)
            if (items.length === 0) return null
            const tc = TYPE_CONFIG[type]
            const isOpen = expandedGroups[type]
            return (
              <div key={type} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(type)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800"
                >
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  <span style={{ color: tc.color }}>{tc.icon}</span>
                  <span className="text-gray-600 dark:text-gray-300 uppercase tracking-wider">{tc.label}</span>
                  <span className="ml-auto text-gray-400">{items.length}</span>
                </button>
                {isOpen && items.map((d) => (
                  <DetRow key={d.id} d={d} isSelected={selectedId === d.id} onSelect={setSelectedId} onStatus={setStatus} />
                ))}
              </div>
            )
          })}
        </div>

        {/* Bottom actions */}
        <div className="p-3 border-t border-gray-200 dark:border-navy-700 space-y-2">
          <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Avg confidence</span>
            <span className={`font-mono font-medium ${avgConf >= 90 ? 'text-teal-500' : 'text-orange-400'}`}>{avgConf}%</span>
          </div>
          {review > 0 && (
            <div className="flex items-start gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
              <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
              {review} item{review > 1 ? 's' : ''} need review before takeoff
            </div>
          )}
          <Button
            className="w-full"
            size="sm"
            iconRight={ArrowRight}
            onClick={() => navigate('/preconstruction/takeoff')}
          >
            {readyForTakeoff ? 'Run Takeoff' : `Run Takeoff (${review} pending)`}
          </Button>
        </div>
      </div>

      {/* ── Center: plan view ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-gray-800 dark:text-white">AI Detection</h1>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{project.name}</span>
            <Badge variant="green">
              <Cpu size={10} className="mr-1" />{avgConf}% avg confidence
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {/* Layer toggles */}
            {Object.entries(TYPE_CONFIG).map(([type, tc]) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleType(type)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  visibleTypes[type]
                    ? 'border-transparent text-white'
                    : 'border-gray-200 dark:border-navy-600 text-gray-400 dark:text-gray-500 bg-transparent'
                }`}
                style={visibleTypes[type] ? { backgroundColor: tc.color + '33', borderColor: tc.color + '66', color: tc.color } : {}}
              >
                {visibleTypes[type] ? <Eye size={11} /> : <EyeOff size={11} />}
                {tc.label}
              </button>
            ))}
            <div className="w-px h-4 bg-gray-200 dark:bg-navy-600 mx-1" />
            <button type="button" onClick={() => setZoom((z) => Math.max(z - 20, 40))} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500 cursor-pointer"><ZoomOut size={14} /></button>
            <span className="text-xs font-mono text-gray-400 w-10 text-center">{zoom}%</span>
            <button type="button" onClick={() => setZoom((z) => Math.min(z + 20, 200))} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500 cursor-pointer"><ZoomIn size={14} /></button>
            <button type="button" onClick={() => setZoom(100)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-500 cursor-pointer"><RotateCcw size={14} /></button>
          </div>
        </div>

        {/* Viewport */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-navy-950 flex items-start justify-center p-6">
          <PlanOverlay
            detections={detections}
            visibleTypes={visibleTypes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            zoom={zoom}
          />
        </div>

        {/* Status bar */}
        <div className="flex items-center gap-6 px-4 py-1.5 bg-white dark:bg-navy-900 border-t border-gray-200 dark:border-navy-700 text-xs text-gray-400 flex-shrink-0">
          <span className="flex items-center gap-1.5">
            <CheckCircle size={11} className="text-teal-500" />{confirmed} confirmed
          </span>
          <span className="flex items-center gap-1.5">
            <AlertCircle size={11} className="text-orange-400" />{review} review
          </span>
          <span className="flex items-center gap-1.5">
            <XCircle size={11} className="text-red-400" />{rejected} rejected
          </span>
          <span className="ml-auto">
            {selected
              ? `Selected: ${selected.label} — ${selected.conf}% confidence`
              : 'Click a detection to inspect'}
          </span>
        </div>
      </div>

      {/* ── Right: inspector panel ── */}
      <div className="w-60 flex-shrink-0 border-l border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 flex flex-col overflow-y-auto">
        {selected ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-navy-700">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">{selected.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selected.subLabel}</p>
                </div>
                <span style={{ color: TYPE_CONFIG[selected.type].color }} className="text-xl flex-shrink-0">
                  {TYPE_CONFIG[selected.type].icon}
                </span>
              </div>

              {/* Confidence bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">AI Confidence</span>
                  <span className={`font-mono font-bold ${
                    selected.conf >= 90 ? 'text-teal-500' : selected.conf >= 75 ? 'text-orange-400' : 'text-red-400'
                  }`}>{selected.conf}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${selected.conf >= 90 ? 'bg-teal-500' : selected.conf >= 75 ? 'bg-orange-400' : 'bg-red-400'}`}
                    style={{ width: `${selected.conf}%` }}
                  />
                </div>
              </div>

              {/* Status buttons */}
              <div className="flex gap-1.5">
                {['confirmed', 'review', 'rejected'].map((s) => {
                  const sc = STATUS_CONFIG[s]
                  const Icon = sc.icon
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(selected.id, s)}
                      className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border text-[10px] font-medium cursor-pointer transition-colors capitalize ${
                        selected.status === s
                          ? `${sc.bg} border-current ${sc.color}`
                          : 'border-gray-200 dark:border-navy-700 text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={14} />
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Detection details */}
            <div className="p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Detection Details</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Type</span>
                  <span className="text-gray-800 dark:text-white capitalize">{selected.type}</span>
                </div>
                {selected.lf && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Length</span>
                    <span className="font-mono text-gray-800 dark:text-white">{selected.lf}′–0″</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className={STATUS_CONFIG[selected.status].color + ' capitalize font-medium'}>
                    {selected.status}
                  </span>
                </div>
              </div>

              {selected.conf < 80 && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
                  <Info size={12} className="flex-shrink-0 mt-0.5" />
                  Low confidence — verify this detection against the original plan before running takeoff.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-3">
              <Cpu size={22} className="text-teal-500" />
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white mb-1">Select a detection</p>
            <p className="text-xs text-gray-400">Click any wall, opening, or corner on the plan to inspect its AI confidence and status.</p>
          </div>
        )}

        {/* Summary at bottom */}
        <div className="mt-auto border-t border-gray-200 dark:border-navy-700 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Summary</p>
          {[
            { label: 'Walls', count: detections.filter((d) => d.type === 'wall').length, lf: detections.filter((d) => d.type === 'wall' && d.lf).reduce((s, d) => s + d.lf, 0) + ' LF' },
            { label: 'Openings', count: detections.filter((d) => d.type === 'opening').length, lf: '' },
            { label: 'Corners', count: detections.filter((d) => d.type === 'corner').length, lf: '' },
          ].map(({ label, count, lf }) => (
            <div key={label} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-mono text-gray-800 dark:text-white">{count} {lf && <span className="text-gray-400">· {lf}</span>}</span>
            </div>
          ))}
          <Button className="w-full" size="sm" iconRight={ArrowRight} onClick={() => navigate('/preconstruction/takeoff')}>
            Proceed to Takeoff
          </Button>
        </div>
      </div>
    </div>
  )
}
