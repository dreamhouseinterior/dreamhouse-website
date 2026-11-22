import Image from '../models/Image.js'
import Project from '../models/Project.js'
import { uploadBuffer, destroyImage } from '../utils/cloudinary.js'

export async function getImages(req, res) {
  const { category, project } = req.query
  const filter = {}
  if (category && category !== 'All') filter.category = category
  if (project) filter.projectId = project
  res.json(await Image.find(filter).sort({ createdAt: -1 }))
}

// Accepts multipart files (field "images") AND/OR a "urls" field (comma-separated image URLs)
export async function createImages(req, res) {
  const { category, projectId, caption, urls } = req.body
  const base = { category, projectId: projectId || null, caption }
  const docs = []

  const uploaded = await Promise.all((req.files || []).map((f) => uploadBuffer(f.buffer)))
  uploaded.forEach((r) => docs.push({ ...base, url: r.secure_url, publicId: r.public_id }))

  if (urls) {
    urls.split(',').map((u) => u.trim()).filter(Boolean).forEach((u) => docs.push({ ...base, url: u }))
  }
  if (!docs.length) return res.status(400).json({ message: 'No images provided' })

  res.status(201).json(await Image.insertMany(docs))
}

export async function updateImage(req, res) {
  const image = await Image.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!image) return res.status(404).json({ message: 'Image not found' })

  if (req.body.isCover && image.projectId) {
    await Image.updateMany({ projectId: image.projectId, _id: { $ne: image._id } }, { isCover: false })
    await Project.findByIdAndUpdate(image.projectId, { coverImage: image.url })
  }
  res.json(image)
}

export async function deleteImage(req, res) {
  const image = await Image.findByIdAndDelete(req.params.id)
  if (image?.publicId) await destroyImage(image.publicId).catch(() => {})
  res.json({ ok: true })
}