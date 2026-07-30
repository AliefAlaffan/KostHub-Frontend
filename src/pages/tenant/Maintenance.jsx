import { useEffect, useState } from 'react'
import { getMaintenanceRequests, createMaintenanceRequest } from '../../api/maintenance'
import StatusChip from '../../components/StatusChip'

const PRIORITY_LABEL = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', urgent: 'Darurat' }

export default function Maintenance() {
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({ category: 'kerusakan', priority: 'medium', description: '' })
  const [error, setError] = useState('')

  const load = () => getMaintenanceRequests().then(setRequests)
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createMaintenanceRequest(form)
      setForm({ category: 'kerusakan', priority: 'medium', description: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengajukan komplain')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-ink mb-4">Ajukan Komplain</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-muted/15 p-4 space-y-2 mb-6">
        <select
          value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm"
        >
          <option value="kerusakan">Kerusakan</option>
          <option value="kebersihan">Kebersihan</option>
          <option value="keamanan">Keamanan</option>
          <option value="lainnya">Lainnya</option>
        </select>
        <select
          value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
          className="w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm"
        >
          <option value="low">Rendah</option>
          <option value="medium">Sedang</option>
          <option value="high">Tinggi</option>
          <option value="urgent">Darurat</option>
        </select>
        <textarea
          placeholder="Jelaskan masalahnya" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm" required
        />
        <button type="submit" className="w-full bg-ledger text-white rounded-md py-2 text-sm font-medium">
          Kirim Komplain
        </button>
        {error && <p className="text-sm text-[color:var(--color-status-danger)]">{error}</p>}
      </form>

      <h2 className="text-sm font-medium mb-2">Riwayat Komplain</h2>
      <div className="space-y-2">
        {requests.map((r) => (
          <div key={r.id} className="bg-white rounded-lg border border-slate-muted/15 p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">{r.category} — {PRIORITY_LABEL[r.priority]}</span>
              <StatusChip status={r.status} />
            </div>
            <p className="text-sm text-slate-muted">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}