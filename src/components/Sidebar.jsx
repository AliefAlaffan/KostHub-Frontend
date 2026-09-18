import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logout } from '../api/auth'
import {
  LayoutDashboard, Building2, DoorOpen, Users, FileText, Receipt,
  Wrench, Megaphone, Star, BarChart3, UserCog, Settings, LogOut,
  ClipboardList, Bell, Menu, X, ChevronsLeft, ChevronsRight,
} from 'lucide-react'

const SECTIONS = {
  admin: [
    { label: 'UTAMA', items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
    { label: 'MANAJEMEN', items: [
      { to: '/admin/properties', label: 'Properti', icon: Building2 },
      { to: '/admin/rooms', label: 'Kamar', icon: DoorOpen },
      { to: '/admin/tenants', label: 'Penghuni', icon: Users },
      { to: '/admin/contracts', label: 'Kontrak', icon: FileText },
    ]},
    { label: 'OPERASIONAL', items: [
      { to: '/admin/invoices', label: 'Tagihan', icon: Receipt },
      { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench },
      { to: '/admin/announcements', label: 'Pengumuman', icon: Megaphone },
      { to: '/admin/reviews', label: 'Review', icon: Star },
    ]},
    { label: 'ANALISIS & SISTEM', items: [
      { to: '/admin/reports', label: 'Laporan', icon: BarChart3 },
      { to: '/admin/users', label: 'Manajemen User', icon: UserCog },
    ]},
  ],
  staff: [
    { label: 'TUGAS HARIAN', items: [{ to: '/staff', label: 'Dashboard', icon: ClipboardList }] },
    { label: 'OPERASIONAL LAPANGAN', items: [
      { to: '/staff/rooms', label: 'Kamar', icon: DoorOpen },
      { to: '/staff/tenants', label: 'Penghuni', icon: Users },
      { to: '/staff/contracts', label: 'Kontrak', icon: FileText },
      { to: '/staff/invoices', label: 'Tagihan', icon: Receipt },
      { to: '/staff/maintenance', label: 'Maintenance', icon: Wrench },
      { to: '/staff/announcements', label: 'Pengumuman', icon: Megaphone },
    ]},
  ],
  customer: [
    { label: 'HUNIAN SAYA', items: [{ to: '/customer', label: 'Sewa Saya', icon: LayoutDashboard }] },
    { label: 'LAYANAN PENYEWA', items: [
      { to: '/customer/tagihan', label: 'Tagihan', icon: Receipt },
      { to: '/customer/komplain', label: 'Komplain', icon: Wrench },
      { to: '/customer/pengumuman', label: 'Pengumuman', icon: Megaphone },
      { to: '/customer/ulasan', label: 'Beri Ulasan', icon: Star },
    ]},
  ],
}

const SETTINGS_PATH = { admin: '/admin/settings', staff: '/staff/settings', customer: '/customer/pengaturan' }
const PANEL_LABEL = { admin: 'Admin Console', staff: 'Staff Portal', customer: 'Resident Portal' }

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const role = user?.role
  const sections = SECTIONS[role] || []

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  const navContent = (
    <>
      {/* Brand */}
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm shadow-indigo-600/30">
            K
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-slate-900 text-base tracking-tight block leading-tight">KostHub</span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide block uppercase">{PANEL_LABEL[role]}</span>
            </div>
          )}
        </div>
        <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden">
          <X size={18} />
        </button>
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1 shrink-0">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs">
            <span className="text-indigo-700 font-semibold flex items-center gap-1.5 truncate capitalize">
              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
              {role}
            </span>
            <span className="text-[10px] bg-white border border-indigo-200 text-indigo-700 font-bold px-1.5 py-0.5 rounded uppercase">Active</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.label} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{section.label}</p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  title={item.label}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center ${collapsed ? 'justify-center px-2' : 'px-3.5'} py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isActive ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={2} className="shrink-0" />
                  {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex items-center gap-2 mx-3 mb-2 px-3 py-2 rounded-lg text-[11px] font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 shrink-0"
      >
        {collapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
        {!collapsed && <span>Ciutkan Sidebar</span>}
      </button>

      {/* Profile footer */}
      <div className="p-3 border-t border-slate-200 shrink-0">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-2 rounded-xl hover:bg-slate-50 transition-colors`}>
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 ring-2 ring-indigo-100">
              {initials}
            </div>
            {!collapsed && (
              <div className="truncate text-left">
                <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5 capitalize">{role}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button onClick={handleLogout} title="Keluar" className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors">
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger trigger, fixed di pojok - Layout/Topbar gak perlu tau soal ini */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-600"
      >
        <Menu size={18} />
      </button>

      {/* Backdrop mobile */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden" />
      )}

      <aside
        className={`bg-white border-r border-slate-200 h-screen flex flex-col shrink-0 z-40 transition-all duration-300
          fixed lg:sticky top-0 lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}
      >
        {navContent}
      </aside>
    </>
  )
}