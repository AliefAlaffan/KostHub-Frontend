import { useEffect, useState } from 'react'
import { Megaphone, Plus, X } from 'lucide-react'
import { getAnnouncements, createAnnouncement } from '../../api/announcements'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', target: 'all' })
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    getAnnouncements().then((data) => { setAnnouncements(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createAnnouncement(form)
      setForm({ title: '', content: '', target: 'all' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat pengumuman')
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  return (
    <div>
      <Topbar title="Pengumuman" breadcrumb={['KostHub', 'Pengumuman']} />

      <div className="p-8 max-w-[1300px]">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-muted">{announcements.length} pengumuman</p>
          <Button onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-2"><Plus size={16} /> Buat Pengumuman</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Megaphone size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-display font-bold text-ink mb-1">Belum ada pengumuman</h3>
            <p className="text-sm text-slate-muted mb-5">Buat pengumuman pertama untuk penghuni kost Anda.</p>
            <Button onClick={() => setShowForm(true)}>
              <span className="flex items-center gap-2"><Plus size={16} /> Buat Pengumuman</span>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {announcements.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                  <Megaphone size={16} className="text-indigo-600" />
                </div>
                <h3 className="font-display font-bold text-ink mb-1.5">{a.title}</h3>
                <p className="text-sm text-slate-600 mb-3">{a.content}</p>
                <p className="text-xs text-slate-muted">oleh {a.creator?.name}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-sm p-6 relative rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink mb-5">Buat Pengumuman</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} required />
              <textarea placeholder="Isi pengumuman" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className={inputClass} required />
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Kirim Pengumuman</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}