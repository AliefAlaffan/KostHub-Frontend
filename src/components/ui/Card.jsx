export default function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] ${className}`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {children}
    </div>
  )
}