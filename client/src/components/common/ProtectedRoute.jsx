import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ADMIN_BASE } from '../../utils/config.js'

export default function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to={`${ADMIN_BASE}/login`} replace />
}