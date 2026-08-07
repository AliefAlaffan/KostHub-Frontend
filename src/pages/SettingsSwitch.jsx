import { useAuthStore } from '../store/authStore'
import AdminSettings from './admin/Settings'
import StaffSettings from './staff/Settings'
import TenantSettings from './tenant/Settings'

export default function SettingsSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffSettings />
  if (user?.role === 'tenant') return <TenantSettings />
  return <AdminSettings />
}