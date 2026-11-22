import { useEffect, useState } from 'react'
import api from '../../api/axios.js'
import { inr } from '../../utils/estimate.js'

const STATUSES = ['New', 'Site Visit Booked', 'Quote Sent', 'Closed']
const SOURCE_LABEL = { wizard: 'Estimate Wizard', roi: 'ROI Calculator', 'site-visit': 'Free Site Visit' }
const UNIT_LABEL = { wardrobes: 'Wardrobes', kitchen: 'Kitchen', tvUnit: 'TV Unit', crockery: 'Crockery', study: 'Study', bed: 'Bed' }

function estimateText(e = {}) {
  if (e.min != null) return `${inr(e.min)} – ${inr(e.max)}`
  if (e.furnished != null) return `Rent ${inr(e.furnished)} (+${inr(e.extra)}), payback ${e.payback} mo`
  return '—'
}

function unitsText(u = {}) {
  const parts = Object.entries(u).filter(([, n]) => n > 0).map(([k, n]) => `${UNIT_LABEL[k] || k} ×${n}`)
  return parts.length ? parts.join(', ') : '—'
}

export default function LeadsManager() {
  const [leads, setLeads] = useState([])
  const [filter, setFilter] = useState('All')

  const load = () => api.get('/leads').then((r) => setLeads(r.data))
  useEffect(() => { load() }, [])

  async function setStatus(id, status) {
    await api.patch(`/leads/${id}/status`, { status })
    load()
  }

  const shown = filter === 'All' ? leads : leads.filter((l) => l.status === filter)

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-800">Leads & Site-Visit Requests</h1>
      <div className="flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm border ${filter === s ? 'bg-teal-700 text-white border-teal-700' : 'bg-white'}`}>
            {s} {s === 'All' ? `(${leads.length})` : `(${leads.filter((l) => l.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Contact</th><th>Source</th><th>Property</th><th>Units</th><th>Estimate</th><th>Date</th><th className="pr-3">Status</th></tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l._id} className="border-t align-top">
                <td className="p-3">
                  <div className="font-semibold text-slate-800">{l.name}</div>
                  <a href={`tel:${l.phone}`} className="text-teal-700">{l.phone}</a>
                  {l.email && <div className="text-slate-500">{l.email}</div>}
                  {l.location && <div className="text-slate-500">{l.location}</div>}
                </td>
                <td>{SOURCE_LABEL[l.source] || l.source}</td>
                <td>{[l.propertyType, l.size, l.purpose, l.budgetTier].filter(Boolean).join(' · ') || '—'}</td>
                <td className="max-w-[180px]">{unitsText(l.units)}</td>
                <td>{estimateText(l.estimate)}</td>
                <td className="whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="pr-3">
                  <select value={l.status} onChange={(e) => setStatus(l._id, e.target.value)} className="border rounded-lg px-2 py-1.5 bg-white">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {!shown.length && <tr><td colSpan={7} className="p-6 text-center text-slate-500">No leads yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}