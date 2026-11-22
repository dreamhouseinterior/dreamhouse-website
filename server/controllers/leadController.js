import Lead from '../models/Lead.js'

const PUBLIC_FIELDS = ['name', 'email', 'phone', 'location', 'propertyType', 'size', 'purpose', 'budgetTier', 'units', 'estimate']
const ADMIN_FIELDS = [...PUBLIC_FIELDS, 'notes', 'status', 'source']
const PUBLIC_SOURCES = ['wizard', 'roi', 'site-visit']

const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]))

// PUBLIC: website forms. Status and notes cannot be set from outside.
export async function createLead(req, res) {
  const { name, phone, source } = req.body
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required' })
  const lead = await Lead.create({
    ...pick(req.body, PUBLIC_FIELDS),
    source: PUBLIC_SOURCES.includes(source) ? source : 'wizard',
  })
  res.status(201).json(lead)
}

// ADMIN: add a lead manually (phone call, walk-in, referral...)
export async function createLeadAdmin(req, res) {
  const { name, phone } = req.body
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required' })
  const lead = await Lead.create({ source: 'manual', ...pick(req.body, ADMIN_FIELDS) })
  res.status(201).json(lead)
}

export async function getLeads(_req, res) {
  res.json(await Lead.find().sort({ createdAt: -1 }))
}

export async function updateLead(req, res) {
  const lead = await Lead.findByIdAndUpdate(req.params.id, pick(req.body, ADMIN_FIELDS), {
    new: true,
    runValidators: true,
  })
  if (!lead) return res.status(404).json({ message: 'Lead not found' })
  res.json(lead)
}

export async function updateLeadStatus(req, res) {
  const lead = await Lead.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true })
  if (!lead) return res.status(404).json({ message: 'Lead not found' })
  res.json(lead)
}

export async function deleteLead(req, res) {
  await Lead.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
}