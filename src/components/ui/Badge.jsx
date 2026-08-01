const STATUS_MAP = {
  available: { label: 'Tersedia', color: '#16A34A', bg: '#F0FDF4' },
  occupied: { label: 'Terisi', color: '#4F46E5', bg: '#EEF2FF' },
  maintenance: { label: 'Perbaikan', color: '#D97706', bg: '#FFFBEB' },
  inactive: { label: 'Non-aktif', color: '#6B7280', bg: '#F9FAFB' },
  unpaid: { label: 'Belum Dibayar', color: '#D97706', bg: '#FFFBEB' },
  partial: { label: 'Sebagian', color: '#D97706', bg: '#FFFBEB' },
  paid: { label: 'Lunas', color: '#16A34A', bg: '#F0FDF4' },
  overdue: { label: 'Terlambat', color: '#E11D48', bg: '#FFF1F2' },
  pending: { label: 'Menunggu', color: '#D97706', bg: '#FFFBEB' },
  verified: { label: 'Terverifikasi', color: '#16A34A', bg: '#F0FDF4' },
  rejected: { label: 'Ditolak', color: '#E11D48', bg: '#FFF1F2' },
  active: { label: 'Aktif', color: '#4F46E5', bg: '#EEF2FF' },
  ending_soon: { label: 'Akan Berakhir', color: '#D97706', bg: '#FFFBEB' },
  ended: { label: 'Berakhir', color: '#6B7280', bg: '#F9FAFB' },
  renewed: { label: 'Diperpanjang', color: '#16A34A', bg: '#F0FDF4' },
  new: { label: 'Baru', color: '#D97706', bg: '#FFFBEB' },
  in_progress: { label: 'Diproses', color: '#4F46E5', bg: '#EEF2FF' },
  done: { label: 'Selesai', color: '#16A34A', bg: '#F0FDF4' },
  closed: { label: 'Ditutup', color: '#6B7280', bg: '#F9FAFB' },
}

export default function Badge({ status }) {
  const info = STATUS_MAP[status] || { label: status, color: '#6B7280', bg: '#F9FAFB' }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: info.bg, color: info.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
      {info.label}
    </span>
  )
}