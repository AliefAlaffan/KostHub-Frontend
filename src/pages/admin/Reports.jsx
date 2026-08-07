import { useEffect, useState } from 'react'
import apiClient from '../../api/client'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'

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

  return (
    <div>
      <Topbar title="Laporan" breadcrumb={['KostHub', 'Laporan']} />

      <div className="p-8 max-w-[1200px]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Card className="p-5">
            <div className="text-xs text-slate-muted mb-1.5">Occupancy Rate</div>
            <div className="font-display text-2xl font-bold text-ink">{occupancy?.occupancy_rate ?? '—'}%</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-slate-muted mb-1.5">Total Revenue</div>
            <div className="font-display text-2xl font-bold text-ink">Rp {Number(revenue?.total_revenue ?? 0).toLocaleString('id-ID')}</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-slate-muted mb-1.5">Tunggakan</div>
            <div className="font-display text-2xl font-bold text-ink">Rp {Number(outstanding?.total_outstanding ?? 0).toLocaleString('id-ID')}</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs text-slate-muted mb-1.5">Total Pengeluaran</div>
            <div className="font-display text-2xl font-bold text-ink">Rp {Number(expenses?.total_expenses ?? 0).toLocaleString('id-ID')}</div>
          </Card>
        </div>

        <Card className="p-6">
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
      </div>
    </div>
  )
}