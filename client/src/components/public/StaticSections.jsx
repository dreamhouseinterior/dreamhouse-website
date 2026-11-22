import { useState } from 'react'
import { ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react'
import { BRAND } from '../../utils/brand.js'

const PACKAGES = [
  ['Rental-Ready', 'Durable, low-maintenance fit-out for rental flats', 'Bulk discounts'],
  ['Essential', 'Core modular kitchen, wardrobes and painting', 'Best for first homes'],
  ['Premium', 'Branded hardware, false ceiling and designer finishes', 'Most popular'],
  ['Luxury', 'Bespoke design, premium materials and full 3D walkthrough', 'Villas & large homes'],
]
export function Packages() {
  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Packages</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PACKAGES.map(([n, d, tag]) => (
            <div key={n} className="bg-white border rounded-2xl p-6">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">{tag}</span>
              <h3 className="mt-3 text-xl font-bold text-slate-800">{n}</h3>
              <p className="mt-2 text-sm text-slate-600">{d}</p>
              <a href="#estimate" className="inline-block mt-5 text-teal-700 font-semibold text-sm">Get estimate →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  ['Consult & Measure', 'Free site visit, requirement discussion and measurement.'],
  ['Design & 3D Sign-off', '3D walkthrough, material selection and locked BOQ.'],
  ['Factory Production & Install', 'Precision modular manufacturing and dust-free installation.'],
  ['Handover', 'Quality check, snag fixes and on-time handover with warranty.'],
]
export function Process() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Our 4-Step Process</h2>
        <div className="mt-10 grid md:grid-cols-4 gap-5">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-teal-700 text-white font-bold flex items-center justify-center">{i + 1}</div>
              <h3 className="mt-3 font-bold text-slate-800">{t}</h3>
              <p className="mt-1 text-sm text-slate-600">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TESTIMONIALS = [
  ['Rajesh K.', 'Villa owner, Indiranagar', 'Handover was on time and the price never changed after sign-off.'],
  ['Meera S.', 'Landlord, HSR Layout', 'Our flats rent faster now and tenants stay longer.'],
  ['Arun P.', 'NRI owner', 'Weekly video updates made it easy to manage from abroad.'],
]
export function Testimonials() {
  return (
    <section className="py-20 bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">What Owners Say</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(([n, r, q]) => (
            <div key={n} className="bg-white border rounded-2xl p-6">
              <p className="text-slate-700">“{q}”</p>
              <div className="mt-4 font-semibold text-slate-800">{n}</div>
              <div className="text-sm text-slate-500">{r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FAQS = [
  ['How long does a full home interior take?', 'Typically 45 days from design sign-off for a standard home, with a clear milestone schedule.'],
  ['Is the quote fixed?', 'Yes. The BOQ is locked after 3D sign-off, so there are no hidden escalations.'],
  ['Can you work on a building that is still under construction?', 'Yes. Book a free site visit at plastering stage so we can plan electrical points and layouts before tiles and paint.'],
  ['Do you offer discounts for multiple flats?', 'Yes, bulk multi-flat discounts apply for building owners.'],
]
export function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map(([q, a], i) => (
            <div key={q} className="border rounded-xl">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-slate-800">
                {q}
                <ChevronDown className={`transition ${open === i ? 'rotate-180' : ''}`} size={20} />
              </button>
              {open === i && <p className="px-5 pb-4 text-slate-600">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-800 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <div className="text-xl font-bold text-white">{BRAND.name}</div>
          <p className="mt-2 text-sm">{BRAND.tagline}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><Phone size={16} /> {BRAND.phone}</div>
          <div className="flex items-center gap-2"><Mail size={16} /> {BRAND.email}</div>
        </div>
        <div className="text-sm">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</div>
      </div>
    </footer>
  )
}

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${BRAND.whatsapp}?text=Hi%2C%20I%20want%20an%20interior%20quote`}
      target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[1500] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
    >
      <MessageCircle />
    </a>
  )
}