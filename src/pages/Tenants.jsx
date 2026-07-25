import { useEffect, useState } from 'react'
import { getProperties } from '../api/properties'
import { getRooms } from '../api/rooms'
import { getTenants, createTenant } from '../api/tenants'

export default function Tenants() {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [availableRooms, setAvailableRooms] = useState([])
  const [tenants, setTenants] = useState([])
  const [form, setForm] = useState({
    name: '', email: '', phone: '', ktp_number: '', room_id: '',
    start_date: '', end_date: '',
  })
  const [error, setError] = useState('')
  const [successInfo, setSuccessInfo] = useState(null) // simpan hasil onboarding (password sekali tampil)

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      if (data.length > 0) setSelectedProperty(data[0].id)
    })
    getTenants().then(setTenants)
  }, [])

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
      getTenants().then(setTenants)
      getRooms(selectedProperty).then((rooms) => setAvailableRooms(rooms.filter((r) => r.status === 'available')))
    } catch (err) {
      const errors = err.response?.data?.errors
      setError(errors ? Object.values(errors).flat().join(', ') : (err.response?.data?.message || 'Gagal menambah penghuni'))
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Tambah Penghuni</h1>

      <label>Properti: </label>
      <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
        {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '24px 0' }}>
        <input name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} required />
        <input name="ktp_number" placeholder="No. KTP" value={form.ktp_number} onChange={handleChange} required />
        <input name="email" placeholder="Email (opsional)" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="No. HP (opsional)" value={form.phone} onChange={handleChange} />

        <select name="room_id" value={form.room_id} onChange={handleChange} required>
          <option value="">-- Pilih Kamar Tersedia --</option>
          {availableRooms.map((r) => (
            <option key={r.id} value={r.id}>
              Kamar {r.room_number} (Lantai {r.floor}) - Rp{Number(r.price).toLocaleString('id-ID')}
            </option>
          ))}
        </select>

        <label>Mulai Sewa:</label>
        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
        <label>Selesai Sewa:</label>
        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required />

        <button type="submit">Daftarkan Penghuni</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {successInfo && (
        <div style={{ border: '2px solid #3F7D5C', borderRadius: 8, padding: 16, marginBottom: 24, background: '#f0f7f3' }}>
          <strong>Penghuni berhasil didaftarkan!</strong>
          <p>Sampaikan kredensial ini ke penghuni secara langsung — tidak akan ditampilkan lagi:</p>
          <p>Email/Login: <code>{successInfo.tenant.user.email}</code></p>
          <p>Password: <code style={{ fontSize: 18, fontWeight: 'bold' }}>{successInfo.plain_password}</code></p>
        </div>
      )}

      <h2>Daftar Penghuni</h2>
      <ul>
        {tenants.map((t) => (
          <li key={t.id}>
            {t.user?.name} — {t.active_contract?.room?.room_number ? `Kamar ${t.active_contract.room.room_number}` : 'Tidak ada kamar aktif'}
          </li>
        ))}
      </ul>
    </div>
  )
}