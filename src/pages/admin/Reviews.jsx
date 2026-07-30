import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { getProperties } from '../../api/properties'
import { getReviews, createReview, replyReview } from '../../api/reviews'

export default function Reviews() {
  const { user } = useAuthStore()
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ rating: 5, comment: '' })
  const [error, setError] = useState('')
  const [replyText, setReplyText] = useState({})

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      if (data.length > 0) setSelectedProperty(data[0].id)
    })
  }, [])

  const loadReviews = (propertyId) => {
    if (!propertyId) return
    getReviews(propertyId).then(setReviews)
  }
  useEffect(() => { loadReviews(selectedProperty) }, [selectedProperty])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createReview(selectedProperty, form)
      setForm({ rating: 5, comment: '' })
      loadReviews(selectedProperty)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim ulasan')
    }
  }

  const handleReply = async (reviewId) => {
    setError('')
    try {
      await replyReview(reviewId, replyText[reviewId] || '')
      loadReviews(selectedProperty)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membalas')
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Review & Ulasan</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {user?.role !== 'tenant' && (
        <>
          <label>Properti: </label>
          <select value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
            {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </>
      )}

      {user?.role === 'tenant' && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '16px 0' }}>
          <label>Rating (1-5):</label>
          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <textarea placeholder="Komentar (opsional)" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          <button type="submit">Kirim Ulasan</button>
        </form>
      )}

      {reviews.map((r) => (
        <div key={r.id} style={{ border: '1px solid #ccc', borderRadius: 6, padding: 12, marginBottom: 8 }}>
          <strong>{r.tenant?.user?.name}</strong> — {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
          <p>{r.comment}</p>
          {r.owner_reply && <p style={{ background: '#f0f0f0', padding: 8 }}>Balasan pemilik: {r.owner_reply}</p>}

          {user?.role === 'admin' && !r.owner_reply && (
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              <input
                placeholder="Tulis balasan..."
                value={replyText[r.id] || ''}
                onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
              />
              <button onClick={() => handleReply(r.id)}>Balas</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
