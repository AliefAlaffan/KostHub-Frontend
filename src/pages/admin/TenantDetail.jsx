import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, IdCard, Briefcase, PhoneCall, FileText, Upload, Trash2, Building2 } from 'lucide-react'
import { getTenant, uploadTenantDocument, deleteTenantDocument } from '../../api/tenants'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

export default function TenantDetail() {
  const { id } = useParams()
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    getTenant(id).then((data) => {
      setTenant(data)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [id])

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

  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Hapus dokumen ini?')) return
    await deleteTenantDocument(tenant.id, documentId)
    load()
  }

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

              {activeContract?.room ? (
                <div className="flex items-center gap-1.5 mb-2">
                  <Building2 size={14} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-600">
                    {activeContract.room.property?.name || 'Properti tidak diketahui'}
                  </span>
                  <span className="text-sm text-slate-muted">— Kamar {activeContract.room.room_number}</span>
                </div>
              ) : (
                <div className="text-sm text-slate-muted mb-2">Tidak sedang menyewa kamar aktif</div>
              )}

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
                  <div className="text-xs text-slate-muted mb-1">Properti</div>
                  <div className="text-sm font-semibold text-ink">
                    {activeContract.room?.property?.name || '-'}
                  </div>
                </div>
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
                  <th className="pb-2.5 font-semibold">Properti</th>
                  <th className="pb-2.5 font-semibold">Kamar</th>
                  <th className="pb-2.5 font-semibold">Periode</th>
                  <th className="pb-2.5 font-semibold">Sewa</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenant.contracts.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="py-2.5 text-slate-600">{c.room?.property?.name || '-'}</td>
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

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-ink">Dokumen</h3>
            <DocumentUploadButton tenantId={tenant.id} onUploaded={load} />
          </div>

          {tenant.documents?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tenant.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-2.5 bg-[var(--color-paper)] rounded-lg p-3 group relative"
                >
                  <a
                    href={`http://localhost:8000/storage/${doc.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 flex-1 min-w-0"
                  >
                    <FileText size={16} className="text-slate-muted shrink-0" />
                    <span className="text-xs font-medium text-ink uppercase truncate">{doc.doc_type}</span>
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-muted">Belum ada dokumen diunggah.</p>
          )}
        </Card>
      </div>
    </div>
  )
}

function DocumentUploadButton({ tenantId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [docType, setDocType] = useState('ktp')
  const [showPicker, setShowPicker] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('doc_type', docType)
    formData.append('file', file)

    try {
      await uploadTenantDocument(tenantId, formData)
      onUploaded()
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal upload dokumen')
    } finally {
      setUploading(false)
      setShowPicker(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <Upload size={13} /> {uploading ? 'Mengunggah...' : 'Upload Dokumen'}
      </button>

      {showPicker && (
        <div className="absolute right-0 top-6 bg-white rounded-lg border border-[var(--color-border)] shadow-lg p-3 z-10 w-48">
          <label className="block text-xs font-medium text-slate-muted mb-1.5">Jenis Dokumen</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full px-2 py-1.5 border border-[var(--color-border)] rounded-md text-xs mb-2"
          >
            <option value="ktp">KTP</option>
            <option value="kk">KK</option>
            <option value="other">Lainnya</option>
          </select>
          <label className="block w-full text-center bg-indigo-600 text-white rounded-md py-1.5 text-xs font-semibold cursor-pointer hover:bg-indigo-700">
            Pilih File
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}
    </div>
  )
}