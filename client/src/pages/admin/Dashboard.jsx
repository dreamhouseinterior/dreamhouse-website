import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserPlus, CalendarCheck, CheckCircle2, MapPin, Images, Plus } from 'lucide-react'
import api from '../../api/axios.js'
import { ADMIN_BASE } from '../../utils/config.js'
import { STATUSES, STATUS_STYLE, SOURCE_LABEL } from '../../utils/leadMeta.js'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([api.get('/leads'), api.get('/projects/all'), api.get('/images')])
      .then(([l, p, i]) => setData({ leads: l.data, projects: p.data, images: i.data }))
      .catch(() => setData({ leads: [], projects: [], images: [] }))
  }, [])

  if (!data) return <p className="text-slate-500">Loading…</p>
  const { leads, projects, images } = data
  const count = (s) => leads.filter((l) => l.status === s).length

  const cards = [
    [Users, 'Total leads', leads.length, 'bg-teal-50 text-teal-700'],
    [UserPlus, 'New leads', count('New'), 'bg-blue-50 text-blue-700'],
    [CalendarCheck, 'Site visits booked', count('Site Visit Booked'), 'bg-amber-50 text-amber-700'],
    [CheckCircle2, 'Closed', count('Closed'), 'bg-emerald-50 text-emerald-700'],
    [MapPin, 'Projects on map', projects.filter((p) => p.visible).length, 'bg-violet-50 text-violet-700'],
    [Images, 'Gallery images', images.length, 'bg-rose-50 text-rose-700'],
  ]

  const bySource = Object.entries(
    leads.reduce((a, l) => ({ ...a, [l.source]: (a[l.source] || 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1])
  const maxSource = Math.max(1, ...bySource.map(([, n]) => n))

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of your leads and website content.</p>
        </div>
        <Link to={`${ADMIN_BASE}/leads?add=1`} className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-5 py-2.5 rounded-xl">
          <Plus size={18} /> Add Lead
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(([Icon, label, n, style]) => (
          <div key={label} className="bg-white border rounded-2xl p-4">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${style}`}><Icon size={20} /></span>
            <div className="mt-3 text-3xl font-bold text-slate-800">{n}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="font-semibold text-slate-800">Recent leads</h2>
            <Link to={`${ADMIN_BASE}/leads`} className="text-sm text-teal-700 font-semibold">View all →</Link>
          </div>
          <ul className="divide-y">
            {leads.slice(0, 6).map((l) => (
              <li key={l._id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{l.name}</div>
                  <div className="text-sm text-slate-500 truncate">
                    {l.phone} · {SOURCE_LABEL[l.source] || l.source} · {new Date(l.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-semibold border rounded-full px-2.5 py-1 ${STATUS_STYLE[l.status]}`}>{l.status}</span>
              </li>
            ))}
            {!leads.length && <li className="px-5 py-8 text-center text-slate-500">No leads yet. Add one with the button above.</li>}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold text-slate-800">Leads by source</h2>
            <div className="mt-4 space-y-3">
              {bySource.map(([s, n]) => (
                <div key={s}>
                  <div className="flex justify-between text-sm"><span>{SOURCE_LABEL[s] || s}</span><span className="font-semibold">{n}</span></div>
                  <div className="h-2 bg-slate-100 rounded-full mt-1">
                    <div className="h-full bg-teal-700 rounded-full" style={{ width: `${(n / maxSource) * 100}%` }} />
                  </div>
                </div>
              ))}
              {!bySource.length && <p className="text-sm text-slate-500">No data yet.</p>}
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-5">
            <h2 className="font-semibold text-slate-800">Pipeline</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <span key={s} className={`text-xs font-semibold border rounded-full px-3 py-1.5 ${STATUS_STYLE[s]}`}>{s}: {count(s)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}