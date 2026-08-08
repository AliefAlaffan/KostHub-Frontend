import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Receipt, Check, X as XIcon } from 'lucide-react'
import { getInvoice } from '../../api/invoices'
import { createPayment, verifyPayment, rejectPayment } from '../../api/payments'
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
  const [showPayForm, setShowPayForm] = useState(false)
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const load = () => {
    getInvoice(id).then((data) => { setInvoice(data); setLoading(false) })
  }
  useEffect(() => { load() }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmitPayment = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createPayment(id, form)
      setForm({ amount: '', method: 'transfer', payment_date: '' })
      setShowPayForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal input pembayaran')
    }
  }

  const handleVerify = async (paymentId) => {
    setError('')
    try {
      await verifyPayment(paymentId)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal verifikasi')
    }
  }

  const handleReject = async (paymentId) => {
    setError('')
    try {
      await rejectPayment(paymentId, rejectReason)
      setRejectingId(null)
      setRejectReason('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menolak')
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  if (loading) {
    return (
      <div>
        <Topbar title="Detail Tagihan" breadcrumb={['KostHub', 'Tagihan', 'Detail']} />
        <div className="p-8 max-w-[900px] space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div>
        <Topbar title="Detail Tagihan" breadcrumb={['KostHub', 'Tagihan']} />
        <div className="p-8 text-slate-muted text-sm">Tagihan tidak ditemukan.</div>
      </div>
    )
  }

  return (
    <div>
      <Topbar title="Detail Tagihan" breadcrumb={['KostHub', 'Tagihan', invoice.period]} />

      <div className="p-8 max-w-[900px]">
        <Link to="/invoices" className="inline-flex items-center gap-1.5 text-sm text-slate-muted hover:text-ink mb-5 transition-colors">
          <ArrowLeft size={15} /> Kembali ke Tagihan
        </Link>

        <Card className="p-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="font-display text-xl font-bold text-ink">Invoice {invoice.period}</h2>
                <Badge status={invoice.status} />
              </div>
              <p className="text-sm text-slate-muted">
                {invoice.contract?.tenant?.user?.name} · Kamar {invoice.contract?.room?.room_number}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-muted mb-1">Total Tagihan</div>
              <div className="font-display text-2xl font-bold text-ink">
                Rp {Number(invoice.total_amount).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <h3 className="font-display text-sm font-bold text-ink mb-4">Rincian Item</h3>
          <div className="space-y-2.5">
            {invoice.items?.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-600">{item.description}</span>
                <span className="font-semibold text-ink">Rp {Number(item.amount).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm pt-2.5 border-t border-[var(--color-border)]">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-bold text-ink">Rp {Number(invoice.total_amount).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-ink">Riwayat Pembayaran</h3>
            {['unpaid', 'partial', 'overdue'].includes(invoice.status) && (
              <button
                onClick={() => setShowPayForm(!showPayForm)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {showPayForm ? 'Batal' : '+ Input Pembayaran'}
              </button>
            )}
          </div>

          {invoice.payments?.length ? (
            <div className="space-y-2">
              {invoice.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-[var(--color-border)] last:border-0">
                  <div>
                    <div className="text-sm font-medium text-ink">Rp {Number(p.amount).toLocaleString('id-ID')}</div>
                    <div className="text-xs text-slate-muted">{p.payment_date} · {p.method}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={p.status} />
                    {p.status === 'pending' && (
                      <>
                        <button onClick={() => handleVerify(p.id)} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                          <Check size={14} />
                        </button>
                        <button onClick={() => setRejectingId(p.id)} className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-100 transition-colors">
                          <XIcon size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-muted">Belum ada pembayaran.</p>
          )}

          {rejectingId && (
            <div className="mt-3 bg-rose-50 rounded-lg p-3">
              <label className="block text-xs font-medium text-rose-700 mb-1.5">Alasan penolakan</label>
              <div className="flex gap-2">
                <input
                  value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                  className="flex-1 px-3 py-2 border border-rose-200 rounded-lg text-sm focus:outline-none"
                  placeholder="mis. Bukti transfer tidak jelas"
                />
                <Button variant="danger" onClick={() => handleReject(rejectingId)}>Tolak</Button>
              </div>
            </div>
          )}

          {showPayForm && (
            <form onSubmit={handleSubmitPayment} className="mt-4 space-y-3 bg-[var(--color-paper)] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3">
                <input name="amount" type="number" placeholder="Jumlah" value={form.amount} onChange={handleChange} className={inputClass} required />
                <select name="method" value={form.method} onChange={handleChange} className={inputClass}>
                  <option value="transfer">Transfer</option>
                  <option value="cash">Tunai</option>
                  <option value="ewallet">E-Wallet</option>
                </select>
              </div>
              <input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} className={inputClass} required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Kirim Pembayaran</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  )
}