/**
 * Checkbox dengan label, styling konsisten.
 * Contoh: <Checkbox label="Parkir Mobil Khusus (+Rp150rb)" checked={x} onChange={...} />
 */
export default function Checkbox({ label, className = '', ...props }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer text-xs text-slate-700 ${className}`}>
      <input
        type="checkbox"
        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}