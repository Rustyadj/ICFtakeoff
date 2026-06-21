import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import useAppStore from '../../store/useAppStore'

export default function AppShell() {
  const isDark = useAppStore((s) => s.isDark)
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className="h-full flex flex-col bg-slate-25 dark:bg-navy-900">
      {isHome ? null : <TopNav />}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
