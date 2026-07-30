import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { getMaintenanceRequests, createMaintenanceRequest, updateMaintenanceStatus } from '../../api/maintenance'

const STATUS_LABEL = { new: 'Baru', in_progress: 'Diproses', done: 'Selesai', closed: 'Ditutup' }
const PRIORITY_LABEL = { low: 'Rendah', medium: 'Sedang', high: 'Tinggi', urgent: 'Darurat' }

export default function Maintenance() {
  const { user } = useAuthStore()
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState({ category: 'kerusakan', priority: 'medium', description: '' })
  const [error, setError] = useState('')
  const [repairCost, setRepairCost] = useState({})

  const load = () => getMaintenanceRequests().then(setRequests)
  useEffect(() => { load() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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

  const handleStatusChange = async (id, status) => {
    setError('')
    try {
      await updateMaintenanceStatus(id, { status, repair_cost: repairCost[id] || undefined })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal update status')
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Maintenance / Komplain</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form pengajuan hanya relevan untuk tenant, tapi biarkan tampil untuk semua saat testing */}
      {user?.role === 'tenant' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, marginBottom: 24 }}>
          <h3>Ajukan Komplain</h3>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="kerusakan">Kerusakan</option>
            <option value="kebersihan">Kebersihan</option>
            <option value="keamanan">Keamanan</option>
            <option value="lainnya">Lainnya</option>
          </select>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Rendah</option>
            <option value="medium">Sedang</option>
            <option value="high">Tinggi</option>
            <option value="urgent">Darurat</option>
          </select>
          <textarea name="description" placeholder="Jelaskan masalahnya" value={form.description} onChange={handleChange} required />
          <button type="submit">Kirim Komplain</button>
        </form>
      )}

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th>Penghuni</th><th>Kamar</th><th>Kategori</th><th>Prioritas</th><th>Deskripsi</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.tenant?.user?.name}</td>
              <td>{r.room?.room_number}</td>
              <td>{r.category}</td>
              <td>{PRIORITY_LABEL[r.priority]}</td>
              <td>{r.description}</td>
              <td>{STATUS_LABEL[r.status]}</td>
              <td>
                {user?.role !== 'tenant' && r.status !== 'closed' && (
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <select onChange={(e) => handleStatusChange(r.id, e.target.value)} defaultValue="">
                      <option value="" disabled>Ubah Status</option>
                      <option value="in_progress">Diproses</option>
                      <option value="done">Selesai</option>
                      <option value="closed">Ditutup</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Biaya perbaikan"
                      style={{ width: 100 }}
                      onChange={(e) => setRepairCost({ ...repairCost, [r.id]: e.target.value })}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
