import { useEffect, useState } from 'react'
import apiClient from '../../api/client'

export default function Reports() {
  const [occupancy, setOccupancy] = useState(null)
  const [revenue, setRevenue] = useState(null)
  const [outstanding, setOutstanding] = useState(null)

  useEffect(() => {
    apiClient.get('/reports/occupancy').then((r) => setOccupancy(r.data))
    apiClient.get('/reports/revenue').then((r) => setRevenue(r.data))
    apiClient.get('/reports/outstanding-invoices').then((r) => setOutstanding(r.data))
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Laporan</h1>

      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
          <div>Occupancy Rate</div>
          <strong style={{ fontSize: 24 }}>{occupancy?.occupancy_rate ?? '—'}%</strong>
        </div>
        <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
          <div>Total Revenue (Lunas)</div>
          <strong style={{ fontSize: 24 }}>Rp {Number(revenue?.total_revenue ?? 0).toLocaleString('id-ID')}</strong>
        </div>
        <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8 }}>
          <div>Tunggakan</div>
          <strong style={{ fontSize: 24 }}>Rp {Number(outstanding?.total_outstanding ?? 0).toLocaleString('id-ID')}</strong>
        </div>
      </div>

      <h3>Invoice Belum Lunas ({outstanding?.count ?? 0})</h3>
      <ul>
        {outstanding?.invoices?.map((inv) => (
          <li key={inv.id}>
            {inv.contract?.tenant?.user?.name} — Kamar {inv.contract?.room?.room_number} — Rp {Number(inv.total_amount).toLocaleString('id-ID')} ({inv.status})
          </li>
        ))}
      </ul>
    </div>
  )
}
