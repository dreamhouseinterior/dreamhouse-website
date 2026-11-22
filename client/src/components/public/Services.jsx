import { Sofa, ChefHat, Layers, Lightbulb, PaintRoller, Building2, ArrowRight } from 'lucide-react'
import { Reveal } from '../common/Reveal.jsx'

const SERVICES = [
  [Sofa, 'Full-Home Turnkey Interiors', 'One team from design to handover.', ['Space planning & 3D design', 'Civil, electrical & plumbing', 'Furniture, décor & styling'], 'from-teal-500 to-emerald-500'],
  [ChefHat, 'Modular Kitchens', 'Factory-finished, built for Indian cooking.', ['Moisture-resistant carcass', 'Soft-close branded hardware', 'Chimney, hob & utility planning'], 'from-amber-500 to-orange-500'],
  [Layers, 'Wardrobes & Storage', 'Smart storage that fits your rooms.', ['Sliding & hinged wardrobes', 'Loft, drawers & accessories', 'TV, crockery & study units'], 'from-sky-500 to-indigo-500'],
  [Lightbulb, 'False Ceiling & Lighting', 'Layered ceilings and lighting plans.', ['Gypsum & POP ceilings', 'Cove, spot & profile lighting', 'Electrical point planning'], 'from-yellow-400 to-amber-500'],
  [PaintRoller, 'Painting & Finishing', 'Clean, durable wall and wood finishes.', ['Premium emulsion & texture', 'Polish, PU & laminate finishes', 'Final snag clean-up'], 'from-rose-500 to-pink-500'],
  [Building2, 'Rental & Commercial Fit-Outs', 'Bulk execution for owners and businesses.', ['Rental-ready multi-flat packages', 'Workstations & partitions', 'Fire-norm-compliant execution'], 'from-violet-500 to-fuchsia-500'],
]

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-24 mesh-light">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-block glass-light rounded-full px-4 py-1.5 text-sm font-bold tracking-widest text-teal-700">OUR SERVICES</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-slate-800">Everything under <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-500">one roof</span></h2>
          <p className="mt-4 text-slate-600">Civil, electrical, ceilings, painting and modular woodwork handled by a single accountable team.</p>
        </Reveal>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(([Icon, title, desc, items, grad], i) => (
            <Reveal key={title} delay={i * 90}>
              <div onMouseMove={onMove}
                className="spot group h-full rounded-3xl glass-light p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-900/10">
                <span className="absolute -top-3 right-4 text-8xl font-black text-slate-900/5 select-none">{String(i + 1).padStart(2, '0')}</span>

                <div className={`relative w-16 h-16 rounded-2xl bg-linear-to-br ${grad} text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}>
                  <Icon size={28} />
                </div>
                <h3 className="relative mt-6 text-xl font-bold text-slate-800">{title}</h3>
                <p className="relative mt-1 text-sm text-slate-600">{desc}</p>

                <ul className="relative mt-5 space-y-2 text-sm text-slate-700">
                  {items.map((x) => (
                    <li key={x} className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full bg-linear-to-br ${grad}`} />{x}
                    </li>
                  ))}
                </ul>

                <a href="#estimate" className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                  Get estimate <ArrowRight size={15} className="transition group-hover:translate-x-1.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}