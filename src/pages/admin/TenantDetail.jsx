import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, IdCard, Briefcase, PhoneCall, FileText } from 'lucide-react'
import { getTenant } from '../../api/tenants'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

export default function TenantDetail() {
  const { id } = useParams()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTenant(id).then((data) => {
      setTenant(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div>
        <Topbar title="Detail Penghuni" breadcrumb={['KostHub', 'Penghuni', 'Detail']} />
        <div className="p-8 max-w-[1100px] space-y-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (!tenant) {
    return (
      <div>
        <Topbar title="Detail Penghuni" breadcrumb={['KostHub', 'Penghuni']} />
        <div className="p-8 text-slate-muted text-sm">Penghuni tidak ditemukan.</div>
      </div>
    )
  }

  const initials = (tenant.user?.name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const activeContract = tenant.contracts?.find(
    (c) => c.status === 'active' || c.status === 'ending_soon'
  )

  return (
    <div>
      <Topbar title="Detail Penghuni" breadcrumb={['KostHub', 'Penghuni', tenant.user?.name]} />

      <div className="p-8 max-w-[1100px]">
        <Link
          to="/tenants"
          className="inline-flex items-center gap-1.5 text-sm text-slate-muted hover:text-ink mb-5 transition-colors"
        >
          <ArrowLeft size={15} />
          Kembali ke Penghuni
        </Link>

        <Card className="p-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center text-xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <h2 className="font-display text-xl font-bold text-ink">{tenant.user?.name}</h2>
                {activeContract && <Badge status={activeContract.status} />}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-muted mt-2">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {tenant.user?.email}
                </span>
                {tenant.user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} />
                    {tenant.user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <IdCard size={14} />
                  {tenant.ktp_number}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <Card className="lg:col-span-2 p-6">
            <h3 className="font-display text-sm font-bold text-ink mb-4">Kontrak Aktif</h3>
            {activeContract ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-muted mb-1">Kamar</div>
                  <div className="text-sm font-semibold text-ink">
                    Kamar {activeContract.room?.room_number}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-muted mb-1">Sewa / Bulan</div>
                  <div className="text-sm font-semibold text-ink">
                    Rp {Number(activeContract.rent_amount).toLocaleString('id-ID')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-muted mb-1">Mulai Sewa</div>
                  <div className="text-sm font-semibold text-ink">{activeContract.start_date}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-muted mb-1">Selesai Sewa</div>
                  <div className="text-sm font-semibold text-ink">{activeContract.end_date}</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-muted">Tidak ada kontrak aktif saat ini.</p>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-sm font-bold text-ink mb-4">Informasi Tambahan</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Briefcase size={15} className="text-slate-muted shrink-0" />
                <span className="text-ink">{tenant.occupation || '—'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <PhoneCall size={15} className="text-slate-muted shrink-0" />
                <span className="text-ink">
                  {tenant.emergency_contact_name || '—'}
                  {tenant.emergency_contact_phone ? ` · ${tenant.emergency_contact_phone}` : ''}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mb-4">
          <h3 className="font-display text-sm font-bold text-ink mb-4">Riwayat Sewa</h3>
          {tenant.contracts?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-slate-muted uppercase tracking-wide border-b border-[var(--color-border)]">
                  <th className="pb-2.5 font-semibold">Kamar</th>
                  <th className="pb-2.5 font-semibold">Periode</th>
                  <th className="pb-2.5 font-semibold">Sewa</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenant.contracts.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2.5 text-ink font-medium">Kamar {c.room?.room_number}</td>
                    <td className="py-2.5 text-slate-600">
                      {c.start_date} — {c.end_date}
                    </td>
                    <td className="py-2.5 text-slate-600">
                      Rp {Number(c.rent_amount).toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5">
                      <Badge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-muted">Belum ada riwayat sewa.</p>
          )}
        </Card>
      </div>
    </div>
  )
}