const variants = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-sm',
  secondary: 'bg-transparent border border-gray-300 dark:border-navy-500 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-700',
  ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-700',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 13 : 15} />}
      {children}
      {IconRight && <IconRight size={size === 'sm' ? 13 : 15} />}
    </button>
  )
}
