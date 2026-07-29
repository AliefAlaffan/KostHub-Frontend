import { useAuthStore } from '../store/authStore'
import AdminDashboard from './AdminDashboard'
import StaffTasks from './StaffTasks'
import TenantHome from './TenantHome'

export default function Dashboard() {
  const { user } = useAuthStore()

  if (user?.role === 'admin') return <AdminDashboard />
  if (user?.role === 'staff') return <StaffTasks />
  if (user?.role === 'tenant') return <TenantHome />
  return null
}