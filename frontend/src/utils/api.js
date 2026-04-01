import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({ baseURL: BASE, timeout: 30000 })

export const detectPlate = async (file) => {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/detect', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return res.data
}

export const getHistory  = async () => (await client.get('/history')).data
export const clearHistory = async () => (await client.delete('/history')).data
export const getHealth   = async () => (await client.get('/health')).data
