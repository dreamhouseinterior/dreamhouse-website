import { useState } from 'react'
import api from '../../api/axios.js'
import { inr } from '../../utils/estimate.js'

const TYPES = ['1 BHK', '2 BHK', '3 BHK', 'Independent Floor', 'Multi-Unit Building', 'Commercial Space']

// uplift = extra rent as a fraction of unfurnished rent
// costMonths = interior cost expressed in months of unfurnished rent
// resaleFactor = resale value uplift as a multiple of interior cost
const PACKAGES = {
  'Rental-Ready Economy': { uplift: 0.15, costMonths: 8, resaleFactor: 1.0 },
  'Executive Standard': { uplift: 0.25, costMonths: 12, resaleFactor: 1.2 },
  Luxury: { uplift: 0.3, costMonths: 18, resaleFactor: 1.4 },
}

export default function RoiCalculator() {
  const [type, setType] = useState('2 BHK')
  const [rent, setRent] = useState(25000)
  const [pkg, setPkg] = useState('Executive Standard')
  const [contact, setContact] = useState({ name: '', phone: '' })
  const [msg, setMsg] = useState('')

  const p = PACKAGES[pkg]
  const rentNum = Number(rent) || 0
  const extra = Math.round(rentNum * p.uplift)
  const furnished = rentNum + extra
  const cost = rentNum * p.costMonths
  const payback = extra > 0 ? Math.round(cost / extra) : 0
  const resale = Math.round(cost * p.resaleFactor)

  async function lock(e) {
    e.preventDefault()
    try {
      await api.post('/leads', {
        name: contact.name,
        phone: '+91' + contact.phone,
        propertyType: type,
        budgetTier: pkg,
        purpose: 'Rent Out',
        estimate: { furnished, extra, payback, resale, cost },
        source: 'roi',
      })
      setMsg('Quote locked! We will contact you shortly.')
    } catch {
      setMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="roi" className="py-20 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Rental Yield & Property Value Calculator</h2>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-2xl p-6 space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Property type
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2.5 font-normal">
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Expected unfurnished rent (₹ / month)
              <input type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)}
                className="mt-1 w-full border rounded-xl px-3 py-2.5 font-normal" />
            </label>
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-2">Interior package</div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PACKAGES).map((k) => (
                  <button key={k} type="button" onClick={() => setPkg(k)}
                    className={`px-3 py-2 rounded-xl text-sm border ${pkg === k ? 'bg-teal-700 text-white border-teal-700' : 'bg-white'}`}>
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800 text-white rounded-2xl p-6">
            <dl className="space-y-4">
              <Row label="Estimated Furnished Rent" value={inr(furnished) + ' / mo'} />
              <Row label="Extra Monthly Rental Income" value={'+' + inr(extra)} gold />
              <Row label="Estimated Payback Period" value={payback + ' months'} />
              <Row label="Estimated Resale Value Uplift" value={inr(resale)} />
            </dl>
            <p className="text-xs text-slate-400 mt-4">Indicative figures only. Final numbers depend on site and scope.</p>

            <form onSubmit={lock} className="mt-5 space-y-2">
              <input required placeholder="Your name *" value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="w-full rounded-xl px-3 py-2.5 text-slate-800" />
              <input required placeholder="Phone (10 digits) *" inputMode="numeric" maxLength={10} value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, '') })}
                className="w-full rounded-xl px-3 py-2.5 text-slate-800" />
              <button className="w-full bg-amber-500 hover:bg-amber-600 font-semibold py-2.5 rounded-xl">
                Lock This Package Quote
              </button>
              {msg && <p className="text-sm text-amber-300">{msg}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value, gold }) {
  return (
    <div className="flex justify-between items-baseline border-b border-slate-700 pb-3">
      <dt className="text-slate-300 text-sm">{label}</dt>
      <dd className={`text-lg font-bold ${gold ? 'text-amber-400' : ''}`}>{value}</dd>
    </div>
  )
}