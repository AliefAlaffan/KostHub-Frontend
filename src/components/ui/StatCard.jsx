import IconBadge from './IconBadge'

/**
 * Kartu KPI ringkasan (dashboard).
 * trend: { direction: 'up'|'down', label: string } -> badge kecil pojok kanan atas
 * progress: 0-100 -> mini progress bar di bawah (opsional)
 *
 * Contoh:
 * <StatCard icon={DoorOpen} color="purple" label="Occupancy Rate" value="87.5%"
 *   sublabel="28 dari 32 kamar terisi" trend={{ direction: 'up', label: '+5% bln ini' }} progress={87.5} />
 */
export default function StatCard({ icon, label, value, sublabel, trend, progress, color = 'purple' }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)] hover:shadow-[0_10px_25px_-3px_rgba(15,23,42,0.08),0_4px_6px_-4px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between">
        <IconBadge icon={icon} color={color} size={40} />
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
            trend.direction === 'up' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
          }`}>
            {trend.label}
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">{value}</div>
        {sublabel && <p className="text-xs text-slate-500 mt-1">{sublabel}</p>}
      </div>
      {typeof progress === 'number' && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}