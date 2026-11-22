import { useState } from 'react'
import { IndianRupee, CalendarCheck, Factory, ShieldCheck } from 'lucide-react'
import api from '../../api/axios.js'

const ITEMS = [
  [IndianRupee, 'Fixed-Price Contract', 'No hidden escalations. BOQ is locked after 3D sign-off.'],
  [CalendarCheck, 'On-Time Handover Guarantee', 'Clear milestones with weekly WhatsApp/video updates, ideal for NRI and busy owners.'],
  [Factory, '100% Factory-Finished Precision', 'Dust-free, faster installation without damaging new flooring or walls.'],
  [ShieldCheck, 'Single-Point Accountability', 'Civil, electrical, false ceiling, painting and modular woodwork under one roof.'],
]

export function Guarantees() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Zero-Hassle Execution Guarantees</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ITEMS.map(([Icon, t, d]) => (
            <div key={t} className="rounded-2xl border p-6 bg-[#F8F9FA]">
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-bold text-slate-800">{t}</h3>
              <p className="mt-2 text-sm text-slate-600">{d}</p>
            </div>
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

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/leads', { ...f, phone: '+91' + f.phone, source: 'site-visit' })
      setDone(true)
    } catch {
      setErr('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="site-visit" className="py-16 bg-teal-700">
      <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center text-white">
        <div>
          <h2 className="text-3xl font-bold">Free Site Visit & Bare-Shell Inspection</h2>
          <p className="mt-3 text-teal-50">
            Building near completion or at plastering stage? Book a free on-site measurement,
            floor-plan audit and electrical point check before tiles and paint are finalized.
          </p>
        </div>
        {done ? (
          <div className="bg-white text-slate-800 rounded-2xl p-6 font-semibold">
            Thanks! We will call you shortly to confirm the visit.
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-2xl p-6 space-y-3">
            <input required placeholder="Full Name *" className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
              value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            <input required placeholder="Phone Number *" inputMode="numeric" maxLength={10}
              className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
              value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value.replace(/\D/g, '') })} />
            <input placeholder="Property Location" className="w-full border rounded-xl px-4 py-2.5 text-slate-800"
              value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
            {err && <p className="text-red-600 text-sm">{err}</p>}
            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl">
              Book Free Site Visit
            </button>
          </form>
        )}
      </div>
    </section>
  )
}