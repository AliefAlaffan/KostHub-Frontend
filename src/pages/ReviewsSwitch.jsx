import { useAuthStore } from '../store/authStore'
import AdminReviews from './admin/Reviews'
import TenantReviews from './tenant/Reviews'

export default function ReviewsSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'tenant') return <TenantReviews />
  return <AdminReviews />
}