const TONES = {
  emerald: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-800',
  rose: 'bg-rose-100 text-rose-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  slate: 'bg-slate-100 text-slate-700',
  purple: 'bg-purple-100 text-purple-800',
}

/**
 * Label solid kecil buat sel tabel yang padat (beda dari <Badge> yang bentuk pill+dot).
 * Contoh: <Tag tone="emerald">LUNAS</Tag>
 */
export default function Tag({ tone = 'slate', children, className = '' }) {
  return (
    <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${TONES[tone]} ${className}`}>
      {children}
    </span>
  )
}