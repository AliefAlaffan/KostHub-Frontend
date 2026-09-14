import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { getMe } from './api/auth'
import ProtectedRoute from './routes/ProtectedRoute'
import PageLoader from './components/PageLoader'

import Login from './pages/Login'

import AdminLayout from './components/AdminLayout'
import StaffLayout from './components/StaffLayout'
import CustomerLayout from './components/CustomerLayout'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminProperties from './pages/admin/Properties'
import AdminRooms from './pages/admin/Rooms'
import AdminTenants from './pages/admin/Tenants'
import AdminTenantDetail from './pages/admin/TenantDetail'
import AdminContracts from './pages/admin/Contracts'
import AdminInvoices from './pages/admin/Invoices'
import AdminInvoiceDetail from './pages/admin/InvoiceDetail'
import AdminMaintenance from './pages/admin/Maintenance'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminReviews from './pages/admin/Reviews'
import AdminReports from './pages/admin/Reports'
import AdminUserManagement from './pages/admin/UserManagement'
import AdminSettings from './pages/admin/Settings'

// Staff
import StaffTasks from './pages/staff/Tasks'
import StaffRooms from './pages/staff/Rooms'
import StaffTenants from './pages/staff/Tenants'
import StaffContracts from './pages/staff/Contracts'
import StaffInvoices from './pages/staff/Invoices'
import StaffInvoiceDetail from './pages/staff/InvoiceDetail'
import StaffMaintenance from './pages/staff/Maintenance'
import StaffAnnouncements from './pages/staff/Announcements'
import StaffSettings from './pages/staff/Settings'

// Customer
import CustomerHome from './pages/tenant/Home'
import CustomerInvoices from './pages/tenant/Invoices'
import CustomerInvoiceDetail from './pages/tenant/InvoiceDetail'
import CustomerMaintenance from './pages/tenant/Maintenance'
import CustomerAnnouncements from './pages/tenant/Announcements'
import CustomerReviews from './pages/tenant/Reviews'
import CustomerSettings from './pages/tenant/Settings'

const REDIRECT_BY_ROLE = { admin: '/admin', staff: '/staff', customer: '/customer' }

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
    return <PageLoader />
  }

  const homeRedirect = REDIRECT_BY_ROLE[user?.role] || '/login'

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to={homeRedirect} replace />} />

        {/* ADMIN */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
            <Route path="/admin/tenants" element={<AdminTenants />} />
            <Route path="/admin/tenants/:id" element={<AdminTenantDetail />} />
            <Route path="/admin/contracts" element={<AdminContracts />} />
            <Route path="/admin/invoices" element={<AdminInvoices />} />
            <Route path="/admin/invoices/:id" element={<AdminInvoiceDetail />} />
            <Route path="/admin/maintenance" element={<AdminMaintenance />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* STAFF */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route element={<StaffLayout />}>
            <Route path="/staff" element={<StaffTasks />} />
            <Route path="/staff/rooms" element={<StaffRooms />} />
            <Route path="/staff/tenants" element={<StaffTenants />} />
            <Route path="/staff/tenants/:id" element={<AdminTenantDetail />} />
            <Route path="/staff/contracts" element={<StaffContracts />} />
            <Route path="/staff/invoices" element={<StaffInvoices />} />
            <Route path="/staff/invoices/:id" element={<StaffInvoiceDetail />} />
            <Route path="/staff/maintenance" element={<StaffMaintenance />} />
            <Route path="/staff/announcements" element={<StaffAnnouncements />} />
            <Route path="/staff/settings" element={<StaffSettings />} />
          </Route>
        </Route>

        {/* CUSTOMER */}
        <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
          <Route element={<CustomerLayout />}>
            <Route path="/customer" element={<CustomerHome />} />
            <Route path="/customer/tagihan" element={<CustomerInvoices />} />
            <Route path="/customer/tagihan/:id" element={<CustomerInvoiceDetail />} />
            <Route path="/customer/komplain" element={<CustomerMaintenance />} />
            <Route path="/customer/pengumuman" element={<CustomerAnnouncements />} />
            <Route path="/customer/ulasan" element={<CustomerReviews />} />
            <Route path="/customer/pengaturan" element={<CustomerSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}