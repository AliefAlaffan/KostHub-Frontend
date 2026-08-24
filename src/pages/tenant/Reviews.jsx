import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { getMyReviews, submitMyReview } from '../../api/reviews'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const load = () => {
    setLoading(true)
    getMyReviews().then((data) => { setReviews(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await submitMyReview({ rating, comment })
      setSuccess('Ulasan berhasil dikirim, terima kasih!')
      setComment('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim ulasan')
    }
  }

  return (
    <div>
      <Topbar title="Beri Ulasan" breadcrumb={['KostHub', 'Review']} />

      <div className="p-6 max-w-lg mx-auto">
        <Card className="p-6 mb-5">
          <h3 className="font-display text-sm font-bold text-ink mb-4">Bagaimana pengalaman Anda?</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center gap-1.5 py-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={(hoverRating || rating) >= n ? 'text-amber-400' : 'text-slate-200'}
                    fill={(hoverRating || rating) >= n ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Ceritakan pengalaman Anda tinggal di sini..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              rows={4}
            />
            {error && <p className="text-sm text-rose-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600">{success}</p>}
            <Button type="submit" className="w-full">Kirim Ulasan</Button>
          </form>
        </Card>

        <h3 className="text-sm font-bold text-ink mb-3">Ulasan Saya Sebelumnya</h3>
        {loading ? (
          <Skeleton className="h-24" />
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-muted">Anda belum pernah memberi ulasan.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-ink">{r.property?.name}</span>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill={i < r.rating ? 'currentColor' : 'none'} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-slate-600 mb-2">{r.comment}</p>}
                {r.owner_reply && (
                  <div className="bg-[var(--color-paper)] rounded-lg p-2.5 text-xs text-slate-600 mt-2">
                    <span className="font-semibold text-ink">Balasan pemilik: </span>{r.owner_reply}
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