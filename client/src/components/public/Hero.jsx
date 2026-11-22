import { useEffect, useState } from 'react'
import { ArrowRight, CalendarCheck, ChevronDown, BadgeCheck } from 'lucide-react'
import { BRAND } from '../../utils/brand.js'
import { CountUp } from '../common/Reveal.jsx'

// Swap these with the client's own project photos for best results
const BG = [
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
]
const WORDS = ['Home', 'Villa', 'Rental Flats', 'Office']

export default function Hero() {
  const [bg, setBg] = useState(0)
  const [w, setW] = useState(0)

  useEffect(() => {
    const a = setInterval(() => setBg((i) => (i + 1) % BG.length), 6000)
    const b = setInterval(() => setW((i) => (i + 1) % WORDS.length), 2400)
    return () => { clearInterval(a); clearInterval(b) }
  }, [])

  return (
    <section id="home" className="relative overflow-hidden bg-slate-900">
      {BG.map((src, i) => (
        <div key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ${i === bg ? 'opacity-100 animate-kenburns' : 'opacity-0'}`}
          style={{ backgroundImage: `url('${src}')` }} />
      ))}
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/90 via-slate-900/70 to-slate-900/30" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl animate-blob" />

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 text-white grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <span className="animate-fade inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-amber-300 text-sm font-semibold px-4 py-1.5 rounded-full">
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ring" />
              <span className="relative w-2 h-2 rounded-full bg-amber-400" />
            </span>
            {BRAND.tagline}
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-tight animate-fade" style={{ animationDelay: '.15s' }}>
            Interiors for your{' '}
            <span key={WORDS[w]} className="animate-word inline-block text-amber-400">{WORDS[w]}</span>
            <br />delivered on time, at a fixed price.
          </h1>

          <p className="mt-5 text-lg text-slate-200 max-w-xl animate-fade" style={{ animationDelay: '.3s' }}>
            From bare-shell to move-in for homeowners, landlords and commercial building owners.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 animate-fade" style={{ animationDelay: '.45s' }}>
            <a href="#estimate" className="group inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5">
              Quick Estimate <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#site-visit" className="inline-flex items-center gap-2 bg-white text-slate-800 px-6 py-3.5 rounded-xl font-semibold transition hover:-translate-y-0.5">
              <CalendarCheck size={18} /> Book Free Site Visit
            </a>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-4">
          <div className="animate-float bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-xs ml-auto">
            <BadgeCheck className="text-amber-400" size={32} />
            <div className="mt-3 text-lg font-bold">Fixed-Price Contract</div>
            <p className="mt-1 text-sm text-slate-200">BOQ locked after 3D sign-off. No hidden escalations.</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRAND.metrics.map((m, i) => (
            <div key={m.label} className="animate-fade bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
              <div className="text-3xl font-bold text-amber-400"><CountUp end={m.end} suffix={m.suffix} /></div>
              <div className="text-sm text-slate-200">{m.label}</div>
            </div>
          ))}
        </div>
        <a href="#owners" aria-label="Scroll down" className="hidden md:flex justify-center mt-8 text-white/70 animate-bounce">
          <ChevronDown size={28} />
        </a>
      </div>
    </section>
  )
}

const TICKER = ['Modular Kitchens', 'Wardrobes', 'False Ceilings', 'Villa Interiors', 'Rental-Ready Flats',
  'Office Fit-Outs', '3D Walkthroughs', 'Turnkey Execution', 'Painting & Civil Work']

// Scrolling strip under the hero. Add <Ticker /> to Home.jsx (shown below).
export function Ticker() {
  const items = [...TICKER, ...TICKER]
  return (
    <div className="bg-teal-700 text-white overflow-hidden py-3">
      <div className="flex w-max animate-marquee">
        {items.map((t, i) => (
          <span key={i} className="mx-6 text-sm font-semibold tracking-wide whitespace-nowrap flex items-center gap-6">
            {t} <span className="text-amber-300">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}