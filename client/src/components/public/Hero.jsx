import { BRAND } from '../../utils/brand.js'

export default function Hero() {
  return (
    <section id="home" className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600')" }}
      />
      <div className="absolute inset-0 bg-slate-900/70" />
      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 text-white">
        <p className="text-amber-400 font-semibold mb-3">{BRAND.tagline}</p>
        <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">
          Interiors delivered on time, at a fixed price.
        </h1>
        <p className="mt-4 text-lg text-slate-200 max-w-xl">
          From bare-shell to move-in for homeowners, landlords and commercial building owners.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#estimate" className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl font-semibold">Quick Estimate</a>
          <a href="#site-visit" className="bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold">Book Free Site Visit</a>
        </div>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRAND.metrics.map((m) => (
            <div key={m.label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="text-2xl font-bold text-amber-400">{m.value}</div>
              <div className="text-sm text-slate-200">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}