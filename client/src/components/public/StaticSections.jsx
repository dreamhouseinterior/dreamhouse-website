import { useEffect, useState } from 'react'
import { Plus, Search, MessageCircle, Phone, Mail, Check, Star, Quote, ArrowUp, Ruler, Box, Factory, KeyRound, Globe } from 'lucide-react'
import { BRAND } from '../../utils/brand.js'
import { Reveal } from '../common/Reveal.jsx'
import Logo from '../common/Logo.jsx'

/* ---------------- Packages ---------------- */
const PACKAGES = [
  ['Rental-Ready', 'Durable, low-maintenance fit-out for rental flats', 'Bulk discounts', ['Moisture-resistant woodwork', 'Basic kitchen & wardrobes', 'Paint & lighting'], false],
  ['Essential', 'Core modular kitchen, wardrobes and painting', 'Best for first homes', ['Modular kitchen', 'Wardrobes & TV unit', 'Standard painting'], false],
  ['Premium', 'Branded hardware, false ceiling and designer finishes', 'Most popular', ['Branded hardware', 'False ceiling & lighting', '3D walkthrough'], true],
  ['Luxury', 'Bespoke design, premium materials and full 3D walkthrough', 'Villas & large homes', ['Custom design', 'Premium materials', 'Dedicated project manager'], false],
]

export function Packages() {
  return (
    <section id="packages" className="py-24 mesh-light">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold tracking-widest text-teal-700">PACKAGES</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-800">Pick the package that fits your goal</h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {PACKAGES.map(([n, d, tag, feats, hot], i) => (
            <Reveal key={n} delay={i * 100}>
              <div className={`h-full rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${hot ? 'bg-slate-800 text-white border-slate-800 lg:scale-105 shadow-xl' : 'bg-white'}`}>
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${hot ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-700'}`}>{tag}</span>
                <h3 className="mt-4 text-xl font-bold">{n}</h3>
                <p className={`mt-2 text-sm ${hot ? 'text-slate-300' : 'text-slate-600'}`}>{d}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {feats.map((f) => (
                    <li key={f} className="flex items-center gap-2"><Check size={16} className={hot ? 'text-amber-400' : 'text-teal-700'} />{f}</li>
                  ))}
                </ul>
                <a href="#estimate" className={`inline-block mt-6 font-semibold text-sm ${hot ? 'text-amber-400' : 'text-teal-700'}`}>Get estimate →</a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Process ---------------- */
const STEPS = [
  [Ruler, 'Consult & Measure', 'Free site visit, requirement discussion and measurement.'],
  [Box, 'Design & 3D Sign-off', '3D walkthrough, material selection and locked BOQ.'],
  [Factory, 'Production & Install', 'Precision modular manufacturing and dust-free installation.'],
  [KeyRound, 'Handover', 'Quality check, snag fixes and on-time handover with warranty.'],
]

export function Process() {
  return (
    <section id="process" className="py-24 mesh-white">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="text-sm font-bold tracking-widest text-teal-700">HOW IT WORKS</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-800">Our 4-Step Process</h2>
        </Reveal>
        <Reveal className="relative mt-14">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-slate-200">
            <div className="line-draw h-full bg-teal-700" />
          </div>
          <div className="relative grid md:grid-cols-4 gap-8">
            {STEPS.map(([Icon, t, d], i) => (
              <div key={t} className="text-center group">
                <div className="relative w-16 h-16 mx-auto rounded-full bg-teal-700 text-white flex items-center justify-center ring-8 ring-white transition-transform duration-300 group-hover:scale-110">
                  <Icon size={26} />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-bold text-slate-800">{t}</h3>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- Testimonials (auto-rotating carousel) ---------------- */
// PLACEHOLDER testimonials: replace with real client quotes before launch.
const TESTIMONIALS = [
  ['Rajesh K.', 'Villa owner, Indiranagar', 'Handover was on time and the price never changed after sign-off.'],
  ['Meera S.', 'Landlord, HSR Layout', 'Our flats rent faster now and tenants stay longer.'],
  ['Arun P.', 'NRI owner', 'Weekly video updates made it easy to manage from abroad.'],
]

export function Testimonials() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [paused])

  const [n, r, q] = TESTIMONIALS[i]

  return (
    <section id="testimonials" className="py-24 mesh-light">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <Reveal>
          <span className="text-sm font-bold tracking-widest text-teal-700">TESTIMONIALS</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-800">What Owners Say</h2>
        </Reveal>
        <Reveal delay={150}>
          <div className="mt-10 bg-white border rounded-3xl p-8 md:p-12 shadow-sm relative"
            onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            <Quote className="absolute top-6 left-6 text-teal-100" size={48} />
            <div key={i} className="animate-fade relative">
              <div className="flex justify-center gap-1 text-amber-500">
                {[...Array(5)].map((_, k) => <Star key={k} size={18} fill="currentColor" />)}
              </div>
              <p className="mt-5 text-xl md:text-2xl text-slate-700 leading-relaxed">“{q}”</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="w-11 h-11 rounded-full bg-teal-700 text-white font-bold flex items-center justify-center">{n.charAt(0)}</span>
                <div className="text-left">
                  <div className="font-semibold text-slate-800">{n}</div>
                  <div className="text-sm text-slate-500">{r}</div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-2">
              {TESTIMONIALS.map((_, k) => (
                <button key={k} onClick={() => setI(k)} aria-label={`Testimonial ${k + 1}`}
                  className={`h-2 rounded-full transition-all ${k === i ? 'w-8 bg-teal-700' : 'w-2 bg-slate-300'}`} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  ['How long does a full home interior take?', 'Typically 45 days from design sign-off for a standard home, with a clear milestone schedule shared up front.'],
  ['Is the quote fixed?', 'Yes. The BOQ is locked after 3D sign-off, so there are no hidden escalations during execution.'],
  ['Can you work on a building that is still under construction?', 'Yes. Book a free site visit at plastering stage so we can plan electrical points and layouts before tiles and paint are finalised.'],
  ['Do you offer discounts for multiple flats?', 'Yes. Bulk multi-flat discounts apply for building owners and landlords.'],
  ['What materials and hardware do you use?', 'Branded BWP marine ply and branded hardware for premium packages. Rental-ready packages use durable, moisture-resistant materials.'],
  ['Can I track progress if I live abroad?', 'Yes. You get weekly WhatsApp and video updates with photos at every milestone, so you can manage the project remotely.'],
  ['What warranty do you provide?', `We provide a ${BRAND.metrics[3].end}${BRAND.metrics[3].suffix} warranty on modular woodwork. Our team will explain what is covered at the time of quote.`],
  ['How do I get an estimate?', 'Use the free estimate wizard on this page for an instant range, or book a free site visit for an exact measured quote.'],
]

export function FAQ() {
  const [open, setOpen] = useState(FAQS[0][0])
  const [term, setTerm] = useState('')
  const list = FAQS.filter(([q, a]) => (q + a).toLowerCase().includes(term.toLowerCase()))

  return (
    <section id="faq" className="py-24 mesh-white">
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-10">
        <Reveal dir="left" className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <span className="text-sm font-bold tracking-widest text-teal-700">FAQ</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-slate-800">Questions owners ask us</h2>
            <p className="mt-3 text-slate-600">Quick answers about timelines, pricing and how we work with building owners.</p>

            <div className="relative mt-6">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search questions…"
                className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600" />
            </div>

            <div className="mt-6 rounded-2xl bg-teal-700 text-white p-5">
              <div className="font-bold">Still have questions?</div>
              <p className="text-sm text-teal-100 mt-1">Talk to our team. We usually reply within a few hours.</p>
              <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-white text-teal-800 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-teal-50">
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-8 space-y-3">
          {list.map(([q, a], i) => {
            const on = open === q
            return (
              <Reveal key={q} delay={i * 60}>
                <div className={`rounded-2xl border bg-white transition-all ${on ? 'shadow-md border-teal-200' : 'hover:shadow-sm'}`}>
                  <button onClick={() => setOpen(on ? '' : q)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                    <span className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 font-bold flex items-center justify-center shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 font-semibold text-slate-800">{q}</span>
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${on ? 'rotate-45 bg-teal-700 text-white border-teal-700' : ''}`}>
                      <Plus size={16} />
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 sm:pl-[4.75rem] text-slate-600">{a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
          {!list.length && <p className="text-slate-500 py-8 text-center">No matching questions. Try another word or message us on WhatsApp.</p>}
        </div>
      </div>
    </section>
  )
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const links = [['For Building Owners', '#owners'], ['Services', '#services'], ['Portfolio', '#portfolio'], ['Project Map', '#map'], ['Estimate', '#estimate'], ['FAQ', '#faq']]
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <Reveal className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <Logo size={44} dark />
          <p className="mt-3 text-sm max-w-sm">{BRAND.tagline}</p>
          <a href="#estimate" className="inline-block mt-5 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition">Get Free Estimate</a>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">Quick Links</div>
          <ul className="space-y-2 text-sm">
            {links.map(([l, h]) => <li key={h}><a href={h} className="hover:text-amber-400 transition">{l}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="font-semibold text-white mb-3">Contact</div>
          <div className="space-y-3 text-sm">
            <a href={`tel:${BRAND.phoneRaw}`} className="flex items-center gap-2 hover:text-amber-400"><Phone size={16} /> {BRAND.phone}</a>
            <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 hover:text-amber-400"><Mail size={16} /> {BRAND.email}</a>
            <a href={BRAND.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-amber-400"><Globe size={16} /> dreamhouseinterior.com</a>
          </div>
        </div>
      </Reveal>
      <div className="max-w-6xl mx-auto px-4 mt-12 pt-6 border-t border-slate-700 text-sm">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </div>
    </footer>
  )
}

/* ---------------- Floating WhatsApp + back-to-top ---------------- */
export function WhatsAppFloat() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <div className="fixed bottom-5 right-5 z-[1500] flex flex-col items-center gap-3">
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
        className={`bg-slate-800 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ArrowUp size={20} />
      </button>
      <a href={`https://wa.me/${BRAND.whatsapp}?text=Hi%2C%20I%20want%20an%20interior%20quote`}
        target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg">
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ring" />
        <MessageCircle className="relative" />
      </a>
    </div>
  )
}