import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3, Bot, Box, BriefcaseBusiness, CalendarDays, Calculator, ClipboardCheck,
  Database, FileBarChart, FileImage, FileText, Headphones, LayoutDashboard,
  MessageSquare, Package, Settings2, Shapes, Upload, Users, Wrench,
} from 'lucide-react'

const DASHBOARD_SECTIONS = [
  { title: 'Main', items: [
    ['Dashboard', '/dashboard', LayoutDashboard], ['Projects', '/projects', BriefcaseBusiness],
    ['Calendar', '/calendar', CalendarDays], ['Tasks', '/tasks', ClipboardCheck],
    ['Team', '/team', Users], ['Messages', '/messages', MessageSquare],
  ] },
  { title: 'Pre-Construction', items: [
    ['Plan Viewer', '/preconstruction/plan-viewer', FileImage], ['AI Detection', '/preconstruction/ai-detection', Bot],
    ['3D Model', '/preconstruction/3d-model', Box], ['Takeoff', '/preconstruction/takeoff', Wrench],
    ['Estimates', '/preconstruction/estimates', Calculator], ['Bid / Proposal', '/preconstruction/bid-proposal', FileText],
    ['Compare Manufacturers', '/preconstruction/compare', Shapes], ['Scope & Matrix', '/preconstruction/scope-matrix', ClipboardCheck],
    ['Project Dashboard', '/preconstruction/project-dashboard', BarChart3],
  ] },
  { title: 'Database', items: [
    ['Cost Database', '/cost-database', Database], ['Labor Database', '/database/labor', Users],
    ['Manufacturer Center', '/database/manufacturers', Package],
  ] },
  { title: 'Tools', items: [
    ['Reports', '/reports', FileBarChart], ['Export', '/tools/export', Upload], ['Notes & Voice', '/tools/notes', MessageSquare],
  ] },
]

const PRECON_ITEMS = DASHBOARD_SECTIONS[1].items

function SideLink({ item }) {
  const [label, to, Icon] = item
  return (
    <NavLink to={to} className={({ isActive }) => `flex h-[30px] items-center gap-3 rounded-md px-3 text-xs transition-colors ${isActive ? 'bg-teal-500/15 text-teal-300' : 'text-slate-300 hover:bg-[#12232d] hover:text-white'}`}>
      <Icon size={14} strokeWidth={1.7}/><span>{label}</span>
    </NavLink>
  )
}

function NavigationSections({ sections }) {
  return sections.map((section) => (
    <div key={section.title} className="mb-3">
      <h2 className="mb-1 px-3 text-[10px] font-medium uppercase tracking-wide text-slate-400">{section.title}</h2>
      <div className="space-y-0.5">{section.items.map((item) => <SideLink key={item[1]} item={item}/>)}</div>
    </div>
  ))
}

export default function Sidebar() {
  const { pathname: path } = useLocation()
  if (path === '/' || path === '/preconstruction/plan-viewer') return null
  if (path === '/dashboard') {
    return (
      <aside className="flex w-[206px] shrink-0 flex-col border-r border-[#1c303c] bg-[#081722] p-3">
        <div className="min-h-0 flex-1 overflow-y-auto"><NavigationSections sections={DASHBOARD_SECTIONS}/></div>
        <div className="rounded-md border border-[#263c47] bg-[#0b1c27] p-3">
          <div className="flex items-center gap-2"><Headphones size={20} className="text-teal-400"/><strong className="text-xs">Need Help?</strong></div>
          <p className="mt-2 text-[11px] text-slate-300">Chat with our ICF experts</p>
          <button type="button" className="mt-3 w-full rounded bg-teal-600/30 py-2 text-xs text-teal-300">Start Chat</button>
        </div>
      </aside>
    )
  }
  if (!path.startsWith('/preconstruction')) return null
  return (
    <aside className="flex w-[206px] shrink-0 flex-col border-r border-[#1c303c] bg-[#081722] p-3">
      <h2 className="mb-2 px-3 text-[10px] uppercase tracking-wide text-slate-400">Pre-Construction</h2>
      <div className="space-y-1">{PRECON_ITEMS.map((item)=><SideLink key={item[1]} item={item}/>)}</div>
      <div className="mt-auto flex items-center gap-2 border-t border-[#20333f] px-3 pt-3 text-xs text-slate-400"><Settings2 size={14}/>Preferences</div>
    </aside>
  )
}
