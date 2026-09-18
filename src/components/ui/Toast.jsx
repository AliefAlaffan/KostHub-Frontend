import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const ICONS = {
  success: { Icon: CheckCircle2, badge: 'bg-emerald-50 text-emerald-700' },
  error: { Icon: XCircle, badge: 'bg-rose-50 text-rose-700' },
  info: { Icon: Info, badge: 'bg-indigo-50 text-indigo-700' },
}

/**
 * Bungkus <App /> dengan <ToastProvider> sekali di root (lihat main.jsx),
 * lalu di halaman manapun tinggal:
 *
 *   const toast = useToast()
 *   toast.success('Data berhasil disimpan')
 *   toast.error('Gagal memproses otorisasi bank')
 *   toast.info('Ada 3 notifikasi baru')
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => remove(id), 3800)
  }, [remove])

  const api = {
    success: (msg) => push('success', msg),
    error: (msg) => push('error', msg),
    info: (msg) => push('info', msg),
  }

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 w-80">
        {toasts.map((t) => {
          const { Icon, badge } = ICONS[t.type]
          return (
            <div key={t.id} className="flex items-start gap-2.5 p-3.5 bg-white rounded-xl shadow-lg border border-slate-200 text-xs animate-[fadeIn_0.2s_ease-out]">
              <div className={`w-6 h-6 rounded-lg ${badge} flex items-center justify-center shrink-0`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 font-semibold text-slate-800 leading-tight pt-0.5">{t.message}</div>
              <button onClick={() => remove(t.id)} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>')
  return ctx
}