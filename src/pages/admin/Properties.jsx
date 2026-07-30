import { useEffect, useState } from 'react'
import { getProperties, createProperty } from '../../api/properties'

export default function Properties() {
  const [properties, setProperties] = useState([])
  const [form, setForm] = useState({ name: '', address: '', city: '', type: 'campur', description: '' })
  const [error, setError] = useState('')

  const loadProperties = async () => {
    const data = await getProperties()
    setProperties(data)
  }

  useEffect(() => { loadProperties() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createProperty(form)
      setForm({ name: '', address: '', city: '', type: 'campur', description: '' })
      loadProperties()
    } catch (err) {
      setError(JSON.stringify(err.response?.data?.errors || err.response?.data?.message))
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Properti Saya</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, marginBottom: 24 }}>
        <input name="name" placeholder="Nama Kost" value={form.name} onChange={handleChange} required />
        <input name="address" placeholder="Alamat" value={form.address} onChange={handleChange} required />
        <input name="city" placeholder="Kota" value={form.city} onChange={handleChange} required />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="campur">Campur</option>
          <option value="putra">Putra</option>
          <option value="putri">Putri</option>
        </select>
        <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} />
        <button type="submit">Tambah Properti</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {properties.map((p) => (
          <li key={p.id}>{p.name} — {p.city} ({p.type})</li>
        ))}
      </ul>
    </div>
  )
}
