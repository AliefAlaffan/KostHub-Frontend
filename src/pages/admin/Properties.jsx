import { useEffect, useState } from 'react'
import { Building2, Plus, X, MapPin } from 'lucide-react'
import { getProperties, createProperty } from '../../api/properties'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', city: '', type: 'campur', description: '' })
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getProperties().then((data) => { setProperties(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createProperty(form)
      setForm({ name: '', address: '', city: '', type: 'campur', description: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah properti')
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  return (
    <div>
      <Topbar title="Properti" breadcrumb={['KostHub', 'Properti']} />

      <div className="p-8 max-w-[1300px]">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-muted">{properties.length} properti terdaftar</p>
          <Button onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-2"><Plus size={16} /> Tambah Properti</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : properties.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Building2 size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada properti terdaftar.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">Tambah Properti Pertama</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                  <Building2 size={18} className="text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-ink mb-1">{p.name}</h3>
                <p className="text-xs text-slate-muted flex items-center gap-1.5 mb-2">
                  <MapPin size={12} /> {p.city}
                </p>
                <span className="inline-block text-[10px] font-semibold px-2 py-1 rounded-full bg-[var(--color-paper)] text-slate-600 capitalize">
                  {p.type}
                </span>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-[#0A0B0F]/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-sm p-6 relative rounded-xl"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
          >
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink mb-5">Tambah Properti</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Nama Kost" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required />
              <input placeholder="Alamat" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} required />
              <input placeholder="Kota" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} required />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                <option value="campur">Campur</option>
                <option value="putra">Putra</option>
                <option value="putri">Putri</option>
              </select>
              <textarea placeholder="Deskripsi (opsional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Simpan Properti</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}