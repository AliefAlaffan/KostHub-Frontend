import IconBadge from './IconBadge'

export default function StatCard({ icon, label, value, trend, color = 'purple' }) {
  return (
    <div className="bg-[var(--color-surface)] rounded-xl p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <IconBadge icon={icon} color={color} />
      <div className="font-display text-xl font-semibold text-ink mt-3.5">{value}</div>
      <div className="text-xs text-slate-muted mt-0.5">
        {label}
        {trend && <span className={trend.startsWith('-') ? ' text-rose-600' : ' text-emerald-600'}> · {trend}</span>}
      </div>
    </div>
  )
}