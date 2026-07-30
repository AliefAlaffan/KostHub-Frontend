const STATUS_MAP = {
  available: { label: 'TERSEDIA', color: 'var(--color-status-success)' },
  occupied: { label: 'TERISI', color: 'var(--color-status-active)' },
  maintenance: { label: 'PERBAIKAN', color: 'var(--color-status-pending)' },
  inactive: { label: 'NON-AKTIF', color: 'var(--color-status-muted)' },
  unpaid: { label: 'BELUM DIBAYAR', color: 'var(--color-status-pending)' },
  partial: { label: 'SEBAGIAN', color: 'var(--color-status-pending)' },
  paid: { label: 'LUNAS', color: 'var(--color-status-success)' },
  overdue: { label: 'TERLAMBAT', color: 'var(--color-status-danger)' },
  pending: { label: 'MENUNGGU', color: 'var(--color-status-pending)' },
  verified: { label: 'TERVERIFIKASI', color: 'var(--color-status-success)' },
  rejected: { label: 'DITOLAK', color: 'var(--color-status-danger)' },
  active: { label: 'AKTIF', color: 'var(--color-status-active)' },
  ending_soon: { label: 'AKAN BERAKHIR', color: 'var(--color-status-pending)' },
  ended: { label: 'BERAKHIR', color: 'var(--color-status-muted)' },
  renewed: { label: 'DIPERPANJANG', color: 'var(--color-status-success)' },
  new: { label: 'BARU', color: 'var(--color-status-pending)' },
  in_progress: { label: 'DIPROSES', color: 'var(--color-status-active)' },
  done: { label: 'SELESAI', color: 'var(--color-status-success)' },
  closed: { label: 'DITUTUP', color: 'var(--color-status-muted)' },
}

export default function StatusChip({ status }) {
  const info = STATUS_MAP[status] || { label: status?.toUpperCase(), color: 'var(--color-status-muted)' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide"
      style={{ backgroundColor: `${info.color}1F`, color: info.color }}
    >
      {info.label}
    </span>
  )
}