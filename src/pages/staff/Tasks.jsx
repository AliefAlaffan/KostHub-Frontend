import { useEffect, useState } from 'react'
import apiClient from '../../api/client'

export default function Tasks() {
  const [outstanding, setOutstanding] = useState(null)

  useEffect(() => {
    apiClient.get('/reports/outstanding-invoices').then((r) => setOutstanding(r.data))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-ink mb-6">Tugas Hari Ini</h1>
      <div className="bg-white rounded-lg border border-slate-muted/15">
        <div className="px-4 py-3 border-b border-slate-muted/15 text-sm font-medium">
          Tagihan Perlu Perhatian ({outstanding?.count ?? 0})
        </div>
        <table className="w-full text-sm">
          <tbody>
            {outstanding?.invoices?.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-muted/10">
                <td className="px-4 py-2">{inv.contract.tenant.user.name}</td>
                <td className="px-4 py-2">Kamar {inv.contract.room.room_number}</td>
                <td className="px-4 py-2 text-right">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                <td className="px-4 py-2">{inv.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}