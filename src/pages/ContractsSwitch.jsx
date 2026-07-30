import { useAuthStore } from '../store/authStore'
import AdminContracts from './admin/Contracts'
import StaffContracts from './staff/Contracts'

export default function ContractsSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffContracts />
  return <AdminContracts />
}