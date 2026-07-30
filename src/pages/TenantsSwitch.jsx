import { useAuthStore } from '../store/authStore'
import AdminTenants from './admin/Tenants'
import StaffTenants from './staff/Tenants'

export default function TenantsSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffTenants />
  return <AdminTenants />
}