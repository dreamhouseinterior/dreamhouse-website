import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { MapPin, Images, Users, LogOut, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

const NAV = [
  ['/admin/projects', 'Projects & Map', MapPin],
  ['/admin/images', 'Images', Images],
  ['/admin/leads', 'Leads', Users],
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA]">
      <aside className="md:w-60 bg-slate-800 text-slate-200 p-4 flex md:flex-col gap-2 overflow-x-auto">
        <div className="hidden md:block text-white font-bold text-lg px-3 py-2">Admin Panel</div>
        {NAV.map(([to, label, Icon]) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap ${isActive ? 'bg-teal-700 text-white' : 'hover:bg-slate-700'}`}>
            <Icon size={18} /> {label}
          </NavLink>
        ))}
        <div className="md:mt-auto flex md:flex-col gap-2">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700 whitespace-nowrap">
            <Globe size={18} /> View Site
          </Link>
          <button onClick={() => { logout(); nav('/admin/login') }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-700 whitespace-nowrap">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}