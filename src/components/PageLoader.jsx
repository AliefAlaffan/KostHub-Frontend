export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-paper)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-[3px] border-slate-200 border-t-[var(--color-brand)] rounded-full animate-spin" />
        <span className="text-xs text-slate-muted font-medium tracking-wide">Memuat KostHub...</span>
      </div>
    </div>
  )
}