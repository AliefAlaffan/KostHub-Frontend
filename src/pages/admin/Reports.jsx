import { useEffect, useState } from 'react'
import { Home, Wallet, AlertCircle, TrendingDown } from 'lucide-react'
import apiClient from '../../api/client'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'

export default function Reports() {
  const [occupancy, setOccupancy] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [outstanding, setOutstanding] = useState(null)
  const [expenses, setExpenses] = useState(null)

  useEffect(() => {
    apiClient.get('/reports/occupancy').then((r) => setOccupancy(r.data))
    apiClient.get('/reports/revenue').then((r) => setRevenue(r.data))
    apiClient.get('/reports/outstanding-invoices').then((r) => setOutstanding(r.data))
    apiClient.get('/reports/expenses').then((r) => setExpenses(r.data))
  }, [])

  const stats = [
    { icon: Home, bg: '#EEF2FF', fg: '#4338CA', label: 'Occupancy Rate', value: `${occupancy?.occupancy_rate ?? 0}%` },
    { icon: Wallet, bg: '#ECFDF5', fg: '#059669', label: 'Total Revenue', value: `Rp ${Number(revenue?.total_revenue ?? 0).toLocaleString('id-ID')}` },
    { icon: AlertCircle, bg: '#FFFBEB', fg: '#B45309', label: 'Tunggakan', value: `Rp ${Number(outstanding?.total_outstanding ?? 0).toLocaleString('id-ID')}` },
    { icon: TrendingDown, bg: '#FEF2F2', fg: '#BE123C', label: 'Total Pengeluaran', value: `Rp ${Number(expenses?.total_expenses ?? 0).toLocaleString('id-ID')}` },
  ]

  const handleExport = (format, type = 'revenue') => {
    const token = localStorage.getItem('auth_token')
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
    const url = format === 'excel'
      ? `${baseUrl}/reports/export/excel?type=${type}`
      : `${baseUrl}/reports/export/pdf`

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = format === 'excel' ? `laporan-${type}.xlsx` : 'laporan-ringkasan.pdf'
        link.click()
      })
  }

  return (
    <div>
      <Topbar
  title="Laporan"
  breadcrumb={['KostHub', 'Laporan']}
  actions={
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleExport('excel', 'revenue')}
        className="flex items-center gap-1.5 text-xs font-semibold pl-2 pr-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
      >
        <FileSpreadsheet size={14} /> Excel
      </button>
      <button
        onClick={() => handleExport('pdf')}
        className="flex items-center gap-1.5 text-xs font-semibold pl-2 pr-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
      >
        <FileText size={14} /> PDF
      </button>
    </div>
  }
/>
      <div className="p-8 max-w-[1300px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.label} className="p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.bg }}>
                  <Icon size={18} strokeWidth={2.2} style={{ color: s.fg }} />
                </div>
                <div className="font-display text-xl font-bold text-ink">{s.value}</div>
                <div className="text-xs text-slate-muted mt-1.5">{s.label}</div>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-display text-sm font-bold text-ink mb-4">
              Invoice Belum Lunas ({outstanding?.count ?? 0})
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-slate-muted uppercase tracking-wide border-b border-[var(--color-border)]">
                  <th className="pb-2.5 font-semibold">Penghuni</th>
                  <th className="pb-2.5 font-semibold">Kamar</th>
                  <th className="pb-2.5 font-semibold">Jumlah</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {outstanding?.invoices?.map((inv) => (
                  <tr key={inv.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2.5 text-ink font-medium">{inv.contract?.tenant?.user?.name}</td>
                    <td className="py-2.5 text-slate-600">Kamar {inv.contract?.room?.room_number}</td>
                    <td className="py-2.5 text-slate-600">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                    <td className="py-2.5"><Badge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-sm font-bold text-ink mb-4">Pengeluaran per Kategori</h3>
            {expenses?.by_category && Object.keys(expenses.by_category).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(expenses.by_category).map(([cat, amount]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 capitalize">{cat}</span>
                    <span className="text-sm font-semibold text-ink">Rp {Number(amount).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-muted">Belum ada data pengeluaran.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}