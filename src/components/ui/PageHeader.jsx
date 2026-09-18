/**
 * Header halaman standar (dalam <main>, di atas konten), beda dari <Topbar> yang nempel
 * di atas layar. Dipakai buat judul + deskripsi + status pill + tombol aksi kanan.
 *
 * Contoh:
 * <PageHeader
 *   title="Manajemen Properti"
 *   pill="5 Cabang Aktif"
 *   description="Kelola daftar gedung, kapasitas kamar, dan penugasan staf."
 *   actions={<Button onClick={openForm}>+ Tambah Properti</Button>}
 * />
 */
export default function PageHeader({ title, pill, description, actions, className = '' }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {pill && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {pill}
            </span>
          )}
        </div>
        {description && <p className="text-xs sm:text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  )
}