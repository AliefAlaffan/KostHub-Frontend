import { Search, Bell } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Topbar({ title, subtitle }) {
  const { user } = useAuthStore()
  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="sticky top-0 z-10 bg-white/70 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-muted mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 w-64">
          <Search size={16} className="text-slate-muted" />
          <input placeholder="Cari..." className="bg-transparent text-sm outline-none w-full placeholder:text-slate-muted" />
        </div>
        <button className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors relative">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/30">
          {initials}
        </div>
      </div>
    </div>
  )
}