/**
 * Pagination bar. Cuma UI + callback, gak nyimpen state sendiri (biar fleksibel).
 * Contoh:
 * <Pagination page={page} totalPages={10} totalItems={124} pageSize={10} onChange={setPage} />
 */
export default function Pagination({ page, totalPages, totalItems, pageSize, onChange }) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  const pageNumbers = () => {
    const nums = []
    for (let p = Math.max(1, page - 1); p <= Math.min(totalPages, page + 1); p++) nums.push(p)
    return nums
  }

  return (
    <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <span className="text-slate-500">
        Menampilkan <strong className="text-slate-800">{from}–{to}</strong> dari <strong className="text-slate-800">{totalItems}</strong> data
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold disabled:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed"
        >
          ← Sebelumnya
        </button>
        {page > 2 && (
          <>
            <button onClick={() => onChange(1)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">1</button>
            {page > 3 && <span className="px-1 text-slate-400">...</span>}
          </>
        )}
        {pageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center ${
              p === page ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold'
            }`}
          >
            {p}
          </button>
        ))}
        {page < totalPages - 1 && (
          <>
            {page < totalPages - 2 && <span className="px-1 text-slate-400">...</span>}
            <button onClick={() => onChange(totalPages)} className="w-8 h-8 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold">{totalPages}</button>
          </>
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold disabled:text-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed"
        >
          Berikutnya →
        </button>
      </div>
    </div>
  )
}