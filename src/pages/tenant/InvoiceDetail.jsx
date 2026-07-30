import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInvoice } from '../../api/invoices'
import { createPayment } from '../../api/payments'
import StatusChip from '../../components/StatusChip'

export default function InvoiceDetail() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [form, setForm] = useState({ amount: '', method: 'transfer', payment_date: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => getInvoice(id).then(setInvoice)
  useEffect(() => { load() }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await createPayment(id, form)
      setSuccess('Pembayaran berhasil dikirim, menunggu verifikasi staff.')
      setForm({ amount: '', method: 'transfer', payment_date: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim pembayaran')
    }
  }

  if (!invoice) return <p className="p-4 text-sm text-slate-muted">Memuat...</p>

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-ink mb-1">Invoice {invoice.period}</h1>
      <div className="mb-4"><StatusChip status={invoice.status} /></div>

      <div className="bg-white rounded-lg border border-slate-muted/15 p-4 mb-4">
        <h3 className="text-sm font-medium mb-2">Rincian Tagihan</h3>
        {invoice.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm py-1">
            <span>{item.description}</span>
            <span>Rp {Number(item.amount).toLocaleString('id-ID')}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-muted/15 mt-2">
          <span>Total</span>
          <span>Rp {Number(invoice.total_amount).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-muted/15 p-4 mb-4">
        <h3 className="text-sm font-medium mb-2">Riwayat Pembayaran</h3>
        {invoice.payments?.length ? invoice.payments.map((p) => (
          <div key={p.id} className="flex justify-between text-sm py-1 items-center">
            <span>{p.payment_date} — Rp {Number(p.amount).toLocaleString('id-ID')}</span>
            <StatusChip status={p.status} />
          </div>
        )) : <p className="text-sm text-slate-muted">Belum ada pembayaran.</p>}
      </div>

      {['unpaid', 'partial', 'overdue'].includes(invoice.status) && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-muted/15 p-4 space-y-2">
          <h3 className="text-sm font-medium mb-2">Bayar Sekarang</h3>
          <input
            type="number" placeholder="Jumlah" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm" required
          />
          <select
            value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}
            className="w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm"
          >
            <option value="transfer">Transfer</option>
            <option value="ewallet">E-Wallet</option>
          </select>
          <input
            type="date" value={form.payment_date}
            onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
            className="w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm" required
          />
          <button type="submit" className="w-full bg-ledger text-white rounded-md py-2 text-sm font-medium">
            Kirim Bukti Pembayaran
          </button>
          {error && <p className="text-sm text-[color:var(--color-status-danger)]">{error}</p>}
          {success && <p className="text-sm text-[color:var(--color-status-success)]">{success}</p>}
        </form>
      )}
    </div>
  )
}