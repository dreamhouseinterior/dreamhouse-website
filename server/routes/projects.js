import { Router } from 'express'
import auth from '../middleware/auth.js'
import {
  getPublicProjects, getAllProjects, createProject, updateProject, deleteProject,
} from '../controllers/projectController.js'

const r = Router()
r.get('/', getPublicProjects)           // public
r.get('/all', auth, getAllProjects)     // admin (must be above /:id)
r.post('/', auth, createProject)
r.put('/:id', auth, updateProject)
r.delete('/:id', auth, deleteProject)
export default r