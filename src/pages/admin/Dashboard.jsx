import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DoorOpen, Wallet, KeySquare, AlertCircle, Plus, Receipt, Wrench,
  CheckCircle2, TrendingUp, TrendingDown, ArrowRight, RefreshCw,
} from 'lucide-react'
import apiClient from '../../api/client'
import Topbar from '../../components/Topbar'
import { useAuthStore } from '../../store/authStore'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const fmtRupiah = (n) => `Rp ${Number(n ?? 0).toLocaleString('id-ID')}`

function dueUrgency(dueDateStr) {
  const due = new Date(dueDateStr)
  const today = new Date()
  due.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.round((due - today) / 86400000)

  if (diffDays < 0) return { label: `Terlambat ${Math.abs(diffDays)} hari`, tone: 'rose' }
  if (diffDays === 0) return { label: 'Hari ini', tone: 'rose' }
  if (diffDays === 1) return { label: 'Besok', tone: 'amber' }
  return { label: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), tone: 'slate' }
}

const TONE_PILL = {
  rose: 'bg-rose-50 border-rose-100 text-rose-700',
  amber: 'bg-amber-50 border-amber-100 text-amber-700',
  slate: 'bg-slate-100 border-slate-200/60 text-slate-700',
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const [occupancy, setOccupancy] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [outstanding, setOutstanding] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    apiClient.get('/reports/dashboard-summary')
      .then((r) => {
        setOccupancy(r.data.occupancy)
        setRevenue(r.data.revenue)
        setOutstanding(r.data.outstanding)
      })
      .catch(() => setError('Gagal memuat data dashboard.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const chartData = revenue?.monthly?.map((m) => ({ period: m.period, total: Number(m.total) })) || []
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const totalRooms = occupancy?.total_rooms ?? 0
  const occupied = occupancy?.occupied ?? 0
  const available = occupancy?.available ?? 0
  const maintenance = Math.max(totalRooms - occupied - available, 0)
  const pct = (n) => (totalRooms > 0 ? (n / totalRooms) * 100 : 0)

  return (
    <div>
      <Topbar title="Ringkasan Dashboard" breadcrumb={['KostHub', 'Dashboard']} />

      {error && (
        <div className="mx-8 mt-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
          <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-16 h-56 w-56 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> KOSTHUB LIVE SYSTEM
                </span>
                <span className="text-xs font-medium text-slate-400">• {today}</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
                  Halo, {user?.name?.split(' ')[0] || 'Admin'}
                </h1>
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Pantau okupansi, kelola arus kas sewa, dan optimasi pengelolaan kos secara real-time dari satu kendali cerdas.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Link to="/admin/tenants" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold shadow-xs hover:shadow transition-all duration-150">
                  <Plus size={16} /> Tambah Penghuni
                </Link>
                <Link to="/admin/invoices" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-2xs hover:border-slate-300 transition-all duration-150">
                  <Receipt size={16} className="text-slate-500" /> Buat Tagihan
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:w-[420px]">
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue Lunas</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center">
                    <Wallet size={16} />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold text-slate-900 tracking-tight">{fmtRupiah(revenue?.total_revenue)}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tunggakan Aktif</span>
                  <div className="w-7 h-7 rounded-lg bg-rose-100/70 text-rose-700 flex items-center justify-center">
                    <AlertCircle size={16} />
                  </div>
                </div>
                <div className="mt-2 text-xl font-bold text-rose-600 tracking-tight">{fmtRupiah(outstanding?.total_outstanding)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 KPI CARDS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <DoorOpen size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Occupancy Rate</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{occupancy?.occupancy_rate ?? 0}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-800">{occupied}</span> dari {totalRooms} kamar terisi • <span className="font-semibold text-indigo-600">{available} kosong</span>
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-700" style={{ width: `${occupancy?.occupancy_rate ?? 0}%` }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                <Wallet size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Revenue (Lunas)</span>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{fmtRupiah(revenue?.total_revenue)}</div>
              <p className="text-xs text-slate-500 mt-1">Total invoice berstatus lunas</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center">
                <KeySquare size={20} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kamar Tersedia</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{available}</span>
                <span className="text-xs font-semibold text-sky-700">siap huni</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
                <AlertCircle size={20} />
              </div>
              {outstanding?.count > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-bold text-rose-600">
                  {outstanding.count} Belum Lunas
                </span>
              )}
            </div>
            <div className="mt-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tunggakan Invoice</span>
              <div className="text-2xl font-extrabold text-rose-600 tracking-tight mt-1">{fmtRupiah(outstanding?.total_outstanding)}</div>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-800">{outstanding?.count ?? 0}</span> invoice aktif menunggu pelunasan
              </p>
            </div>
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-slate-800 tracking-tight">Aksi Cepat Operasional:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Link to="/admin/tenants" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all whitespace-nowrap">
              <Plus size={14} className="text-indigo-600" /> Tambah Penghuni
            </Link>
            <Link to="/admin/rooms" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all whitespace-nowrap">
              <Plus size={14} className="text-indigo-600" /> Tambah Kamar
            </Link>
            <Link to="/admin/invoices" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all whitespace-nowrap">
              <Receipt size={14} className="text-indigo-600" /> Buat Tagihan
            </Link>
            <Link to="/admin/maintenance" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all whitespace-nowrap">
              <Wrench size={14} className="text-amber-600" /> Tambah Maintenance
            </Link>
          </div>
        </section>

        {/* CHART + TAGIHAN BELUM LUNAS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Tren Pendapatan</h2>
                  <p className="text-xs text-slate-500">Ringkasan revenue per periode (invoice lunas)</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Jt`} />
                  <Tooltip formatter={(v) => fmtRupiah(v)} />
                  <Area type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2.5} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">Tagihan Belum Lunas</h2>
                    {outstanding?.count > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100">{outstanding.count}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Daftar invoice menanti pelunasan</p>
                </div>
                <Link to="/admin/invoices" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  Lihat Semua <ArrowRight size={14} />
                </Link>
              </div>

              {outstanding?.invoices?.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {outstanding.invoices.slice(0, 5).map((inv) => {
                    const urgency = dueUrgency(inv.due_date)
                    return (
                      <div key={inv.id} className="p-3.5 rounded-xl bg-slate-50/75 border border-slate-200/70 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{inv.contract?.tenant?.user?.name}</span>
                            <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold">
                              {inv.contract?.room?.room_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
                            <span>{inv.period}</span>
                            <span>•</span>
                            <span className={`font-semibold ${urgency.tone === 'rose' ? 'text-rose-600' : urgency.tone === 'amber' ? 'text-amber-600' : ''}`}>
                              Jatuh tempo: {urgency.label}
                            </span>
                          </div>
                          <div className="text-sm font-extrabold text-slate-900 mt-1">{fmtRupiah(inv.total_amount)}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold ${TONE_PILL[urgency.tone]}`}>
                            {inv.status === 'overdue' ? 'Jatuh Tempo' : inv.status === 'partial' ? 'Sebagian' : 'Belum Bayar'}
                          </span>
                          <Link to={`/admin/invoices/${inv.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-all">
                            <Receipt size={14} /> Detail
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-4 p-6 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-2">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Semua Tagihan Sudah Lunas!</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">Seluruh tagihan kos saat ini telah diselesaikan tanpa tunggakan aktif.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AKTIVITAS TERBARU + STATUS KAMAR */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">Aktivitas Terbaru</h2>
                <p className="text-xs text-slate-500">Log operasional &amp; transaksi</p>
              </div>
              <button onClick={load} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Muat Ulang">
                <RefreshCw size={16} />
              </button>
            </div>
            {/*
              Belum ada endpoint activity-log di backend, jadi belum ada data
              real buat ditampilin di sini. Sengaja dikasih empty state jujur
              daripada nampilin data contoh yang keliatan real padahal palsu.
            */}
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <RefreshCw size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-600">Log aktivitas belum tersedia</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">Fitur ini butuh endpoint activity-log di backend yang belum dibuat.</p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.03)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Status Kamar Terkini</h2>
                  <p className="text-xs text-slate-500">Total {totalRooms} unit terdaftar</p>
                </div>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex gap-0.5 my-4 p-0.5">
                <div className="bg-indigo-600 rounded-l-full" style={{ width: `${pct(occupied)}%` }} title={`${occupied} Terisi`} />
                <div className="bg-sky-400" style={{ width: `${pct(available)}%` }} title={`${available} Kosong`} />
                <div className="bg-rose-500 rounded-r-full" style={{ width: `${pct(maintenance)}%` }} title={`${maintenance} Maintenance`} />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">{occupied} Terisi</span>
                  <span className="text-[11px] font-semibold text-slate-400 ml-auto">{pct(occupied).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <span className="text-xs font-bold text-slate-800">{available} Kosong</span>
                  <span className="text-[11px] font-semibold text-slate-400 ml-auto">{pct(available).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200/60 col-span-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-800">{maintenance} Maintenance</span>
                  <span className="text-[11px] font-semibold text-slate-400 ml-auto">{pct(maintenance).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-5 text-white shadow-card flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                <DoorOpen size={20} className="text-indigo-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white tracking-tight">Kelola Cabang Kost Baru?</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tambahkan unit kamar pertama Anda untuk mulai menerima penghuni baru.
                </p>
                <Link to="/admin/rooms" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-xs transition-all">
                  <Plus size={14} className="text-indigo-600" /> Tambah Kamar Baru
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}