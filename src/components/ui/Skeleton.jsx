/**
 * Skeleton loading placeholder.
 * shimmer: true -> nambah efek sapuan cahaya (dari index.css .skeleton-shimmer)
 * Pemakaian lama <Skeleton className="h-4 w-full" /> tetap jalan tanpa shimmer.
 */
export default function Skeleton({ className = '', shimmer = false }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${shimmer ? 'skeleton-shimmer' : ''} ${className}`} />
  )
}