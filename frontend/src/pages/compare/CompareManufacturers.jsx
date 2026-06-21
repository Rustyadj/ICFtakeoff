import { useState } from 'react'
import { Download, Bookmark, Info, CheckCircle, MessageCircle } from 'lucide-react'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import useAppStore from '../../store/useAppStore'
import { MANUFACTURERS, getMfr, getMfrBlock, getMfrPricing } from '../../data/manufacturers'
import { ACTIVE_PROJECT } from '../../data/projectData'

const MFR_OPTIONS = MANUFACTURERS.map((m) => ({ value: m.id, label: m.name }))

const fmt = (n) => (n != null ? `$${n.toLocaleString()}` : '—')
const fmtIn = (n) => (n != null ? `${n}"` : '—')
const fmtR = (n) => (n != null ? `R-${n}` : '—')

function BlockRender({ mfrId }) {
  const colors = {
    'nudura': { bg: '#1e3a2f', border: '#14b8a6', lines: '#0d9488' },
    'fox-blocks': { bg: '#1a3320', border: '#10b981', lines: '#059669' },
    'buildblock': { bg: '#1e2a3a', border: '#3b82f6', lines: '#2563eb' },
    'amvic': { bg: '#2a2010', border: '#f59e0b', lines: '#d97706' },
    'quad-lock': { bg: '#1e1a2a', border: '#8b5cf6', lines: '#7c3aed' },
    'superform': { bg: '#2a1a1a', border: '#ef4444', lines: '#dc2626' },
    'element-icf': { bg: '#1a2530', border: '#06b6d4', lines: '#0891b2' },
    'stronghold': { bg: '#2a1515', border: '#dc2626', lines: '#b91c1c' },
    'liteform': { bg: '#1a1e25', border: '#64748b', lines: '#475569' },
  }
  const c = colors[mfrId] || colors['nudura']

  return (
    <div
      className="w-full h-28 rounded-lg flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: c.bg, border: `1px solid ${c.border}33` }}
    >
      {/* Simplified block visual */}
      <svg viewBox="0 0 160 90" className="w-4/5 h-4/5 opacity-80">
        {/* Block body */}
        <rect x="10" y="20" width="140" height="55" rx="3" fill={c.bg} stroke={c.border} strokeWidth="1.5" />
        {/* Foam panels */}
        <rect x="10" y="20" width="22" height="55" rx="2" fill={c.lines} fillOpacity="0.25" />
        <rect x="128" y="20" width="22" height="55" rx="2" fill={c.lines} fillOpacity="0.25" />
        {/* Web ties */}
        {[44, 64, 84, 104].map((x) => (
          <g key={x}>
            <line x1={x} y1="20" x2={x} y2="75" stroke={c.border} strokeWidth="1.5" strokeOpacity="0.6" />
            <circle cx={x} cy="47" r="3" fill={c.border} fillOpacity="0.5" />
          </g>
        ))}
        {/* Top rebar hints */}
        <line x1="32" y1="30" x2="128" y2="30" stroke={c.border} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4,3" />
        <line x1="32" y1="65" x2="128" y2="65" stroke={c.border} strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4,3" />
      </svg>
    </div>
  )
}

function SpecRow({ label, values, highlight = false, format = (v) => v ?? '—' }) {
  return (
    <div className={`grid grid-cols-[240px_repeat(4,1fr)] border-b border-gray-100 dark:border-navy-700/50 ${highlight ? 'bg-gray-50 dark:bg-navy-800/50' : ''}`}>
      <div className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
        {label}
        <Info size={11} className="text-gray-400 dark:text-gray-600 cursor-help" />
      </div>
      {values.map((v, i) => (
        <div key={i} className={`px-4 py-2.5 text-sm font-medium text-center ${v === highlight ? 'text-teal-400' : 'text-gray-800 dark:text-white'}`}>
          {format(v)}
        </div>
      ))}
    </div>
  )
}

function CostRow({ label, values, isTotal = false }) {
  const maxVal = Math.max(...values.filter(Boolean))
  return (
    <div className={`grid grid-cols-[240px_repeat(4,1fr)] border-b border-gray-100 dark:border-navy-700/50 ${isTotal ? 'bg-gray-50 dark:bg-navy-800' : ''}`}>
      <div className={`px-4 py-2.5 text-xs flex items-center gap-1.5 ${isTotal ? 'font-semibold text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
        {isTotal ? label.toUpperCase() : label}
        {!isTotal && <Info size={11} className="text-gray-400 dark:text-gray-600 cursor-help" />}
      </div>
      {values.map((v, i) => {
        const isHigh = v === maxVal && values.filter(Boolean).length > 1
        return (
          <div
            key={i}
            className={`px-4 py-2.5 text-sm font-medium text-center ${
              isTotal
                ? 'text-teal-500 font-bold text-base'
                : isHigh
                ? 'text-orange-400'
                : 'text-gray-800 dark:text-white'
            }`}
          >
            {v != null ? fmt(v) : '—'}
          </div>
        )
      })}
    </div>
  )
}

export default function CompareManufacturers() {
  const { compareSelections, setCompareSelection, activeProject } = useAppStore()
  const project = ACTIVE_PROJECT
  const coreSize = project.coreSize

  const mfrs = compareSelections.map((id) => getMfr(id))
  const blocks = compareSelections.map((id) => getMfrBlock(id, coreSize))
  const pricing = compareSelections.map((id) => getMfrPricing(id, coreSize))

  const getVal = (arr, key) => arr.map((item) => item?.[key] ?? null)

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main scroll area */}
      <div className="flex-1 overflow-y-auto">
        {/* Page header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-navy-700 flex items-start justify-between bg-white dark:bg-navy-900 sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Compare ICF Systems</h1>
              <Info size={16} className="text-gray-400 cursor-help" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Compare block systems side-by-side to evaluate specifications, performance, and costs.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={Download}>Export Comparison</Button>
            <Button size="sm" icon={Bookmark}>Save Comparison</Button>
          </div>
        </div>

        <div className="p-6">
          {/* Comparison grid */}
          <div className="bg-white dark:bg-navy-800 rounded-xl border border-gray-200 dark:border-navy-700 overflow-hidden">

            {/* === DROPDOWNS ROW === */}
            <div className="grid grid-cols-[240px_repeat(4,1fr)] border-b border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-900/60">
              <div className="px-4 py-3 flex items-center">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Current Project</span>
              </div>
              {compareSelections.map((mfrId, i) => (
                <div key={i} className="px-3 py-3 border-l border-gray-200 dark:border-navy-700">
                  <Select
                    value={mfrId}
                    onChange={(val) => setCompareSelection(i, val)}
                    options={MFR_OPTIONS}
                  />
                </div>
              ))}
            </div>

            {/* === PROJECT INFO + LOGOS ROW === */}
            <div className="grid grid-cols-[240px_repeat(4,1fr)] border-b border-gray-200 dark:border-navy-700">
              {/* Left info column */}
              <div className="px-4 py-4 border-r border-gray-100 dark:border-navy-700">
                <div className="text-xs font-semibold text-teal-500 mb-2">{project.name}</div>
                <div className="space-y-1">
                  {[
                    `${project.sf.toLocaleString()} SF ICF Wall Area`,
                    `${project.coreSize}" Core Width`,
                    project.levels,
                    `${project.openings} Openings`,
                    `${project.corners} Corners`,
                    `${project.tWalls} T-Walls`,
                    `${project.maxWallHeightFt}' Max Wall Height`,
                  ].map((line) => (
                    <div key={line} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0" />
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Manufacturer logo cells */}
              {mfrs.map((m, i) => (
                <div key={i} className="px-4 py-4 border-l border-gray-100 dark:border-navy-700 flex flex-col items-center justify-center gap-2">
                  <div className="text-base font-bold text-gray-900 dark:text-white tracking-wide text-center">{m?.name ?? '—'}</div>
                  {m?.systemType === 'panel' && (
                    <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded">Panel System</span>
                  )}
                </div>
              ))}
            </div>

            {/* === BLOCK RENDERS ROW === */}
            <div className="grid grid-cols-[240px_repeat(4,1fr)] border-b border-gray-200 dark:border-navy-700">
              <div className="px-4 py-4 border-r border-gray-100 dark:border-navy-700">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Project Details</div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Total Wall Area', value: `${project.sf.toLocaleString()} SF` },
                    { label: 'Core Size', value: `${project.coreSize}"` },
                    { label: 'Systems Compared', value: compareSelections.length },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">{label}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {compareSelections.map((id, i) => (
                <div key={i} className="px-3 py-4 border-l border-gray-100 dark:border-navy-700">
                  <BlockRender mfrId={id} />
                  <button type="button" className="w-full mt-2 text-xs text-teal-500 hover:text-teal-400 border border-teal-500/30 rounded-lg py-1.5 transition-colors cursor-pointer">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* === SPECIFICATIONS SECTION === */}
            <div className="border-b border-gray-200 dark:border-navy-700 px-4 py-2 bg-gray-100 dark:bg-navy-900/80">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">Specifications</span>
            </div>

            <SpecRow label="Core Size" values={getVal(blocks, null).map(() => `${coreSize}"`)} />
            <SpecRow label="Block Height (Course)" values={getVal(blocks, 'blockHeightIn')} format={fmtIn} />
            <SpecRow label="Block Length" values={getVal(blocks, 'blockLengthIn')} format={(v) => v != null ? <span className="text-orange-400">{fmtIn(v)}</span> : '—'} />
            <SpecRow label="SF per Block" values={getVal(blocks, 'sfPerBlock')} format={(v) => v?.toFixed(2) ?? '—'} />
            <SpecRow label="R-Value (Core)" values={getVal(blocks, 'rValueCore')} format={fmtR} />
            <SpecRow label="R-Value (Total)" values={getVal(blocks, 'rValueTotal')} format={fmtR} />
            <SpecRow label="Bundle Qty (Straight)" values={getVal(blocks, 'bundleQtyStraight')} format={(v) => v ?? '—'} />
            <SpecRow label="Compressive Strength" values={getVal(blocks, 'compressiveStrengthPsi')} format={(v) => v != null ? `${v} PSI` : '—'} />

            {/* === MATERIAL & COST SECTION === */}
            <div className="border-b border-gray-200 dark:border-navy-700 border-t border-t-gray-200 dark:border-t-navy-700 px-4 py-2 bg-gray-100 dark:bg-navy-900/80">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Material &amp; Cost Comparison <span className="font-normal normal-case tracking-normal">(Per SF of Wall)</span>
              </span>
            </div>

            <SpecRow label="Blocks (Qty)" values={getVal(pricing, 'blocksQty')} format={(v) => v?.toFixed(3) ?? '—'} />
            <CostRow label="Blocks Cost" values={getVal(pricing, 'blocksTotal')} />
            <CostRow label="Accessories Cost" values={getVal(pricing, 'accessoriesTotal')} />
            <CostRow label="Concrete Cost" values={getVal(pricing, 'concreteTotal')} />
            <CostRow label="Rebar & Mesh" values={getVal(pricing, 'rebarMeshTotal')} />
            <CostRow label="Labor (Install)" values={getVal(pricing, 'laborInstallTotal')} />

            {/* Total row */}
            <div className="grid grid-cols-[240px_repeat(4,1fr)] border-t-2 border-gray-300 dark:border-navy-600 bg-gray-50 dark:bg-navy-900/60">
              <div className="px-4 py-4 flex items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">Total Installed Cost</span>
                <span className="ml-1 text-xs text-gray-400 font-normal">(Per SF)</span>
              </div>
              {getVal(pricing, 'totalInstalledCost').map((v, i) => (
                <div key={i} className="px-4 py-4 border-l border-gray-200 dark:border-navy-700 text-center">
                  <div className="text-xl font-bold text-teal-500">{fmt(v)}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            All pricing updated: {project.date} · Prices may vary by region · Contact local suppliers for current pricing
          </p>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-64 flex-shrink-0 border-l border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 overflow-y-auto">
        <div className="p-5 space-y-5">
          {/* Project Summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Project Summary</h3>
              <button type="button" className="text-xs text-teal-500 hover:text-teal-400 cursor-pointer">Edit Project</button>
            </div>
            <div className="flex gap-3 p-3 bg-gray-50 dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-700">
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
                <svg viewBox="0 0 56 56" className="w-full h-full">
                  <rect width="56" height="56" fill="#334155" />
                  <rect x="0" y="28" width="56" height="28" fill="#1e293b" />
                  <polygon points="28,6 50,28 6,28" fill="#475569" />
                  <rect x="18" y="28" width="20" height="22" fill="#374151" />
                  <rect x="24" y="34" width="8" height="16" fill="#1e293b" />
                  <rect x="8" y="30" width="8" height="8" fill="#1e3a5f" />
                  <rect x="40" y="30" width="8" height="8" fill="#1e3a5f" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800 dark:text-white leading-snug">{project.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{project.sf.toLocaleString()} SF</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{project.coreSize}" Core ICF Walls</div>
              </div>
            </div>
          </div>

          {/* Comparison Overview */}
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Comparison Overview</h3>
            <div className="space-y-1.5">
              {[
                `${compareSelections.length} Systems Compared`,
                `All ${project.coreSize}" Core Width`,
                `Based on ${project.sf.toLocaleString()} SF of ICF Wall Area`,
                `Pricing Updated: ${project.date}`,
              ].map((line) => (
                <div key={line} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <div className="w-1 h-1 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Key Insights */}
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Key Insights</h3>
            <div className="space-y-3">
              {[
                { icon: '💰', text: 'Material costs range up to $40,302 between systems.' },
                { icon: '👷', text: 'Labor costs vary based on block size and installation method.' },
                { icon: '🌡️', text: 'R-value performance is similar across selected systems.' },
                { icon: '📦', text: 'Bundle quantity impacts delivery frequency and site storage.' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{text}</span>
                </div>
              ))}
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                Review all factors to determine the best solution for your project.
              </p>
            </div>
          </div>

          {/* Need Help Deciding */}
          <div className="border-t border-gray-200 dark:border-navy-700 pt-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Need Help Deciding?</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Our ICF experts can help you analyze these systems for your specific project.
            </p>
            <Button variant="secondary" size="sm" icon={MessageCircle} className="w-full">
              Talk to an Expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
