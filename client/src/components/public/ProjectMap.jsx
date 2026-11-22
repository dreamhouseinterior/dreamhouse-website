import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'
import api from '../../api/axios.js'
import { Reveal } from '../common/Reveal.jsx'

// To use Google Maps later: replace <MapContainer> with the Google Maps JS API / @vis.gl/react-google-maps.
// The marker data (lat, lng, status, propertyType) stays exactly the same.

const STATUS_COLOR = { Completed: '#0F766E', Ongoing: '#F59E0B' }
const typeLetter = (t) => (t === 'Commercial' ? 'C' : t === 'Multi-Unit Building' ? 'B' : 'R')

function makeIcon(p) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${STATUS_COLOR[p.status] || '#64748b'};color:#fff;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"><span style="transform:rotate(45deg);font-weight:700;font-size:13px">${typeLetter(p.propertyType)}</span></div>`,
    iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -30],
  })
}

const FILTERS = ['All Locations', 'Completed', 'Ongoing', 'Residential', 'Commercial/Building']

export default function ProjectMap() {
  const [projects, setProjects] = useState([])
  const [images, setImages] = useState([])
  const [filter, setFilter] = useState('All Locations')

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {})
    api.get('/images').then((r) => setImages(r.data)).catch(() => {})
  }, [])

  const shown = useMemo(() => projects.filter((p) => {
    const commercial = p.propertyType === 'Commercial' || p.propertyType === 'Multi-Unit Building'
    if (filter === 'Completed' || filter === 'Ongoing') return p.status === filter
    if (filter === 'Residential') return !commercial
    if (filter === 'Commercial/Building') return commercial
    return true
  }), [projects, filter])

  return (
    <section id="map" className="py-24 mesh-white">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal className="text-center max-w-2xl mx-auto">
          <span className="inline-block glass-light rounded-full px-4 py-1.5 text-sm font-bold tracking-widest text-teal-700">OUR WORK</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-bold text-slate-800">Projects across <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-500">Bengaluru</span></h2>
        </Reveal>

        <Reveal className="mt-10">
          <div className="relative h-[620px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-teal-900/15 z-0">
            {/* Glass control bar floating over the map */}
            <div className="absolute top-4 left-4 right-4 z-[1000] glass-light rounded-2xl px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <span className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center"><MapPin size={16} /></span>
                  {shown.length} project{shown.length === 1 ? '' : 's'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((f) => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition ${filter === f ? 'bg-teal-700 text-white shadow' : 'bg-white/70 text-slate-700 hover:bg-white'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
                <span><b style={{ color: STATUS_COLOR.Completed }}>●</b> Completed</span>
                <span><b style={{ color: STATUS_COLOR.Ongoing }}>●</b> Ongoing</span>
                <span>R = Residential · B = Building · C = Commercial</span>
              </div>
            </div>

            <MapContainer center={[12.9716, 77.5946]} zoom={11} scrollWheelZoom={false} zoomControl={false} className="h-full w-full">
              <ZoomControl position="bottomright" />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {shown.map((p) => {
                const photos = images.filter((i) => i.projectId === p._id).slice(0, 3)
                return (
                  <Marker key={p._id} position={[p.lat, p.lng]} icon={makeIcon(p)}>
                    <Popup minWidth={240}>
                      <div className="space-y-1">
                        <div className="font-bold text-base">{p.title}</div>
                        <div className="text-slate-600">{p.locality} · {p.propertyType}</div>
                        <div className="text-slate-600">Status: {p.status}</div>
                        <div className="flex gap-1 mt-1">
                          {photos.map((ph) => <img key={ph._id} src={ph.url} alt="" className="w-20 h-16 object-cover rounded" />)}
                        </div>
                        <a href="#estimate" className="inline-block mt-2 bg-amber-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">Get Similar Quote</a>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          </div>
        </Reveal>
      </div>
    </section>
  )
}