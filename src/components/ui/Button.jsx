import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs focus:ring-2 focus:ring-indigo-500/40',
  // 'outline' TETAP netral (abu-abu) seperti sebelumnya - dipakai di ConfirmDialog & beberapa halaman.
  // JANGAN diubah warnanya, pemakaian lama bergantung ke ini.
  outline: 'border border-[var(--color-border)] text-ink hover:bg-slate-50',
  // 'outlineBrand' BARU - versi berwarna indigo, buat kasus yang butuh outline tapi tetep menonjol.
  outlineBrand: 'bg-transparent text-indigo-600 border border-indigo-300 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400',
  ghost: 'text-slate-muted hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs focus:ring-2 focus:ring-rose-400',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs focus:ring-2 focus:ring-emerald-400',
}

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2.5 text-sm rounded-lg', // default, sama persis ukuran lama
  lg: 'px-5 py-3 text-base rounded-xl',
}

/**
 * Button serbaguna, backward-compatible sama pemakaian lama.
 * variant: primary | outline | outlineBrand | ghost | danger | success
 * size: sm | md | lg (default md, sama kayak sebelumnya)
 * loading: true -> nonaktif + spinner + label "Memproses..."
 *
 * Contoh: <Button variant="danger" size="sm" loading={saving}>Hapus</Button>
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={size === 'sm' ? 14 : 16} className="animate-spin" />
          <span>Memproses...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}