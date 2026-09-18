import { useState } from 'react'
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'

const TONES = {
  info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-900', icon: Info, iconColor: 'text-sky-600' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: CheckCircle2, iconColor: 'text-emerald-600' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: AlertTriangle, iconColor: 'text-amber-600' },
  danger: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: XCircle, iconColor: 'text-rose-600' },
}

/**
 * Alert banner statis di dalam halaman (beda dari Toast yang mengambang/auto-hilang).
 * tone: info | success | warning | danger
 * dismissible: true -> ada tombol X buat nutup manual
 * action: { label, onClick } -> tombol aksi opsional di bawah pesan
 *
 * Contoh:
 * <Alert tone="warning" title="Masa Sewa Mendekati Jatuh Tempo" dismissible
 *   action={{ label: 'Kirim Penawaran →', onClick: handleOffer }}>
 *   Kamar A-104 akan berakhir kontrak 10 Oktober 2026.
 * </Alert>
 */
export default function Alert({ tone = 'info', title, children, dismissible, action, className = '' }) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const t = TONES[tone]
  const Icon = t.icon

  return (
    <div role="alert" className={`flex items-start gap-3 p-4 rounded-xl border ${t.bg} ${t.border} ${t.text} ${className}`}>
      <Icon size={20} className={`${t.iconColor} shrink-0 mt-0.5`} />
      <div className="flex-1 text-xs">
        {title && <strong className="font-bold text-sm block mb-0.5">{title}</strong>}
        {children}
        {action && (
          <div className="mt-2">
            <button onClick={action.onClick} className="font-bold underline hover:no-underline">
              {action.label}
            </button>
          </div>
        )}
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} className={`${t.iconColor} opacity-60 hover:opacity-100`}>
          <X size={16} />
        </button>
      )}
    </div>
  )
}