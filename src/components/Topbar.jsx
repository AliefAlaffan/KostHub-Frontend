import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { logout } from '../api/auth'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notifications'

const SETTINGS_PATH = { admin: '/admin/settings', staff: '/staff/settings', customer: '/customer/pengaturan' }

/**
 * Topbar - props lama (title, breadcrumb, actions) tetap didukung persis seperti sebelumnya.
 * Tambahan baru: notification bell (nyambung ke NotificationController asli) + profile dropdown.
 */
export default function Topbar({ title, breadcrumb, actions }) {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotif, setLoadingNotif] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read_at).length

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openNotifications = () => {
    setNotifOpen((o) => !o)
    if (!notifOpen) {
      setLoadingNotif(true)
      getNotifications()
        .then((res) => setNotifications(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingNotif(false))
    }
  }

  const handleReadOne = async (id) => {
    await markNotificationRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)))
  }

  const handleReadAll = async () => {
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })))
  }

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
      <div className="min-w-0 pl-10 lg:pl-0">
        <h1 className="font-bold text-slate-900 text-base lg:text-lg truncate">{title}</h1>
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 truncate">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>›</span>}
                {b}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {actions}

        {/* Notification bell - nyambung ke /notifications asli (Bug O) */}
        <div className="relative" ref={notifRef}>
          <button onClick={openNotifications} className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Notifikasi</span>
                {unreadCount > 0 && (
                  <button onClick={handleReadAll} className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {loadingNotif ? (
                  <div className="p-4 text-center text-slate-400">Memuat...</div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">Belum ada notifikasi.</div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => !n.read_at && handleReadOne(n.id)}
                      className={`w-full text-left p-3 hover:bg-slate-50 transition-colors flex gap-2.5 ${!n.read_at ? 'bg-indigo-50/40' : ''}`}
                    >
                      {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1.5" />}
                      <div className={!n.read_at ? '' : 'pl-3.5'}>
                        <p className="font-semibold text-slate-800">{n.data?.message || 'Notifikasi baru'}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen((o) => !o)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-100">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold text-slate-800 block leading-tight">{user?.name}</span>
              <span className="text-[10px] text-slate-500 block leading-tight capitalize">{user?.role}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs divide-y divide-slate-100">
              <div className="px-4 py-2.5">
                <p className="font-bold text-slate-900 text-xs truncate">{user?.name}</p>
                <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setProfileOpen(false); navigate(SETTINGS_PATH[user?.role] || '/login') }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
                >
                  <Settings size={14} className="text-slate-500" /> Pengaturan Akun
                </button>
              </div>
              <div className="py-1">
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2">
                  <LogOut size={14} /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}