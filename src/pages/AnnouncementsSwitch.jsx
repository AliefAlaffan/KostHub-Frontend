import { useAuthStore } from '../store/authStore'
import AdminAnnouncements from './admin/Announcements'
import StaffAnnouncements from './staff/Announcements'
import TenantAnnouncements from './tenant/Announcements'

export default function AnnouncementsSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffAnnouncements />
  if (user?.role === 'tenant') return <TenantAnnouncements />
  return <AdminAnnouncements />
}