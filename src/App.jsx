import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Rooms from './pages/Rooms'
import Tenants from './pages/Tenants'
import Contracts from './pages/Contracts'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Maintenance from './pages/Maintenance'
import Announcements from './pages/Announcements'
import Reports from './pages/Reports'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/AppLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />

            {/* Hanya admin & staff */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'staff']} />}>
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/tenants" element={<Tenants />} />
              <Route path="/contracts" element={<Contracts />} />
            </Route>

            {/* Hanya admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/properties" element={<Properties />} />
              <Route path="/reports" element={<Reports />} />
            </Route>

            {/* Semua role boleh akses (tapi kontennya beda sesuai role di dalam komponennya) */}
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/announcements" element={<Announcements />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}