export default function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-[var(--shadow-card)] transition-all duration-300 ${
        hover ? 'hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}