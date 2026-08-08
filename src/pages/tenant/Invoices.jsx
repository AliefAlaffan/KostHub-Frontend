import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Receipt } from 'lucide-react'
import { getInvoices } from '../../api/invoices'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getInvoices().then((data) => { setInvoices(data); setLoading(false) })
  }, [])

  return (
    <div>
      <Topbar title="Tagihan Saya" breadcrumb={['KostHub', 'Tagihan Saya']} />

      <div className="p-6 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : invoices.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Receipt size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada riwayat tagihan.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <Link key={inv.id} to={`/invoices/${inv.id}`}>
                <Card className="p-4 flex items-center justify-between hover:shadow-[var(--shadow-card-hover)] transition-shadow">
                  <div>
                    <div className="text-sm font-mono text-slate-muted">{inv.period}</div>
                    <div className="font-display text-lg font-bold text-ink">
                      Rp {Number(inv.total_amount).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <Badge status={inv.status} />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}