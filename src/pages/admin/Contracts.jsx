import { useEffect, useState } from 'react'
import { FileText, X, RefreshCw, LogOut as CheckoutIcon, History, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { getContracts, renewContract, checkoutContract } from '../../api/contracts'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [modal, setModal] = useState(null)
  const [renewForm, setRenewForm] = useState({ start_date: '', end_date: '' })
  const [checkoutForm, setCheckoutForm] = useState({ checkout_date: '', room_condition_notes: '' })

  const load = () => {
    setLoading(true)
    getContracts().then((data) => { setContracts(data); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const visibleContracts = showHistory
    ? contracts
    : contracts.filter((c) => c.status !== 'renewed')

  const summary = {
    active: contracts.filter((c) => c.status === 'active').length,
    ending_soon: contracts.filter((c) => c.status === 'ending_soon').length,
    ended: contracts.filter((c) => c.status === 'ended').length,
  }

  const openRenew = (contract) => {
    setModal({ type: 'renew', contract })
    setRenewForm({ start_date: '', end_date: '' })
    setError('')
  }
  const openCheckout = (contract) => {
    setModal({ type: 'checkout', contract })
    setCheckoutForm({ checkout_date: '', room_condition_notes: '' })
    setError('')
  }
  const closeModal = () => setModal(null)

  const handleRenewSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await renewContract(modal.contract.id, renewForm)
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperpanjang kontrak')
    }
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await checkoutContract(modal.contract.id, checkoutForm)
      closeModal()
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal proses check-out')
    }
  }

  const initials = (name) => (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  return (
    <div>
      <Topbar title="Kontrak" breadcrumb={['KostHub', 'Kontrak']} />

      <div className="p-8 max-w-[1300px]">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-indigo-600" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink leading-none">{summary.active}</div>
              <div className="text-xs text-slate-muted mt-1">Kontrak Aktif</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-amber-600" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink leading-none">{summary.ending_soon}</div>
              <div className="text-xs text-slate-muted mt-1">Akan Berakhir</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
              <XCircle size={16} className="text-slate-500" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink leading-none">{summary.ended}</div>
              <div className="text-xs text-slate-muted mt-1">Sudah Berakhir</div>
            </div>
          </Card>
        </div>

        <div className="mb-5">
        <div className="inline-flex items-center gap-1.5 bg-[var(--color-paper)] rounded-lg p-1">
          <button
            onClick={() => setShowHistory(false)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
              !showHistory ? 'bg-white text-ink shadow-sm' : 'text-slate-muted hover:text-ink'
            }`}
          >
            Aktif Saat Ini ({visibleContracts.length === contracts.length && !showHistory ? contracts.length : contracts.filter((c) => c.status !== 'renewed').length})
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
              showHistory ? 'bg-white text-ink shadow-sm' : 'text-slate-muted hover:text-ink'
            }`}
          >
            Semua Termasuk Riwayat ({contracts.length})
          </button>
        </div>
        <p className="text-xs text-slate-muted mt-2">
          {showHistory
            ? 'Termasuk kontrak lama yang sudah digantikan oleh perpanjangan baru.'
            : 'Kontrak lama yang sudah diperpanjang disembunyikan agar tabel lebih ringkas.'}
        </p>
      </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : visibleContracts.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <FileText size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-display font-bold text-ink mb-1">Belum ada kontrak</h3>
            <p className="text-sm text-slate-muted">Kontrak akan muncul di sini setelah ada penghuni baru.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-slate-muted uppercase tracking-wide bg-[var(--color-paper)]">
                  <th className="px-5 py-3 font-semibold">Penghuni</th>
                  <th className="px-5 py-3 font-semibold">Kamar</th>
                  <th className="px-5 py-3 font-semibold">Periode Sewa</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {visibleContracts.map((c) => {
                  const tenantName = c.tenant?.user?.name
                  return (
                    <tr
                      key={c.id}
                      className={`border-t border-[var(--color-border)] hover:bg-[var(--color-paper)]/60 transition-colors ${c.status === 'renewed' ? 'opacity-50' : ''}`}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                            {initials(tenantName)}
                          </div>
                          {tenantName ? (
                            <span className="text-ink font-medium">{tenantName}</span>
                          ) : (
                            <span className="text-slate-400 italic">Data penghuni terhapus</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">Kamar {c.room?.room_number ?? '-'}</td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {c.start_date} <span className="text-slate-300">→</span> {c.end_date}
                      </td>
                      <td className="px-5 py-3.5"><Badge status={c.status} /></td>
                      <td className="px-5 py-3.5 text-right">
                        {['active', 'ending_soon'].includes(c.status) ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openRenew(c)} className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                              <RefreshCw size={13} /> Perpanjang
                            </button>
                            <span className="text-slate-200">|</span>
                            <button onClick={() => openCheckout(c)} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors">
                              <CheckoutIcon size={13} /> Check-out
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">Tidak ada aksi</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-sm p-6 relative rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>

            {modal.type === 'renew' ? (
              <>
                <h3 className="font-display text-lg font-bold text-ink mb-1">Perpanjang Kontrak</h3>
                <p className="text-xs text-slate-muted mb-5">{modal.contract.tenant?.user?.name} · Kamar {modal.contract.room?.room_number}</p>
                <form onSubmit={handleRenewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-muted mb-1.5">Mulai Periode Baru</label>
                    <input type="date" value={renewForm.start_date} onChange={(e) => setRenewForm({ ...renewForm, start_date: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-muted mb-1.5">Selesai Periode Baru</label>
                    <input type="date" value={renewForm.end_date} onChange={(e) => setRenewForm({ ...renewForm, end_date: e.target.value })} className={inputClass} required />
                  </div>
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                  <Button type="submit" className="w-full">Simpan Perpanjangan</Button>
                </form>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-bold text-ink mb-1">Proses Check-out</h3>
                <p className="text-xs text-slate-muted mb-5">{modal.contract.tenant?.user?.name} · Kamar {modal.contract.room?.room_number}</p>
                <form onSubmit={handleCheckoutSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-muted mb-1.5">Tanggal Check-out</label>
                    <input type="date" value={checkoutForm.checkout_date} onChange={(e) => setCheckoutForm({ ...checkoutForm, checkout_date: e.target.value })} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-muted mb-1.5">Catatan Kondisi Kamar</label>
                    <textarea value={checkoutForm.room_condition_notes} onChange={(e) => setCheckoutForm({ ...checkoutForm, room_condition_notes: e.target.value })} className={inputClass} />
                  </div>
                  {error && <p className="text-sm text-rose-600">{error}</p>}
                  <Button type="submit" className="w-full">Proses Check-out</Button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}