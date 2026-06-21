const variants = {
  teal: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
  green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  gray: 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
  red: 'bg-red-500/15 text-red-400 border border-red-500/30',
}

const statusVariantMap = {
  Takeoff: 'teal',
  Estimating: 'blue',
  'Proposal Sent': 'orange',
  Draft: 'gray',
  Active: 'green',
  Won: 'green',
  Lost: 'red',
}

export default function Badge({ children, variant, status, className = '' }) {
  const v = variant ?? statusVariantMap[status] ?? 'gray'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[v]} ${className}`}>
      {children ?? status}
    </span>
  )
}
