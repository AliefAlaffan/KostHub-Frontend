import { useAuthStore } from '../store/authStore'
import AdminMaintenance from './admin/Maintenance'
import StaffMaintenance from './staff/Maintenance'
import TenantMaintenance from './tenant/Maintenance'

export default function MaintenanceSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffMaintenance />
  if (user?.role === 'tenant') return <TenantMaintenance />
  return <AdminMaintenance />
}