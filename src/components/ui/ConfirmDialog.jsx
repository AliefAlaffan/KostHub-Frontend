import { AlertTriangle } from 'lucide-react'
import Button from './Button'

export default function ConfirmDialog({
  open,
  title = 'Konfirmasi',
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[60] p-4"
      style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-xs p-6 rounded-xl text-center"
        style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-rose-50' : 'bg-indigo-50'}`}>
          <AlertTriangle size={22} className={danger ? 'text-rose-600' : 'text-indigo-600'} />
        </div>
        <h3 className="font-display text-base font-bold text-ink mb-1.5">{title}</h3>
        <p className="text-sm text-slate-muted mb-6">{message}</p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={onConfirm}
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Memproses...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}