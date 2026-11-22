import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import api from '../../api/axios.js'

// To use Google Maps later: replace <MapContainer> with the Google Maps JS API / @vis.gl/react-google-maps.
// The marker data (lat, lng, status, propertyType) stays exactly the same.

const STATUS_COLOR = { Completed: '#0F766E', Ongoing: '#F59E0B' }
const typeLetter = (t) => (t === 'Commercial' ? 'C' : t === 'Multi-Unit Building' ? 'B' : 'R')

// divIcon avoids Vite's broken default Leaflet marker images
function makeIcon(p) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${STATUS_COLOR[p.status] || '#64748b'};color:#fff;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"><span style="transform:rotate(45deg);font-weight:700;font-size:13px">${typeLetter(p.propertyType)}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
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
    <section id="map" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Our Projects Across Bengaluru</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm border ${filter === f ? 'bg-teal-700 text-white border-teal-700' : 'bg-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-5 text-sm text-slate-600">
          <span><b style={{ color: STATUS_COLOR.Completed }}>●</b> Completed</span>
          <span><b style={{ color: STATUS_COLOR.Ongoing }}>●</b> Ongoing</span>
          <span>R = Residential · B = Building · C = Commercial</span>
        </div>

        <div className="mt-6 h-[520px] rounded-2xl overflow-hidden border relative z-0">
          <MapContainer center={[12.9716, 77.5946]} zoom={11} scrollWheelZoom={false} className="h-full w-full">
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
                        {photos.map((ph) => (
                          <img key={ph._id} src={ph.url} alt="" className="w-20 h-16 object-cover rounded" />
                        ))}
                      </div>
                      <a href="#estimate" className="inline-block mt-2 bg-amber-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg">
                        Get Similar Quote
                      </a>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </section>
  )
}