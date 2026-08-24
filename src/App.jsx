import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { getMe } from './api/auth'
import Login from './pages/Login'
import DashboardSwitch from './pages/DashboardSwitch'
import RoomsSwitch from './pages/RoomsSwitch'
import TenantsSwitch from './pages/TenantsSwitch'
import ContractsSwitch from './pages/ContractsSwitch'
import InvoicesSwitch from './pages/InvoicesSwitch'
import InvoiceDetailSwitch from './pages/InvoiceDetailSwitch'
import MaintenanceSwitch from './pages/MaintenanceSwitch'
import AnnouncementsSwitch from './pages/AnnouncementsSwitch'
import Properties from './pages/admin/Properties'
import Reports from './pages/admin/Reports'
import UserManagement from './pages/admin/UserManagement'
import ReviewsSwitch from './pages/ReviewsSwitch'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/AppLayout'
import TenantDetail from './pages/admin/TenantDetail'
import SettingsSwitch from './pages/SettingsSwitch'

export default function App() {
  const { token, user, setUser, clearAuth } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (token && !user) {
    getMe()
      .then((data) => setUser(data))
      .catch((err) => {
        console.error('Gagal ambil data user:', err)
        clearAuth()
      })
      .finally(() => setLoading(false))
  } else {
    setLoading(false)
  }
}, [token, user])

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-[3px] border-slate-200 border-t-[var(--color-brand)] rounded-full animate-spin" />
        <span className="text-xs text-slate-muted font-medium tracking-wide">Memuat KostHub...</span>
      </div>
    </div>
  )
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardSwitch />} />

            <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
              <Route path="/rooms" element={<RoomsSwitch />} />
              <Route path="/tenants" element={<TenantsSwitch />} />
              <Route path="/contracts" element={<ContractsSwitch />} />
              <Route path="/tenants/:id" element={<TenantDetail />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/properties" element={<Properties />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>

            <Route path="/invoices" element={<InvoicesSwitch />} />
            <Route path="/invoices/:id" element={<InvoiceDetailSwitch />} />
            <Route path="/maintenance" element={<MaintenanceSwitch />} />
            <Route path="/announcements" element={<AnnouncementsSwitch />} />
            <Route path="/reviews" element={<ReviewsSwitch />} />
            <Route path="/settings" element={<SettingsSwitch />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}