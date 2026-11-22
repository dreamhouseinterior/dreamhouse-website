import Lead from '../models/Lead.js'

export async function createLead(req, res) {
  const { name, phone } = req.body
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone are required' })
  res.status(201).json(await Lead.create(req.body))
}

export async function getLeads(_req, res) {
  res.json(await Lead.find().sort({ createdAt: -1 }))
}

export async function updateLeadStatus(req, res) {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  )
  if (!lead) return res.status(404).json({ message: 'Lead not found' })
  res.json(lead)
}