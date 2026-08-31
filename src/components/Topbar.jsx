import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'

export default function Topbar({ title, breadcrumb, actions }) {
  const { user } = useAuthStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-[var(--color-border)]">
      <div>
        <h1 className="font-display text-lg font-bold text-ink">{title}</h1>
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-slate-muted mt-0.5">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>›</span>}
                {b}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <span className="text-sm text-slate-muted tabular-nums">{timeStr}</span>
        <div className="w-9 h-9 rounded-xl bg-[var(--color-brand)] flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </div>
  )
}