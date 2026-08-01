export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5',
    outline: 'border border-slate-200 text-ink hover:bg-slate-50',
    danger: 'border border-rose-200 text-rose-600 hover:bg-rose-50',
    ghost: 'text-slate-muted hover:bg-slate-50',
  }
  return (
    <button
      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}