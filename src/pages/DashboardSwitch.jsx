import { useAuthStore } from '../store/authStore'
import AdminDashboard from './admin/Dashboard'
import StaffTasks from './staff/Tasks'
import TenantHome from './tenant/Home'

export default function DashboardSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffTasks />
  if (user?.role === 'tenant') return <TenantHome />
  return <AdminDashboard />
}