import { useAuthStore } from '../store/authStore'
import AdminInvoices from './admin/Invoices'
import StaffInvoices from './staff/Invoices'
import TenantInvoices from './tenant/Invoices'

export default function InvoicesSwitch() {
  const { user } = useAuthStore()
  if (user?.role === 'staff') return <StaffInvoices />
  if (user?.role === 'tenant') return <TenantInvoices />
  return <AdminInvoices />
}