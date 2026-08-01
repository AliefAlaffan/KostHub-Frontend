import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logout } from '../api/auth'
import {
  LayoutDashboard, Building2, DoorOpen, Users, FileText, Receipt,
  Wrench, Megaphone, Star, BarChart3, UserCog, Settings, LogOut, ClipboardList,
} from 'lucide-react'

const MENU = {
  admin: [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/properties', label: 'Properti', icon: Building2 },
    { to: '/rooms', label: 'Kamar', icon: DoorOpen },
    { to: '/tenants', label: 'Penghuni', icon: Users },
    { to: '/contracts', label: 'Kontrak', icon: FileText },
    { to: '/invoices', label: 'Tagihan', icon: Receipt },
    { to: '/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/announcements', label: 'Pengumuman', icon: Megaphone },
    { to: '/reviews', label: 'Review', icon: Star },
    { to: '/reports', label: 'Laporan', icon: BarChart3 },
    { to: '/users', label: 'Manajemen User', icon: UserCog },
  ],
  staff: [
    { to: '/', label: 'Tugas Hari Ini', icon: ClipboardList },
    { to: '/rooms', label: 'Kamar', icon: DoorOpen },
    { to: '/tenants', label: 'Penghuni', icon: Users },
    { to: '/contracts', label: 'Kontrak', icon: FileText },
    { to: '/invoices', label: 'Tagihan', icon: Receipt },
    { to: '/maintenance', label: 'Maintenance', icon: Wrench },
    { to: '/announcements', label: 'Pengumuman', icon: Megaphone },
  ],
  tenant: [
    { to: '/', label: 'Sewa Saya', icon: LayoutDashboard },
    { to: '/invoices', label: 'Tagihan Saya', icon: Receipt },
    { to: '/maintenance', label: 'Komplain', icon: Wrench },
    { to: '/announcements', label: 'Pengumuman', icon: Megaphone },
    { to: '/reviews', label: 'Beri Ulasan', icon: Star },
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

  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <aside className="w-60 shrink-0 bg-[#101114] flex flex-col h-screen sticky top-0">
      <div className="px-5 py-6">
        <div className="font-display font-bold text-white text-[15px]">Manajemen Kost</div>
        <div className="text-[11px] text-zinc-500 capitalize mt-0.5 tracking-wide">{user?.role} Panel</div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {menu.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors duration-150 ${
                  isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`
              }
            >
              <Icon size={16} strokeWidth={2} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/[0.06] space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
              isActive ? 'bg-white/[0.08] text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
            }`
          }
        >
          <Settings size={16} strokeWidth={2} />
          Pengaturan
        </NavLink>

        <div className="flex items-center gap-2.5 px-3 py-2.5 mt-1">
          <div className="w-7 h-7 rounded-full bg-white/10 text-zinc-200 flex items-center justify-center text-[11px] font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0 text-[13px] font-medium text-zinc-300 truncate">{user?.name}</div>
          <button onClick={handleLogout} className="text-zinc-600 hover:text-rose-400 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}