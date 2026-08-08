import { useEffect, useState } from 'react'
import { Wrench, Plus, X } from 'lucide-react'
import { getMaintenanceRequests, createMaintenanceRequest } from '../../api/maintenance'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

export default function Maintenance() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ category: 'kerusakan', priority: 'medium', description: '' })
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getMaintenanceRequests().then((data) => { setRequests(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createMaintenanceRequest(form)
      setForm({ category: 'kerusakan', priority: 'medium', description: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengajukan komplain')
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  return (
    <div>
      <Topbar title="Komplain" breadcrumb={['KostHub', 'Komplain']} />

      <div className="p-6 max-w-lg mx-auto">
        <Button onClick={() => setShowForm(true)} className="w-full mb-5">
          <span className="flex items-center justify-center gap-2"><Plus size={16} /> Ajukan Komplain</span>
        </Button>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
          </div>
        ) : requests.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Wrench size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada komplain diajukan.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-500 capitalize">{r.category}</span>
                  <Badge status={r.status} />
                </div>
                <p className="text-sm text-ink">{r.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-sm p-6 relative rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink mb-5">Ajukan Komplain</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                <option value="kerusakan">Kerusakan</option>
                <option value="kebersihan">Kebersihan</option>
                <option value="keamanan">Keamanan</option>
                <option value="lainnya">Lainnya</option>
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className={inputClass}>
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Darurat</option>
              </select>
              <textarea placeholder="Jelaskan masalahnya" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Kirim Komplain</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}