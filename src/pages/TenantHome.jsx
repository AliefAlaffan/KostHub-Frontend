import { useEffect, useState } from 'react'
import { getInvoices } from '../api/invoices'

export default function TenantHome() {
  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    getInvoices().then((data) => {
      const unpaid = data.find((inv) => ['unpaid', 'partial', 'overdue'].includes(inv.status))
      setInvoice(unpaid)
    })
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Sewa Saya</h1>
      {invoice ? (
        <div style={{ border: '2px solid #3F7D5C', borderRadius: 8, padding: 16, maxWidth: 300 }}>
          <div>Tagihan {invoice.period}</div>
          <strong style={{ fontSize: 24 }}>Rp {Number(invoice.total_amount).toLocaleString('id-ID')}</strong>
          <div>Status: {invoice.status}</div>
        </div>
      ) : (
        <p>Tidak ada tagihan belum lunas.</p>
      )}
    </div>
  )
}