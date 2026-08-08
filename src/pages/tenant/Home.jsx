import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Receipt, Wrench, Megaphone, ArrowRight, PartyPopper, DoorOpen } from 'lucide-react'
import { getInvoices } from '../../api/invoices'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'
import { useAuthStore } from '../../store/authStore'

export default function Home() {
  const { user } = useAuthStore()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvoices().then((data) => {
      const unpaid = data.find((inv) => ['unpaid', 'partial', 'overdue'].includes(inv.status))
      setInvoice(unpaid)
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Topbar title="Sewa Saya" breadcrumb={['KostHub', 'Sewa Saya']} />

      <div className="p-6 max-w-lg mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--color-navy)] p-6 mb-5 text-white">
          <div className="absolute right-6 -top-6 w-32 h-32 rounded-full bg-white/[0.04]" />
          <div className="relative">
            <div className="text-sm text-zinc-400">Selamat datang,</div>
            <div className="font-display text-xl font-bold">{user?.name}</div>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-40 mb-5" />
        ) : invoice ? (
          <Card className="p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-muted uppercase tracking-wide mb-1">Tagihan {invoice.period}</div>
                <div className="font-display text-3xl font-bold text-ink tracking-tight">
                  Rp {Number(invoice.total_amount).toLocaleString('id-ID')}
                </div>
              </div>
              <Badge status={invoice.status} />
            </div>
            <Link
              to={`/invoices/${invoice.id}`}
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white rounded-xl py-3.5 text-sm font-bold hover:bg-indigo-700 transition-colors"
            >
              Bayar Sekarang <ArrowRight size={16} />
            </Link>
          </Card>
        ) : (
          <Card className="p-8 text-center mb-5">
            <PartyPopper size={26} className="text-emerald-400 mx-auto mb-3" />
            <p className="font-display font-bold text-ink mb-1">Semua Lunas!</p>
            <p className="text-sm text-slate-muted">Tidak ada tagihan yang perlu dibayar.</p>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Link to="/invoices" className="group">
            <Card className="p-4 text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2">
                <Receipt size={18} className="text-indigo-600" />
              </div>
              <div className="text-xs font-semibold text-ink">Tagihan</div>
            </Card>
          </Link>
          <Link to="/maintenance" className="group">
            <Card className="p-4 text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mx-auto mb-2">
                <Wrench size={18} className="text-rose-600" />
              </div>
              <div className="text-xs font-semibold text-ink">Komplain</div>
            </Card>
          </Link>
          <Link to="/announcements" className="group">
            <Card className="p-4 text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-2">
                <Megaphone size={18} className="text-amber-600" />
              </div>
              <div className="text-xs font-semibold text-ink">Info</div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}