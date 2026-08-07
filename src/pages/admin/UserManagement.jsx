import { useEffect, useState } from 'react'
import { UserCog, Plus, X, Key, Power, Users } from 'lucide-react'
import { getProperties } from '../../api/properties'
import { getUsers, createStaff, resetUserPassword, toggleUserStatus } from '../../api/users'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', property_ids: [] })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')

  const load = () => {
    setLoading(true)
    getUsers().then((data) => { setUsers(data); setLoading(false) })
  }
  useEffect(() => {
    load()
    getProperties().then(setProperties)
  }, [])

  const handlePropertyToggle = (id) => {
    setForm((f) => ({
      ...f,
      property_ids: f.property_ids.includes(id) ? f.property_ids.filter((p) => p !== id) : [...f.property_ids, id],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      const result = await createStaff(form)
      setMessage(`Staff dibuat — ${result.user.email} / ${result.plain_password}`)
      setForm({ name: '', email: '', phone: '', property_ids: [] })
      setShowForm(false)
      load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Gagal membuat staff')
    }
  }

  const handleReset = async (id) => {
    setError('')
    try {
      const result = await resetUserPassword(id)
      setMessage(`Password baru: ${result.plain_password}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal reset password')
    }
  }

  const handleToggle = async (id) => {
    setError('')
    try {
      await toggleUserStatus(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal ubah status')
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"

  return (
    <div>
      <Topbar title="Manajemen User" breadcrumb={['KostHub', 'Manajemen User']} />

      <div className="p-8 max-w-[1300px]">
        {message && (
          <div className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage('')} className="text-emerald-700 hover:text-emerald-900"><X size={14} /></button>
          </div>
        )}
        {error && (
          <div className="bg-rose-50 text-rose-700 text-sm rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-700 hover:text-rose-900"><X size={14} /></button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-muted">{users.length} akun terdaftar</p>
          <Button onClick={() => { setShowForm(true); setFormError('') }}>
            <span className="flex items-center gap-2"><Plus size={16} /> Tambah Staff</span>
          </Button>
        </div>

        {loading ? (
          <Skeleton className="h-64" />
        ) : users.length === 0 ? (
          <Card className="p-16 text-center">
            <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-indigo-600" />
            </div>
            <h3 className="font-display font-bold text-ink mb-1">Belum ada user</h3>
            <p className="text-sm text-slate-muted">Data user akan muncul di sini.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-slate-muted uppercase tracking-wide bg-[var(--color-paper)]">
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-[var(--color-border)] hover:bg-[var(--color-paper)]/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {(u.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <span className="text-ink font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[var(--color-paper)] text-slate-600 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${u.status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {u.status === 'active' ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {u.role !== 'admin' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleReset(u.id)} className="w-7 h-7 rounded-lg bg-[var(--color-paper)] flex items-center justify-center hover:bg-slate-200 transition-colors" title="Reset Password">
                            <Key size={13} className="text-slate-500" />
                          </button>
                          <button onClick={() => handleToggle(u.id)} className="w-7 h-7 rounded-lg bg-[var(--color-paper)] flex items-center justify-center hover:bg-slate-200 transition-colors" title="Aktifkan/Nonaktifkan">
                            <Power size={13} className="text-slate-500" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="w-full max-w-sm p-6 relative rounded-xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-muted hover:text-ink">
              <X size={18} />
            </button>
            <h3 className="font-display text-lg font-bold text-ink mb-1">Tambah Staff</h3>
            <p className="text-xs text-slate-muted mb-5">Akun login otomatis dibuat dengan password acak.</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} required />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} required />
              <input placeholder="No. HP (opsional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              <div>
                <div className="text-xs font-medium text-slate-muted mb-2">Assign ke Properti</div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {properties.length === 0 && <p className="text-xs text-slate-muted">Belum ada properti.</p>}
                  {properties.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={form.property_ids.includes(p.id)} onChange={() => handlePropertyToggle(p.id)} />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
              {formError && <p className="text-sm text-rose-600">{formError}</p>}
              <Button type="submit" className="w-full">Buat Akun Staff</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}