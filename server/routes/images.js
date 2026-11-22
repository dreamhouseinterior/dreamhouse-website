import { Router } from 'express'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { getImages, createImages, updateImage, deleteImage } from '../controllers/imageController.js'

const r = Router()
r.get('/', getImages)
r.post('/', auth, upload.array('images', 10), createImages)
r.put('/:id', auth, updateImage)
r.delete('/:id', auth, deleteImage)
export default r