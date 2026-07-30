import { useAuthStore } from '../store/authStore'
import AdminRooms from './admin/Rooms'
import StaffRooms from './staff/Rooms'

export default function RoomsSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffRooms />
  return <AdminRooms />
}