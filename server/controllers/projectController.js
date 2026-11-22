import Project from '../models/Project.js'

// PUBLIC: only visible projects
export async function getPublicProjects(_req, res) {
  res.json(await Project.find({ visible: true }).sort({ createdAt: -1 }))
}

// ADMIN: all projects, including hidden
export async function getAllProjects(_req, res) {
  res.json(await Project.find().sort({ createdAt: -1 }))
}

export async function createProject(req, res) {
  res.status(201).json(await Project.create(req.body))
}

export async function updateProject(req, res) {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!project) return res.status(404).json({ message: 'Project not found' })
  res.json(project)
}

export async function deleteProject(req, res) {
  await Project.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
}