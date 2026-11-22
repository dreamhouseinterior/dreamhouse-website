import axios from 'axios'

// Vite proxies /api and /uploads to http://localhost:5000 (see vite.config.js).
// For production, set baseURL to your deployed API URL.
// const api = axios.create({ baseURL: '/api' })
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
    if (err.response?.status === 401 && path.startsWith('/admin') && !path.includes('login')) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

export default api