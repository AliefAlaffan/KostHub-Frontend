import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Edit, DoorOpen, MapPin, QrCode, Upload, Trash2,
  ImagePlus, AlertTriangle, Wifi, Wind, Bath, Car, Utensils, Camera,
  Bed, DoorClosed, Wrench, Users, Wallet,
} from 'lucide-react'
import { getProperty, updateProperty, deleteProperty, uploadQris, deleteQris, uploadPropertyPhoto, deletePropertyPhoto } from '../../api/properties'
import { storageUrl } from '../../lib/storageUrl'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import Checkbox from '../../components/ui/Checkbox'
import Skeleton from '../../components/ui/Skeleton'
import ErrorState from '../../components/ui/ErrorState'
import { useToast } from '../../components/ui/Toast'

const TYPE_LABEL = { campur: 'Campur', putra: 'Putra', putri: 'Putri' }

const FACILITY_OPTIONS = [
  { key: 'wifi', label: 'WiFi Kencang', icon: Wifi },
  { key: 'ac', label: 'AC Inverter', icon: Wind },
  { key: 'km_dalam', label: 'KM Mandi Dalam', icon: Bath },
  { key: 'parkir', label: 'Parkir Motor & Mobil', icon: Car },
  { key: 'dapur', label: 'Dapur Bersama', icon: Utensils },
  { key: 'cctv', label: 'CCTV 24 Jam', icon: Camera },
]

const fmtRupiah = (n) => `Rp ${Number(n ?? 0).toLocaleString('id-ID')}`
const fmtRupiahSingkat = (n) => {
  const num = Number(n ?? 0)
  if (num >= 1000000) return `Rp${(num / 1000000).toFixed(1)}Jt`
  if (num >= 1000) return `Rp${(num / 1000).toFixed(0)}rb`
  return `Rp${num}`
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteChecked, setDeleteChecked] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingQris, setUploadingQris] = useState(false)

  const load = () => {
    setLoading(true)
    setError('')
    getProperty(id)
      .then((data) => setProperty(data))
      .catch(() => setError('Gagal memuat detail properti.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [id])

  const openEdit = () => {
    setEditForm({
      name: property.name,
      address: property.address,
      city: property.city,
      type: property.type,
      description: property.description || '',
      facilities: property.facilities || [],
    })
    setEditError('')
    setShowEdit(true)
  }

  const toggleFacility = (key) => {
    setEditForm((f) => ({
      ...f,
      facilities: f.facilities.includes(key) ? f.facilities.filter((x) => x !== key) : [...f.facilities, key],
    }))
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setEditError('')
    try {
      await updateProperty(id, editForm)
      toast.success('Perubahan properti berhasil disimpan')
      setShowEdit(false)
      load()
    } catch (err) {
      setEditError(err.response?.data?.message || 'Gagal menyimpan perubahan')
    } finally {
      setSaving(false)
    }
  }

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingPhoto(true)
    const formData = new FormData()
    formData.append('photo', file)
    try {
      await uploadPropertyPhoto(id, formData)
      toast.success('Foto properti berhasil diperbarui')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal upload foto')
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleUploadQris = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingQris(true)
    const formData = new FormData()
    formData.append('qris_image', file)
    try {
      await uploadQris(id, formData)
      toast.success('QRIS berhasil diperbarui')
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal upload QRIS')
    } finally {
      setUploadingQris(false)
    }
  }

  const handleDeleteQris = async () => {
    await deleteQris(id)
    toast.success('QRIS dihapus')
    load()
  }

  const handleDeleteProperty = async () => {
    setDeleting(true)
    try {
      await deleteProperty(id)
      toast.success('Properti berhasil dihapus')
      navigate('/admin/properties')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus properti')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div>
        <Topbar title="Detail Properti" breadcrumb={['KostHub', 'Properti', '...']} />
        <div className="p-8 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-80" shimmer />
          <Skeleton className="h-32" shimmer />
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div>
        <Topbar title="Detail Properti" breadcrumb={['KostHub', 'Properti']} />
        <div className="p-8 max-w-7xl mx-auto">
          <ErrorState description={error || 'Properti tidak ditemukan.'} onRetry={load} />
        </div>
      </div>
    )
  }

  const rooms = property.rooms || []
  const totalRooms = rooms.length
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length
  const availableRooms = rooms.filter((r) => r.status === 'available').length
  const maintenanceRooms = rooms.filter((r) => r.status === 'maintenance').length
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
  const pct = (n) => (totalRooms > 0 ? (n / totalRooms) * 100 : 0)

  const prices = rooms.map((r) => Number(r.price)).filter((p) => p > 0)
  const priceRange = prices.length > 0
    ? prices.length === 1
      ? fmtRupiahSingkat(prices[0])
      : `${fmtRupiahSingkat(Math.min(...prices))} - ${fmtRupiahSingkat(Math.max(...prices))}`
    : '-'

  const billing = property.billing_this_month || { collected: 0, total_due: 0 }
  const billingPct = billing.total_due > 0 ? Math.round((billing.collected / billing.total_due) * 100) : 0

  const maintenanceRoom = rooms.find((r) => r.status === 'maintenance')

  return (
    <div>
      <Topbar title="Detail Properti" breadcrumb={['KostHub', 'Properti', property.name]} />

      <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header + actions */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <button onClick={() => navigate('/admin/properties')} className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition mt-1">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900">Detail Properti — {property.name}</h1>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {property.status === 'active' ? 'Aktif Beroperasi' : 'Nonaktif'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                Pusat komando operasional untuk mengelola fisik gedung, inventaris {totalRooms} unit kamar, {occupiedRooms} penghuni aktif, dan fasilitas bersama.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" onClick={openEdit}>
              <Edit size={16} /> Edit Informasi
            </Button>
            <Button onClick={() => navigate(`/admin/rooms?property_id=${id}`)}>
              <DoorOpen size={16} /> Tambah Kamar Baru
            </Button>
          </div>
        </div>

        {/* Hero: foto + identifikasi + occupancy bar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Foto */}
            <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[340px] bg-slate-900 group">
              {property.photo ? (
                <img src={storageUrl(property.photo)} alt={property.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-600">
                  <ImagePlus size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/10" />
              <label className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 text-xs font-semibold shadow cursor-pointer transition">
                <Upload size={14} />
                {uploadingPhoto ? 'Mengunggah...' : property.photo ? 'Ganti Foto' : 'Upload Foto'}
                <input type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" disabled={uploadingPhoto} />
              </label>
            </div>

            {/* Identifikasi + metrik + occupancy bar */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">ID Sistem</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-xs font-semibold text-slate-700">#{property.id}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Terdaftar sejak {new Date(property.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-1.5">{property.name}</h2>
                <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-2">
                  <MapPin size={14} className="shrink-0 mt-0.5" /> <span>{property.address}</span>
                </div>
                {property.description && (
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{property.description}</p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase block">Tipe Properti</span>
                    <span className="text-sm font-semibold text-slate-900">{TYPE_LABEL[property.type]}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase block">Rentang Sewa</span>
                    <span className="text-sm font-semibold text-indigo-600">{priceRange}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase block">Staf Pengelola</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {property.staff?.length > 0 ? property.staff.map((s) => s.name).join(', ') : 'Belum ada'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Occupancy bar */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-900">Occupancy Rate: {occupancyRate}%</span>
                  <span className="text-slate-500">{occupiedRooms} Terisi / {totalRooms} Unit Total</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div className="bg-indigo-600 h-full" style={{ width: `${pct(occupiedRooms)}%` }} />
                  <div className="bg-sky-300 h-full" style={{ width: `${pct(availableRooms)}%` }} />
                  <div className="bg-rose-500 h-full" style={{ width: `${pct(maintenanceRooms)}%` }} />
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                  <span className="flex items-center gap-1 text-slate-700"><span className="w-2 h-2 rounded-full bg-indigo-600" /> {occupiedRooms} Terisi</span>
                  <span className="flex items-center gap-1 text-slate-500"><span className="w-2 h-2 rounded-full bg-sky-300" /> {availableRooms} Siap Sewa</span>
                  <span className="flex items-center gap-1 text-rose-600"><span className="w-2 h-2 rounded-full bg-rose-500" /> {maintenanceRooms} Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI 6-grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Kamar</span>
              <Bed size={16} className="text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{totalRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Terisi</span>
              <DoorClosed size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-600">{occupiedRooms}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">{occupancyRate}% Okupansi</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Siap Huni</span>
              <DoorOpen size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-indigo-600">{availableRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Perbaikan</span>
              <Wrench size={16} className="text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-600">{maintenanceRooms}</div>
            {maintenanceRoom && <div className="text-xs text-rose-600 mt-1 truncate">Kamar {maintenanceRoom.room_number}</div>}
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Penyewa</span>
              <Users size={16} className="text-slate-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{occupiedRooms}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">Penagihan Bln Ini</span>
              <Wallet size={16} className="text-slate-400" />
            </div>
            <div className="text-base font-bold text-slate-900">{fmtRupiahSingkat(billing.collected)}</div>
            <div className="text-xs text-slate-500 mt-1">dari {fmtRupiahSingkat(billing.total_due)} ({billingPct}%)</div>
          </Card>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fasilitas Bangunan */}
          <div className="lg:col-span-2">
            <Card
              className="p-5"
              title={`Fasilitas Bangunan & Layanan Bersama`}
              actions={<span className="text-xs text-slate-400">{property.facilities?.length || 0} Fasilitas Aktif</span>}
            >
              {property.facilities?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {property.facilities.map((key) => {
                    const opt = FACILITY_OPTIONS.find((o) => o.key === key)
                    if (!opt) return null
                    const Icon = opt.icon
                    return (
                      <div key={key} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <Icon size={20} className="text-indigo-600 shrink-0" />
                        <span className="text-xs font-semibold text-slate-700">{opt.label}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-6">Belum ada fasilitas ditambahkan. Klik "Edit Informasi" untuk menambahkan.</p>
              )}
            </Card>
          </div>

          {/* Hapus Properti (ganti kartu Petugas Lapangan) */}
          <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3 h-fit">
            <span className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
              <AlertTriangle size={16} /> Zona Berbahaya
            </span>
            <p className="text-xs text-rose-600 leading-relaxed">
              Menghapus properti ini akan menghapus permanen {totalRooms} kamar terkait, data sewa penghuni, dan seluruh riwayat penagihan.
            </p>

            {property.qris_image ? (
              <div className="p-3 bg-white rounded-xl border border-rose-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <QrCode size={18} className="text-slate-700 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 truncate">QRIS Aktif</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold hover:bg-slate-200 cursor-pointer">
                    Ganti
                    <input type="file" accept="image/*" onChange={handleUploadQris} className="hidden" disabled={uploadingQris} />
                  </label>
                  <button onClick={handleDeleteQris} className="p-1 text-rose-500 hover:bg-rose-100 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            ) : (
              <label className="w-full flex items-center justify-center gap-1.5 p-2.5 bg-white rounded-xl border border-dashed border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                <QrCode size={16} /> {uploadingQris ? 'Mengunggah...' : 'Upload QRIS'}
                <input type="file" accept="image/*" onChange={handleUploadQris} className="hidden" disabled={uploadingQris} />
              </label>
            )}

            <Button variant="danger" className="w-full" onClick={() => setShowDeleteConfirm(true)}>
              Hapus Properti Ini
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Edit Properti" subtitle={`Perbarui informasi ${property.name}`} size="lg">
        {editForm && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input label="Nama Properti" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Kota / Lokasi" required value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
              <Select
                label="Tipe Kost"
                value={editForm.type}
                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                options={[{ value: 'campur', label: 'Campur' }, { value: 'putra', label: 'Putra' }, { value: 'putri', label: 'Putri' }]}
              />
            </div>
            <Textarea label="Alamat Lengkap" required value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
            <Textarea label="Deskripsi" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Fasilitas Bangunan</label>
              <div className="grid grid-cols-2 gap-2">
                {FACILITY_OPTIONS.map((opt) => (
                  <Checkbox
                    key={opt.key}
                    label={opt.label}
                    checked={editForm.facilities.includes(opt.key)}
                    onChange={() => toggleFacility(opt.key)}
                  />
                ))}
              </div>
            </div>

            {editError && <p className="text-sm text-rose-600">{editError}</p>}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Batalkan</Button>
              <Button type="submit" loading={saving}>Simpan Perubahan</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal konfirmasi hapus */}
      <Modal open={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteChecked(false) }} title="Hapus Properti Ini?" size="sm">
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Tindakan ini akan menghapus permanen bangunan <span className="font-bold text-slate-800">{property.name}</span>,
            {' '}{totalRooms} kamar terkait, dan seluruh riwayat penagihan.
          </p>
          <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 text-xs">
            <Checkbox
              label="Saya memahami bahwa tindakan ini bersifat permanen dan tidak dapat dibatalkan."
              checked={deleteChecked}
              onChange={(e) => setDeleteChecked(e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeleteChecked(false) }}>Batalkan</Button>
            <Button variant="danger" disabled={!deleteChecked} loading={deleting} onClick={handleDeleteProperty}>
              Hapus Permanen
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}