import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { BRAND } from '../../utils/brand.js'

const LINKS = [
  ['Home', '#home'], ['For Building Owners', '#owners'], ['Services', '#services'],
  ['Portfolio', '#portfolio'], ['Project Map', '#map'], ['Estimate', '#estimate'],
  ['FAQ', '#faq'], ['Contact', '#contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold text-slate-800">
          {BRAND.name}
        </a>
        <nav className="hidden xl:flex gap-5 text-sm text-slate-600">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} className="hover:text-teal-700">{l}</a>
          ))}
        </nav>
        <div className="hidden xl:flex items-center gap-3">
          <a href="#estimate" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl">
            Get Free Estimate
          </a>
          <Link to="/admin/login" className="text-sm border border-slate-300 px-3 py-2 rounded-xl hover:bg-slate-50">
            Admin
          </Link>
        </div>
        <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="xl:hidden border-t bg-white px-4 py-3 flex flex-col gap-3">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="text-slate-700">{l}</a>
          ))}
          <a href="#estimate" onClick={() => setOpen(false)} className="bg-amber-500 text-white text-center font-semibold py-2 rounded-xl">
            Get Free Estimate
          </a>
          <Link to="/admin/login" className="text-center border py-2 rounded-xl">Admin</Link>
        </div>
      )}
    </header>
  )
}