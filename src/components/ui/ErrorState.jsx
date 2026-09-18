import { AlertCircle } from 'lucide-react'

/**
 * Tampilan gagal-muat-data, dengan tombol coba lagi.
 * Contoh: <ErrorState description="Gagal terhubung ke server." onRetry={load} />
 */
export default function ErrorState({ title = 'Gagal Memuat Data', description, onRetry, className = '' }) {
  return (
    <div className={`bg-white p-6 rounded-xl border border-rose-100 shadow-xs text-center flex flex-col items-center justify-center min-h-[240px] ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
        <AlertCircle size={28} strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1 max-w-xs">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 shadow-xs hover:bg-slate-50 transition-colors">
          Muat Ulang
        </button>
      )}
    </div>
  )
}