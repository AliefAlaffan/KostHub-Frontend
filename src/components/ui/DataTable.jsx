import { useState } from 'react'
import EmptyState from './EmptyState'
import Skeleton from './Skeleton'

/**
 * Tabel data generik.
 * columns: [{ key, label, render?: (row) => ReactNode, align?: 'left'|'right'|'center' }]
 * rows: array data (harus punya field `id` unik)
 * selectable: true -> tambah kolom checkbox, dipakai bareng selectedIds + onSelectChange
 * loading: true -> tampil skeleton rows
 * emptyState: { icon, title, description } -> ditampilin kalau rows kosong
 *
 * Contoh:
 * <DataTable
 *   columns={[
 *     { key: 'name', label: 'Penghuni', render: (r) => <span className="font-bold">{r.name}</span> },
 *     { key: 'room', label: 'Kamar' },
 *     { key: 'status', label: 'Status', render: (r) => <Badge status={r.status} /> },
 *   ]}
 *   rows={tenants}
 *   onRowClick={(row) => navigate(`/admin/tenants/${row.id}`)}
 * />
 */
export default function DataTable({
  columns,
  rows,
  loading = false,
  selectable = false,
  selectedIds = [],
  onSelectChange,
  onRowClick,
  emptyState,
  rowActions,
}) {
  const allSelected = rows.length > 0 && selectedIds.length === rows.length

  const toggleAll = () => {
    onSelectChange?.(allSelected ? [] : rows.map((r) => r.id))
  }

  const toggleOne = (id) => {
    onSelectChange?.(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id])
  }

  if (!loading && rows.length === 0) {
    return <EmptyState {...(emptyState || { title: 'Belum ada data' })} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
            {selectable && (
              <th className="p-4 w-10 text-center">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              </th>
            )}
            {columns.map((col) => (
              <th key={col.key} className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                {col.label}
              </th>
            ))}
            {rowActions && <th className="py-3 px-4 text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {selectable && <td className="p-4"><Skeleton className="h-4 w-4" /></td>}
                {columns.map((col) => (
                  <td key={col.key} className="py-3.5 px-4"><Skeleton className="h-4 w-full max-w-[140px]" /></td>
                ))}
                {rowActions && <td className="py-3.5 px-4" />}
              </tr>
            ))
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={`hover:bg-slate-50/70 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {selectable && (
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(row.id)}
                      onChange={() => toggleOne(row.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {rowActions && (
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    {rowActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}