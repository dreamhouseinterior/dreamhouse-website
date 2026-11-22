import { Router } from 'express'
import auth from '../middleware/auth.js'
import {
  createLead, createLeadAdmin, getLeads, updateLead, updateLeadStatus, deleteLead,
} from '../controllers/leadController.js'

const r = Router()
r.post('/', createLead)                          // public website forms
r.post('/admin', auth, createLeadAdmin)          // admin "Add Lead"
r.get('/', auth, getLeads)
r.put('/:id', auth, updateLead)
r.patch('/:id/status', auth, updateLeadStatus)
r.delete('/:id', auth, deleteLead)
export default r