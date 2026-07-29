import { useEffect, useState } from 'react'
import { getProperties } from '../api/properties'
import { getUsers, createStaff, resetUserPassword, toggleUserStatus } from '../api/users'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState({ name: '', email: '', phone: '', property_ids: [] })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = () => getUsers().then(setUsers)
  useEffect(() => {
    load()
    getProperties().then(setProperties)
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handlePropertyToggle = (id) => {
    setForm((f) => ({
      ...f,
      property_ids: f.property_ids.includes(id)
        ? f.property_ids.filter((p) => p !== id)
        : [...f.property_ids, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const result = await createStaff(form)
      setMessage(`Staff dibuat! Email: ${result.user.email} — Password: ${result.plain_password}`)
      setForm({ name: '', email: '', phone: '', property_ids: [] })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat staff')
    }
  }

  const handleReset = async (id) => {
    setError('')
    try {
      const result = await resetUserPassword(id)
      setMessage(`Password baru: ${result.plain_password}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal reset password')
    }
  }

  const handleToggle = async (id) => {
    setError('')
    try {
      await toggleUserStatus(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal ubah status')
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Manajemen User</h1>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Tambah Staff Baru</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, marginBottom: 24 }}>
        <input name="name" placeholder="Nama" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="No. HP (opsional)" value={form.phone} onChange={handleChange} />
        <div>
          <div>Assign ke Properti:</div>
          {properties.map((p) => (
            <label key={p.id} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={form.property_ids.includes(p.id)}
                onChange={() => handlePropertyToggle(p.id)}
              />
              {' '}{p.name}
            </label>
          ))}
        </div>
        <button type="submit">Buat Akun Staff</button>
      </form>

      <h3>Daftar Semua User</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                {u.role !== 'admin' && (
                  <>
                    <button onClick={() => handleReset(u.id)}>Reset Password</button>{' '}
                    <button onClick={() => handleToggle(u.id)}>
                      {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}