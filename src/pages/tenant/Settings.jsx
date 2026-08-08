import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { updateProfile, changePassword } from '../../api/auth'
import Topbar from '../../components/Topbar'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Settings() {
  const { user, setUser } = useAuthStore()

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileMessage('')
    setProfileLoading(true)
    try {
      const updated = await updateProfile(profileForm)
      setUser(updated)
      setProfileMessage('Profil berhasil diperbarui.')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Gagal memperbarui profil')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    setPasswordLoading(true)
    try {
      await changePassword(passwordForm)
      setPasswordMessage('Password berhasil diubah.')
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      const errors = err.response?.data?.errors
      setPasswordError(errors ? Object.values(errors).flat().join(', ') : (err.response?.data?.message || 'Gagal mengubah password'))
    } finally {
      setPasswordLoading(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
  const initials = (user?.name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div>
      <Topbar title="Pengaturan" breadcrumb={['KostHub', 'Pengaturan']} />

      <div className="p-8 max-w-2xl">
        <Card className="p-6 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <div className="font-display font-bold text-ink text-lg">{user?.name}</div>
            <div className="text-sm text-slate-muted">{user?.email}</div>
            <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 uppercase">
              {user?.role}
            </span>
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <User size={15} className="text-indigo-600" />
            </div>
            <h2 className="font-display text-sm font-bold text-ink">Data Diri</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">Nama Lengkap</label>
              <input className={inputClass} value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">No. HP</label>
              <input className={inputClass} value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
            </div>
            <Button type="submit" disabled={profileLoading}>{profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            {profileMessage && <p className="text-sm text-emerald-600">{profileMessage}</p>}
            {profileError && <p className="text-sm text-rose-600">{profileError}</p>}
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Lock size={15} className="text-indigo-600" />
            </div>
            <h2 className="font-display text-sm font-bold text-ink">Ganti Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">Password Saat Ini</label>
              <input type="password" className={inputClass} value={passwordForm.current_password} onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">Password Baru</label>
              <input type="password" className={inputClass} value={passwordForm.new_password} onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} required minLength={8} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-muted mb-1.5">Ulangi Password Baru</label>
              <input type="password" className={inputClass} value={passwordForm.new_password_confirmation} onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })} required minLength={8} />
            </div>
            <Button type="submit" disabled={passwordLoading}>{passwordLoading ? 'Menyimpan...' : 'Ubah Password'}</Button>
            {passwordMessage && <p className="text-sm text-emerald-600">{passwordMessage}</p>}
            {passwordError && <p className="text-sm text-rose-600">{passwordError}</p>}
          </form>
        </Card>
      </div>
    </div>
  )
}