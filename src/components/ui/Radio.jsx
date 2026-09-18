/**
 * Radio button dengan label. Ingat: semua radio dalam 1 grup harus punya `name` yang sama.
 * Contoh: <Radio name="billing_cycle" label="Bulanan" value="monthly" checked={x === 'monthly'} onChange={...} />
 */
export default function Radio({ label, className = '', ...props }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer text-xs text-slate-700 ${className}`}>
      <input
        type="radio"
        className="border-slate-300 text-indigo-600 focus:ring-indigo-500"
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}