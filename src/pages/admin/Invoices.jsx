import { useEffect, useState } from 'react'
import { Receipt, Plus, X, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getTenants } from '../../api/tenants'
import { getInvoices, generateInvoice } from '../../api/invoices'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'unpaid', label: 'Belum Dibayar' },
  { key: 'partial', label: 'Sebagian' },
  { key: 'paid', label: 'Lunas' },
  { key: 'overdue', label: 'Terlambat' },
]

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Invoices() {
  const [tenants, setTenants] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState('')
  const [period, setPeriod] = useState('')
  const [error, setError] = useState('')

  const loadInvoices = () => {
    setLoading(true)
    getInvoices().then((data) => { setInvoices(data); setLoading(false) })
  }

  useEffect(() => {
    getTenants().then(setTenants)
    loadInvoices()
  }, [])

  const handleGenerate = async (e) => {
    e.preventDefault()
    setError('')
    const tenant = tenants.find((t) => t.id === Number(selectedTenant))
    const contractId = tenant?.active_contract?.id

    if (!contractId) {
      setError('Penghuni ini tidak memiliki kontrak aktif.')
      return
    }

    try {
      await generateInvoice({ contract_id: contractId, period })
      setShowForm(false)
      setSelectedTenant('')
      setPeriod('')
      loadInvoices()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal generate invoice')
    }
  }

  const filteredInvoices = filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter)
  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  const totalOutstanding = invoices
    .filter((inv) => ['unpaid', 'partial', 'overdue'].includes(inv.status))
    .reduce((sum, inv) => sum + Number(inv.total_amount), 0)
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length
  const paidThisMonth = invoices.filter((inv) => inv.status === 'paid').length

  const initials = (name) => (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div>
      <Topbar title="Tagihan" breadcrumb={['KostHub', 'Tagihan']} />

      <div className="p-8 max-w-[1300px]">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
              <Wallet size={16} className="text-rose-600" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink leading-none">
                Rp {totalOutstanding.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-muted mt-1">Total Belum Lunas</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <AlertCircle size={16} className="text-amber-600" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink leading-none">{overdueCount}</div>
              <div className="text-xs text-slate-muted mt-1">Terlambat Bayar</div>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-ink leading-none">{paidThisMonth}</div>
              <div className="text-xs text-slate-muted mt-1">Sudah Lunas</div>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 bg-[var(--color-paper)] rounded-lg p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  filter === f.key ? 'bg-white text-ink shadow-sm' : 'text-slate-muted hover:text-ink'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button onClick={() => setShowForm(true)}>
            <span className="flex items-center gap-2"><Plus size={16} /> Generate Invoice</span>
          </Button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Receipt size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-display font-bold text-ink mb-1">Tidak ada tagihan</h3>
            <p className="text-sm text-slate-muted">Tidak ada tagihan untuk filter ini.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-slate-muted uppercase tracking-wide bg-[var(--color-paper)]">
                  <th className="px-5 py-3 font-semibold">Penghuni</th>
                  <th className="px-5 py-3 font-semibold">Kamar</th>
                  <th className="px-5 py-3 font-semibold">Periode</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Jatuh Tempo</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => {
                  const tenantName = inv.contract?.tenant?.user?.name
                  return (
                    <tr
                      key={inv.id}
                      onClick={() => window.location.href = `/invoices/${inv.id}`}
                      className="border-t border-[var(--color-border)] hover:bg-[var(--color-paper)]/60 transition-colors cursor-pointer"
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
                      <td className="px-5 py-3.5 text-slate-600">Kamar {inv.contract?.room?.room_number ?? '-'}</td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono">{inv.period}</td>
                      <td className="px-5 py-3.5 text-ink font-semibold">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5 text-slate-600">{formatDate(inv.due_date)}</td>
                      <td className="px-5 py-3.5"><Badge status={inv.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-sm p-6 relative rounded-xl" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink mb-5">Generate Invoice</h3>
            <form onSubmit={handleGenerate} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Penghuni</label>
                <select value={selectedTenant} onChange={(e) => setSelectedTenant(e.target.value)} className={inputClass} required>
                  <option value="">-- Pilih Penghuni --</option>
                  {tenants.map((t) => <option key={t.id} value={t.id}>{t.user?.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-muted mb-1.5">Periode</label>
                <input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className={inputClass} required />
              </div>
              {error && <p className="text-sm text-rose-600">{error}</p>}
              <Button type="submit" className="w-full">Generate</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}