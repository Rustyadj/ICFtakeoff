import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Bot, Box, BriefcaseBusiness, CalendarDays, ChevronDown,
  CircleDollarSign, ClipboardList, FileText, MoreHorizontal, Plus, Upload,
  Wrench, CircleDot,
} from 'lucide-react'
import dashboardReference from '../assets/dashboard-reference.png'

const METRICS = [
  { Icon: ClipboardList, label: 'Active Projects', value: '12', change: '▲ 20%', color: 'text-teal-300 bg-teal-500/15' },
  { Icon: FileText, label: 'Plans Processed', value: '47', change: '▲ 32%', color: 'text-slate-200 bg-slate-500/20' },
  { Icon: Box, label: 'Takeoffs Completed', value: '18', change: '▲ 18%', color: 'text-teal-300 bg-teal-500/15' },
  { Icon: CircleDollarSign, label: 'Estimates Created', value: '9', change: '▲ 29%', color: 'text-emerald-300 bg-emerald-500/15' },
  { Icon: BriefcaseBusiness, label: 'Total Project Value', value: '$8.42M', change: '▲ 24%', color: 'text-purple-300 bg-purple-500/20' },
]

const PROJECTS = [
  ['Pine Ridge Custom Home','PRJ-2024-0047','Austin, TX','Takeoff','75%','2h ago','bg-teal-500','text-teal-300 border-teal-500/50','w-3/4'],
  ['Maple Creek Estates','PRJ-2024-0046','Dallas, TX','AI Detection','45%','4h ago','bg-sky-500','text-sky-300 border-sky-500/50','w-[45%]'],
  ['Modern Lake House','PRJ-2024-0045','Lakeway, TX','Estimate','60%','1d ago','bg-purple-500','text-purple-300 border-purple-500/50','w-3/5'],
  ['Silverton Commercial','PRJ-2024-0044','Houston, TX','Bid / Proposal','30%','2d ago','bg-amber-500','text-amber-300 border-amber-500/50','w-[30%]'],
  ['Hillside Retreat','PRJ-2024-0043','San Antonio, TX','Plan Review','90%','3d ago','bg-blue-300','text-slate-300 border-slate-500/50','w-[90%]'],
]

const ACTIVITIES = [
  ['JD','Pine Ridge Custom Home','Takeoff updated','2h ago','bg-purple-600'],
  ['AC','Maple Creek Estates','AI detection completed','4h ago','bg-amber-600'],
  ['MG','Modern Lake House','Estimate created','1d ago','bg-emerald-700'],
  ['DW','Silverton Commercial','Bid proposal sent','2d ago','bg-sky-700'],
  ['JD','Hillside Retreat','Plans uploaded','3d ago','bg-purple-600'],
]

function Panel({ children, className = '' }) {
  return <section className={`rounded-lg border border-[#213642] bg-[#0b1a25] ${className}`}>{children}</section>
}

function ProjectImage({ index }) {
  const tops = ['top-[-356px]','top-[-414px]','top-[-473px]','top-[-531px]','top-[-590px]']
  return <div className="relative h-10 w-[52px] shrink-0 overflow-hidden rounded"><img src={dashboardReference} alt="" className={`absolute left-[-249px] h-auto w-[1536px] max-w-none ${tops[index]}`}/></div>
}

function Donut({ center, sub, compact = false }) {
  return <div className={`relative shrink-0 rounded-full bg-[conic-gradient(#15b8a6_0_42%,#2d55da_42%_70%,#1696e8_70%_83%,#9850d8_83%)] ${compact?'h-32 w-32':'h-[150px] w-[150px]'}`}><div className="absolute inset-[17px] flex flex-col items-center justify-center rounded-full bg-[#0b1a25]"><strong className="text-2xl">{center}</strong><span className="text-xs text-teal-400">{sub}</span>{compact?null:<span className="text-[11px] text-slate-400">Total Wall Area</span>}</div></div>
}

export default function Dashboard() {
  const navigate = useNavigate()
  return (
    <div className="min-h-full bg-[#071620] p-6 text-white">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-[22px] font-semibold">Welcome back, John</h1><p className="mt-1 text-xs text-slate-300">Here’s what’s happening with your projects today.</p></div>
        <div className="flex gap-3 text-xs"><button type="button" className="flex items-center gap-2 rounded bg-teal-600 px-5 py-3"><Plus size={16}/>New Project</button><button type="button" onClick={()=>navigate('/preconstruction/plan-viewer')} className="flex items-center gap-2 rounded border border-[#30434f] bg-[#0a1924] px-5 py-3"><Upload size={15}/>Upload Plans</button><button type="button" className="flex items-center gap-2 rounded border border-[#30434f] bg-[#0a1924] px-5 py-3"><Bot size={15}/>AI Plan Reading</button></div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {METRICS.map(({Icon,label,value,change,color})=><Panel key={label} className="flex h-[93px] items-center gap-4 p-4"><div className={`flex h-14 w-14 items-center justify-center rounded-lg ${color}`}><Icon size={27} strokeWidth={1.6}/></div><div><div className="text-xs text-slate-300">{label}</div><div className="text-[22px] font-semibold">{value}</div><div className="text-[10px] text-slate-400"><span className="text-teal-400">{change}</span> vs last month</div></div></Panel>)}
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.52fr_1fr]">
        <div className="space-y-3">
          <Panel>
            <div className="flex items-center justify-between p-4"><h2 className="text-sm font-semibold">Recent Projects</h2><button type="button" className="flex items-center gap-2 text-xs text-teal-400">View All Projects <ArrowRight size={13}/></button></div>
            <div className="grid grid-cols-[1.7fr_.9fr_.85fr_.8fr_.5fr_28px] border-y border-[#1e3440] px-4 py-2 text-[10px] text-slate-300"><span>Project Name</span><span>Location</span><span>Stage</span><span>Progress</span><span>Updated</span><MoreHorizontal size={13}/></div>
            <div className="divide-y divide-[#1b313e]">
              {PROJECTS.map((project,index)=><button type="button" key={project[0]} onClick={()=>navigate('/preconstruction/plan-viewer')} className="grid w-full grid-cols-[1.7fr_.9fr_.85fr_.8fr_.5fr_28px] items-center px-4 py-2 text-left text-xs"><div className="flex items-center gap-2"><ProjectImage index={index}/><div><strong className="block text-xs">{project[0]}</strong><span className="text-[10px] text-slate-400">{project[1]}</span></div></div><span>{project[2]}</span><span className={`w-fit rounded border px-2 py-1 text-[10px] ${project[7]}`}>{project[3]}</span><span><span className="block text-[11px]">{project[4]}</span><span className="mt-1 block h-1.5 w-[102px] overflow-hidden rounded bg-[#1c303d]"><span className={`block h-full ${project[6]} ${project[8]}`}/></span></span><span className="text-[10px] text-slate-300">{project[5]}</span><MoreHorizontal size={13}/></button>)}
            </div>
          </Panel>

          <div className="grid h-[268px] gap-3 md:grid-cols-2">
            <Panel className="p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Projects by Stage</h2></div><div className="mt-5 flex items-center gap-6"><Donut center="12" sub="Total Projects" compact/><div className="flex-1 space-y-3 text-xs">{[['Plan Review','3 (25%)','bg-blue-300'],['AI Detection','2 (17%)','bg-blue-600'],['Takeoff','4 (33%)','bg-teal-500'],['Estimate','2 (17%)','bg-purple-500'],['Bid / Proposal','1 (8%)','bg-amber-500']].map(([a,b,c])=><div key={a} className="flex items-center"><span className={`mr-2 h-2 w-2 rounded-full ${c}`}/><span className="flex-1">{a}</span><span>{b}</span></div>)}</div></div><button type="button" className="mt-5 flex items-center gap-2 text-xs text-teal-400">View All Projects <ArrowRight size={13}/></button></Panel>
            <Panel className="p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">AI Detection Summary</h2><button type="button" className="flex items-center gap-2 text-[10px] text-slate-300">This Month <ChevronDown size={12}/></button></div><div className="mt-4 divide-y divide-[#1b313e]">{[['Plans Processed','47','32%'],['Walls Detected','1,248','28%'],['Openings Detected','186','15%'],['Corners Detected','94','21%'],['T-Walls Detected','23','27%']].map(([a,b,c])=><div key={a} className="flex items-center py-2 text-xs"><CircleDot size={13} className="mr-3 text-slate-400"/><span className="flex-1 text-slate-300">{a}</span><strong>{b}</strong><span className="ml-6 text-[10px] text-teal-400">▲ {c}</span></div>)}</div><div className="mt-3 rounded border border-[#213642] p-3"><div className="flex"><strong className="flex-1 text-xs">Detection Accuracy</strong><strong className="text-lg">97%</strong><span className="ml-4 text-[10px] text-teal-400">▲ 3%</span></div><p className="text-[10px] text-slate-400">Average confidence score across all projects</p></div></Panel>
          </div>
        </div>

        <div className="space-y-3">
          <Panel className="p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Takeoff Analytics</h2><button type="button" className="flex items-center gap-2 text-[10px] text-slate-300">This Month <ChevronDown size={12}/></button></div><div className="mt-4 flex items-center gap-6"><Donut center="2,847" sub="SF"/><div className="flex-1 space-y-5 text-xs">{[['Exterior Walls','1,942 SF','68%','bg-teal-500'],['Interior Walls','542 SF','19%','bg-blue-500'],['Foundations','363 SF','13%','bg-purple-500']].map(([a,b,c,d])=><div key={a} className="grid grid-cols-[1fr_auto_auto] items-center gap-4"><span><i className={`mr-2 inline-block h-2 w-2 rounded-full ${d}`}/>{a}</span><strong>{b}</strong><span>{c}</span></div>)}</div></div><div className="mt-5 grid grid-cols-4 gap-2">{[[Box,'Concrete','23.6 yd³','text-teal-400'],[Wrench,'Rebar','2,186 LF','text-blue-400'],[FileText,'Openings','18','text-purple-400'],[CircleDot,'Corners','42','text-amber-400']].map(([Icon,a,b,c])=><div key={a} className="rounded border border-[#243944] p-3"><Icon size={23} className={c}/><div className="mt-3 text-xs">{a}</div><strong className="text-lg">{b}</strong></div>)}</div></Panel>
          <Panel className="h-[300px] overflow-hidden p-4"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Recent Activity</h2><button type="button" className="flex items-center gap-2 text-xs text-teal-400">View All Activity <ArrowRight size={13}/></button></div><div className="mt-2 divide-y divide-[#1b313e]">{ACTIVITIES.map(([initials,name,action,time,color])=><div key={name} className="flex items-center gap-3 py-1.5"><span className={`flex h-7 w-7 items-center justify-center rounded-full border border-white/30 text-[10px] ${color}`}>{initials}</span><div className="flex-1"><strong className="block text-xs">{name}</strong><span className="text-[11px] text-slate-400">{action}</span></div><span className="text-[10px] text-slate-300">{time}</span></div>)}</div></Panel>
        </div>
      </div>

      <Panel className="mt-3 flex items-center gap-5 px-5 py-3 text-xs"><CalendarDays size={18}/><strong>Upcoming Deadlines</strong><span className="text-amber-400">3 projects due this week</span><span className="ml-auto">Maple Creek Estates <span className="text-slate-400">Takeoff Due • May 10, 2025</span></span><span>Modern Lake House <span className="text-slate-400">Estimate Due • May 12, 2025</span></span><button type="button" className="flex items-center gap-2 text-teal-400">View Calendar <ArrowRight size={13}/></button></Panel>
    </div>
  )
}
