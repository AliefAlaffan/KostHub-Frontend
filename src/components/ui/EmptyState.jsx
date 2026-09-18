/**
 * Tampilan kosong (belum ada data) yang konsisten di semua halaman list.
 * Contoh:
 * <EmptyState icon={Users} title="Belum Ada Penghuni"
 *   description="Cabang ini belum punya penghuni terdaftar."
 *   action={{ label: '+ Tambah Penghuni Pertama', onClick: openForm }} />
 */
export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center min-h-[240px] ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Icon size={28} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 transition-colors">
          {action.label}
        </button>
      )}
    </div>
  )
}