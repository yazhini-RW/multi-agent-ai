import axios from 'axios'

const configuredApiRoot = process.env.NEXT_PUBLIC_API_ROOT
const renderApiHostname = process.env.NEXT_PUBLIC_API_HOST
const apiRoot = (
  configuredApiRoot ||
  (renderApiHostname ? `https://${renderApiHostname}` : 'http://127.0.0.1:8000')
).replace(/\/+$/, '')
const API_BASE = `${apiRoot}/api`
console.log('[api] API_BASE:', API_BASE)

export const sendMessage = async (question: string) => {
  const response = await axios.post(`${API_BASE}/chat?question=${encodeURIComponent(question)}`)
  return response.data
}

export const uploadPDF = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(`${API_BASE}/upload/pdf`, formData)
  return response.data
}

export const uploadCSV = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(`${API_BASE}/upload/csv`, formData)
  return response.data
}

export const getStats = async () => {
  const response = await axios.get(`${API_BASE}/analytics/stats`)
  return response.data
}

export const getQueryLogs = async () => {
  const response = await axios.get(`${API_BASE}/analytics/queries`)
  return response.data
}
