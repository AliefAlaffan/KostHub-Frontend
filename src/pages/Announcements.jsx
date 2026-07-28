import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { getAnnouncements, createAnnouncement } from '../api/announcements'

export default function Announcements() {
  const { user } = useAuthStore()
  const [announcements, setAnnouncements] = useState([])
  const [form, setForm] = useState({ title: '', content: '', target: 'all' })
  const [error, setError] = useState('')

  const load = () => getAnnouncements().then(setAnnouncements)
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createAnnouncement(form)
      setForm({ title: '', content: '', target: 'all' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pengumuman')
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Pengumuman</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user?.role !== 'tenant' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, marginBottom: 24 }}>
          <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Isi pengumuman" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          <button type="submit">Kirim Pengumuman</button>
        </form>
      )}

      {announcements.map((a) => (
        <div key={a.id} style={{ border: '1px solid #ccc', borderRadius: 6, padding: 12, marginBottom: 8 }}>
          <strong>{a.title}</strong>
          <p>{a.content}</p>
          <small>oleh {a.creator?.name}</small>
        </div>
      ))}
    </div>
  )
}