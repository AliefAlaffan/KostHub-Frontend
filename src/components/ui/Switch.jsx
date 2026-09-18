/**
 * Toggle switch on/off, sering dipakai buat setting notifikasi dsb.
 * Contoh: <Switch label="Kirim Reminder H-3" checked={x} onChange={(e) => setX(e.target.checked)} />
 */
export default function Switch({ label, checked, onChange, className = '' }) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {label && <span className="text-xs text-slate-600">{label}</span>}
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
        <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 peer-focus:outline-none transition-colors
          after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-slate-300
          after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>
    </div>
  )
}