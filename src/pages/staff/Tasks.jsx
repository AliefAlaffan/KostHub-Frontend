import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, Wrench, UserPlus, ArrowRight, ReceiptText, PartyPopper, Hand } from 'lucide-react'
import apiClient from '../../api/client'
import { getMaintenanceRequests } from '../../api/maintenance'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useAuthStore } from '../../store/authStore'

export default function Tasks() {
  const { user } = useAuthStore()
  const [outstanding, setOutstanding] = useState(null)
  const [maintenance, setMaintenance] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get('/reports/outstanding-invoices'),
      getMaintenanceRequests(),
    ]).then(([out, maint]) => {
      setOutstanding(out.data)
      setMaintenance(maint.filter((m) => m.status !== 'closed'))
      setLoading(false)
    })
  }, [])

  const daysOverdue = (dueDate) => {
    const diff = Math.floor((new Date() - new Date(dueDate)) / (1000 * 60 * 60 * 24))
    return diff > 0 ? diff : 0
  }

  return (
    <div>
     <Topbar
        title={
          <span className="flex items-center gap-2">
            Halo, {user?.name?.split(' ')[0]}
          </span>
        }
        breadcrumb={['KostHub', 'Tugas Hari Ini']}
      />

      <div className="p-8 max-w-[1300px]">
        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Link to="/tenants" className="group">
            <Card className="p-5 flex items-center gap-4 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <UserPlus size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-ink">Tambah Penghuni Baru</div>
                <div className="text-xs text-slate-muted mt-0.5">Daftarkan penghuni & buat akun sekaligus</div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </Card>
          </Link>
          <Link to="/invoices" className="group">
            <Card className="p-5 flex items-center gap-4 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <ReceiptText size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="font-display font-bold text-ink">Kelola Tagihan</div>
                <div className="text-xs text-slate-muted mt-0.5">Generate invoice & verifikasi pembayaran</div>
              </div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Card>
          </Link>
        </div>

        {/* Stat summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertCircle size={16} className="text-amber-600" />
              </div>
              <span className="font-display text-2xl font-bold text-ink">{outstanding?.count ?? 0}</span>
            </div>
            <p className="text-sm text-slate-muted">Tagihan perlu perhatian</p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
                <Wrench size={16} className="text-rose-600" />
              </div>
              <span className="font-display text-2xl font-bold text-ink">{maintenance.length}</span>
            </div>
            <p className="text-sm text-slate-muted">Komplain aktif</p>
          </Card>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        ) : (
          <>
            <Card className="mb-4 overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h3 className="font-display text-sm font-bold text-ink">Tagihan Perlu Perhatian</h3>
              </div>
              {outstanding?.invoices?.length ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] text-slate-muted uppercase tracking-wide bg-[var(--color-paper)]">
                      <th className="px-6 py-2.5 font-semibold">Penghuni</th>
                      <th className="px-6 py-2.5 font-semibold">Kamar</th>
                      <th className="px-6 py-2.5 font-semibold">Jumlah</th>
                      <th className="px-6 py-2.5 font-semibold">Telat</th>
                      <th className="px-6 py-2.5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outstanding.invoices.map((inv) => {
                      const overdue = daysOverdue(inv.due_date)
                      return (
                        <tr
                          key={inv.id}
                          onClick={() => window.location.href = `/invoices/${inv.id}`}
                          className="border-t border-[var(--color-border)] hover:bg-[var(--color-paper)]/60 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-3 text-ink font-medium">{inv.contract?.tenant?.user?.name}</td>
                          <td className="px-6 py-3 text-slate-600">Kamar {inv.contract?.room?.room_number}</td>
                          <td className="px-6 py-3 text-slate-600">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                          <td className="px-6 py-3 text-slate-600">{overdue > 0 ? `${overdue} hari` : '—'}</td>
                          <td className="px-6 py-3"><Badge status={inv.status} /></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="px-6 py-10 text-center">
                  <PartyPopper size={22} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-muted">Semua tagihan sudah lunas.</p>
                </div>
              )}
            </Card>

            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h3 className="font-display text-sm font-bold text-ink">Komplain Perlu Ditindaklanjuti</h3>
              </div>
              {maintenance.length ? (
                <div>
                  {maintenance.map((m) => (
                    <div key={m.id} className="flex items-center justify-between px-6 py-3.5 border-t border-[var(--color-border)] first:border-t-0">
                      <div>
                        <p className="text-sm text-ink font-medium">{m.description}</p>
                        <p className="text-xs text-slate-muted mt-0.5">{m.tenant?.user?.name} · Kamar {m.room?.room_number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.priority === 'urgent' && (
                          <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-50 text-rose-700">DARURAT</span>
                        )}
                        <Badge status={m.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-10 text-center">
                  <PartyPopper size={22} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-muted">Tidak ada komplain aktif.</p>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  )
}