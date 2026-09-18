/**
 * Textarea serbaguna, opsional ada penghitung karakter.
 * Contoh: <Textarea label="Catatan" maxLength={250} showCounter value={note} onChange={...} />
 */
export default function Textarea({ label, helperText, maxLength, showCounter, value = '', className = '', id, ...props }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        {label && <label htmlFor={textareaId} className="block text-xs font-semibold text-slate-700">{label}</label>}
        {showCounter && maxLength && (
          <span className="text-[11px] text-slate-400 font-mono">{value.length} / {maxLength} karakter</span>
        )}
      </div>
      <textarea
        id={textareaId}
        value={value}
        maxLength={maxLength}
        rows={3}
        className="w-full text-sm rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-900 placeholder-slate-400 shadow-xs px-3 py-2 focus:outline-none"
        {...props}
      />
      {helperText && <span className="block text-[11px] text-slate-400 mt-1">{helperText}</span>}
    </div>
  )
}