import { Routes, Route } from 'react-router-dom'
import Home from './pages/public/Home.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'
import ProjectsManager from './pages/admin/ProjectsManager.jsx'
import ImagesManager from './pages/admin/ImagesManager.jsx'
import LeadsManager from './pages/admin/LeadsManager.jsx'
import { ADMIN_BASE } from './utils/config.js'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Admin only exists at the secret ADMIN_BASE path */}
      <Route path={`${ADMIN_BASE}/login`} element={<Login />} />
      <Route path={ADMIN_BASE} element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<LeadsManager />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="images" element={<ImagesManager />} />
      </Route>

      {/* Any other URL, including /admin, shows the public site */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}