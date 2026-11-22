import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import api from '../../api/axios.js'

const CATS = ['All', 'Full Home', 'Modular Kitchen', 'Living Room', 'Bedroom', 'Wardrobes', 'Commercial / Multi-Unit']

export default function Gallery() {
  const [images, setImages] = useState([])
  const [cat, setCat] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    api.get('/images', { params: { category: cat } }).then((r) => setImages(r.data)).catch(() => {})
  }, [cat])

  return (
    <section id="portfolio" className="py-24 mesh-light">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Our Portfolio</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-xl text-sm border ${cat === c ? 'bg-teal-700 text-white border-teal-700' : 'bg-white'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <button key={img._id} onClick={() => setLightbox(img)} className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition" />
              {img.caption && (
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 p-3 text-left text-white text-sm">
                  {img.caption}
                </span>
              )}
            </button>
          ))}
          {!images.length && <p className="col-span-full text-center text-slate-500">No images in this category yet.</p>}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[2000] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white" aria-label="Close"><X size={32} /></button>
          <img src={lightbox.url} alt={lightbox.caption} className="max-h-[85vh] max-w-full rounded-xl" />
        </div>
      )}
    </section>
  )
}