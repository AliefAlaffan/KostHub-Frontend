import { useEffect, useState } from 'react'
import { DoorOpen, Wallet, UtensilsCrossed, Receipt } from 'lucide-react'
import apiClient from '../../api/client'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Topbar from '../../components/Topbar'
import { useAuthStore } from '../../store/authStore'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [occupancy, setOccupancy] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [outstanding, setOutstanding] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/reports/dashboard-summary').then((r) => {
      setOccupancy(r.data.occupancy)
      setRevenue(r.data.revenue)
      setOutstanding(r.data.outstanding)
    })
  }, [])

  const chartData = revenue?.monthly?.map((m) => ({ period: m.period, total: Number(m.total) })) || []
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const stats = [
    { icon: DoorOpen, bg: '#EEF2FF', fg: '#4338CA', label: 'OCCUPANCY RATE', value: `${occupancy?.occupancy_rate ?? 0}%`, sub: `${occupancy?.occupied ?? 0} dari ${occupancy?.total_rooms ?? 0} kamar` },
    { icon: Wallet, bg: '#ECFDF5', fg: '#059669', label: 'REVENUE BULAN INI', value: `Rp ${Number(revenue?.total_revenue ?? 0).toLocaleString('id-ID')}`, sub: 'Dari invoice lunas' },
    { icon: UtensilsCrossed, bg: '#F5F3FF', fg: '#7C3AED', label: 'KAMAR TERSEDIA', value: occupancy?.available ?? 0, sub: 'Siap disewa' },
    { icon: Receipt, bg: '#FFF7ED', fg: '#C2410C', label: 'TUNGGAKAN', value: `Rp ${Number(outstanding?.total_outstanding ?? 0).toLocaleString('id-ID')}`, sub: `${outstanding?.count ?? 0} invoice belum lunas` },
  ]

  return (
    <div>
      <Topbar title="Dashboard" breadcrumb={['KostHub', 'Dashboard']} />

      <div className="p-8 max-w-[1300px]">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-navy)] p-7 mb-6 text-white">
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/[0.03]" />
          <div className="flex items-center justify-between relative">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SISTEM AKTIF
              </div>
              <div className="font-display text-2xl font-bold">Halo, {user?.name?.split(' ')[0]}</div>
              <div className="text-zinc-400 text-sm mt-1">{today}</div>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/[0.05] rounded-xl px-5 py-3 text-center">
                <div className="text-[10px] text-zinc-500 tracking-wider mb-1">MINGGU INI</div>
                <div className="font-display text-lg font-bold text-indigo-400">
                  Rp {Number(revenue?.total_revenue ?? 0).toLocaleString('id-ID', { notation: 'compact' })}
                </div>
              </div>
              <div className="bg-white/[0.05] rounded-xl px-5 py-3 text-center">
                <div className="text-[10px] text-zinc-500 tracking-wider mb-1">BULAN INI</div>
                <div className="font-display text-lg font-bold text-emerald-400">
                  Rp {Number(revenue?.total_revenue ?? 0).toLocaleString('id-ID', { notation: 'compact' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.label} className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.bg }}>
                    <Icon size={18} strokeWidth={2.2} style={{ color: s.fg }} />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full tracking-wide">LIVE</span>
                </div>
                <div className="text-[10px] font-semibold text-slate-muted tracking-wider mb-1.5">{s.label}</div>
                <div className="font-display text-xl font-bold text-ink">{s.value}</div>
                <div className="text-xs text-slate-muted mt-1">{s.sub}</div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <Card className="lg:col-span-2 p-6">
            <h2 className="font-display text-sm font-bold text-ink mb-1">Tren Pendapatan</h2>
            <p className="text-xs text-slate-muted mb-4">Beberapa bulan terakhir</p>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4338CA" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4338CA" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#71717A' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `Rp ${Number(v).toLocaleString('id-ID')}`} />
                <Area type="monotone" dataKey="total" stroke="#4338CA" strokeWidth={2.5} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="font-display text-sm font-bold text-ink mb-4">Tagihan Belum Lunas</h2>
            <div className="space-y-3">
              {outstanding?.invoices?.slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-ink">{inv.contract?.tenant?.user?.name}</div>
                    <div className="text-xs text-slate-muted">Kamar {inv.contract?.room?.room_number}</div>
                  </div>
                  <Badge status={inv.status} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}