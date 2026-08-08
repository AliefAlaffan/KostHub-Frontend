import { useEffect, useState } from 'react'
import { Wrench, AlertTriangle } from 'lucide-react'
import { getMaintenanceRequests, updateMaintenanceStatus } from '../../api/maintenance'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const PRIORITY_STYLE = {
  low: { bg: '#F4F4F5', fg: '#52525B', label: 'Rendah' },
  medium: { bg: '#E6F1FB', fg: '#185FA5', label: 'Sedang' },
  high: { bg: '#FFFBEB', fg: '#92400E', label: 'Tinggi' },
  urgent: { bg: '#FEF2F2', fg: '#BE123C', label: 'Darurat' },
}

const STATUS_FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'new', label: 'Baru' },
  { key: 'in_progress', label: 'Diproses' },
  { key: 'done', label: 'Selesai' },
  { key: 'closed', label: 'Ditutup' },
]

export default function Maintenance() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')
  const [costInputs, setCostInputs] = useState({})

  const load = () => {
    setLoading(true)
    getMaintenanceRequests().then((data) => { setRequests(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const handleStatusChange = async (id, status) => {
    setError('')
    try {
      await updateMaintenanceStatus(id, { status, repair_cost: costInputs[id] || undefined })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update status')
    }
  }

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter)

  return (
    <div>
      <Topbar title="Maintenance" breadcrumb={['KostHub', 'Maintenance']} />

      <div className="p-8 max-w-[1300px]">
        <div className="flex items-center gap-1.5 bg-[var(--color-paper)] rounded-lg p-1 mb-5 w-fit">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                filter === f.key ? 'bg-white text-ink shadow-sm' : 'text-slate-muted hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Wrench size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Tidak ada komplain untuk filter ini.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const priority = PRIORITY_STYLE[r.priority]
              return (
                <Card key={r.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: priority.bg, color: priority.fg }}
                        >
                          {r.priority === 'urgent' && <AlertTriangle size={10} />}
                          {priority.label.toUpperCase()}
                        </span>
                        <Badge status={r.status} />
                        <span className="text-xs text-slate-muted capitalize">{r.category}</span>
                      </div>
                      <p className="text-sm text-ink mb-2">{r.description}</p>
                      <p className="text-xs text-slate-muted">
                        {r.tenant?.user?.name} · Kamar {r.room?.room_number}
                        {r.repair_cost && ` · Biaya: Rp ${Number(r.repair_cost).toLocaleString('id-ID')}`}
                      </p>
                    </div>

                    {r.status !== 'closed' && (
                      <div className="flex flex-col gap-2 shrink-0 w-44">
                        <select
                          onChange={(e) => handleStatusChange(r.id, e.target.value)}
                          defaultValue=""
                          className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="" disabled>Ubah Status</option>
                          <option value="in_progress">Diproses</option>
                          <option value="done">Selesai</option>
                          <option value="closed">Ditutup</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Biaya perbaikan"
                          onChange={(e) => setCostInputs({ ...costInputs, [r.id]: e.target.value })}
                          className="px-3 py-2 border border-[var(--color-border)] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}