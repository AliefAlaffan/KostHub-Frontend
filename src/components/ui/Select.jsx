/**
 * Select dropdown serbaguna.
 * options: array of { value, label } ATAU array of string
 * Contoh:
 * <Select label="Cabang Kost" options={properties.map(p => ({ value: p.id, label: p.name }))} value={propertyId} onChange={...} />
 */
export default function Select({ label, helperText, error, required, options = [], className = '', id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const hasError = Boolean(error)

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className={`block text-xs font-semibold mb-1.5 ${hasError ? 'text-rose-600' : 'text-slate-700'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full text-sm rounded-lg shadow-xs text-slate-900 px-3 py-2 focus:outline-none focus:ring-1 cursor-pointer transition-colors
          ${hasError
            ? 'border border-rose-300 focus:border-rose-500 focus:ring-rose-500'
            : 'border border-slate-300 focus:border-indigo-600 focus:ring-indigo-600'}`}
        {...props}
      >
        {options.map((opt) => {
          const value = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          return <option key={value} value={value}>{label}</option>
        })}
      </select>
      {(helperText || error) && (
        <span className={`block text-[11px] mt-1 ${hasError ? 'font-medium text-rose-600' : 'text-slate-400'}`}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}