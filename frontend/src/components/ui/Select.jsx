import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function Select({ value, onChange, options, className = '', placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-gray-800 dark:text-gray-200 hover:border-teal-500 dark:hover:border-teal-500 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.icon && <span>{selected.icon}</span>}
          <span className="truncate">{selected?.label ?? placeholder}</span>
        </span>
        <ChevronDown size={14} className={`flex-shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-max rounded-lg border border-gray-200 dark:border-navy-600 bg-white dark:bg-navy-800 shadow-xl py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-navy-700 text-gray-800 dark:text-gray-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {opt.icon && <span>{opt.icon}</span>}
                {opt.label}
              </span>
              {opt.value === value && <Check size={14} className="text-teal-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
