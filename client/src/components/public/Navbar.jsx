import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { BRAND } from '../../utils/brand.js'
import Logo from '../common/Logo.jsx'

const LINKS = [
  ['Home', '#home'], ['For Building Owners', '#owners'], ['Services', '#services'],
  ['Portfolio', '#portfolio'], ['Project Map', '#map'], ['Estimate', '#estimate'],
  ['FAQ', '#faq'], ['Contact', '#contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? (y / h) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    LINKS.forEach(([, h]) => {
      const el = document.getElementById(h.slice(1))
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b transition-shadow ${scrolled ? 'shadow-md border-transparent' : 'border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#home"><Logo size={40} /></a>

        <nav className="hidden xl:flex gap-1 text-sm">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h}
              className={`px-3 py-2 rounded-lg transition-colors ${active === h ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-600 hover:text-teal-700'}`}>
              {l}
            </a>
          ))}
        </nav>

        <a href="#estimate" className="hidden xl:inline-block bg-amber-500 hover:bg-amber-600 hover:-translate-y-0.5 transition text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm">
          Get Free Estimate
        </a>

        <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="xl:hidden border-t bg-white px-4 py-3 flex flex-col gap-1 animate-fade">
          {LINKS.map(([l, h]) => (
            <a key={h} href={h} onClick={() => setOpen(false)} className="text-slate-700 py-2">{l}</a>
          ))}
          <a href="#estimate" onClick={() => setOpen(false)} className="mt-2 bg-amber-500 text-white text-center font-semibold py-2.5 rounded-xl">
            Get Free Estimate
          </a>
        </div>
      )}

      <div className="h-0.5 bg-transparent">
        <div className="h-full bg-amber-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>
    </header>
  )
}