import { useState, useMemo, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown, ChevronRight, AlertCircle, CheckCircle,
  FileText, ArrowRight, Settings2, Info,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { ACTIVE_PROJECT } from '../../data/projectData'
import { WALL_SEGMENTS, PROJECT_CORNERS } from '../../data/wallSegments'
import { getMfrBlock, getMfr } from '../../data/manufacturers'
import { calcTakeoff } from '../../lib/takeoffCalc'

// ── Waste defaults ─────────────────────────────────────────────────────────
const DEFAULT_WASTE = { blocks: 5, rebar: 7.5, concrete: 4 }

// ── Number formatters ──────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString()
const fmtDec = (n, d = 1) => n.toFixed(d)

// ── Stat card ──────────────────────────────────────────────────────────────
function Stat({ label, value, unit, sub, accent }) {
  return (
    <div className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-navy-700 rounded-xl p-4">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? 'text-teal-500' : 'text-gray-900 dark:text-white'}`}>
        {value}
        {unit && <span className="text-sm font-normal ml-1 text-gray-500 dark:text-gray-400">{unit}</span>}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Section heading for material table ───────────────────────────────────
function MatRow({ label, qty, unit, waste, note, highlight, formula }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <tr
        className={`border-b border-gray-100 dark:border-navy-700 text-sm ${
          highlight ? 'bg-teal-50 dark:bg-teal-900/10' : 'hover:bg-gray-50 dark:hover:bg-navy-800/50'
        }`}
      >
        <td className="py-2.5 px-4 font-medium text-gray-800 dark:text-white">
          <div className="flex items-center gap-2">
            {formula && (
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="text-gray-400 hover:text-teal-500 transition-colors cursor-pointer"
              >
                <Info size={13} />
              </button>
            )}
            {label}
          </div>
        </td>
        <td className="py-2.5 px-4 text-right font-mono text-gray-700 dark:text-gray-300">{fmt(qty)}</td>
        <td className="py-2.5 px-4 text-gray-500 dark:text-gray-400">{unit}</td>
        <td className="py-2.5 px-4 text-right">
          {waste != null && (
            <span className="text-xs text-orange-500 font-medium">+{waste}%</span>
          )}
        </td>
        <td className="py-2.5 px-4 font-mono font-semibold text-gray-800 dark:text-white text-right">
          {waste != null ? fmt(Math.ceil(qty * (1 + waste / 100))) : '—'}
        </td>
        <td className="py-2.5 px-4 text-xs text-gray-400 dark:text-gray-500">{note}</td>
      </tr>
      {open && formula && (
        <tr className="bg-teal-50 dark:bg-navy-900 border-b border-teal-100 dark:border-navy-700">
          <td colSpan={6} className="px-8 py-2 text-xs text-teal-700 dark:text-teal-400 font-mono">
            {formula}
          </td>
        </tr>
      )}
    </>
  )
}

// ── Segment row ────────────────────────────────────────────────────────────
function SegRow({ seg }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <tr
        className="border-b border-gray-100 dark:border-navy-700 text-sm hover:bg-gray-50 dark:hover:bg-navy-800/40 cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        <td className="py-2 px-4">
          <div className="flex items-center gap-2">
            {open ? <ChevronDown size={13} className="text-gray-400" /> : <ChevronRight size={13} className="text-gray-400" />}
            <span className="font-medium text-gray-800 dark:text-white">{seg.label}</span>
          </div>
        </td>
        <td className="py-2 px-4 text-right font-mono text-gray-600 dark:text-gray-300">{seg.lengthFt}′</td>
        <td className="py-2 px-4 text-right font-mono text-gray-600 dark:text-gray-300">{seg.heightFt}′–0″</td>
        <td className="py-2 px-4 text-center">
          {seg.isCutCourse
            ? <span className="text-xs text-orange-500 font-medium">{seg.courses} (+cut)</span>
            : <span className="text-xs text-gray-500 dark:text-gray-400">{seg.courses}</span>}
        </td>
        <td className="py-2 px-4 text-right font-mono text-gray-600 dark:text-gray-300">{fmtDec(seg.grossAreaSf)} SF</td>
        <td className="py-2 px-4 text-right">
          {seg.openings.length > 0
            ? <span className="text-xs text-blue-500">−{fmtDec(seg.openingsAreaSf)} SF</span>
            : <span className="text-xs text-gray-300 dark:text-gray-600">—</span>}
        </td>
        <td className="py-2 px-4 text-right font-mono font-semibold text-gray-800 dark:text-white">{fmtDec(seg.netAreaSf)} SF</td>
        <td className="py-2 px-4 text-right font-mono text-teal-600 dark:text-teal-400 font-medium">{seg.netBlocks}</td>
        <td className="py-2 px-4 text-right font-mono text-gray-500 dark:text-gray-400 text-xs">{fmtDec(seg.concreteYd3, 1)} yd³</td>
      </tr>
      {open && seg.openings.length > 0 && (
        <tr className="bg-blue-50 dark:bg-navy-900 border-b border-blue-100 dark:border-navy-700">
          <td colSpan={9} className="px-8 py-2">
            <div className="grid grid-cols-3 gap-x-8 gap-y-0.5">
              {seg.openings.map((o, i) => (
                <div key={i} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                  <span>{o.label}</span>
                  <span className="font-mono">{o.widthFt}′ × {o.heightFt}′ = {fmtDec(o.widthFt * o.heightFt, 1)} SF</span>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Takeoff() {
  const navigate = useNavigate()
  const project = ACTIVE_PROJECT
  const mfr = getMfr(project.manufacturer)

  const [coreSize, setCoreSize] = useState(String(project.coreSize))
  const [wastePcts, setWastePcts] = useState(DEFAULT_WASTE)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState('quantities') // quantities | courses | openings

  const block = useMemo(
    () => getMfrBlock(project.manufacturer, Number(coreSize)),
    [coreSize],
  )

  const result = useMemo(
    () => calcTakeoff(WALL_SEGMENTS, block, Number(coreSize), PROJECT_CORNERS, wastePcts),
    [block, wastePcts],
  )

  // Group segments by level
  const levels = [...new Set(WALL_SEGMENTS.map((s) => s.level))]

  return (
    <div className="h-full flex overflow-hidden">

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-semibold text-gray-800 dark:text-white">Takeoff</h1>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{project.name}</span>
            <Badge variant="green">{mfr?.shortName} {coreSize}″ Core</Badge>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSettings((s) => !s)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showSettings ? 'bg-teal-500/10 text-teal-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              <Settings2 size={15} />
            </button>
            <Button size="sm" iconRight={ArrowRight} onClick={() => navigate('/preconstruction/estimates')}>
              View Estimate
            </Button>
          </div>
        </div>

        {/* Waste settings overlay */}
        {showSettings && (
          <div className="flex items-center gap-6 px-6 py-3 bg-teal-50 dark:bg-navy-800 border-b border-teal-200 dark:border-teal-900 text-sm flex-shrink-0">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Waste Factors</span>
            {[
              { key: 'blocks', label: 'Blocks', hint: '3–7%' },
              { key: 'rebar', label: 'Rebar', hint: '5–10%' },
              { key: 'concrete', label: 'Concrete', hint: '3–5%' },
            ].map(({ key, label, hint }) => (
              <label key={key} className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 dark:text-gray-300">{label}</span>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.5}
                  value={wastePcts[key]}
                  onChange={(e) => setWastePcts((w) => ({ ...w, [key]: Number(e.target.value) }))}
                  className="w-14 text-right bg-white dark:bg-navy-700 border border-gray-300 dark:border-navy-600 rounded-md px-2 py-0.5 font-mono text-xs text-gray-800 dark:text-white"
                />
                <span className="text-gray-400">{hint}</span>
              </label>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-4 px-6 py-4 flex-shrink-0 border-b border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-950">
          <Stat label="Net Wall Area" value={fmt(result.totalNetAreaSf)} unit="SF" sub={`Gross: ${fmt(result.totalGrossAreaSf)} SF`} />
          <Stat label="Total Blocks" value={fmt(result.totalBlocksWithWaste)} unit="ea" sub={`w/ ${wastePcts.blocks}% waste`} accent />
          <Stat label="Concrete" value={fmtDec(result.concreteWithWaste, 1)} unit="yd³" sub={`w/ ${wastePcts.concrete}% waste`} />
          <Stat label="Rebar" value={fmt(result.totalRebarWithWaste)} unit="LF" sub={`${fmt(result.rebarBarCount)} bars @ 20′`} />
          <Stat label="Bracing Sets" value={fmt(result.braceCount)} unit="ea" sub={`@ 5′–0″ o.c.`} />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-navy-700 flex-shrink-0 bg-white dark:bg-navy-900 px-6">
          {[
            { id: 'quantities', label: 'Wall Quantities' },
            { id: 'materials', label: 'Materials Breakdown' },
            { id: 'openings', label: `Openings (${result.totalOpeningsCount})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === id
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Wall Quantities tab ── */}
          {activeTab === 'quantities' && (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
                <tr>
                  {['Segment', 'Length', 'Height', 'Courses', 'Gross Area', '− Openings', 'Net Area', 'Blocks', 'Concrete'].map((h) => (
                    <th key={h} className="py-2.5 px-4 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] whitespace-nowrap last:text-right">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {levels.map((level) => {
                  const segs = result.segCalcs.filter((s) => s.level === level)
                  const lvlNetArea = segs.reduce((s, x) => s + x.netAreaSf, 0)
                  const lvlBlocks = segs.reduce((s, x) => s + x.netBlocks, 0)
                  const lvlConcrete = segs.reduce((s, x) => s + x.concreteYd3, 0)
                  return (
                    <Fragment key={level}>
                      <tr className="bg-gray-100 dark:bg-navy-800">
                        <td colSpan={9} className="py-1.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                          {level}
                        </td>
                      </tr>
                      {segs.map((seg) => <SegRow key={seg.id} seg={seg} />)}
                      <tr className="bg-teal-50 dark:bg-teal-900/10 border-b-2 border-teal-200 dark:border-teal-800 text-xs font-semibold">
                        <td className="py-2 px-4 text-teal-700 dark:text-teal-400">Level Subtotal</td>
                        <td className="py-2 px-4 text-right font-mono text-teal-700 dark:text-teal-400">
                          {segs.reduce((s, x) => s + x.lengthFt, 0)}′
                        </td>
                        <td className="py-2 px-4" />
                        <td className="py-2 px-4" />
                        <td className="py-2 px-4" />
                        <td className="py-2 px-4" />
                        <td className="py-2 px-4 text-right font-mono text-teal-700 dark:text-teal-400">
                          {fmtDec(lvlNetArea, 1)} SF
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-teal-700 dark:text-teal-400">{lvlBlocks}</td>
                        <td className="py-2 px-4 text-right font-mono text-teal-700 dark:text-teal-400">
                          {fmtDec(lvlConcrete, 1)} yd³
                        </td>
                      </tr>
                    </Fragment>
                  )
                })}
                {/* Grand total */}
                <tr className="bg-teal-600 text-white text-xs font-bold">
                  <td className="py-3 px-4">TOTAL</td>
                  <td className="py-3 px-4 text-right font-mono">{result.totalLengthFt}′</td>
                  <td className="py-3 px-4" />
                  <td className="py-3 px-4 text-center">{result.maxCourses}</td>
                  <td className="py-3 px-4 text-right font-mono">{fmt(result.totalGrossAreaSf)} SF</td>
                  <td className="py-3 px-4 text-right font-mono">−{fmt(result.totalOpeningsAreaSf)} SF</td>
                  <td className="py-3 px-4 text-right font-mono">{fmt(result.totalNetAreaSf)} SF</td>
                  <td className="py-3 px-4 text-right font-mono">{fmt(result.totalNetBlocks)}</td>
                  <td className="py-3 px-4 text-right font-mono">{fmtDec(result.concreteRaw, 1)} yd³</td>
                </tr>
              </tbody>
            </table>
          )}

          {/* ── Materials Breakdown tab ── */}
          {activeTab === 'materials' && (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
                <tr>
                  {['Material', 'Calc Qty', 'Unit', 'Waste', 'Order Qty', 'Notes'].map((h) => (
                    <th key={h} className="py-2.5 px-4 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* ICF Blocks */}
                <tr className="bg-gray-100 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                  <td colSpan={6} className="py-1.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    ICF Blocks — {mfr?.shortName} {coreSize}″ Core ({block?.blockHeightIn}″ × {block?.blockLengthIn}″ · {block?.sfPerBlock} SF/block)
                  </td>
                </tr>
                <MatRow
                  label="Straight Blocks"
                  qty={result.straightBlocks}
                  unit="ea"
                  waste={wastePcts.blocks}
                  note={`${block?.sfPerBlock} SF/block · net area ${fmt(result.totalNetAreaSf)} SF`}
                  formula={`Net area ÷ sfPerBlock = ${fmt(result.totalNetAreaSf)} ÷ ${block?.sfPerBlock} = ${result.totalNetBlocks} total, minus ${result.cornerBlocks + result.tBlocks} corner/T positions`}
                />
                <MatRow
                  label={`Corner Blocks (90°)`}
                  qty={result.cornerBlocks}
                  unit="ea"
                  waste={wastePcts.blocks}
                  note={`${PROJECT_CORNERS.junctions90 + PROJECT_CORNERS.junctionsInterior} junctions × 2 legs × ${result.maxCourses} courses`}
                  formula={`Junctions × 2 sides × courses = ${PROJECT_CORNERS.junctions90 + PROJECT_CORNERS.junctionsInterior} × 2 × ${result.maxCourses}`}
                />
                <MatRow
                  label="T-Wall Blocks"
                  qty={result.tBlocks}
                  unit="ea"
                  waste={wastePcts.blocks}
                  note={`${PROJECT_CORNERS.tWallJunctions} T-junctions × ${result.maxCourses} courses`}
                  formula={`T-junctions × courses = ${PROJECT_CORNERS.tWallJunctions} × ${result.maxCourses}`}
                />
                <MatRow
                  label="Foam Loss (Opening Cutouts)"
                  qty={result.foamLossBlocks}
                  unit="blks"
                  waste={null}
                  note="Deducted from gross; charge as waste cost only"
                />

                {/* Concrete */}
                <tr className="bg-gray-100 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                  <td colSpan={6} className="py-1.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Concrete — Core Fill ({coreSize}″ core)
                  </td>
                </tr>
                <MatRow
                  label="Concrete (core fill)"
                  qty={result.concreteRaw}
                  unit="yd³"
                  waste={wastePcts.concrete}
                  note={`${result.totalLengthFt}′ × ${coreSize / 12}′ core × avg ${result.maxWallHeightFt}′ ÷ 27`}
                  formula={`Wall Length × Core Width (ft) × Wall Height ÷ 27 = ${result.totalLengthFt} × ${(Number(coreSize) / 12).toFixed(3)} × ${result.maxWallHeightFt} ÷ 27`}
                />

                {/* Rebar */}
                <tr className="bg-gray-100 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                  <td colSpan={6} className="py-1.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Rebar & Reinforcement (incl. 15% lap / development)
                  </td>
                </tr>
                <MatRow
                  label="Horizontal Rebar"
                  qty={result.rebarHorizLf}
                  unit="LF"
                  waste={wastePcts.rebar}
                  note={`${result.maxCourses} courses × 2 rows/course × ${result.totalLengthFt}′ × 1.15 lap`}
                  formula={`Wall Length × (Courses × 2 rows) × 1.15 = ${result.totalLengthFt} × ${result.maxCourses * 2} × 1.15`}
                />
                <MatRow
                  label="Vertical Rebar"
                  qty={result.rebarVertLf}
                  unit="LF"
                  waste={wastePcts.rebar}
                  note={`Bars @ 24″ o.c. × ${result.maxWallHeightFt}′ wall ht × 1.15 lap`}
                  formula={`(Wall Length ÷ 2′ spacing) × Wall Height × 1.15 = ${Math.ceil(result.totalLengthFt / 2)} bars × ${result.maxWallHeightFt} × 1.15`}
                />
                <MatRow
                  label="Lintel Rebar (openings)"
                  qty={result.lintelBarLf}
                  unit="LF"
                  waste={wastePcts.rebar}
                  note={`2 bars per opening × (width + 3′ development each end)`}
                />

                {/* Buck material */}
                <tr className="bg-gray-100 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                  <td colSpan={6} className="py-1.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Openings & Buck Material
                  </td>
                </tr>
                <MatRow
                  label="Buck Lumber (2× framing)"
                  qty={result.buckLf}
                  unit="LF"
                  waste={5}
                  note={`Rough bucks: 2 sides + head per opening × both foam sides`}
                />

                {/* Bracing */}
                <tr className="bg-gray-100 dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
                  <td colSpan={6} className="py-1.5 px-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Bracing, Scaffold & Strongbacks
                  </td>
                </tr>
                <MatRow
                  label="Brace Sets"
                  qty={result.braceCount}
                  unit="sets"
                  waste={null}
                  note={`Wall length ÷ 5′ o.c. = ${result.totalLengthFt} ÷ 5`}
                  formula={`Wall Length ÷ 5′ spacing = ${result.totalLengthFt} ÷ 5 = ${result.braceCount}`}
                />
                <MatRow
                  label="Scaffold Sets"
                  qty={result.scaffoldCount}
                  unit="sets"
                  waste={null}
                  note="Matches brace count"
                />
                {result.strongbackCount > 0 && (
                  <MatRow
                    label="Strongbacks"
                    qty={result.strongbackCount}
                    unit="ea"
                    waste={null}
                    note={`Required: ${result.strongbackSegments.join(', ')}`}
                  />
                )}
              </tbody>
            </table>
          )}

          {/* ── Openings tab ── */}
          {activeTab === 'openings' && (
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-50 dark:bg-navy-900 border-b border-gray-200 dark:border-navy-700">
                <tr>
                  {['Wall Segment', 'Opening', 'Width', 'Height', 'Area', 'Buck LF', 'Lintel Rebar', 'Notes'].map((h) => (
                    <th key={h} className="py-2.5 px-4 text-left font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WALL_SEGMENTS.filter((s) => s.openings.length > 0).map((seg) => (
                  <Fragment key={seg.id}>
                  {seg.openings.map((o, oi) => {
                    const area = o.widthFt * o.heightFt
                    const buck = 2 * (2 * o.heightFt + o.widthFt)
                    const lintel = (o.widthFt + 3) * 2
                    const isLarge = o.widthFt > 8
                    return (
                      <tr
                        key={`${seg.id}-${oi}`}
                        className={`border-b border-gray-100 dark:border-navy-700 hover:bg-gray-50 dark:hover:bg-navy-800/40 ${isLarge ? 'bg-orange-50 dark:bg-orange-900/5' : ''}`}
                      >
                        <td className="py-2 px-4 font-medium text-gray-700 dark:text-gray-300">
                          <div>
                            <div>{seg.label}</div>
                            <div className="text-gray-400 text-[10px]">{seg.level}</div>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-gray-800 dark:text-white">{o.label}</td>
                        <td className="py-2 px-4 font-mono text-gray-600 dark:text-gray-300">{o.widthFt}′</td>
                        <td className="py-2 px-4 font-mono text-gray-600 dark:text-gray-300">{o.heightFt}′</td>
                        <td className="py-2 px-4 font-mono text-gray-600 dark:text-gray-300">{fmtDec(area, 1)} SF</td>
                        <td className="py-2 px-4 font-mono text-gray-600 dark:text-gray-300">{fmtDec(buck, 1)} LF</td>
                        <td className="py-2 px-4 font-mono text-gray-600 dark:text-gray-300">{fmtDec(lintel, 1)} LF</td>
                        <td className="py-2 px-4">
                          {isLarge && (
                            <span className="flex items-center gap-1 text-orange-500 text-[10px]">
                              <AlertCircle size={11} /> Verify lintel design
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="w-60 flex-shrink-0 border-l border-gray-200 dark:border-navy-700 bg-white dark:bg-navy-900 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-navy-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Block Summary</p>
          <div className="space-y-2">
            {[
              { label: 'Straight Blocks', value: result.straightWithWaste, color: 'teal' },
              { label: 'Corner Blocks', value: result.cornersWithWaste, color: 'blue' },
              { label: 'T-Wall Blocks', value: result.tBlocksWithWaste, color: 'purple' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
                <span className={`text-xs font-bold font-mono text-${color}-500`}>{fmt(value)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-navy-700 pt-2 flex justify-between">
              <span className="text-xs font-semibold text-gray-800 dark:text-white">Total Order</span>
              <span className="text-sm font-bold text-teal-500 font-mono">{fmt(result.totalBlocksWithWaste)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-navy-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Concrete</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{fmtDec(result.concreteWithWaste, 1)} <span className="text-sm font-normal text-gray-400">yd³</span></p>
          <p className="text-xs text-gray-400 mt-1">
            Formula: {result.totalLengthFt}′ × {(Number(coreSize) / 12).toFixed(3)}′ × {result.maxWallHeightFt}′ ÷ 27
          </p>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-navy-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Rebar</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Horizontal</span>
              <span className="font-mono text-gray-800 dark:text-white">{fmt(result.rebarHorizLf)} LF</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Vertical</span>
              <span className="font-mono text-gray-800 dark:text-white">{fmt(result.rebarVertLf)} LF</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Lintels</span>
              <span className="font-mono text-gray-800 dark:text-white">{fmt(result.lintelBarLf)} LF</span>
            </div>
            <div className="border-t border-gray-200 dark:border-navy-700 pt-1.5 flex justify-between text-xs font-semibold">
              <span className="text-gray-800 dark:text-white">Total w/ waste</span>
              <span className="font-mono text-teal-500">{fmt(result.totalRebarWithWaste)} LF</span>
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>20′ bar count</span>
              <span className="font-mono">{fmt(result.rebarBarCount)} bars</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-navy-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Course Check</p>
          <div className="space-y-1">
            {result.topCourseCheck.slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-xs">
                {c.exactFit
                  ? <CheckCircle size={11} className="text-teal-400 flex-shrink-0" />
                  : <AlertCircle size={11} className="text-orange-400 flex-shrink-0" />}
                <span className="text-gray-500 dark:text-gray-400 truncate">{c.label}</span>
                <span className={`ml-auto font-mono flex-shrink-0 ${c.exactFit ? 'text-gray-500' : 'text-orange-400'}`}>
                  {c.exactFit ? `${c.courses}c` : `${c.courses}c+${c.cutHeightIn}″`}
                </span>
              </div>
            ))}
            {result.topCourseCheck.length > 4 && (
              <p className="text-xs text-gray-400 text-center">+{result.topCourseCheck.length - 4} more</p>
            )}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <Button className="w-full" size="sm" iconRight={ArrowRight} onClick={() => navigate('/preconstruction/estimates')}>
            View Estimate
          </Button>
          <Button variant="secondary" className="w-full" size="sm" icon={FileText}>
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
