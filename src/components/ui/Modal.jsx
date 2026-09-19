import { X } from 'lucide-react'

const SIZES = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

/**
 * Modal generik di tengah layar (beda dari <Drawer> yang geser dari kanan).
 * Dipakai buat form Tambah/Edit, atau konten pendek lain yang butuh fokus penuh.
 *
 * Contoh:
 * <Modal open={showForm} onClose={() => setShowForm(false)} title="Tambah Properti" subtitle="Isi info bangunan baru" size="lg">
 *   <form>...</form>
 * </Modal>
 */
export default function Modal({ open, onClose, title, subtitle, children, size = 'md' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full ${SIZES[size]} bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto my-auto`}>
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}