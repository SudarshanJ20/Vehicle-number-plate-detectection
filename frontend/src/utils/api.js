const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export async function detectPlate(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(BASE + '/api/detect', { method: 'POST', body: form })
  if (!res.ok) throw new Error('API error: ' + res.status)
  return res.json()
}