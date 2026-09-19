/**
 * Bikin URL lengkap buat file yang disimpen di Laravel storage (foto, QRIS, dokumen, dst).
 * Pakai .env yang sama kayak api client, bukan hardcode localhost.
 *
 * Contoh: <img src={storageUrl(property.photo)} />
 */
export function storageUrl(path) {
  if (!path) return null
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'
  const origin = apiBase.replace(/\/api\/v1\/?$/, '')
  return `${origin}/storage/${path}`
}