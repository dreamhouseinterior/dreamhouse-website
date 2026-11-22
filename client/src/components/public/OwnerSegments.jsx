import { useState } from 'react'
import { Check } from 'lucide-react'

const SEGMENTS = [
  {
    key: 'Villa / House Owners',
    title: 'New House / Villa Owners (Own Use)',
    points: [
      'Zero-stress turnkey execution from bare-shell to move-in',
      '3D walkthroughs before production starts',
      'Branded BWP marine ply and hardware',
      '45-day handover guarantee',
    ],
  },
  {
    key: 'Apartment / Multi-Unit',
    title: 'Multi-Unit / Apartment Building Owners (Rent-Out Ready)',
    points: [
      'Durable, low-maintenance rental interior packages',
      'Designed to lift monthly rent (up to 25–30% higher)',
      'Attract premium tenants faster',
      'Bulk multi-flat discounts',
    ],
  },
  {
    key: 'Commercial / Office',
    title: 'Commercial & Office Building Owners',
    points: [
      'End-to-end warm-shell / bare-shell fit-outs',
      'Workstations and false ceilings',
      'Electrical and HVAC coordination',
      'Fire-norm-compliant modular execution',
    ],
  },
]

export default function OwnerSegments() {
  const [i, setI] = useState(0)
  const s = SEGMENTS[i]
  return (
    <section id="owners" className="py-20 bg-[#F8F9FA]">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">For Building & Property Owners</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {SEGMENTS.map((x, idx) => (
            <button
              key={x.key}
              onClick={() => setI(idx)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
                i === idx ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {x.key}
            </button>
          ))}
        </div>
        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-8">
          <h3 className="text-xl font-bold text-slate-800">{s.title}</h3>
          <ul className="mt-5 grid md:grid-cols-2 gap-3">
            {s.points.map((p) => (
              <li key={p} className="flex gap-2 text-slate-600">
                <Check className="text-teal-700 shrink-0" size={20} /> {p}
              </li>
            ))}
          </ul>
          <a href="#estimate" className="inline-block mt-6 bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold">
            Get a Quote for This
          </a>
        </div>
      </div>
    </section>
  )
}