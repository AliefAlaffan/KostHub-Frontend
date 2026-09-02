import { useEffect, useState } from 'react'
import { Plus, DoorOpen, CheckCircle2, Wrench, XCircle, X } from 'lucide-react'
import { getProperties } from '../../api/properties'
import { getRooms, createRoom } from '../../api/rooms'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { Link } from 'react-router-dom'
import { getRoom } from '../../api/rooms'
import { User, Calendar, Wallet } from 'lucide-react'

const STATUS_STYLE = {
  available: { icon: CheckCircle2, iconBg: '#ECFDF5', iconFg: '#059669', badgeBg: '#ECFDF5', badgeFg: '#047857', label: 'Tersedia' },
  occupied: { icon: DoorOpen, iconBg: '#EEF2FF', iconFg: '#4338CA', badgeBg: '#EEF2FF', badgeFg: '#3730A3', label: 'Terisi' },
  maintenance: { icon: Wrench, iconBg: '#FFFBEB', iconFg: '#D97706', badgeBg: '#FFFBEB', badgeFg: '#92400E', label: 'Perbaikan' },
  inactive: { icon: XCircle, iconBg: '#FAFAFA', iconFg: '#71717A', badgeBg: '#F4F4F5', badgeFg: '#52525B', label: 'Non-aktif' },
}

export default function Rooms() {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ room_number: '', floor: 1, price: '', description: '' })
  const [error, setError] = useState('')
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomDetail, setRoomDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

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

  const openRoomDetail = async (room) => {
    setSelectedRoom(room)
    setDetailLoading(true)
    const data = await getRoom(room.id)
    setRoomDetail(data)
    setDetailLoading(false)
  }

  const closeRoomDetail = () => {
    setSelectedRoom(null)
    setRoomDetail(null)
  }

  return (
    <div>
      <Topbar title="Kamar" breadcrumb={['KostHub', 'Kamar']} />

      <div className="p-8 max-w-[1300px]">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="bg-white border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <Button onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-2"><Plus size={16} /> Tambah Kamar</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {summary.map((s) => {
            const style = STATUS_STYLE[s.status]
            const Icon = style.icon
            return (
              <Card key={s.status} className="p-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: style.iconBg }}>
                  <Icon size={16} strokeWidth={2.2} style={{ color: style.iconFg }} />
                </div>
                <div className="font-display text-xl font-bold text-ink leading-none tabular-nums">{s.count}</div>
                <div className="text-xs text-slate-muted mt-1.5">{style.label}</div>
              </Card>
            )
          })}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        )}

        {!loading && Object.entries(roomsByFloor).sort(([a], [b]) => a - b).map(([floor, floorRooms]) => (
          <div key={floor} className="mb-8">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="text-[11px] font-bold text-slate-muted uppercase tracking-wider">Lantai {floor}</span>
              <span className="text-[11px] text-slate-300">·</span>
              <span className="text-[11px] text-slate-muted">{floorRooms.length} kamar</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {floorRooms.map((room) => {
                const style = STATUS_STYLE[room.status]
                return (
                  <div
                    key={room.id}
                    onClick={() => openRoomDetail(room)}
                    className="relative bg-white rounded-xl border border-[var(--color-border)] pl-4 pr-3.5 py-3.5 flex items-center gap-3 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="font-mono text-2xl font-bold text-ink tracking-tight">{room.room_number}</div>
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: style.badgeBg, color: style.badgeFg }}
                      >
                        {style.label}
                      </span>
                    </div>
                    <div className="text-[13px] font-semibold text-slate-600">
                      Rp {Number(room.price).toLocaleString('id-ID')}
                      <span className="text-slate-muted font-normal text-xs"> /bulan</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {!loading && rooms.length === 0 && (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <DoorOpen size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada kamar terdaftar di properti ini.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">Tambah Kamar Pertama</Button>
          </Card>
        )}
      </div>

      {selectedRoom && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={closeRoomDetail}
        >
          <div
            className="w-full max-w-sm p-6 relative rounded-xl"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeRoomDetail} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>

            {detailLoading || !roomDetail ? (
              <div className="py-8 text-center text-sm text-slate-muted">Memuat...</div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-2xl font-bold text-ink">{roomDetail.room_number}</span>
                  {(() => {
                    const style = STATUS_STYLE[roomDetail.status]
                    return (
                      <span
                        className="text-[10px] font-bold px-2 py-1 rounded-full"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {style.label}
                      </span>
                    )
                  })()}
                </div>
                <p className="text-xs text-slate-muted mb-4">Lantai {roomDetail.floor}</p>

                <div className="flex items-center gap-2 text-sm text-slate-600 mb-5">
                  <Wallet size={14} className="text-slate-muted" />
                  Rp {Number(roomDetail.price).toLocaleString('id-ID')} / bulan
                </div>

                {roomDetail.active_contract ? (
                  <div className="bg-[var(--color-paper)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User size={14} className="text-indigo-600" />
                      <span className="text-xs font-bold text-ink uppercase tracking-wide">Penghuni Saat Ini</span>
                    </div>
                    <div className="text-sm font-semibold text-ink mb-1">
                      {roomDetail.active_contract.tenant?.user?.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-muted mb-3">
                      <Calendar size={12} />
                      {roomDetail.active_contract.start_date} — {roomDetail.active_contract.end_date}
                    </div>
                    <Link
                      to={`/tenants/${roomDetail.active_contract.tenant?.id}`}
                      className="block text-center bg-indigo-600 text-white rounded-lg py-2 text-xs font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Lihat Detail Penghuni
                    </Link>
                  </div>
                ) : (
                  <div className="bg-[var(--color-paper)] rounded-lg p-4 text-center">
                    <p className="text-sm text-slate-muted">Kamar ini sedang kosong.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="w-full max-w-sm p-6 relative rounded-xl"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
          >
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink transition-colors">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink mb-5">Tambah Kamar</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Nomor Kamar</label>
                <input
                  value={form.room_number}
                  onChange={(e) => setForm({ ...form, room_number: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Lantai</label>
                <input
                  type="number" value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Harga Sewa</label>
                <input
                  type="number" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Deskripsi (opsional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Simpan Kamar</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}   