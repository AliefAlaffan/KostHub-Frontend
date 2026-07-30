import { useEffect, useState } from 'react'
import { getAnnouncements } from '../../api/announcements'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => { getAnnouncements().then(setAnnouncements) }, [])

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-ink mb-4">Pengumuman</h1>
      <div className="space-y-2">
        {announcements.map((a) => (
          <div key={a.id} className="bg-white rounded-lg border border-slate-muted/15 p-4">
            <strong className="text-sm">{a.title}</strong>
            <p className="text-sm text-slate-muted mt-1">{a.content}</p>
            <span className="text-xs text-slate-muted">oleh {a.creator?.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}