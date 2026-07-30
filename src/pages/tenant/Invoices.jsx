import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getInvoices } from '../../api/invoices'
import StatusChip from '../../components/StatusChip'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])

  useEffect(() => { getInvoices().then(setInvoices) }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-ink mb-4">Riwayat Tagihan</h1>
      <div className="space-y-2">
        {invoices.map((inv) => (
          <Link
            key={inv.id}
            to={`/invoices/${inv.id}`}
            className="block bg-white rounded-lg border border-slate-muted/15 p-4 flex justify-between items-center"
          >
            <div>
              <div className="text-sm">{inv.period}</div>
              <div className="text-base font-medium">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</div>
            </div>
            <StatusChip status={inv.status} />
          </Link>
        ))}
      </div>
    </div>
  )
}