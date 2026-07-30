import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTenants } from '../../api/tenants'
import { getInvoices, generateInvoice } from '../../api/invoices'

const STATUS_LABEL = {
  unpaid: 'Belum Dibayar', partial: 'Sebagian', paid: 'Lunas', overdue: 'Terlambat',
}

export default function Invoices() {
  const [tenants, setTenants] = useState([])
  const [invoices, setInvoices] = useState([])
  const [selectedTenant, setSelectedTenant] = useState('')
  const [period, setPeriod] = useState('')
  const [error, setError] = useState('')

  const loadInvoices = () => getInvoices().then(setInvoices)

  useEffect(() => {
    getTenants().then(setTenants)
    loadInvoices()
  }, [])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    const tenant = tenants.find((t) => t.id === Number(selectedTenant))
    const contractId = tenant?.active_contract?.id

    if (!contractId) {
      setError('Penghuni ini tidak memiliki kontrak aktif.')
      return
    }

    try {
      await generateInvoice({ contract_id: contractId, period })
      loadInvoices()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal generate invoice')
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Tagihan</h1>

      <form onSubmit={handleGenerate} style={{ display: 'flex', gap: 8, alignItems: 'end', marginBottom: 24 }}>
        <div>
          <label>Penghuni:</label><br />
          <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} required>
            <option value="">-- Pilih --</option>
            {tenants.map((t) => (
              <option key={t.id} value={t.id}>{t.user?.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Periode:</label><br />
          <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} required />
        </div>
        <button type="submit">Generate Invoice</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Penghuni</th><th>Kamar</th><th>Periode</th><th>Total</th><th>Jatuh Tempo</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.contract?.tenant?.user?.name}</td>
              <td>{inv.contract?.room?.room_number}</td>
              <td><Link to={`/invoices/${inv.id}`}>{inv.period}</Link></td>
              <td>Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
              <td>{inv.due_date}</td>
              <td>{STATUS_LABEL[inv.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
