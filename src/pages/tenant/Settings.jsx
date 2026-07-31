import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { updateProfile, changePassword } from '../../api/auth'

export default function Settings() {
  const { user, setUser } = useAuthStore()

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    emergency_contact_name: user?.tenant?.emergency_contact_name || '',
    emergency_contact_phone: user?.tenant?.emergency_contact_phone || '',
    occupation: user?.tenant?.occupation || '',
  })
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')

  const [passwordForm, setPasswordForm] = useState({
    current_password: '', new_password: '', new_password_confirmation: '',
  })
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setProfileMessage('')
    try {
      const updated = await updateProfile(profileForm)
      setUser(updated)
      setProfileMessage('Profil berhasil diperbarui.')
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Gagal memperbarui profil')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordMessage('')
    try {
      await changePassword(passwordForm)
      setPasswordMessage('Password berhasil diubah. Gunakan password baru saat login berikutnya.')
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      const errors = err.response?.data?.errors
      setPasswordError(errors ? Object.values(errors).flat().join(', ') : (err.response?.data?.message || 'Gagal mengubah password'))
    }
  }

  const inputClass = "w-full px-3 py-2 border border-slate-muted/30 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brass"

  return (
    <div className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-semibold text-ink">Pengaturan Akun</h1>

      <div className="bg-white rounded-lg border border-slate-muted/15 p-4">
        <h2 className="text-sm font-medium mb-3">Data Diri</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-2">
          <div>
            <label className="block text-xs text-slate-muted mb-1">Nama Lengkap</label>
            <input className={inputClass} value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">No. HP</label>
            <input className={inputClass} value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Kontak Darurat (Nama)</label>
            <input className={inputClass} value={profileForm.emergency_contact_name}
              onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Kontak Darurat (No. HP)</label>
            <input className={inputClass} value={profileForm.emergency_contact_phone}
              onChange={(e) => setProfileForm({ ...profileForm, emergency_contact_phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Pekerjaan</label>
            <input className={inputClass} value={profileForm.occupation}
              onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })} />
          </div>
          <button type="submit" className="w-full bg-ledger text-white rounded-md py-2 text-sm font-medium">
            Simpan Perubahan
          </button>
          {profileMessage && <p className="text-sm text-[color:var(--color-status-success)]">{profileMessage}</p>}
          {profileError && <p className="text-sm text-[color:var(--color-status-danger)]">{profileError}</p>}
        </form>
      </div>

      <div className="bg-white rounded-lg border border-slate-muted/15 p-4">
        <h2 className="text-sm font-medium mb-3">Ganti Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-2">
          <div>
            <label className="block text-xs text-slate-muted mb-1">Password Saat Ini</label>
            <input type="password" className={inputClass} value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })} required />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Password Baru (min. 8 karakter)</label>
            <input type="password" className={inputClass} value={passwordForm.new_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })} required minLength={8} />
          </div>
          <div>
            <label className="block text-xs text-slate-muted mb-1">Ulangi Password Baru</label>
            <input type="password" className={inputClass} value={passwordForm.new_password_confirmation}
              onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })} required minLength={8} />
          </div>
          <button type="submit" className="w-full bg-ledger text-white rounded-md py-2 text-sm font-medium">
            Ubah Password
          </button>
          {passwordMessage && <p className="text-sm text-[color:var(--color-status-success)]">{passwordMessage}</p>}
          {passwordError && <p className="text-sm text-[color:var(--color-status-danger)]">{passwordError}</p>}
        </form>
      </div>
    </div>
  )
}