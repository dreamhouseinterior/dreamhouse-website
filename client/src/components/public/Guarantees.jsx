import { useState } from 'react'
import { IndianRupee, CalendarCheck, Factory, ShieldCheck, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'
import { Reveal } from '../common/Reveal.jsx'

const ITEMS = [
  [IndianRupee, 'Fixed-Price Contract', 'No hidden escalations. BOQ is locked after 3D sign-off.', 'Locked BOQ', 'from-amber-400 to-orange-500'],
  [CalendarCheck, 'On-Time Handover Guarantee', 'Clear milestones with weekly WhatsApp/video updates, ideal for NRI and busy owners.', 'Weekly updates', 'from-teal-400 to-emerald-500'],
  [Factory, '100% Factory-Finished Precision', 'Dust-free, faster installation without damaging new flooring or walls.', 'Dust-free', 'from-sky-400 to-indigo-500'],
  [ShieldCheck, 'Single-Point Accountability', 'Civil, electrical, false ceiling, painting and modular woodwork under one roof.', 'One team', 'from-violet-400 to-fuchsia-500'],
]

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}


export function Guarantees() {
  return (
    <section id="guarantees" className="relative overflow-hidden py-24 mesh-dark text-white">
      <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl animate-blob" />
      <div className="relative max-w-7xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-block glass rounded-full px-4 py-1.5 text-sm font-bold tracking-widest text-amber-300">OUR PROMISE</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold">Zero-Hassle <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-teal-300">Execution Guarantees</span></h2>
          <p className="mt-4 text-slate-300">The four things building owners worry about most, handled in writing.</p>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(([Icon, t, d, tag, grad], i) => (
            <Reveal key={t} delay={i * 100} dir="zoom">
              <div onMouseMove={onMove} className="spot spot-dark group h-full glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
                <div className="relative w-16 h-16">
                  <span className={`absolute inset-0 rounded-2xl bg-linear-to-br ${grad} opacity-40 blur-lg`} />
                  <span className={`relative w-16 h-16 rounded-2xl bg-linear-to-br ${grad} flex items-center justify-center shadow-lg animate-float`} style={{ animationDelay: `${i * 0.4}s` }}>
                    <Icon size={28} />
                  </span>
                </div>
                <span className="relative mt-5 inline-block text-xs font-bold tracking-wide bg-white/10 border border-white/15 rounded-full px-3 py-1 text-amber-300">{tag}</span>
                <h3 className="relative mt-3 text-lg font-bold">{t}</h3>
                <p className="relative mt-2 text-sm text-slate-300">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SiteVisitBanner() {
  const [f, setF] = useState({ name: '', phone: '', location: '' })
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setErr(''); setBusy(true)
    try {
      await api.post('/leads', { ...f, phone: '+91' + f.phone, source: 'site-visit' })
      setDone(true)
    } catch {
      setErr('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600'

  return (
    <section id="site-visit" className="relative overflow-hidden py-20 bg-linear-to-br from-teal-800 to-teal-600">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-amber-400/20 blur-3xl animate-blob" />
      <div className="relative max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center text-white">
        <Reveal dir="left">
          <span className="inline-block bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">FREE FOR BUILDING OWNERS</span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Free Site Visit & Bare-Shell Inspection</h2>
          <p className="mt-3 text-teal-50">
            Building near completion or at plastering stage? Book a free on-site measurement,
            floor-plan audit and electrical point check before tiles and paint are finalized.
          </p>
        </Reveal>
        <Reveal dir="right">
          {done ? (
            <div className="bg-white text-slate-800 rounded-2xl p-8 text-center animate-fade">
              <CheckCircle2 className="mx-auto text-teal-700" size={44} />
              <p className="mt-3 font-semibold">Thanks! We will call you shortly to confirm the visit.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-white rounded-2xl p-6 space-y-3 shadow-2xl">
              <input required placeholder="Full Name *" className={input} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
              <input required placeholder="Phone Number *" inputMode="numeric" maxLength={10} className={input}
                value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, '') })} />
              <input placeholder="Property Location" className={input} value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
              {err && <p className="text-red-600 text-sm">{err}</p>}
              <button disabled={busy} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition hover:-translate-y-0.5 disabled:opacity-60">
                {busy ? 'Booking…' : 'Book Free Site Visit'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}