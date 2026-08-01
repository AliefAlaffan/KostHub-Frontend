import { useEffect, useState } from 'react'
import { Plus, DoorOpen, X } from 'lucide-react'
import { getProperties } from '../../api/properties'
import { getRooms, createRoom } from '../../api/rooms'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

const STATUS_STYLE = {
  available: { dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Tersedia' },
  occupied: { dot: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Terisi' },
  maintenance: { dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', label: 'Perbaikan' },
  inactive: { dot: 'bg-slate-400', bg: 'bg-slate-50', text: 'text-slate-600', label: 'Non-aktif' },
}

export default function Rooms() {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ room_number: '', floor: 1, price: '', description: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      if (data.length > 0) setSelectedProperty(data[0].id)
    })
  }, [])

  const loadRooms = async (propertyId) => {
    if (!propertyId) return
    setLoading(true)
    const data = await getRooms(propertyId)
    setRooms(data)
    setLoading(false)
  }
  useEffect(() => { loadRooms(selectedProperty) }, [selectedProperty])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createRoom({ ...form, property_id: selectedProperty })
      setForm({ room_number: '', floor: 1, price: '', description: '' })
      setShowForm(false)
      loadRooms(selectedProperty)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah kamar')
    }
  }

  const roomsByFloor = rooms.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || []
    acc[room.floor].push(room)
    return acc
  }, {})

  const summary = ['available', 'occupied', 'maintenance', 'inactive'].map((s) => ({
    status: s, count: rooms.filter((r) => r.status === s).length,
  }))

  return (
    <div>
      <Topbar title="Kamar" subtitle="Kelola kamar dan pantau statusnya secara real-time" />

      <div className="p-8 max-w-[1400px] animate-in">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-medium text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-2"><Plus size={16} /> Tambah Kamar</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {summary.map((s) => {
            const style = STATUS_STYLE[s.status]
            return (
              <div key={s.status} className="rounded-lg bg-white border border-slate-100 p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
                <span className={`w-2.5 h-2.5 rounded-full ${style.dot} shrink-0`} />
                <div>
                  <div className="text-lg font-bold text-ink leading-none tabular-nums">{s.count}</div>
                  <div className="text-xs font-medium text-slate-muted mt-1">{style.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        )}

        {!loading && Object.entries(roomsByFloor).sort(([a], [b]) => a - b).map(([floor, floorRooms]) => (
          <div key={floor} className="mb-7">
            <div className="text-xs font-bold text-slate-muted uppercase tracking-wider mb-3">Lantai {floor}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {floorRooms.map((room) => {
                const style = STATUS_STYLE[room.status]
                return (
                  <div
                    key={room.id}
                    className="group relative bg-white rounded-xl border border-slate-100 p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className={`absolute inset-x-0 top-0 h-[3px] ${style.dot}`} />
                    <div className="text-2xl font-bold text-ink tracking-tight tabular-nums mt-1">{room.room_number}</div>
                    <div className={`inline-flex items-center gap-1.5 mt-2.5 px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {style.label}
                    </div>
                    <div className="text-xs text-slate-muted mt-2">Rp {Number(room.price).toLocaleString('id-ID')}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {!loading && rooms.length === 0 && (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
              <DoorOpen size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada kamar terdaftar di properti ini.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">Tambah Kamar Pertama</Button>
          </Card>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in">
          <Card className="w-full max-w-sm p-6 relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink transition-colors">
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-ink mb-5">Tambah Kamar</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Nomor Kamar</label>
                <input
                  value={form.room_number}
                  onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Lantai</label>
                <input
                  type="number" value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Harga Sewa</label>
                <input
                  type="number" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Deskripsi (opsional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Simpan Kamar</Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}