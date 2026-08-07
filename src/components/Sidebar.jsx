import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logout } from '../api/auth'
import {
  LayoutDashboard, Building2, DoorOpen, Users, FileText, Receipt,
  Wrench, Megaphone, Star, BarChart3, UserCog, Settings, LogOut, ClipboardList,
} from 'lucide-react'

const SECTIONS = {
  admin: [
    { label: 'UTAMA', items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }] },
    { label: 'MANAJEMEN', items: [
      { to: '/properties', label: 'Properti', icon: Building2 },
      { to: '/rooms', label: 'Kamar', icon: DoorOpen },
      { to: '/tenants', label: 'Penghuni', icon: Users },
      { to: '/contracts', label: 'Kontrak', icon: FileText },
    ]},
    { label: 'OPERASIONAL', items: [
      { to: '/invoices', label: 'Tagihan', icon: Receipt },
      { to: '/maintenance', label: 'Maintenance', icon: Wrench },
      { to: '/announcements', label: 'Pengumuman', icon: Megaphone },
      { to: '/reviews', label: 'Review', icon: Star },
    ]},
    { label: 'LAINNYA', items: [
      { to: '/reports', label: 'Laporan', icon: BarChart3 },
      { to: '/users', label: 'Manajemen User', icon: UserCog },
    ]},
  ],
  staff: [
    { label: 'UTAMA', items: [{ to: '/', label: 'Tugas Hari Ini', icon: ClipboardList }] },
    { label: 'MANAJEMEN', items: [
      { to: '/rooms', label: 'Kamar', icon: DoorOpen },
      { to: '/tenants', label: 'Penghuni', icon: Users },
      { to: '/contracts', label: 'Kontrak', icon: FileText },
    ]},
    { label: 'OPERASIONAL', items: [
      { to: '/invoices', label: 'Tagihan', icon: Receipt },
      { to: '/maintenance', label: 'Maintenance', icon: Wrench },
      { to: '/announcements', label: 'Pengumuman', icon: Megaphone },
    ]},
  ],
  tenant: [
    { label: 'UTAMA', items: [{ to: '/', label: 'Sewa Saya', icon: LayoutDashboard }] },
    { label: 'LAYANAN', items: [
      { to: '/invoices', label: 'Tagihan Saya', icon: Receipt },
      { to: '/maintenance', label: 'Komplain', icon: Wrench },
      { to: '/announcements', label: 'Pengumuman', icon: Megaphone },
      { to: '/reviews', label: 'Beri Ulasan', icon: Star },
    ]},
  ],
}

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const sections = SECTIONS[user?.role] || []

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <aside className="w-64 shrink-0 bg-[var(--color-navy)] flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-7">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-brand)] flex items-center justify-center">
          <Building2 size={16} className="text-white" strokeWidth={2.2} />
        </div>
        <div>
          <div className="font-display font-bold text-[15px] text-white leading-tight">
            Kost<span className="text-[var(--color-brand)]">Hub</span>
          </div>
          <div className="text-[10px] text-zinc-500 tracking-wider">ADMIN PANEL</div>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto space-y-5 pb-4">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="text-[10px] font-semibold text-zinc-600 tracking-wider px-3 mb-1.5">{section.label}</div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `relative flex items-center gap-3 pl-3.5 pr-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 border-l-[3px] ${
                        isActive
                          ? 'bg-white/[0.06] text-white font-semibold border-[var(--color-brand)]'
                          : 'text-zinc-500 font-medium border-transparent hover:bg-white/[0.03] hover:text-zinc-300'
                      }`
                    }
                  >
                    <Icon size={16} strokeWidth={2} />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 pl-3.5 pr-3 py-2.5 rounded-lg text-[13px] mb-2 border-l-[3px] ${
              isActive ? 'bg-white/[0.06] text-white font-semibold border-[var(--color-brand)]' : 'text-zinc-500 font-medium border-transparent hover:bg-white/[0.03] hover:text-zinc-300'
            }`
          }
        >
          <Settings size={16} strokeWidth={2} />
          Pengaturan
        </NavLink>

        <div className="bg-white/[0.04] rounded-xl px-3.5 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{user?.name}</div>
            <div className="text-[11px] text-zinc-500 capitalize">{user?.role}</div>
          </div>
          <button onClick={handleLogout} className="text-zinc-500 hover:text-rose-400 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}