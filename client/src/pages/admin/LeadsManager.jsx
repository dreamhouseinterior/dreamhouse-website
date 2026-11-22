import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Search, Download, Pencil, Trash2, MessageCircle } from 'lucide-react'
import api from '../../api/axios.js'
import Modal from '../../components/common/Modal.jsx'
import { inr } from '../../utils/estimate.js'
import { STATUSES, STATUS_STYLE, SOURCE_LABEL } from '../../utils/leadMeta.js'

const UNIT_LABEL = { wardrobes: 'Wardrobes', kitchen: 'Kitchen', tvUnit: 'TV Unit', crockery: 'Crockery', study: 'Study', bed: 'Bed' }
const PROPERTY = ['Residential', 'Commercial', 'Multi-Unit Building']
const SIZES = ['1 BHK', '2 BHK', '3 BHK', '3+ BHK / Villa', 'Full Floor / Bulk Units']
const PURPOSE = ['Own Use', 'Rent Out', 'Renovate']
const TIERS = ['Economy', 'Standard', 'Premium', 'Luxury']
const ADD_SOURCES = ['phone', 'walk-in', 'referral', 'whatsapp', 'manual']

const EMPTY = {
  name: '', phone: '', email: '', location: '', propertyType: 'Residential', size: '2 BHK',
  purpose: 'Own Use', budgetTier: 'Standard', source: 'phone', status: 'New', notes: '', value: '',
}

// Keeps the current value in the list even if it is not one of the standard options
const opts = (list, current) => [...new Set([...list, current].filter(Boolean))]

function estimateText(e = {}) {
  if (e.min != null) return e.min === e.max ? inr(e.min) : `${inr(e.min)} – ${inr(e.max)}`
  if (e.furnished != null) return `Rent ${inr(e.furnished)} (+${inr(e.extra)}), payback ${e.payback} mo`
  return '—'
}

function unitsText(u = {}) {
  const parts = Object.entries(u).filter(([, n]) => n > 0).map(([k, n]) => `${UNIT_LABEL[k] || k} ×${n}`)
  return parts.length ? parts.join(', ') : '—'
}

function normPhone(p) {
  const d = p.replace(/\D/g, '')
  return d.length === 10 ? '+91' + d : p.trim()
}

function exportCsv(rows) {
  const head = ['Date', 'Name', 'Phone', 'Email', 'Location', 'Source', 'Property', 'Size', 'Purpose', 'Budget', 'Status', 'Notes']
  // leading quote stops spreadsheet apps from running cells that start with = + - @
  const esc = (v) => {
    let s = String(v ?? '')
    if (/^[=+\-@]/.test(s)) s = "'" + s
    return `"${s.replace(/"/g, '""')}"`
  }
  const lines = [
    head.map(esc).join(','),
    ...rows.map((l) =>
      [
        new Date(l.createdAt).toLocaleDateString('en-IN'), l.name, l.phone, l.email, l.location,
        SOURCE_LABEL[l.source] || l.source, l.propertyType, l.size, l.purpose, l.budgetTier, l.status, l.notes,
      ].map(esc).join(',')
    ),
  ]
  const url = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = 'leads.csv'
  a.click()
  URL.revokeObjectURL(url)
}

/* ====================== Main page ====================== */
export default function LeadsManager() {
  const [params, setParams] = useSearchParams()
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('All')
  const [source, setSource] = useState('All')
  const [q, setQ] = useState('')
  const [modal, setModal] = useState(null) // null | { lead: null (add) | object (edit) }
  const [toast, setToast] = useState('')

  const load = () => api.get('/leads').then((r) => setLeads(r.data))
  useEffect(() => { load() }, [])

  // The dashboard "Add Lead" button links here with ?add=1
  useEffect(() => {
    if (params.get('add')) {
      setModal({ lead: null })
      setParams({}, { replace: true })
    }
  }, [params, setParams])

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }

  async function changeStatus(id, s) {
    await api.patch(`/leads/${id}/status`, { status: s })
    load()
  }

  async function remove(l) {
    if (!confirm(`Delete lead "${l.name}"? This cannot be undone.`)) return
    await api.delete(`/leads/${l._id}`)
    flash('Lead deleted')
    load()
  }

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    return leads.filter((l) =>
      (status === 'All' || l.status === status) &&
      (source === 'All' || l.source === source) &&
      (!t || [l.name, l.phone, l.email, l.location].some((v) => (v || '').toLowerCase().includes(t)))
    )
  }, [leads, status, source, q])

  const sources = [...new Set(leads.map((l) => l.source))]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Leads & Site-Visit Requests</h1>
        <div className="flex gap-2">
          <button
            onClick={() => exportCsv(shown)}
            disabled={!shown.length}
            className="inline-flex items-center gap-2 border bg-white px-4 py-2.5 rounded-xl font-semibold text-slate-700 disabled:opacity-50"
          >
            <Download size={18} /> Export CSV
          </button>
          <button
            onClick={() => setModal({ lead: null })}
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-5 py-2.5 rounded-xl"
          >
            <Plus size={18} /> Add Lead
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email or location"
            className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 bg-white"
          />
        </div>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border border-slate-300 rounded-xl px-3 py-2.5 bg-white"
        >
          <option value="All">All sources</option>
          {sources.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s] || s}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm border ${status === s ? 'bg-teal-700 text-white border-teal-700' : 'bg-white'}`}
          >
            {s} ({s === 'All' ? leads.length : leads.filter((l) => l.status === s).length})
          </button>
        ))}
      </div>

      <div className="bg-white border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Contact</th>
              <th>Source</th>
              <th>Property</th>
              <th>Units</th>
              <th>Estimate</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right pr-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((l) => (
              <tr key={l._id} className="border-t align-top">
                <td className="p-3 min-w-[190px]">
                  <div className="font-semibold text-slate-800">{l.name}</div>
                  <a href={`tel:${l.phone}`} className="text-teal-700">{l.phone}</a>
                  {l.email && <div className="text-slate-500">{l.email}</div>}
                  {l.location && <div className="text-slate-500">{l.location}</div>}
                  {l.notes && (
                    <div className="mt-1 text-xs bg-amber-50 text-amber-800 rounded-lg px-2 py-1 max-w-[220px]">📝 {l.notes}</div>
                  )}
                </td>
                <td>{SOURCE_LABEL[l.source] || l.source}</td>
                <td className="max-w-[170px]">
                  {[l.propertyType, l.size, l.purpose, l.budgetTier].filter(Boolean).join(' · ') || '—'}
                </td>
                <td className="max-w-[160px]">{unitsText(l.units)}</td>
                <td className="max-w-[170px]">{estimateText(l.estimate)}</td>
                <td className="whitespace-nowrap">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <select
                    value={l.status}
                    onChange={(e) => changeStatus(l._id, e.target.value)}
                    className={`border rounded-full px-2.5 py-1.5 text-xs font-semibold ${STATUS_STYLE[l.status]}`}
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="text-right pr-3 whitespace-nowrap">
                  <a
                    href={`https://wa.me/${l.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block p-2 text-green-600"
                    title="WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </a>
                  <button onClick={() => setModal({ lead: l })} className="p-2" title="Edit"><Pencil size={18} /></button>
                  <button onClick={() => remove(l)} className="p-2 text-red-600" title="Delete"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr><td colSpan={8} className="p-8 text-center text-slate-500">No leads found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <LeadModal
          lead={modal.lead}
          onClose={() => setModal(null)}
          onSaved={(msg) => { setModal(null); flash(msg); load() }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[4000] bg-slate-800 text-white px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

/* ====================== Add / Edit modal ====================== */
// Field and inputCls are defined OUTSIDE LeadModal so inputs keep focus while typing.
const inputCls = 'w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600'

function Field({ label, children }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <div className="mt-1 font-normal">{children}</div>
    </label>
  )
}

function LeadModal({ lead, onClose, onSaved }) {
  const editing = !!lead
  const [f, setF] = useState(() =>
    editing
      ? {
          ...EMPTY,
          name: lead.name, phone: lead.phone, email: lead.email || '', location: lead.location || '',
          propertyType: lead.propertyType || '', size: lead.size || '', purpose: lead.purpose || '',
          budgetTier: lead.budgetTier || '', source: lead.source, status: lead.status, notes: lead.notes || '',
          value: lead.estimate?.min != null && lead.estimate.min === lead.estimate.max ? lead.estimate.min : '',
        }
      : EMPTY
  )
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    const payload = {
      name: f.name.trim(), phone: normPhone(f.phone), email: f.email.trim(), location: f.location.trim(),
      propertyType: f.propertyType, size: f.size, purpose: f.purpose, budgetTier: f.budgetTier,
      source: f.source, status: f.status, notes: f.notes.trim(),
    }
    if (f.value) payload.estimate = { min: Number(f.value), max: Number(f.value) }
    try {
      if (editing) await api.put(`/leads/${lead._id}`, payload)
      else await api.post('/leads/admin', payload)
      onSaved(editing ? 'Lead updated' : 'Lead added')
    } catch (er) {
      setErr(er.response?.data?.message || 'Could not save lead')
      setBusy(false)
    }
  }

  // Called as a plain function (not <Select />), so it does not create a new component each render
  const renderSelect = (k, list) => (
    <select className={inputCls} value={f[k]} onChange={(e) => set(k, e.target.value)}>
      {opts(list, f[k]).map((o) => <option key={o}>{o}</option>)}
    </select>
  )

  return (
    <Modal title={editing ? 'Edit lead' : 'Add lead'} onClose={onClose}>
      <form onSubmit={save} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name *">
            <input required className={inputCls} value={f.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field label="Phone *">
            <input required className={inputCls} placeholder="10 digits or full number" value={f.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputCls} value={f.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="Property location">
            <input className={inputCls} value={f.location} onChange={(e) => set('location', e.target.value)} />
          </Field>
          <Field label="Property type">{renderSelect('propertyType', PROPERTY)}</Field>
          <Field label="Size">{renderSelect('size', SIZES)}</Field>
          <Field label="Purpose">{renderSelect('purpose', PURPOSE)}</Field>
          <Field label="Budget tier">{renderSelect('budgetTier', TIERS)}</Field>
          <Field label="Lead source">
            <select className={inputCls} value={f.source} onChange={(e) => set('source', e.target.value)}>
              {opts(ADD_SOURCES, f.source).map((s) => <option key={s} value={s}>{SOURCE_LABEL[s] || s}</option>)}
            </select>
          </Field>
          <Field label="Status">{renderSelect('status', STATUSES)}</Field>
          <Field label="Estimated value (₹, optional)">
            <input type="number" min="0" className={inputCls} value={f.value} onChange={(e) => set('value', e.target.value)} />
          </Field>
        </div>
        <Field label="Notes">
          <textarea rows={3} className={inputCls} placeholder="Call summary, preferred time, requirements…" value={f.notes} onChange={(e) => set('notes', e.target.value)} />
        </Field>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="border px-5 py-2.5 rounded-xl">Cancel</button>
          <button
            disabled={busy}
            className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-2.5 rounded-xl disabled:opacity-60"
          >
            {busy ? 'Saving…' : editing ? 'Save changes' : 'Add lead'}
          </button>
        </div>
      </form>
    </Modal>
  )
}