import { useState } from 'react'
import { Minus, Plus, CheckCircle2 } from 'lucide-react'
import api from '../../api/axios.js'
import { SIZES, TIERS, calcEstimate, inr } from '../../utils/estimate.js'

const UNIT_LABELS = {
  wardrobes: 'Wardrobes', kitchen: 'Kitchen', tvUnit: 'TV Unit',
  crockery: 'Crockery Unit', study: 'Study Unit', bed: 'Bed',
}
const INITIAL_UNITS = { wardrobes: 0, kitchen: 0, tvUnit: 0, crockery: 0, study: 0, bed: 0 }

function Choice({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={`px-4 py-2 rounded-xl text-sm border ${value === o ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-700'}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

export default function EstimateWizard() {
  const [step, setStep] = useState(1)
  const [d, setD] = useState({
    propertyType: 'Residential', size: '2 BHK', purpose: 'Own Use', tier: 'Standard',
    units: INITIAL_UNITS, ceilingPaint: true, bulk: false,
    name: '', email: '', phone: '', location: '',
  })
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }))
  const setUnit = (k, delta) =>
    setD((p) => ({ ...p, units: { ...p.units, [k]: Math.max(0, p.units[k] + delta) } }))

  const est = calcEstimate(d)
  const showBulk = d.propertyType === 'Multi-Unit Building' || d.size === 'Full Floor / Bulk Units'

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      await api.post('/leads', {
        name: d.name, email: d.email, phone: '+91' + d.phone, location: d.location,
        propertyType: d.propertyType, size: d.size, purpose: d.purpose, budgetTier: d.tier,
        units: d.units, estimate: est, source: 'wizard',
      })
      setDone(true)
    } catch {
      setErr('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="estimate" className="py-24 mesh-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Get Your Free Estimate</h2>

        <div className="mt-8 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`flex-1 h-2 rounded-full ${step >= n ? 'bg-teal-700' : 'bg-slate-200'}`} />
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-2">Step {step} of 3</p>

        <div className="mt-6 glass-light rounded-3xl p-6">
          {done ? (
            <div className="text-center py-8">
              <CheckCircle2 className="mx-auto text-teal-700" size={48} />
              <h3 className="mt-3 text-xl font-bold">Your estimate is on its way!</h3>
              <p className="mt-2 text-slate-600">Estimated range: {inr(est.min)} – {inr(est.max)}</p>
              <p className="text-sm text-slate-500 mt-1">Our team will call you shortly.</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-5">
              <div><div className="font-semibold mb-2">Property type</div>
                <Choice options={['Residential', 'Commercial', 'Multi-Unit Building']} value={d.propertyType} onChange={(v) => set('propertyType', v)} /></div>
              <div><div className="font-semibold mb-2">Size</div>
                <Choice options={SIZES} value={d.size} onChange={(v) => set('size', v)} /></div>
              <div><div className="font-semibold mb-2">Purpose</div>
                <Choice options={['Own Use', 'Rent Out', 'Renovate']} value={d.purpose} onChange={(v) => set('purpose', v)} /></div>
              <div><div className="font-semibold mb-2">Budget tier</div>
                <Choice options={TIERS} value={d.tier} onChange={(v) => set('tier', v)} /></div>
              <button onClick={() => setStep(2)} className="bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl">Next →</button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-3">
                {Object.entries(UNIT_LABELS).map(([k, label]) => (
                  <div key={k} className="bg-white border rounded-xl px-4 py-3 flex items-center justify-between">
                    <span>{label}</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setUnit(k, -1)} className="w-8 h-8 rounded-full border flex items-center justify-center"><Minus size={16} /></button>
                      <span className="w-5 text-center font-semibold">{d.units[k]}</span>
                      <button type="button" onClick={() => setUnit(k, 1)} className="w-8 h-8 rounded-full border flex items-center justify-center"><Plus size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={d.ceilingPaint} onChange={(e) => set('ceilingPaint', e.target.checked)} />
                False Ceiling & Painting
              </label>
              {showBulk && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={d.bulk} onChange={(e) => set('bulk', e.target.checked)} />
                  Bulk Multi-Flat Discount
                </label>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="border px-5 py-2.5 rounded-xl">← Back</button>
                <button onClick={() => setStep(3)} className="bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl">Next →</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="bg-white border rounded-xl p-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-800 mb-1">Your selection</div>
                {d.propertyType} · {d.size} · {d.purpose} · {d.tier}
                <div className="mt-2 text-lg font-bold text-teal-700">{inr(est.min)} – {inr(est.max)}</div>
              </div>
              <input required placeholder="Full Name *" className="w-full border rounded-xl px-4 py-2.5"
                value={d.name} onChange={(e) => set('name', e.target.value)} />
              <input type="email" placeholder="Email Address" className="w-full border rounded-xl px-4 py-2.5"
                value={d.email} onChange={(e) => set('email', e.target.value)} />
              <div className="flex">
                <span className="border border-r-0 rounded-l-xl px-3 flex items-center bg-white text-slate-500">+91</span>
                <input required placeholder="Phone Number *" inputMode="numeric" maxLength={10}
                  className="w-full border rounded-r-xl px-4 py-2.5"
                  value={d.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))} />
              </div>
              <input placeholder="Property Location / Project Name" className="w-full border rounded-xl px-4 py-2.5"
                value={d.location} onChange={(e) => set('location', e.target.value)} />
              {err && <p className="text-red-600 text-sm">{err}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="border px-5 py-2.5 rounded-xl">← Back</button>
                <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2.5 rounded-xl">Receive it Instantly!</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}