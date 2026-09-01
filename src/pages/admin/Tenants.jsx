import { useEffect, useState } from 'react'
import { Plus, User, X, KeyRound, Copy, Check, Search} from 'lucide-react'
import { getProperties } from '../../api/properties'
import { getRooms } from '../../api/rooms'
import { getTenants, createTenant } from '../../api/tenants'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { Link } from 'react-router-dom'

export default function Tenants() {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [availableRooms, setAvailableRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', ktp_number: '', room_id: '',
    start_date: '', end_date: '',
  })
  const [error, setError] = useState('')
  const [successInfo, setSuccessInfo] = useState(null)
  const [copied, setCopied] = useState(false)
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')  

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      if (data.length > 0) setSelectedProperty(data[0].id)
    })
    loadTenants()
  }, [])

  const loadTenants = () => {
    setLoading(true)
    getTenants({
      property_id: selectedPropertyFilter || undefined,
      search: searchQuery || undefined,
    }).then((data) => { setTenants(data); setLoading(false) })
  }
  useEffect(() => { loadTenants() }, [selectedPropertyFilter, searchQuery])

  useEffect(() => {
    if (!selectedProperty) return
    getRooms(selectedProperty).then((rooms) => {
      setAvailableRooms(rooms.filter((r) => r.status === 'available'))
    })
  }, [selectedProperty])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessInfo(null)
    try {
      const result = await createTenant(form)
      setSuccessInfo(result)
      setForm({ name: '', email: '', phone: '', ktp_number: '', room_id: '', start_date: '', end_date: '' })
      loadTenants()
      getRooms(selectedProperty).then((rooms) => setAvailableRooms(rooms.filter((r) => r.status === 'available')))
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(', ') : (err.response?.data?.message || 'Gagal menambah penghuni'))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`Email: ${successInfo.tenant.user.email}\nPassword: ${successInfo.plain_password}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  return (
    <div>
      <Topbar title="Penghuni" breadcrumb={['KostHub', 'Penghuni']} />

      <div className="p-8 max-w-[1300px]">
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <select
            value={selectedPropertyFilter}
            onChange={(e) => setSelectedPropertyFilter(e.target.value)}
            className="bg-white border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Semua Properti</option>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <div className="flex items-center gap-2 bg-white border border-[var(--color-border)] rounded-lg px-3 py-2.5 flex-1 min-w-[200px] max-w-xs focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500 transition-all">
            <Search size={15} className="text-slate-muted shrink-0" />
            <input
              placeholder="Cari nama atau nomor kamar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full placeholder:text-slate-muted"
              style={{ outline: 'none' }}
            />
          </div>

          <Button onClick={() => setShowForm(true)} className="ml-auto">
            <span className="flex items-center gap-2"><Plus size={16} /> Tambah Penghuni</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : tenants.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <User size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada penghuni terdaftar.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">Tambah Penghuni Pertama</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tenants.map((t) => (
              <Link key={t.id} to={`/tenants/${t.id}`}>
                <Card className="p-4 flex items-center gap-3 hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center text-sm font-bold shrink-0">
                    {(t.user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{t.user?.name}</div>
                    <div className="text-xs text-slate-muted">
                      {t.active_contract?.room ? (
                        <>
                          {t.active_contract.room.property?.name} — Kamar {t.active_contract.room.room_number}
                        </>
                      ) : (
                        'Tidak ada kamar aktif'
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
         <div
          className="w-full max-w-sm p-6 relative rounded-xl"
          style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
        >
            <button
              onClick={() => { setShowForm(false); setSuccessInfo(null) }}
              className="absolute top-4 right-4 text-slate-muted hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>

            {!successInfo ? (
              <>
                <h3 className="font-display text-lg font-bold text-ink mb-1">Tambah Penghuni</h3>
                <p className="text-xs text-slate-muted mb-5">Data akan otomatis membuat akun login untuk penghuni</p>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-muted mb-1.5">Properti</label>
                  <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)} className={inputClass}>
                    {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} className={inputClass} required />
                  <input name="ktp_number" placeholder="No. KTP" value={form.ktp_number} onChange={handleChange} className={inputClass} required />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="email" placeholder="Email (opsional)" value={form.email} onChange={handleChange} className={inputClass} />
                    <input name="phone" placeholder="No. HP (opsional)" value={form.phone} onChange={handleChange} className={inputClass} />
                  </div>

                  <select name="room_id" value={form.room_id} onChange={handleChange} className={inputClass} required>
                    <option value="">-- Pilih Kamar Tersedia --</option>
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Kamar {r.room_number} (Lt. {r.floor}) · Rp{Number(r.price).toLocaleString('id-ID')}
                      </option>
                    ))}
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-muted mb-1.5">Mulai Sewa</label>
                      <input name="start_date" type="date" value={form.start_date} onChange={handleChange} className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-muted mb-1.5">Selesai Sewa</label>
                      <input name="end_date" type="date" value={form.end_date} onChange={handleChange} className={inputClass} required />
                    </div>
                  </div>

                  {error && <p className="text-sm text-rose-600">{error}</p>}
                  <Button type="submit" className="w-full">Daftarkan Penghuni</Button>
                </form>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={22} className="text-emerald-600" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink text-center mb-1">Penghuni Berhasil Didaftarkan!</h3>
                <p className="text-xs text-slate-muted text-center mb-5">
                  Sampaikan kredensial ini ke penghuni secara langsung — tidak akan ditampilkan lagi.
                </p>

                <div className="bg-[var(--color-paper)] rounded-lg p-4 space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-muted">Login</span>
                    <span className="text-sm font-mono font-medium text-ink">{successInfo.tenant.user.email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-muted">Password</span>
                    <span className="text-sm font-mono font-bold text-ink">{successInfo.plain_password}</span>
                  </div>
                </div>

                <Button variant="outline" onClick={handleCopy} className="w-full mb-2">
                  <span className="flex items-center justify-center gap-2">
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Tersalin!' : 'Salin Kredensial'}
                  </span>
                </Button>
                <Button onClick={() => { setShowForm(false); setSuccessInfo(null) }} className="w-full">
                  Selesai
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}