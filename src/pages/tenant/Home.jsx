import { useEffect, useState } from 'react'
import { getInvoices } from '../../api/invoices'
import StatusChip from '../../components/StatusChip'

export default function Home() {
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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-ink mb-4">Sewa Saya</h1>

      {loading && <p className="text-sm text-slate-muted">Memuat...</p>}

      {!loading && invoice && (
        <div className="bg-white rounded-lg border border-slate-muted/15 p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-xs text-slate-muted uppercase">Tagihan {invoice.period}</div>
              <div className="text-2xl font-semibold text-ink mt-1">
                Rp {Number(invoice.total_amount).toLocaleString('id-ID')}
              </div>
            </div>
            <StatusChip status={invoice.status} />
          </div>
          
            <a href={`/invoices/${invoice.id}`}
            className="block text-center w-full bg-ledger text-white rounded-md py-2.5 text-sm font-medium mt-2"
          >
            Bayar Sekarang
          </a>
        </div>
      )}

      {!loading && !invoice && (
        <div className="bg-white rounded-lg border border-slate-muted/15 p-5 text-sm text-slate-muted">
          Tidak ada tagihan belum lunas saat ini.
        </div>
      )}
    </div>
  )
}