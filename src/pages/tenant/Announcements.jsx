import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { getAnnouncements } from '../../api/announcements'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnnouncements().then((data) => { setAnnouncements(data); setLoading(false) })
  }, [])

  return (
    <div>
      <Topbar title="Pengumuman" breadcrumb={['KostHub', 'Pengumuman']} />

      <div className="p-6 max-w-lg mx-auto">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Megaphone size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Belum ada pengumuman.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <Card key={a.id} className="p-4">
                <h3 className="font-display font-bold text-ink mb-1">{a.title}</h3>
                <p className="text-sm text-slate-600">{a.content}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}