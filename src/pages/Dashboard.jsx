import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Dashboard</h1>
      <nav style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link to="/properties">Properti</Link>
        <Link to="/rooms">Kamar</Link>
        <Link to="/tenants">Penghuni</Link>
        <Link to="/contracts">Kontrak</Link>
        <Link to="/invoices">Tagihan</Link>
        <Link to="/maintenance">Maintenance</Link>
        <Link to="/announcements">Pengumuman</Link>
        <Link to="/reports">Laporan</Link>
      </nav>
      <p>Halo, {user?.name} ({user?.role})</p>
      <button onClick={handleLogout}>Keluar</button>
    </div>
  )
}