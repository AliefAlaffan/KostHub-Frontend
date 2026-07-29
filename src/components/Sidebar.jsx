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
    { to: '/reports', label: 'Laporan' },
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
    <nav style={{ width: 180, borderRight: '1px solid #ccc', padding: 16, minHeight: '100vh' }}>
      <div style={{ marginBottom: 16, fontWeight: 'bold' }}>{user?.name}</div>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>{user?.role}</div>
      {menu.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            display: 'block', padding: '6px 0', textDecoration: 'none',
            color: isActive ? '#1E3A52' : '#333', fontWeight: isActive ? 'bold' : 'normal',
          })}
        >
          {item.label}
        </NavLink>
      ))}
      <button onClick={handleLogout} style={{ marginTop: 16 }}>Keluar</button>
    </nav>
  )
}