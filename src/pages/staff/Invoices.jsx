import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Receipt, Plus, X } from 'lucide-react'
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

  return (
    <div>
      <Topbar title="Tagihan" breadcrumb={['KostHub', 'Tagihan']} />

      <div className="p-8 max-w-[1300px]">
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
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[var(--color-paper)] flex items-center justify-center mx-auto mb-3">
              <Receipt size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-muted text-sm">Tidak ada tagihan untuk filter ini.</p>
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
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => window.location.href = `/invoices/${inv.id}`}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-paper)]/60 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-ink font-medium">{inv.contract?.tenant?.user?.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">Kamar {inv.contract?.room?.room_number}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{inv.period}</td>
                    <td className="px-5 py-3.5 text-ink font-semibold">Rp {Number(inv.total_amount).toLocaleString('id-ID')}</td>
                    <td className="px-5 py-3.5 text-slate-600">{inv.due_date}</td>
                    <td className="px-5 py-3.5"><Badge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="w-full max-w-sm p-6 relative rounded-xl"
            style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
          >
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink transition-colors">
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