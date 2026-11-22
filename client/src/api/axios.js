import axios from 'axios'
import { ADMIN_BASE } from '../utils/config.js'

// Locally, Vite proxies /api and /uploads. In production set VITE_API_URL (e.g. https://your-api.onrender.com/api)
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const path = window.location.pathname
    if (err.response?.status === 401 && path.startsWith(ADMIN_BASE) && !path.includes('login')) {
      localStorage.removeItem('token')
      window.location.href = `${ADMIN_BASE}/login`
    }
    return Promise.reject(err)
  }
)

export default api