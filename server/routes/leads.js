import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createLead, getLeads, updateLeadStatus } from '../controllers/leadController.js'

const r = Router()
r.post('/', createLead)                       // public
r.get('/', auth, getLeads)                    // admin
r.patch('/:id/status', auth, updateLeadStatus)
export default r