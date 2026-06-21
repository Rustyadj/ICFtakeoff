import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Bot, Box, ChevronDown, ChevronLeft, ChevronRight,
  Cloud, Columns3, FileImage, FileSearch, FileText, FolderPlus, Hand,
  Maximize2, MousePointer2, MoveDiagonal, Octagon, Pencil, Plus, Redo2, Ruler,
  Settings, Shapes, Square, Type, Undo2, Upload, ZoomIn,
} from 'lucide-react'
import planReference from '../../assets/plan-viewer-reference.png'

const SHEETS = [
  ['A0.0','Foundation Plan'],['A1.0','Main Floor Plan'],['A2.0','Second Floor Plan'],
  ['A3.0','Roof Plan'],['S1.0','Structural Plan'],['S2.0','Rebar Details'],
]

const TOOLS = [
  [MousePointer2,'Select',''],[FileSearch,'Wall Trace','W'],[Square,'Opening','O'],
  [Octagon,'Corner','C'],[Columns3,'T-Wall','T'],[Shapes,'Rebar','R'],
  [Square,'Area','A'],[FolderPlus,'Count',''],[Ruler,'Measure','M'],[Type,'Text',''],[Cloud,'Cloud',''],
]

const SUMMARY = [
  [FileText,'Wall Area (Net)','2,847','SF','text-teal-400 bg-teal-500/10'],
  [Box,'Concrete Volume','23.6','yd³','text-green-400 bg-green-500/10'],
  [Ruler,'Rebar (Total)','2,186','LF','text-sky-400 bg-sky-500/10'],
  [Shapes,'Corners','42','','text-amber-400 bg-amber-500/10'],
  [Square,'Openings','18','','text-orange-400 bg-orange-500/10'],
  [Octagon,'Bucks / Lintels','88','LF','text-purple-400 bg-purple-500/10'],
  [Ruler,'Bracing','76','','text-sky-400 bg-sky-500/10'],
]

const DETECTED = [
  ['Wall','Exterior Wall','96′-0″','Detected','98%'],['Wall','Exterior Wall','42′-0″','Detected','95%'],
  ['Opening','Door Opening 3′-0″','3','Needs Review','78%'],['Corner','90° Corner','12','Detected','96%'],
  ['T-Wall','T-Wall Intersection','2','Detected','94%'],
]

const LAYER_ITEMS = [
  ['Plan Layer','bg-teal-300'],['Detected Walls','bg-purple-400'],['Openings','bg-orange-500'],
  ['Corners','bg-purple-500'],['T-Walls','bg-sky-300'],['Dimensions','bg-slate-400'],['Text / Notes','bg-slate-600'],
]

function IconButton({ Icon, active = false, onClick, label }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`flex h-8 w-8 items-center justify-center rounded ${active?'bg-teal-600 text-white':'text-slate-200 hover:bg-[#172833]'}`}><Icon size={16} strokeWidth={1.7}/></button>
}

function LeftRail({ activeSheet, setActiveSheet, activeTool, setActiveTool }) {
  return (
    <aside className="flex min-h-0 w-[204px] shrink-0 flex-col border-r border-[#21343f] bg-[#091923]">
      <button type="button" className="flex h-11 items-center gap-2 border-b border-[#20333e] px-5 text-xs"><ArrowLeft size={14}/>Back to Project</button>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center justify-between"><h2 className="text-[10px] font-semibold">SHEETS</h2><button type="button" className="flex items-center gap-1 rounded border border-teal-500/60 px-2 py-1 text-[10px] text-teal-400"><Plus size={11}/>Add</button></div>
        <div className="space-y-1">{SHEETS.map(([code,name],index)=><button type="button" key={code} onClick={()=>setActiveSheet(index)} className={`flex w-full items-center gap-3 rounded px-2 py-1.5 text-left ${activeSheet===index?'bg-teal-600/30 text-teal-300':'hover:bg-[#122630]'}`}><span className="flex h-8 w-8 items-center justify-center rounded bg-[#172833]"><FileText size={15}/></span><span><strong className="block text-[11px]">{code}</strong><span className="block text-[11px]">{name}</span></span></button>)}</div>
        <div className="my-3 border-t border-[#22343e]"/>
        <h2 className="mb-2 text-[10px] font-semibold">TOOLS</h2>
        <div>{TOOLS.map(([Icon,label,key],index)=><button type="button" key={label} onClick={()=>setActiveTool(index)} className={`flex h-[27px] w-full items-center gap-3 rounded px-2 text-xs ${activeTool===index?'bg-teal-600/30 text-teal-300':'text-slate-200 hover:bg-[#122630]'}`}><Icon size={14}/><span className="flex-1 text-left">{label}</span><span className="text-[10px]">{key}</span></button>)}</div>
        <div className="my-3 border-t border-[#22343e]"/>
        <div className="space-y-1">{[[ZoomIn,'Zoom Window','Z'],[Hand,'Pan','P']].map(([Icon,label,key])=><button type="button" key={label} className="flex h-7 w-full items-center gap-3 px-2 text-xs"><Icon size={14}/><span className="flex-1 text-left">{label}</span><span>{key}</span></button>)}</div>
      </div>
      <div className="space-y-3 border-t border-[#20333e] p-4 text-xs"><button type="button" className="flex items-center gap-2"><Settings size={14}/>Preferences</button><button type="button" className="flex items-center gap-2"><FileText size={14}/>Shortcuts</button></div>
    </aside>
  )
}

function SummaryRail({ navigate }) {
  return (
    <aside className="flex w-[270px] shrink-0 flex-col border-l border-[#20333e] bg-[#091923] p-3">
      <div className="flex items-center justify-between py-1"><h2 className="text-xs font-semibold">TAKEOFF SUMMARY</h2><button type="button" className="flex items-center gap-2 rounded border border-[#263b46] px-3 py-2 text-[10px]">All Assemblies <ChevronDown size={11}/></button></div>
      <div className="mt-2 space-y-1.5">{SUMMARY.map(([Icon,label,value,unit,color])=><div key={label} className="flex items-center rounded-md bg-[#10232e] p-3"><span className={`mr-3 flex h-9 w-9 items-center justify-center rounded ${color}`}><Icon size={19}/></span><span><span className="block text-[10px] text-slate-300">{label}</span><strong className="text-xl">{value}</strong> <b className="text-xs">{unit}</b></span></div>)}</div>
      <div className="mt-2 rounded-md bg-[#10232e] p-3 text-[10px]"><strong>SYSTEM IMPACT <span className="font-normal text-slate-300">(Nudura 6″ Core)</span></strong><div className="mt-2 space-y-2">{[['Courses','8'],['Straight Blocks','482'],['Corner Blocks','40'],['T-Blocks','12'],['Concrete','23.6 yd³'],['Rebar','2,186 LF']].map(([a,b])=><div key={a} className="flex"><span className="flex-1">{a}</span><strong>{b}</strong></div>)}</div></div>
      <button type="button" onClick={()=>navigate('/preconstruction/estimates')} className="mt-4 flex h-10 items-center justify-center gap-4 rounded bg-teal-600 text-xs font-semibold">View Estimate <ArrowRight size={15}/></button>
    </aside>
  )
}

function BottomPanels({ layers, toggleLayer }) {
  return (
    <div className="grid h-[263px] grid-cols-[1.55fr_.56fr_.6fr] gap-2 bg-[#071620] p-2">
      <section className="rounded border border-[#263a45] bg-[#0a1a24] p-3"><h2 className="text-[11px] font-semibold">DETECTED ITEMS <span className="ml-2 rounded bg-teal-600 px-1.5 py-0.5">24</span></h2><div className="mt-2 grid grid-cols-[.6fr_1.15fr_.55fr_.7fr_.3fr] text-[10px] text-slate-300"><span>Type</span><span>Description</span><span>Length/Qty</span><span>Status</span><span>Confidence</span></div><div className="divide-y divide-[#1d303b]">{DETECTED.map((row)=><div key={row[0]+row[2]} className="grid grid-cols-[.6fr_1.15fr_.55fr_.7fr_.3fr] py-2 text-[10px]"><span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span><span className={row[3]==='Detected'?'text-teal-400':'text-amber-400'}>○ {row[3]}</span><span>{row[4]}</span></div>)}</div><button type="button" className="mt-3 flex items-center gap-3 text-[10px] text-teal-400">View All Detected Items <ArrowRight size={12}/></button></section>
      <section className="rounded border border-[#263a45] bg-[#0a1a24] p-3"><h2 className="text-[11px] font-semibold">LAYERS</h2><div className="mt-3 space-y-2">{LAYER_ITEMS.map(([name,color])=><button type="button" onClick={()=>toggleLayer(name)} key={name} className="flex w-full items-center gap-2 text-[10px]"><span className={`flex h-3 w-3 items-center justify-center border border-teal-500 text-[8px] ${layers[name]?'text-teal-400':'text-transparent'}`}>✓</span><span className={`h-3 w-3 rounded-sm ${color}`}/><span className="flex-1 text-left">{name}</span><span>◉</span></button>)}</div></section>
      <section className="rounded border border-[#263a45] bg-[#0a1a24] p-3"><div className="flex items-center justify-between"><h2 className="text-[11px] font-semibold">ANNOTATIONS (3)</h2><button type="button" className="flex items-center gap-1 rounded border border-teal-500/60 px-2 py-1 text-[10px] text-teal-400"><Plus size={11}/>Add</button></div><div className="mt-2 divide-y divide-[#21343f]">{[['Verify garage lintel size','Today, 9:15 AM','bg-purple-600'],['Confirm stair opening','Today, 9:17 AM','bg-orange-600'],['Check rebar at corners','Today, 9:20 AM','bg-teal-600']].map(([text,time,color])=><div key={text} className="flex gap-3 py-3"><span className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] ${color}`}>JD</span><span><strong className="block text-[10px]">{text}</strong><span className="text-[9px] text-slate-400">{time}</span></span></div>)}</div></section>
    </div>
  )
}

export default function PlanViewer() {
  const navigate = useNavigate()
  const [activeSheet,setActiveSheet] = useState(0)
  const [activeTool,setActiveTool] = useState(0)
  const [zoom,setZoom] = useState(100)
  const [page,setPage] = useState(1)
  const [layers,setLayers] = useState(Object.fromEntries(LAYER_ITEMS.map(([name])=>[name,true])))
  const toggleLayer = (name)=>setLayers((current)=>({...current,[name]:!current[name]}))
  return (
    <div className="flex h-full min-w-[1180px] flex-col overflow-hidden bg-[#07151f] text-slate-100">
      <div className="flex h-[55px] shrink-0 items-center border-b border-[#21343f]">
        <div className="w-[265px] px-4"><h1 className="text-base font-semibold">Plan Viewer</h1><p className="text-xs text-slate-300">Pine Ridge Custom Home <Pencil size={12} className="inline"/></p></div>
        <div className="flex flex-1 items-center justify-center gap-2 text-xs">{[[Upload,'Upload Plans'],[Bot,'AI Detection'],[Box,'3D Model'],[FileImage,'Takeoff'],[Shapes,'Compare'],[FileText,'Reports']].map(([Icon,label])=><button type="button" key={label} className="flex h-9 items-center gap-2 rounded border border-[#2a3d48] px-4"><Icon size={14}/>{label}{label==='AI Detection'?<span className="rounded bg-teal-600 px-1 text-[9px]">97%</span>:null}</button>)}</div>
        <div className="flex w-[378px] items-center justify-end gap-2 px-4 text-xs"><span>System:</span><button type="button" className="flex h-9 w-[205px] items-center gap-2 rounded border border-[#2a3d48] px-4"><Box size={17} className="text-teal-400"/>Nudura 6″ Core <ChevronDown size={12} className="ml-auto"/></button><IconButton Icon={Settings} label="Settings"/></div>
      </div>

      <div className="flex h-[45px] shrink-0 items-center border-b border-[#21343f] px-[212px] text-xs">
        <div className="flex flex-1 items-center gap-2">{[[MousePointer2,true],[Hand],[ZoomIn],[ZoomIn],[ZoomIn]].map(([Icon,active],i)=><IconButton key={i} Icon={Icon} active={active} onClick={i>1?()=>setZoom((value)=>Math.min(200,value+10)):undefined} label="Tool"/>)}<button type="button" onClick={()=>setZoom(100)} className="flex h-8 items-center gap-2 rounded bg-[#12232d] px-3">{zoom}% <ChevronDown size={11}/></button><IconButton Icon={Undo2} label="Undo"/><IconButton Icon={MoveDiagonal} label="Dimension"/><IconButton Icon={Square} label="Rectangle"/><IconButton Icon={Octagon} label="Polygon"/><IconButton Icon={Shapes} label="Shape"/><IconButton Icon={Type} label="Text"/><IconButton Icon={Pencil} label="Pencil"/><IconButton Icon={Ruler} label="Ruler"/><button type="button" className="flex h-8 items-center gap-2 rounded bg-[#12232d] px-3">2 px ━━━━ <ChevronDown size={11}/></button><IconButton Icon={Redo2} label="Redo"/><button type="button" className="flex h-8 items-center gap-2 rounded bg-[#12232d] px-3">Markup <ChevronDown size={11}/></button><IconButton Icon={Maximize2} label="Fullscreen"/></div>
      </div>

      <div className="flex min-h-0 flex-1">
        <LeftRail activeSheet={activeSheet} setActiveSheet={setActiveSheet} activeTool={activeTool} setActiveTool={setActiveTool}/>
        <main className="min-w-0 flex-1 overflow-hidden">
          <div className="relative h-[582px] overflow-hidden bg-[#f6f5f2]">
            <img src={planReference} alt="Foundation plan" className="pointer-events-none absolute left-[-204px] top-[-161px] h-auto w-[1536px] max-w-none select-none" />
          </div>
          <div className="flex h-10 items-center gap-3 border-t border-[#1d313c] bg-[#081722] px-2 text-xs"><IconButton Icon={ChevronLeft} label="Previous page" onClick={()=>setPage((p)=>Math.max(1,p-1))}/><span>{page}</span><span>of 6</span><IconButton Icon={ChevronRight} label="Next page" onClick={()=>setPage((p)=>Math.min(6,p+1))}/><button type="button" className="rounded bg-[#11232d] px-3 py-2">▦</button><button type="button" className="rounded bg-[#11232d] px-3 py-2">Scale: 1/4″ = 1′-0″ <ChevronDown size={11} className="inline"/></button><span>Snap <button type="button" className="ml-1 h-4 w-8 rounded-full bg-teal-500"><span className="block h-3 w-3 translate-x-4 rounded-full bg-white"/></button></span><span>Ortho <button type="button" className="ml-1 h-4 w-8 rounded-full bg-slate-600"><span className="block h-3 w-3 translate-x-0.5 rounded-full bg-slate-300"/></button></span></div>
          <BottomPanels layers={layers} toggleLayer={toggleLayer}/>
        </main>
        <SummaryRail navigate={navigate}/>
      </div>
    </div>
  )
}
