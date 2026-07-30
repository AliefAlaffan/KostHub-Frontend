import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getInvoice } from '../../api/invoices'
import { createPayment, verifyPayment, rejectPayment } from '../../api/payments'

export default function InvoiceDetail() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [form, setForm] = useState({ amount: '', method: 'transfer', payment_date: '' })
  const [error, setError] = useState('')

  const load = () => getInvoice(id).then(setInvoice)
  useEffect(() => { load() }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmitPayment = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createPayment(id, form)
      setForm({ amount: '', method: 'transfer', payment_date: '' })
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
    const reason = prompt('Alasan penolakan:')
    if (!reason) return
    setError('')
    try {
      await rejectPayment(paymentId, reason)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menolak')
    }
  }

  if (!invoice) return <p style={{ padding: 40 }}>Memuat...</p>

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Invoice {invoice.period}</h1>
      <p>Penghuni: {invoice.contract?.tenant?.user?.name}</p>
      <p>Kamar: {invoice.contract?.room?.room_number}</p>
      <p>Total: Rp {Number(invoice.total_amount).toLocaleString('id-ID')}</p>
      <p>Status: <strong>{invoice.status}</strong></p>

      <h3>Item Tagihan</h3>
      <ul>
        {invoice.items?.map((item) => (
          <li key={item.id}>{item.description}: Rp {Number(item.amount).toLocaleString('id-ID')}</li>
        ))}
      </ul>

      <h3>Riwayat Pembayaran</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
        <thead>
          <tr><th>Tanggal</th><th>Jumlah</th><th>Metode</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {invoice.payments?.map((p) => (
            <tr key={p.id}>
              <td>{p.payment_date}</td>
              <td>Rp {Number(p.amount).toLocaleString('id-ID')}</td>
              <td>{p.method}</td>
              <td>{p.status}</td>
              <td>
                {p.status === 'pending' && (
                  <>
                    <button onClick={() => handleVerify(p.id)}>Verifikasi</button>{' '}
                    <button onClick={() => handleReject(p.id)}>Tolak</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Input Pembayaran</h3>
      <form onSubmit={handleSubmitPayment} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300 }}>
        <input name="amount" type="number" placeholder="Jumlah" value={form.amount} onChange={handleChange} required />
        <select name="method" value={form.method} onChange={handleChange}>
          <option value="transfer">Transfer</option>
          <option value="cash">Tunai</option>
          <option value="ewallet">E-Wallet</option>
        </select>
        <input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} required />
        <button type="submit">Kirim Pembayaran</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
