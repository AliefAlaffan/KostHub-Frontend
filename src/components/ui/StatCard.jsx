import { useEffect, useState } from 'react'

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const numeric = typeof target === 'number' ? target : parseFloat(String(target).replace(/[^0-9.-]/g, '')) || 0
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      setValue(Math.round(numeric * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target])
  return value
}

export default function StatCard({ icon: Icon, label, value, trend, isCurrency = false, prefix = '', suffix = '' }) {
  const animated = useCountUp(value)
  const display = isCurrency ? `Rp ${animated.toLocaleString('id-ID')}` : `${prefix}${animated}${suffix}`

  return (
    <div className="bg-white rounded-lg border border-[var(--color-border)] p-5 transition-all duration-200 hover:shadow-[var(--shadow-card-hover)] hover:border-transparent">
      <div className="flex items-center justify-between mb-6">
        <div className="w-8 h-8 rounded-md bg-[var(--color-ledger-soft)] flex items-center justify-center">
          {Icon && <Icon size={15} strokeWidth={2.2} className="text-[var(--color-ledger)]" />}
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold ${trend.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="font-display text-[28px] font-extrabold text-ink tracking-tight leading-none tabular-nums">{display}</div>
      <div className="text-[13px] text-slate-muted mt-2">{label}</div>
    </div>
  )
}