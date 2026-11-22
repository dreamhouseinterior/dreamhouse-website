import { useState } from 'react'
import { IndianRupee, TrendingUp, Timer, Landmark } from 'lucide-react'
import api from '../../api/axios.js'
import { inr } from '../../utils/estimate.js'
import { Reveal, AnimatedNumber } from '../common/Reveal.jsx'

const TYPES = ['1 BHK', '2 BHK', '3 BHK', 'Independent Floor', 'Multi-Unit Building', 'Commercial Space']

// ILLUSTRATIVE assumptions: the client must replace these with numbers they can stand behind.
// uplift = extra rent as a fraction of unfurnished rent
// costMonths = interior cost expressed in months of unfurnished rent
// resaleFactor = resale value uplift as a multiple of interior cost
const PACKAGES = {
  'Rental-Ready Economy': { uplift: 0.15, costMonths: 8, resaleFactor: 1.0, desc: 'Durable essentials' },
  'Executive Standard': { uplift: 0.25, costMonths: 12, resaleFactor: 1.2, desc: 'Tenant-attracting finish' },
  Luxury: { uplift: 0.3, costMonths: 18, resaleFactor: 1.4, desc: 'Premium furnished look' },
}

const field = 'w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600'

export default function RoiCalculator() {
  const [type, setType] = useState('2 BHK')
  const [rent, setRent] = useState(25000)
  const [pkg, setPkg] = useState('Executive Standard')
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const p = PACKAGES[pkg]
  const rentNum = Number(rent) || 0
  const extra = Math.round(rentNum * p.uplift)
  const furnished = rentNum + extra
  const cost = rentNum * p.costMonths
  const payback = extra > 0 ? Math.round(cost / extra) : 0
  const resale = Math.round(cost * p.resaleFactor)

  async function lock(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await api.post('/leads', {
        name: contact.name, phone: '+91' + contact.phone,
        propertyType: type, budgetTier: pkg, purpose: 'Rent Out',
        estimate: { furnished, extra, payback, resale, cost }, source: 'roi',
      })
      setMsg('Quote locked! We will contact you shortly.')
    } catch {
      setMsg('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section id="roi" className="py-24 mesh-white">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold tracking-widest text-teal-700">OWNER CALCULATOR</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-800">Rental Yield & Property Value Calculator</h2>
          <p className="mt-3 text-slate-600">See how much extra rent a furnished interior can earn you and how fast it pays back.</p>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          <Reveal dir="left">
            <div className="glass-light rounded-3xl p-6 md:p-8 space-y-6 h-full">
              <label className="block text-sm font-semibold text-slate-700">Property type
                <select value={type} onChange={(e) => setType(e.target.value)} className={`${field} mt-1.5 font-normal`}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </label>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Expected unfurnished rent (₹ / month)</label>
                <input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} className={`${field} mt-1.5`} />
                <input type="range" min="5000" max="200000" step="1000" value={rentNum}
                  onChange={(e) => setRent(e.target.value)} className="w-full mt-3 accent-teal-700" aria-label="Rent slider" />
                <div className="flex justify-between text-xs text-slate-400"><span>₹5,000</span><span>₹2,00,000</span></div>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-700 mb-2">Interior package</div>
                <div className="grid gap-2">
                  {Object.entries(PACKAGES).map(([k, v]) => (
                    <button key={k} type="button" onClick={() => setPkg(k)}
                      className={`flex items-center justify-between text-left px-4 py-3 rounded-xl border transition ${pkg === k ? 'bg-teal-700 text-white border-teal-700 shadow-md' : 'bg-white hover:border-teal-300'}`}>
                      <span className="font-semibold">{k}</span>
                      <span className={`text-xs ${pkg === k ? 'text-teal-100' : 'text-slate-500'}`}>{v.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal dir="right">
            <div className="bg-slate-800 text-white rounded-3xl p-6 md:p-8 h-full">
              <dl className="space-y-4">
                <Row icon={IndianRupee} label="Estimated Furnished Rent" value={<><AnimatedNumber value={furnished} format={(n) => inr(Math.round(n))} /> / mo</>} />
                <Row icon={TrendingUp} label="Extra Monthly Rental Income" gold value={<>+<AnimatedNumber value={extra} format={(n) => inr(Math.round(n))} /></>} />
                <Row icon={Timer} label="Estimated Payback Period" value={<><AnimatedNumber value={payback} /> months</>} />
                <Row icon={Landmark} label="Estimated Resale Value Uplift" value={<AnimatedNumber value={resale} format={(n) => inr(Math.round(n))} />} />
              </dl>
              <p className="text-xs text-slate-400 mt-4">Indicative figures only. Final numbers depend on site and scope.</p>

              <form onSubmit={lock} className="mt-6 pt-6 border-t border-slate-600 space-y-3">
                <input required placeholder="Your name *" value={contact.name} className={field}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                <input required placeholder="Phone (10 digits) *" inputMode="numeric" maxLength={10} value={contact.phone} className={field}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, '') })} />
                <button disabled={busy} className="w-full bg-amber-500 hover:bg-amber-600 font-semibold py-3 rounded-xl transition hover:-translate-y-0.5 disabled:opacity-60">
                  Lock This Package Quote
                </button>
                {msg && <p className="text-sm text-amber-300">{msg}</p>}
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Row({ icon: Icon, label, value, gold }) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-600 pb-4">
      <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Icon size={20} className={gold ? 'text-amber-400' : 'text-teal-300'} /></span>
      <dt className="flex-1 text-slate-300 text-sm">{label}</dt>
      <dd className={`text-xl font-bold tabular-nums ${gold ? 'text-amber-400' : ''}`}>{value}</dd>
    </div>
  )
}