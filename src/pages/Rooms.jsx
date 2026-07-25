import { useEffect, useState } from 'react'
import { getProperties } from '../api/properties'
import { getRooms, createRoom, updateRoomStatus } from '../api/rooms'

const STATUS_COLOR = {
  available: '#3F7D5C',
  occupied: '#1E3A52',
  maintenance: '#C08A2E',
  inactive: '#6B7280',
}
const STATUS_SYMBOL = { available: '○', occupied: '●', maintenance: '◐', inactive: '✕' }

export default function Rooms() {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ room_number: '', floor: 1, price: '', description: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      if (data.length > 0) setSelectedProperty(data[0].id)
    })
  }, [])

  const loadRooms = async (propertyId) => {
    if (!propertyId) return
    const data = await getRooms(propertyId)
    setRooms(data)
  }

  useEffect(() => { loadRooms(selectedProperty) }, [selectedProperty])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createRoom({ ...form, property_id: selectedProperty })
      setForm({ room_number: '', floor: 1, price: '', description: '' })
      loadRooms(selectedProperty)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah kamar')
    }
  }

  // Kelompokkan per lantai - cikal bakal Grid Papan Kunci
  const roomsByFloor = rooms.reduce((acc, room) => {
    acc[room.floor] = acc[room.floor] || []
    acc[room.floor].push(room)
    return acc
  }, {})

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Kelola Kamar</h1>

      <label>Pilih Properti: </label>
      <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '24px 0' }}>
        <input name="room_number" placeholder="Nomor Kamar (mis. 101)" value={form.room_number} onChange={handleChange} required />
        <input name="floor" type="number" placeholder="Lantai" value={form.floor} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Harga Sewa" value={form.price} onChange={handleChange} required />
        <textarea name="description" placeholder="Deskripsi" value={form.description} onChange={handleChange} />
        <button type="submit">Tambah Kamar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {Object.entries(roomsByFloor).sort(([a], [b]) => a - b).map(([floor, floorRooms]) => (
        <div key={floor} style={{ marginBottom: 16 }}>
          <strong>Lantai {floor}</strong>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            {floorRooms.map((room) => (
              <div
                key={room.id}
                style={{
                  border: '1px solid #ccc', borderRadius: 6, padding: '6px 12px',
                  display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'monospace',
                }}
              >
                <span style={{ color: STATUS_COLOR[room.status] }}>{STATUS_SYMBOL[room.status]}</span>
                {room.room_number}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}