import { Construction } from 'lucide-react'

export default function Placeholder({ title = 'Coming Soon' }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-96 gap-4 text-center p-8">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
        <Construction size={24} className="text-teal-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This section is under construction.</p>
      </div>
    </div>
  )
}
