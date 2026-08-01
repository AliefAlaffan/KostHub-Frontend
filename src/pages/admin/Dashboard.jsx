import { useEffect, useState } from 'react'
import { DoorOpen, Users, Wallet, TrendingUp } from 'lucide-react'
import apiClient from '../../api/client'
import StatCard from '../../components/ui/StatCard'
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

  useEffect(() => {
    apiClient.get('/reports/occupancy').then((r) => setOccupancy(r.data))
    apiClient.get('/reports/revenue').then((r) => setRevenue(r.data))
    apiClient.get('/reports/outstanding-invoices').then((r) => setOutstanding(r.data))
  }, [])

  const chartData = revenue?.monthly?.map((m) => ({ period: m.period, total: Number(m.total) })) || []
  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <div>
      <Topbar title="Dashboard" subtitle="Ringkasan performa kost Anda" />

      <div className="p-8 max-w-[1400px] animate-in">
        <div className="rounded-lg bg-white border border-[var(--color-border)] p-6 mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Selamat datang, {firstName}</h2>
            <p className="text-slate-muted text-sm mt-1">
              Occupancy hari ini <span className="font-semibold text-ink">{occupancy?.occupancy_rate ?? '—'}%</span> — {occupancy?.occupied ?? '—'} dari {occupancy?.total_rooms ?? '—'} kamar terisi
            </p>
          </div>
          <div className="w-11 h-11 rounded-full bg-[var(--color-ledger-soft)] flex items-center justify-center text-lg">👋</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={DoorOpen} label="Occupancy Rate" value={occupancy?.occupancy_rate ?? 0} suffix="%" />
          <StatCard icon={Users} label="Kamar Terisi" value={occupancy?.occupied ?? 0} />
          <StatCard icon={Wallet} label="Total Revenue" value={revenue?.total_revenue ?? 0} isCurrency />
          <StatCard icon={TrendingUp} label="Tunggakan" value={outstanding?.total_outstanding ?? 0} isCurrency />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card hover className="lg:col-span-2 p-6">
            <h2 className="text-sm font-bold text-ink mb-4">Tren Pendapatan</h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v) => `Rp ${Number(v).toLocaleString('id-ID')}`}
                  contentStyle={{ borderRadius: 12, border: '1px solid #F1F5F9', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#4F46E5" strokeWidth={2.5} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card hover className="p-6">
            <h2 className="text-sm font-bold text-ink mb-4">Status Kamar</h2>
            <div className="space-y-4">
              {[
                { label: 'Terisi', value: occupancy?.occupied, dot: 'bg-indigo-500' },
                { label: 'Tersedia', value: occupancy?.available, dot: 'bg-indigo-300' },
                { label: 'Total Kamar', value: occupancy?.total_rooms, dot: 'bg-slate-300' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${row.dot}`} />
                    <span className="text-sm text-slate-600">{row.label}</span>
                  </div>
                  <span className="text-base font-bold text-ink">{row.value ?? '—'}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card hover className="p-6">
          <h2 className="text-sm font-bold text-ink mb-4">
            Tagihan Belum Lunas <span className="text-slate-muted font-medium">({outstanding?.count ?? 0})</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-muted uppercase tracking-wide border-b border-slate-100">
                  <th className="pb-3 font-semibold">Penghuni</th>
                  <th className="pb-3 font-semibold">Kamar</th>
                  <th className="pb-3 font-semibold">Jumlah</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {outstanding?.invoices?.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 text-ink font-medium">{inv.contract?.tenant?.user?.name}</td>
                    <td className="py-3 text-slate-600">Kamar {inv.contract?.room?.room_number}</td>
                    <td className="py-3 text-slate-600">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                    <td className="py-3"><Badge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}