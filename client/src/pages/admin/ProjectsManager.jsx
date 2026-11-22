import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import api from '../../api/axios.js'

const TYPES = ['1 BHK', '2 BHK', '3 BHK', 'Villa / Independent House', 'Multi-Unit Building', 'Commercial']
const TIERS = ['Economy', 'Standard', 'Premium', 'Luxury']

// Quick-pick localities (lat, lng)
const LOCALITIES = {
  Indiranagar: [12.9784, 77.6408],
  Whitefield: [12.9698, 77.75],
  'HSR Layout': [12.9116, 77.6389],
  'JP Nagar': [12.9063, 77.5857],
  'Electronic City': [12.8452, 77.6602],
}

const EMPTY = {
  title: '', locality: '', propertyType: '2 BHK', status: 'Completed', budgetTier: 'Standard',
  description: '', lat: 12.9716, lng: 77.5946, visible: true,
}

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="background:#0F766E;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

function ClickCatcher({ onPick }) {
  useMapEvents({ click: (e) => onPick(e.latlng.lat, e.latlng.lng) })
  return null
}

// Moves the map only when `target` changes (search / quick-pick / edit), not on every click
function FlyTo({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], 14)
  }, [target, map])
  return null
}

export default function ProjectsManager() {
  const [list, setList] = useState([])
  const [f, setF] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [target, setTarget] = useState(null)
  const [msg, setMsg] = useState('')

  const load = () => api.get('/projects/all').then((r) => setList(r.data))
  useEffect(() => { load() }, [])

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const pick = (lat, lng) => setF((p) => ({ ...p, lat: +lat.toFixed(6), lng: +lng.toFixed(6) }))

  function quickPick(name) {
    const [lat, lng] = LOCALITIES[name]
    setF((p) => ({ ...p, locality: name, lat, lng }))
    setTarget({ lat, lng })
  }

  // Free OpenStreetMap geocoder (Nominatim). Fine for light admin use.
  // To use Google instead, swap this fetch for the Google Geocoding API.
  async function doSearch() {
    if (!search.trim()) return
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(search + ', Bengaluru')}`
      const res = await (await fetch(url)).json()
      if (!res.length) return setMsg('Location not found. Click on the map instead.')
      const lat = +res[0].lat, lng = +res[0].lon
      setF((p) => ({ ...p, lat, lng, locality: p.locality || search }))
      setTarget({ lat, lng })
      setMsg('')
    } catch {
      setMsg('Search failed. Click on the map instead.')
    }
  }

  async function submit(e) {
    e.preventDefault()
    const payload = { ...f, lat: Number(f.lat), lng: Number(f.lng) }
    try {
      if (editId) await api.put(`/projects/${editId}`, payload)
      else await api.post('/projects', payload)
      setMsg(editId ? 'Project updated' : 'Project added. Upload its photos in the Images tab.')
      setF(EMPTY)
      setEditId(null)
      load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Could not save project')
    }
  }

  function edit(p) {
    setEditId(p._id)
    setF({
      title: p.title, locality: p.locality, propertyType: p.propertyType, status: p.status,
      budgetTier: p.budgetTier, description: p.description || '', lat: p.lat, lng: p.lng, visible: p.visible,
    })
    setTarget({ lat: p.lat, lng: p.lng })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function toggle(p) {
    await api.put(`/projects/${p._id}`, { visible: !p.visible })
    load()
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"? Its photos stay in the gallery but are unlinked from the map.`)) return
    await api.delete(`/projects/${p._id}`)
    load()
  }

  const input = 'w-full border rounded-xl px-3 py-2.5 bg-white'

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Projects & Map Locations</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-2 gap-6 bg-white border rounded-2xl p-5">
        <div className="space-y-3">
          <h2 className="font-semibold">{editId ? 'Edit project' : 'Add project'}</h2>
          <input required placeholder="Project / Building name *" className={input} value={f.title} onChange={(e) => set('title', e.target.value)} />
          <input required placeholder="Locality *" className={input} value={f.locality} onChange={(e) => set('locality', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className={input} value={f.propertyType} onChange={(e) => set('propertyType', e.target.value)}>
              {TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className={input} value={f.status} onChange={(e) => set('status', e.target.value)}>
              <option>Completed</option><option>Ongoing</option>
            </select>
            <select className={input} value={f.budgetTier} onChange={(e) => set('budgetTier', e.target.value)}>
              {TIERS.map((t) => <option key={t}>{t}</option>)}
            </select>
            <label className="flex items-center gap-2 px-2">
              <input type="checkbox" checked={f.visible} onChange={(e) => set('visible', e.target.checked)} /> Visible on website
            </label>
          </div>
          <textarea rows={3} placeholder="Description" className={input} value={f.description} onChange={(e) => set('description', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="any" className={input} value={f.lat} onChange={(e) => set('lat', e.target.value)} aria-label="Latitude" />
            <input type="number" step="any" className={input} value={f.lng} onChange={(e) => set('lng', e.target.value)} aria-label="Longitude" />
          </div>
          <div className="flex gap-3">
            <button className="bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl">{editId ? 'Save changes' : 'Add project'}</button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setF(EMPTY) }} className="border px-5 py-2.5 rounded-xl">Cancel</button>
            )}
          </div>
          {msg && <p className="text-sm text-teal-700">{msg}</p>}
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Tag location (click the map to drop a pin)</h2>
          <div className="flex gap-2">
            <input placeholder="Search a locality, e.g. Koramangala" className={input} value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch() } }} />
            <button type="button" onClick={doSearch} className="bg-slate-800 text-white px-4 rounded-xl" aria-label="Search"><Search size={18} /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(LOCALITIES).map((n) => (
              <button type="button" key={n} onClick={() => quickPick(n)} className="text-xs border rounded-full px-3 py-1 hover:bg-slate-50">{n}</button>
            ))}
          </div>
          <div className="h-80 rounded-xl overflow-hidden border relative z-0">
            <MapContainer center={[12.9716, 77.5946]} zoom={11} className="h-full w-full">
              <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <ClickCatcher onPick={pick} />
              <FlyTo target={target} />
              <Marker position={[Number(f.lat) || 12.9716, Number(f.lng) || 77.5946]} icon={pinIcon} />
            </MapContainer>
          </div>
        </div>
      </form>

      <div className="bg-white border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Project</th><th>Locality</th><th>Type</th><th>Status</th><th>Visible</th><th className="text-right pr-3">Actions</th></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-3 font-semibold text-slate-800">{p.title}</td>
                <td>{p.locality}</td>
                <td>{p.propertyType}</td>
                <td>{p.status}</td>
                <td>{p.visible ? 'Yes' : 'Hidden'}</td>
                <td className="text-right pr-3 whitespace-nowrap">
                  <button onClick={() => toggle(p)} className="p-2" title="Toggle visibility">{p.visible ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                  <button onClick={() => edit(p)} className="p-2" title="Edit"><Pencil size={18} /></button>
                  <button onClick={() => remove(p)} className="p-2 text-red-600" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {!list.length && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No projects yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}