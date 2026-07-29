import { useEffect, useState } from 'react'
import apiClient from '../api/client'

export default function StaffTasks() {
  const [outstanding, setOutstanding] = useState(null)

  useEffect(() => {
    apiClient.get('/reports/outstanding-invoices').then((r) => setOutstanding(r.data))
  }, [])

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Tugas Hari Ini</h1>
      <h3>Tagihan Perlu Perhatian ({outstanding?.count ?? 0})</h3>
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