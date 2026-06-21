import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, Bot, Box, CheckCircle2, Clock3, FileSearch, FileText,
  PlayCircle, ShieldCheck, Trophy,
} from 'lucide-react'
import homeReference from '../assets/home-page-reference.png'

const FEATURES = [
  { Icon: FileSearch, title: 'Plan Viewer', copy: 'Upload and view plans in a powerful takeoff environment built for ICF projects.' },
  { Icon: Bot, title: 'AI Detection', copy: 'Automatically detect walls, openings, corners, and more with high accuracy.' },
  { Icon: Box, title: 'Manufacturer Comparison', copy: 'Compare up to 4 ICF systems side-by-side on specs, costs, and performance.' },
  { Icon: FileText, title: 'Estimate & Proposal', copy: 'Build accurate estimates and create professional proposals that win more work.' },
]

const MAKERS = ['Nudura', 'FOX BLOCKS', 'BuildBlock', 'amvic', 'QUAD-LOCK', 'SuperForm', 'Element ICF', 'STRONGHOLD', 'LITEFORM']

const PREVIEWS = [
  { title: 'Dashboard', copy: 'Track projects, takeoffs, and estimates in one place.', pos: 'left-[-64px]' },
  { title: 'Plan Viewer', copy: 'Smart plan viewing with takeoff tools built for accuracy.', pos: 'left-[-280px]' },
  { title: 'Compare Manufacturers', copy: 'Compare systems side-by-side to find the best fit.', pos: 'left-[-505px]' },
  { title: 'Estimates', copy: 'Create detailed estimates and professional proposals.', pos: 'left-[-735px]' },
]

function Brand() {
  return (
    <button type="button" className="flex items-center gap-2" aria-label="ICFScope home">
      <svg viewBox="0 0 36 40" className="h-8 w-8"><path d="M18 2 33 10.5 18 19 3 10.5 18 2Z" fill="#21c4bd"/><path d="M3 10.5 18 19v18L3 28.5v-18Z" fill="#eaf7f6"/><path d="M33 10.5 18 19v18l15-8.5v-18Z" fill="#8dded9"/><path d="m9 14 9 5 9-5v7l-9 5-9-5v-7Z" fill="#07151f"/></svg>
      <span className="text-xl font-bold tracking-[.04em] text-white">ICFSCOPE</span>
    </button>
  )
}

function MakerStrip({ boxed = false }) {
  return (
    <div className={`grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9 ${boxed ? '' : 'rounded-lg border border-[#20313d] bg-[#0b1a24] px-4 py-4'}`}>
      {MAKERS.map((maker, index) => (
        <div key={maker} className={`${boxed ? 'rounded-md border border-[#253844] bg-[#0b1923] py-4' : ''} flex min-w-0 items-center justify-center gap-1.5 text-center text-[10px] font-extrabold text-slate-100 sm:text-xs`}>
          <span className="text-teal-200">{index % 3 === 0 ? '◒' : index % 3 === 1 ? '⬡' : '▦'}</span><span className="truncate">{maker}</span>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#03131f] font-sans text-white">
      <header className="sticky top-0 z-50 flex h-[54px] items-center border-b border-[#142733] bg-[#02101a]/95 px-5 backdrop-blur md:px-8">
        <Brand />
        <nav className="mx-auto hidden items-center gap-7 text-xs text-slate-200 md:flex">
          <button type="button">Features⌄</button><button type="button">Manufacturers</button><button type="button">Pricing</button><button type="button">Resources⌄</button><button type="button">Demo</button>
        </nav>
        <div className="ml-auto flex gap-3 text-xs">
          <button type="button" onClick={() => navigate('/dashboard')} className="rounded-md bg-[#071722] px-4 py-2">Login</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="rounded-md bg-teal-600 px-4 py-2 shadow-lg shadow-teal-500/20">Start Free Trial</button>
        </div>
      </header>

      <main className="mx-auto max-w-[1024px] px-5 md:px-8">
        <section className="grid min-h-[320px] items-center gap-5 pt-5 md:grid-cols-[.9fr_1.2fr]">
          <div className="z-10">
            <span className="inline-block rounded-full bg-teal-500/10 px-2 py-1 text-[10px] text-teal-300">The #1 ICF Pre-Construction Platform</span>
            <h1 className="mt-3 text-[36px] font-bold leading-[1.06] tracking-[-.02em] sm:text-[38px]">From Plans to<br/><span className="text-teal-500">Profitable</span> ICF Bids</h1>
            <p className="mt-3 max-w-[315px] text-[13px] leading-5 text-slate-300">Upload plans. Generate takeoffs.<br/>Compare manufacturers. Build estimates.<br/>Create winning proposals.</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => navigate('/dashboard')} className="flex items-center gap-3 rounded-md bg-teal-600 px-5 py-3 text-xs font-semibold">Start Free Trial <ArrowRight size={14}/></button>
              <button type="button" className="flex items-center gap-2 rounded-md border border-[#31424d] bg-[#071720] px-5 py-3 text-xs"><PlayCircle size={15}/>Watch Demo</button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-[10px] text-slate-400"><CheckCircle2 size={12} className="text-teal-400"/>No credit card required <span>•</span> 14 day free trial</p>
          </div>
          <div className="relative h-[270px] overflow-hidden">
            <img src={homeReference} alt="ICF building model" className="absolute left-[-375px] top-[-95px] h-auto w-[1024px] max-w-none" />
          </div>
        </section>

        <MakerStrip />

        <section className="pt-4">
          <h2 className="text-center text-2xl font-semibold">One Platform. Complete ICF Pre-Construction.</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ Icon, title, copy }) => (
              <article key={title} className="rounded-lg border border-[#243642] bg-[#0a1b27] p-4">
                <Icon size={31} strokeWidth={1.5} className="text-teal-400"/><h3 className="mt-3 text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-[1.5] text-slate-300">{copy}</p><button type="button" className="mt-3 flex items-center gap-2 text-xs text-teal-400">Learn more <ArrowRight size={12}/></button>
              </article>
            ))}
          </div>
        </section>

        <section className="py-4">
          <h2 className="text-center text-xl font-semibold">Built Specifically For ICF Contractors</h2>
          <div className="mx-auto mt-4 grid max-w-[760px] gap-6 sm:grid-cols-3">
            {[{Icon:Clock3,title:'Save Time',copy:'Automate tedious counting and calculations so you can focus on winning more projects.'},{Icon:ShieldCheck,title:'Reduce Errors',copy:'Verify takeoffs with 2D and 3D visualization to reduce mistakes and rework.'},{Icon:Trophy,title:'Win More Bids',copy:'Deliver accurate, professional estimates and proposals that help you stand out.'}].map(({Icon,title,copy})=><div key={title} className="flex gap-3"><Icon size={43} strokeWidth={1.5} className="shrink-0 text-teal-400"/><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-[11px] leading-4 text-slate-300">{copy}</p></div></div>)}
          </div>
        </section>

        <section className="rounded-lg border border-[#203441] bg-[#081925] p-3">
          <h2 className="mb-2 text-center text-xl font-semibold">Everything You Need. All In One Place.</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {PREVIEWS.map((preview) => (
              <article key={preview.title} className="overflow-hidden rounded-md border border-[#243944] bg-[#071720]">
                <div className="relative h-[98px] overflow-hidden border-b border-[#1e3440]"><img src={homeReference} alt="" className={`absolute top-[-857px] h-auto w-[1024px] max-w-none ${preview.pos}`}/></div>
                <div className="p-2.5"><h3 className="text-xs font-semibold">{preview.title}</h3><p className="mt-1 text-[10px] leading-4 text-slate-300">{preview.copy}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="py-4"><h2 className="mb-3 text-center text-xl font-semibold">Compare Every Major ICF Manufacturer</h2><MakerStrip boxed/><button type="button" className="mx-auto mt-3 flex items-center gap-2 text-xs text-teal-400">View All Manufacturers <ArrowRight size={12}/></button></section>

        <section><h2 className="mb-3 text-center text-xl font-semibold">Simple, Transparent Pricing</h2><div className="grid gap-3 md:grid-cols-3">
          {[['Starter','$99','Perfect for small teams getting started.'],['Professional','$199','Everything you need to win more bids.'],['Enterprise','Custom Pricing','Advanced tools for large teams.']].map(([name,price,copy],index)=><article key={name} className={`relative rounded-lg border p-3 ${index===1?'border-teal-500 bg-[#08202a]':'border-[#243642] bg-[#0a1924]'}`}>{index===1?<span className="absolute inset-x-0 top-0 rounded-t-lg bg-teal-500/20 py-0.5 text-center text-[8px] text-teal-300">MOST POPULAR</span>:null}<h3 className="mt-1 text-sm font-semibold">{name}</h3><p className="mt-0.5 text-[10px] text-slate-400">{copy}</p><div className="my-1 text-2xl font-semibold">{price}</div><button type="button" onClick={()=>navigate('/dashboard')} className={`w-full rounded border py-1.5 text-xs ${index===1?'border-teal-500 bg-teal-600':'border-[#344752]'}`}>{name==='Enterprise'?'Contact Sales':'Start Free Trial'}</button></article>)}
        </div></section>

        <section className="my-4 flex flex-col items-start justify-between gap-4 rounded-lg border border-[#263945] bg-[#0a1b27] px-6 py-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-semibold">Ready to Build More Profitable ICF Projects?</h2><p className="text-xs text-slate-300">Join hundreds of contractors saving time and winning more work with ICFSCOPE.</p></div><div className="flex gap-3"><button type="button" onClick={()=>navigate('/dashboard')} className="flex items-center gap-2 rounded bg-teal-600 px-5 py-3 text-xs">Start Free Trial <ArrowRight size={13}/></button><button type="button" className="flex items-center gap-2 rounded border border-[#354752] px-5 py-3 text-xs"><PlayCircle size={14}/>Watch Demo</button></div></section>
      </main>

      <footer className="mx-auto flex max-w-[1024px] flex-col gap-5 border-t border-[#142733] px-8 py-5 text-[9px] text-slate-400 sm:flex-row sm:items-center"><Brand/><span>© 2025 ICFSCOPE. All rights reserved.</span><div className="ml-auto flex gap-3 text-xs"><span>f</span><span>in</span><span>▶</span></div></footer>
    </div>
  )
}
