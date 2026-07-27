import { useEffect, useState } from 'react'
import { getContracts, renewContract, checkoutContract } from '../api/contracts'

const STATUS_LABEL = {
  active: 'Aktif', ending_soon: 'Akan Berakhir', ended: 'Berakhir', renewed: 'Diperpanjang',
}

export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [error, setError] = useState('')
  const [renewForm, setRenewForm] = useState({ id: null, start_date: '', end_date: '' })
  const [checkoutForm, setCheckoutForm] = useState({ id: null, checkout_date: '', room_condition_notes: '' })

  const load = () => getContracts().then(setContracts)
  useEffect(() => { load() }, [])

  const handleRenewSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await renewContract(renewForm.id, {
        start_date: renewForm.start_date,
        end_date: renewForm.end_date,
      })
      setRenewForm({ id: null, start_date: '', end_date: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperpanjang kontrak')
    }
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await checkoutContract(checkoutForm.id, {
        checkout_date: checkoutForm.checkout_date,
        room_condition_notes: checkoutForm.room_condition_notes,
      })
      setCheckoutForm({ id: null, checkout_date: '', room_condition_notes: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal proses check-out')
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>Kontrak Sewa</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
        <thead>
          <tr>
            <th>Penghuni</th><th>Kamar</th><th>Mulai</th><th>Selesai</th><th>Status</th><th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id}>
              <td>{c.tenant?.user?.name}</td>
              <td>{c.room?.room_number}</td>
              <td>{c.start_date}</td>
              <td>{c.end_date}</td>
              <td>{STATUS_LABEL[c.status]}</td>
              <td>
                {c.status === 'active' || c.status === 'ending_soon' ? (
                  <>
                    <button onClick={() => setRenewForm({ id: c.id, start_date: '', end_date: '' })}>
                      Perpanjang
                    </button>{' '}
                    <button onClick={() => setCheckoutForm({ id: c.id, checkout_date: '', room_condition_notes: '' })}>
                      Check-out
                    </button>
                  </>
                ) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {renewForm.id && (
        <form onSubmit={handleRenewSubmit} style={{ border: '1px solid #ccc', padding: 16, marginBottom: 16, maxWidth: 320 }}>
          <h3>Perpanjang Kontrak #{renewForm.id}</h3>
          <label>Mulai Periode Baru:</label>
          <input type="date" value={renewForm.start_date} onChange={(e) => setRenewForm({ ...renewForm, start_date: e.target.value })} required />
          <label>Selesai Periode Baru:</label>
          <input type="date" value={renewForm.end_date} onChange={(e) => setRenewForm({ ...renewForm, end_date: e.target.value })} required />
          <br /><br />
          <button type="submit">Simpan Perpanjangan</button>{' '}
          <button type="button" onClick={() => setRenewForm({ id: null, start_date: '', end_date: '' })}>Batal</button>
        </form>
      )}

      {checkoutForm.id && (
        <form onSubmit={handleCheckoutSubmit} style={{ border: '1px solid #ccc', padding: 16, maxWidth: 320 }}>
          <h3>Check-out Kontrak #{checkoutForm.id}</h3>
          <label>Tanggal Check-out:</label>
          <input type="date" value={checkoutForm.checkout_date} onChange={(e) => setCheckoutForm({ ...checkoutForm, checkout_date: e.target.value })} required />
          <label>Catatan Kondisi Kamar:</label>
          <textarea value={checkoutForm.room_condition_notes} onChange={(e) => setCheckoutForm({ ...checkoutForm, room_condition_notes: e.target.value })} />
          <br /><br />
          <button type="submit">Proses Check-out</button>{' '}
          <button type="button" onClick={() => setCheckoutForm({ id: null, checkout_date: '', room_condition_notes: '' })}>Batal</button>
        </form>
      )}
    </div>
  )
}