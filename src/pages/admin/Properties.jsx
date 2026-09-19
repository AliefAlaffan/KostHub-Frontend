import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Plus, MapPin, DoorOpen, ArrowRight, QrCode, Image as ImageIcon } from 'lucide-react'
import { getProperties, createProperty } from '../../api/properties'
import { storageUrl } from '../../lib/storageUrl'
import Topbar from '../../components/Topbar'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Skeleton from '../../components/ui/Skeleton'
import EmptyState from '../../components/ui/EmptyState'
import ErrorState from '../../components/ui/ErrorState'
import { useToast } from '../../components/ui/Toast'

const TYPE_LABEL = { campur: 'Campur', putra: 'Putra', putri: 'Putri' }
const TYPE_TONE = { campur: 'bg-indigo-600', putra: 'bg-sky-600', putri: 'bg-rose-500' }

export default function Properties() {
  const navigate = useNavigate()
  const toast = useToast()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', address: '', city: '', type: 'campur', description: '' })
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    getProperties()
      .then(setProperties)
      .catch(() => setError('Gagal memuat daftar properti.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createProperty(form)
      setForm({ name: '', address: '', city: '', type: 'campur', description: '' })
      setShowForm(false)
      toast.success('Properti baru berhasil disimpan')
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal menambah properti')
    } finally {
      setSaving(false)
    }
  }

  const totalProperties = properties.length
  const totalRooms = properties.reduce((sum, p) => sum + (p.rooms_count ?? p.rooms?.length ?? 0), 0)

  if (error) {
    return (
      <div>
        <Topbar title="Properti Kost" breadcrumb={['KostHub', 'Properti']} />
        <div className="p-8 max-w-[1300px] mx-auto">
          <ErrorState description={error} onRetry={load} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <Topbar title="Properti Kost" breadcrumb={['KostHub', 'Properti']} />

      <div className="p-8 max-w-[1300px] mx-auto flex flex-col gap-6">
        <PageHeader
          title="Properti Kost"
          pill={`${totalProperties} Properti Aktif`}
          description="Kelola informasi bangunan, unit kamar, dan konfigurasi QRIS pembayaran digital penghuni."
          actions={
            <Button onClick={() => setShowForm(true)}>
              <Plus size={16} /> Tambah Properti Baru
            </Button>
          }
        />

        {/* KPI ringkas */}
        {!loading && properties.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Properti</span>
                <div className="text-2xl font-extrabold text-slate-900">{totalProperties}</div>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <DoorOpen size={24} />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Total Kamar Terdaftar</span>
                <div className="text-2xl font-extrabold text-slate-900">{totalRooms}</div>
              </div>
            </Card>
          </section>
        )}

        {/* Grid kartu properti */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-96" shimmer />)}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Belum Ada Properti Terdaftar"
            description="Tambahkan properti pertama Anda untuk mengelola penagihan otomatis, status unit kamar, kontrak sewa penyewa, dan QRIS instan."
            action={{ label: '+ Tambah Properti Pertama', onClick: () => setShowForm(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((p) => (
              <div key={p.id} className="flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                {/* Media header */}
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => navigate(`/admin/properties/${p.id}`)}
                >
                  {p.photo ? (
                    <img src={storageUrl(p.photo)} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-white text-[11px] font-bold shadow-sm ${TYPE_TONE[p.type]}`}>
                      {TYPE_LABEL[p.type]}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 text-emerald-700 text-[11px] font-bold shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {p.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-xs text-slate-200">
                    <MapPin size={14} />
                    <span>{p.city}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 space-y-4">
                  <div>
                    <h2
                      className="text-lg font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                      onClick={() => navigate(`/admin/properties/${p.id}`)}
                    >
                      {p.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">{p.address}</p>
                  </div>

                  {/* Mini metrics grid - data asli dari withCount di backend */}
                  <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Kamar</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">{p.rooms_count ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Terisi</span>
                      <span className="text-sm font-bold text-emerald-600 mt-0.5 block">{p.occupied_rooms_count ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Tersedia</span>
                      <span className="text-sm font-bold text-indigo-600 mt-0.5 block">{p.available_rooms_count ?? 0}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Okupansi</span>
                      <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                        {p.rooms_count > 0 ? Math.round((p.occupied_rooms_count / p.rooms_count) * 100) : 0}%
                      </span>
                    </div>
                  </div>

                  {/* Occupancy bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Tingkat Okupansi</span>
                      <span className="text-slate-800 font-bold">{p.occupied_rooms_count ?? 0} dari {p.rooms_count ?? 0} Unit Terisi</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${TYPE_TONE[p.type]}`}
                        style={{ width: `${p.rooms_count > 0 ? (p.occupied_rooms_count / p.rooms_count) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  {p.qris_image && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <QrCode size={18} className="text-slate-700" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900">QRIS Aktif</span>
                        <p className="text-[11px] text-slate-500">Siap terima pembayaran digital</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-2 mt-auto border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/properties/${p.id}`)}>
                      Detail
                    </Button>
                    <Button size="sm" onClick={() => navigate(`/admin/rooms?property_id=${p.id}`)}>
                      <DoorOpen size={14} /> Kelola Kamar <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Properti */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="Tambah Properti Baru" subtitle="Isi informasi bangunan untuk mulai mengelolanya." size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Nama Properti" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Kost Melati Indah" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Kota / Lokasi" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Contoh: Jakarta Selatan" />
            <Select
              label="Tipe Kost"
              required
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              options={[{ value: 'campur', label: 'Campur' }, { value: 'putra', label: 'Putra' }, { value: 'putri', label: 'Putri' }]}
            />
          </div>
          <Textarea label="Alamat Lengkap" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Jl. Raya Gatot Subroto No..." />
          <Textarea label="Deskripsi (opsional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ceritakan fasilitas & keunggulan properti ini" />

          <p className="text-[11px] text-slate-400">
            Foto properti dan QRIS bisa diunggah nanti dari halaman Detail Properti setelah properti ini tersimpan.
          </p>

          {formError && <p className="text-sm text-rose-600">{formError}</p>}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Batalkan</Button>
            <Button type="submit" loading={saving}>Simpan Properti</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}