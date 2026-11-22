import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/public/Home.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import ProjectsManager from './pages/admin/ProjectsManager.jsx'
import ImagesManager from './pages/admin/ImagesManager.jsx'
import LeadsManager from './pages/admin/LeadsManager.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="projects" replace />} />
        <Route path="projects" element={<ProjectsManager />} />
        <Route path="images" element={<ImagesManager />} />
        <Route path="leads" element={<LeadsManager />} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  )
}