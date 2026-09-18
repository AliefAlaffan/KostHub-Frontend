import { X } from 'lucide-react'

/**
 * Panel geser dari kanan, buat preview cepat (mis. detail invoice) tanpa pindah halaman.
 * Contoh:
 * <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title="Detail Cepat Tagihan" subtitle="INV-2026-10-0082">
 *   ...konten...
 * </Drawer>
 */
export default function Drawer({ open, onClose, title, subtitle, children, footer }) {
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 pointer-events-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm text-slate-900">{title}</h3>
            {subtitle && <p className="text-[11px] text-slate-400 font-mono">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2 shrink-0">
            {footer}
          </div>
        )}
      </aside>
    </div>
  )
}