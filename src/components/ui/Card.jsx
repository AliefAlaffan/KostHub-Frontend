/**
 * Card dasar. Pemakaian lama tetap jalan:
 *   <Card className="p-6">...</Card>
 *
 * Opsional, bisa pakai struktur header/body/footer (dari desain "Reusable Card"):
 *   <Card title="Daftar Penghuni" actions={<Button size="sm">+ Entri Baru</Button>} footer="Terakhir disinkron 14 menit lalu">
 *     ...isi tabel/konten...
 *   </Card>
 * Kalau title/actions/footer dipakai, `className` berlaku ke bagian body doang (bukan card luar),
 * biar padding header/footer konsisten dan gak keinjek className body.
 */
export default function Card({ children, className = '', title, actions, footer }) {
  if (!title && !footer) {
    return (
      <div className={`rounded-xl border border-[var(--color-border)] ${className}`} style={{ backgroundColor: '#FFFFFF' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={className}>{children}</div>
      {footer && (
        <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  )
}