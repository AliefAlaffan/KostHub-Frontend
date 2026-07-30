import { useAuthStore } from '../store/authStore'
import AdminInvoiceDetail from './admin/InvoiceDetail'
import StaffInvoiceDetail from './staff/InvoiceDetail'
import TenantInvoiceDetail from './tenant/InvoiceDetail'

export default function InvoiceDetailSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffInvoiceDetail />
  if (user?.role === 'tenant') return <TenantInvoiceDetail />
  return <AdminInvoiceDetail />
}