import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'

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
      <p>Halo, {user?.name} ({user?.role})</p>
      <button onClick={handleLogout}>Keluar</button>
    </div>
  )
}