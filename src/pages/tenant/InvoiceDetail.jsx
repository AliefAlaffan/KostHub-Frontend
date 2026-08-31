import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getInvoice } from '../../api/invoices'
import { createPayment } from '../../api/payments'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

export default function InvoiceDetail() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ amount: '', method: 'transfer', payment_date: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    getInvoice(id).then((data) => { setInvoice(data); setLoading(false) })
  }
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

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  if (loading) {
    return (
      <div>
        <Topbar title="Detail Tagihan" breadcrumb={['KostHub', 'Tagihan']} />
        <div className="p-6 max-w-lg mx-auto space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar title="Detail Tagihan" breadcrumb={['KostHub', 'Tagihan Saya', invoice?.period]} />

      <div className="p-6 max-w-lg mx-auto">
        <Link to="/invoices" className="inline-flex items-center gap-1.5 text-sm text-slate-muted hover:text-ink mb-4 transition-colors">
          <ArrowLeft size={15} /> Kembali
        </Link>

        <Card className="p-6 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-display text-lg font-bold text-ink">Invoice {invoice.period}</span>
            <Badge status={invoice.status} />
          </div>
          <div className="font-display text-3xl font-bold text-ink mt-2">
            Rp {Number(invoice.total_amount).toLocaleString('id-ID')}
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="text-sm font-bold text-ink mb-3">Rincian</h3>
          {invoice.items?.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1.5">
              <span className="text-slate-600">{item.description}</span>
              <span className="font-medium text-ink">Rp {Number(item.amount).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </Card>

        <Card className="p-5 mb-4">
          <h3 className="text-sm font-bold text-ink mb-3">Riwayat Pembayaran</h3>
          {invoice.payments?.length ? invoice.payments.map((p) => (
            <div key={p.id} className="flex justify-between items-center text-sm py-1.5">
              <span>{p.payment_date} · Rp {Number(p.amount).toLocaleString('id-ID')}</span>
              <Badge status={p.status} />
            </div>
          )) : <p className="text-sm text-slate-muted">Belum ada pembayaran.</p>}
        </Card>

        {['unpaid', 'partial', 'overdue'].includes(invoice.status) && (
          <>
            {invoice.contract?.room?.property?.qris_image && (
              <Card className="p-5 mb-4 text-center">
                <h3 className="text-sm font-bold text-ink mb-3">Scan QRIS untuk Bayar</h3>
                <img
                  src={`http://localhost:8000/storage/${invoice.contract.room.property.qris_image}`}
                  alt="QRIS Pembayaran"
                  className="w-48 h-48 mx-auto rounded-lg border border-[var(--color-border)]"
                />
                <p className="text-xs text-slate-muted mt-3">
                  Scan kode di atas menggunakan aplikasi e-wallet atau m-banking Anda, lalu isi form di
                  bawah dan unggah bukti transfer.
                </p>
              </Card>
            )}

            <Card className="p-5">
              <h3 className="text-sm font-bold text-ink mb-3">Bayar Sekarang</h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="number" placeholder="Jumlah" value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} required />
                <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={inputClass}>
                  <option value="transfer">Transfer</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
                <input type="date" value={form.payment_date}
                  onChange={(e) => setForm({ ...form, payment_date: e.target.value })} className={inputClass} required />
                {error && <p className="text-sm text-rose-600">{error}</p>}
                {success && <p className="text-sm text-emerald-600">{success}</p>}
                <Button type="submit" className="w-full">Kirim Bukti Pembayaran</Button>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}