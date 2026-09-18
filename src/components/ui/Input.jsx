/**
 * Input teks serbaguna.
 * Props tambahan di luar <input> biasa:
 * - label: teks label di atas
 * - helperText: teks kecil di bawah (abu-abu)
 * - error: kalau diisi, border jadi merah dan helperText diganti pesan error ini
 * - prefix / suffix: elemen kecil nempel kiri/kanan (mis. "Rp", "/bulan")
 * - required: nambah tanda bintang merah di label
 *
 * Contoh:
 * <Input label="Nama Lengkap" required value={name} onChange={...} />
 * <Input label="Harga Sewa" prefix="Rp" suffix="/bulan" value={price} onChange={...} />
 * <Input label="Email" error="Format email tidak valid" value={email} onChange={...} />
 */
export default function Input({
  label,
  helperText,
  error,
  prefix,
  suffix,
  required,
  className = '',
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const hasError = Boolean(error)

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className={`block text-xs font-semibold mb-1.5 ${hasError ? 'text-rose-600' : 'text-slate-700'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-xs font-bold text-slate-500">{prefix}</span>
          </div>
        )}
        <input
          id={inputId}
          className={`w-full text-sm rounded-lg shadow-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 transition-colors
            ${prefix ? 'pl-9' : 'pl-3'} ${suffix ? 'pr-14' : 'pr-3'} py-2
            ${hasError
              ? 'border border-rose-300 focus:border-rose-500 focus:ring-rose-500 bg-rose-50/40'
              : 'border border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'}`}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-xs text-slate-400">{suffix}</span>
          </div>
        )}
      </div>
      {(helperText || error) && (
        <span className={`block text-[11px] mt-1 ${hasError ? 'font-medium text-rose-600' : 'text-slate-400'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}