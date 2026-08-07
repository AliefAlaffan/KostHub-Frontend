import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { getProperties } from '../../api/properties'
import { getReviews, replyReview } from '../../api/reviews'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

export default function Reviews() {
  const [properties, setProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState('')
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    getProperties().then((data) => {
      setProperties(data)
      if (data.length > 0) setSelectedProperty(data[0].id)
    })
  }, [])

  const load = (propertyId) => {
    if (!propertyId) return
    setLoading(true)
    getReviews(propertyId).then((data) => { setReviews(data); setLoading(false) })
  }
  useEffect(() => { load(selectedProperty) }, [selectedProperty])

  const handleReply = async (reviewId) => {
    setError('')
    try {
      await replyReview(reviewId, replyText[reviewId] || '')
      load(selectedProperty)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membalas')
    }
  }

  return (
    <div>
      <Topbar title="Review" breadcrumb={['KostHub', 'Review']} />

      <div className="p-8 max-w-[1300px]">
        <select
          value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}
          className="bg-white border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {properties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Star size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada ulasan untuk properti ini.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           {reviews.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-ink text-sm">{r.tenant?.user?.name}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < r.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{r.comment}</p>

                {r.owner_reply ? (
                  <div className="bg-[var(--color-paper)] rounded-lg p-3 text-sm text-slate-600">
                    <span className="font-semibold text-ink">Balasan Anda: </span>{r.owner_reply}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      placeholder="Tulis balasan..."
                      value={replyText[r.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                      className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <Button onClick={() => handleReply(r.id)}>Balas</Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}