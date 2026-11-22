import { useEffect, useState } from 'react'
import { Check, KeyRound, Building2, Briefcase, ArrowRight, Sparkles } from 'lucide-react'
import { Reveal } from '../common/Reveal.jsx'

const SEGMENTS = [
  {
    tab: 'Villa / House Owners', sub: 'Own use', icon: KeyRound, chip: 'Move-in ready in 45 days',
    title: 'New House & Villa Owners',
    blurb: 'Zero-stress turnkey execution from bare-shell to move-in, so you can focus on your life, not on site coordination.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000',
    stats: [['45 Days', 'Handover guarantee'], ['3D', 'Walkthrough first'], ['BWP', 'Marine ply & hardware']],
    points: ['Turnkey execution, bare-shell to move-in', '3D walkthroughs before production starts', 'Branded BWP marine ply and hardware', '45-day handover guarantee'],
  },
  {
    tab: 'Apartment / Multi-Unit', sub: 'Rent-out ready', icon: Building2, chip: 'Built to lift your rental yield',
    title: 'Multi-Unit & Apartment Building Owners',
    blurb: 'Durable, low-maintenance rental interiors designed to lift your monthly yield and attract premium tenants faster.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000',
    stats: [['25–30%', 'Higher rent*'], ['Bulk', 'Multi-flat discounts'], ['Low', 'Maintenance finishes']],
    points: ['Rental-ready packages built for durability', 'Designed to maximise monthly rental yield', 'Premium tenants and faster occupancy', 'Bulk multi-flat discounts'],
    note: '*Indicative. Actual uplift depends on location, unit and package.',
  },
  {
    tab: 'Commercial / Office', sub: 'Fit-outs', icon: Briefcase, chip: 'Bare-shell to fully fitted',
    title: 'Commercial & Office Building Owners',
    blurb: 'End-to-end warm-shell and bare-shell fit-outs, coordinated across trades and delivered to code.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000',
    stats: [['Bare / Warm', 'Shell fit-outs'], ['MEP', 'Electrical & HVAC'], ['Fire-norm', 'Compliant']],
    points: ['Workstations and false ceilings', 'Electrical and HVAC coordination', 'Fire-norm-compliant modular execution', 'Single-point project accountability'],
  },
]

export default function OwnerSegments() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % SEGMENTS.length), 8000)
    return () => clearInterval(t)
  }, [paused])

  const s = SEGMENTS[i]

  return (
    <section id="owners" className="relative overflow-hidden py-24 mesh-dark text-white">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -left-24 w-96 h-96 rounded-full bg-amber-400/15 blur-3xl animate-blob" />

      <div className="relative max-w-7xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm font-semibold text-amber-300">
            <Sparkles size={14} /> FOR PROPERTY OWNERS
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">Interiors built around <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-teal-300">how you own</span> your property</h2>
          <p className="mt-4 text-slate-300">Live in it, rent it out or run a business from it. Tap an option to see what we do for you.</p>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-12 gap-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0">
            {SEGMENTS.map((x, idx) => {
              const Icon = x.icon
              const on = i === idx
              return (
                <button key={x.tab} onClick={() => { setI(idx); setPaused(true) }}
                  className={`relative overflow-hidden flex-1 lg:flex-none min-w-[230px] text-left flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${on ? 'bg-linear-to-r from-teal-500 to-emerald-500 text-white shadow-xl shadow-teal-500/30 lg:translate-x-3' : 'glass hover:bg-white/20'}`}>
                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${on ? 'bg-white/25' : 'bg-white/10 text-teal-300'}`}><Icon size={22} /></span>
                  <span>
                    <span className="block font-bold">{x.tab}</span>
                    <span className={`block text-sm ${on ? 'text-teal-50' : 'text-slate-300'}`}>{x.sub}</span>
                  </span>
                  {on && !paused && (
                    <span key={`${i}-${paused}`} className="absolute bottom-0 left-0 h-1 bg-amber-300 animate-fill" style={{ animationDuration: '8s' }} />
                  )}
                </button>
              )
            })}
          </div>

          <div key={i} className="lg:col-span-8 glass rounded-3xl overflow-hidden animate-fade">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 relative min-h-64">
                <img src={s.image} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 right-4 glass rounded-xl px-3 py-2 text-sm font-semibold flex items-center gap-2 animate-float">
                  <Sparkles size={15} className="text-amber-300 shrink-0" /> {s.chip}
                </span>
              </div>

              <div className="md:col-span-3 p-6 md:p-8">
                <h3 className="text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-slate-300">{s.blurb}</p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {s.stats.map(([v, l]) => (
                    <div key={l} className="rounded-xl bg-white/10 border border-white/15 p-3">
                      <div className="font-bold text-amber-300 leading-tight">{v}</div>
                      <div className="text-xs text-slate-300 mt-1">{l}</div>
                    </div>
                  ))}
                </div>

                <ul className="mt-5 space-y-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-slate-100">
                      <span className="mt-0.5 w-5 h-5 rounded-full bg-teal-400/25 text-teal-300 flex items-center justify-center shrink-0"><Check size={13} /></span>
                      {p}
                    </li>
                  ))}
                </ul>
                {s.note && <p className="mt-3 text-xs text-slate-400">{s.note}</p>}

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#estimate" className="group shine-on-hover inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition">
                    Get a Quote <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </a>
                  <a href="#roi" className="px-5 py-2.5 rounded-xl glass font-semibold hover:bg-white/20 transition">Calculate ROI</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}