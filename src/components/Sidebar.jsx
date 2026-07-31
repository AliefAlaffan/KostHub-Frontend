import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logout } from '../api/auth'

const MENU = {
  admin: [
    { to: '/', label: 'Dashboard' },
    { to: '/properties', label: 'Properti' },
    { to: '/rooms', label: 'Kamar' },
    { to: '/tenants', label: 'Penghuni' },
    { to: '/contracts', label: 'Kontrak' },
    { to: '/invoices', label: 'Tagihan' },
    { to: '/maintenance', label: 'Maintenance' },
    { to: '/announcements', label: 'Pengumuman' },
    { to: '/reviews', label: 'Review' },
    { to: '/reports', label: 'Laporan' },
    { to: '/users', label: 'Manajemen User' },
  ],
  staff: [
    { to: '/', label: 'Tugas Hari Ini' },
    { to: '/rooms', label: 'Kamar' },
    { to: '/tenants', label: 'Penghuni' },
    { to: '/contracts', label: 'Kontrak' },
    { to: '/invoices', label: 'Tagihan' },
    { to: '/maintenance', label: 'Maintenance' },
    { to: '/announcements', label: 'Pengumuman' },
  ],
  tenant: [
    { to: '/', label: 'Sewa Saya' },
    { to: '/invoices', label: 'Tagihan Saya' },
    { to: '/maintenance', label: 'Komplain' },
    { to: '/announcements', label: 'Pengumuman' },
    { to: '/reviews', label: 'Beri Ulasan' },
    { to: '/settings', label: 'Pengaturan Akun' },
  ],
}

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const menu = MENU[user?.role] || []

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-muted/15 flex flex-col h-screen sticky top-0">
      <div className="px-4 py-5 border-b border-slate-muted/15">
        <div className="text-lg font-semibold text-ledger">Manajemen Kost</div>
        <div className="text-xs text-slate-muted mt-0.5">{user?.name} · {user?.role}</div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-ledger text-white' : 'text-ink hover:bg-paper'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-4 border-t border-slate-muted/15">
        <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-sm text-slate-muted hover:bg-paper">
          Keluar
        </button>
      </div>
    </aside>
  )
}