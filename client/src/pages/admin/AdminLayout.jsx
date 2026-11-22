import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, MapPin, Images, LogOut, Globe, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { ADMIN_BASE } from '../../utils/config.js'
import { BRAND } from '../../utils/brand.js'
import Logo from '../../components/common/Logo.jsx'

const NAV = [
  [ADMIN_BASE, 'Dashboard', LayoutDashboard, true],
  [`${ADMIN_BASE}/leads`, 'Leads', Users],
  [`${ADMIN_BASE}/projects`, 'Projects & Map', MapPin],
  [`${ADMIN_BASE}/images`, 'Images', Images],
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)

  const doLogout = () => { logout(); nav(`${ADMIN_BASE}/login`) }

  return (
    <div className="min-h-screen bg-[#F8F9FA] md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 h-14 bg-slate-800 text-white flex items-center justify-between px-4">
        <span className="font-bold">Admin Panel</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu"><Menu /></button>
      </div>
      {open && <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />}

      {/* Sidebar: full screen height, menu scrolls, footer stays at the bottom */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-64 shrink-0 md:self-start bg-slate-800 text-slate-200 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="shrink-0 h-16 px-5 flex items-center justify-between border-b border-slate-700">
          <div className="min-w-0 flex items-center gap-2">
            <Logo size={34} showName={false} />
            <div className="min-w-0">
              <div className="text-white font-bold truncate leading-tight">{BRAND.name}</div>
              <div className="text-xs text-slate-400">Admin Panel</div>
            </div>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${isActive ? 'bg-teal-700 text-white' : 'hover:bg-slate-700'}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 p-3 border-t border-slate-700 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-700">
            <Globe size={18} /> View Website
          </Link>
          <button onClick={doLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-600/20 text-red-300">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}