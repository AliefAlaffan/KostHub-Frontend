import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from './Input'

/**
 * Sama kayak <Input> tapi khusus password, ada tombol mata buat show/hide.
 * Contoh: <PasswordInput label="Password" value={pwd} onChange={...} />
 */
export default function PasswordInput({ suffix, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 text-slate-400 hover:text-slate-600"
        style={{ top: props.label ? '34px' : '10px' }}
        tabIndex={-1}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}