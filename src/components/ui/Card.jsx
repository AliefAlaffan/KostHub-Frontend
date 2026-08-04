export default function Card({ children, className = '' }) {
  return <div className={`bg-[var(--color-surface)] rounded-xl transition-shadow hover:shadow-[var(--shadow-card-hover)] ${className}`}>{children}</div>
}