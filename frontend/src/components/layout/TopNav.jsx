import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Bell, ChevronDown, Moon, Sun } from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const NAV = [
  ['Dashboard','/dashboard'],['Projects','/projects'],['Pre-construction','/preconstruction/plan-viewer'],
  ['CRM','/crm/leads'],['Reports','/reports'],['Cost Database','/cost-database'],['Settings','/settings/profile'],
]

function BrandMark() {
  return <svg viewBox="0 0 36 40" className="h-9 w-8"><path d="M18 2 33 10.5 18 19 3 10.5 18 2Z" fill="#21c4bd"/><path d="M3 10.5 18 19v18L3 28.5v-18Z" fill="#eaf7f6"/><path d="M33 10.5 18 19v18l15-8.5v-18Z" fill="#8dded9"/><path d="m9 14 9 5 9-5v7l-9 5-9-5v-7Z" fill="#07151f"/></svg>
}

export default function TopNav() {
  const isDark = useAppStore((state)=>state.isDark)
  const toggleTheme = useAppStore((state)=>state.toggleTheme)
  const [menu,setMenu] = useState(null)
  const { pathname } = useLocation()
  const isActive = (to)=>to==='/dashboard'?pathname==='/dashboard':pathname.startsWith(to.split('/').slice(0,2).join('/'))
  return (
    <nav className="z-50 flex h-[60px] shrink-0 items-center border-b border-[#1d313d] bg-[#06151f] px-4 text-white">
      <NavLink to="/" className="mr-8 flex items-center gap-2 border-r border-[#1c303b] pr-5"><BrandMark/><span className="text-[25px] font-semibold tracking-[.03em]">ICFSCOPE</span></NavLink>
      <div className="hidden h-full flex-1 items-center gap-1 lg:flex">{NAV.map(([label,to])=><div key={label} className="relative h-full"><NavLink to={to} onMouseEnter={()=>setMenu(label)} onMouseLeave={()=>setMenu(null)} className={`relative flex h-full items-center gap-2 px-4 text-sm ${isActive(to)?'text-teal-400 after:absolute after:inset-x-4 after:bottom-0 after:h-0.5 after:bg-teal-400':'text-white hover:text-teal-300'}`}>{label}{['Pre-construction','CRM','Settings'].includes(label)?<ChevronDown size={13}/>:null}</NavLink>{menu===label&&['Pre-construction','CRM','Settings'].includes(label)?<div className="absolute left-0 top-full z-50 w-48 rounded-b border border-[#2a3c47] bg-[#0b1b26] p-2 text-xs"><NavLink to={to} className="block rounded px-3 py-2 hover:bg-[#152b36]">Open {label}</NavLink></div>:null}</div>)}</div>
      <div className="ml-auto flex items-center gap-4">
        <button type="button" onClick={toggleTheme} className="flex items-center gap-2 rounded-full border border-[#223642] bg-[#0b1b26] p-2"><Sun size={16}/><span className="relative h-5 w-9 rounded-full bg-[#19343d]"><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${isDark?'left-[18px]':'left-0.5'}`}/></span><Moon size={16}/></button>
        <button type="button" className="relative"><Bell size={21}/><span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-teal-600 text-[8px]">3</span></button>
        <div className="hidden items-center gap-3 md:flex"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs">JD</span><span><strong className="block text-xs">John Davis</strong><span className="block text-[10px] text-slate-400">Davis Concrete</span></span><ChevronDown size={14}/></div>
      </div>
    </nav>
  )
}
