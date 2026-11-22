import { useEffect, useRef, useState } from 'react'
import { UploadCloud, Trash2, Star } from 'lucide-react'
import api from '../../api/axios.js'

const CATS = ['Full Home', 'Modular Kitchen', 'Living Room', 'Bedroom', 'Wardrobes', 'Commercial / Multi-Unit']

export default function ImagesManager() {
  const [images, setImages] = useState([])
  const [projects, setProjects] = useState([])
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState('')
  const [category, setCategory] = useState('Full Home')
  const [projectId, setProjectId] = useState('')
  const [caption, setCaption] = useState('')
  const [drag, setDrag] = useState(false)
  const [msg, setMsg] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const fileRef = useRef()

  const load = () => api.get('/images').then((r) => setImages(r.data))
  useEffect(() => {
    load()
    api.get('/projects/all').then((r) => setProjects(r.data))
  }, [])

  function addFiles(list) {
    const imgs = [...list].filter((x) => x.type.startsWith('image/'))
    setFiles((p) => [...p, ...imgs].slice(0, 10))
  }

  async function upload(e) {
    e.preventDefault()
    if (!files.length && !urls.trim()) return setMsg('Choose files or paste image URLs')
    const fd = new FormData()
    files.forEach((x) => fd.append('images', x))
    fd.append('category', category)
    if (projectId) fd.append('projectId', projectId)
    if (caption) fd.append('caption', caption)
    if (urls.trim()) fd.append('urls', urls.replace(/\n/g, ','))
    try {
      await api.post('/images', fd) // axios sets the multipart header automatically
      setFiles([]); setUrls(''); setCaption(''); setMsg('Uploaded!')
      load()
    } catch (err) {
      setMsg(err.response?.data?.message || 'Upload failed (max 5 MB per image)')
    }
  }

  const shown = filterProject ? images.filter((i) => i.projectId === filterProject) : images
  const input = 'w-full border rounded-xl px-3 py-2.5 bg-white'

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Images & Gallery</h1>

      <form onSubmit={upload} className="bg-white border rounded-2xl p-5 grid lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
            onClick={() => fileRef.current.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center ${drag ? 'border-teal-700 bg-teal-50' : 'border-slate-300'}`}
          >
            <UploadCloud className="mx-auto text-teal-700" size={36} />
            <p className="mt-2 font-semibold">Drag & drop images here, or click to browse</p>
            <p className="text-xs text-slate-500">JPG, PNG, WEBP · up to 10 files · 5 MB each</p>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
          </div>
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((x, i) => (
                <div key={i} className="relative">
                  <img src={URL.createObjectURL(x)} alt="" className="w-20 h-16 object-cover rounded-lg" />
                  <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
          <textarea rows={3} placeholder="Or paste image URLs (one per line)" className={input} value={urls} onChange={(e) => setUrls(e.target.value)} />
        </div>

        <div className="space-y-3">
          <select className={input} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className={input} value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Not linked to a map project</option>
            {projects.map((p) => <option key={p._id} value={p._id}>{p.title} ({p.locality})</option>)}
          </select>
          <input placeholder="Caption (optional)" className={input} value={caption} onChange={(e) => setCaption(e.target.value)} />
          <button className="bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-xl">Upload</button>
          {msg && <p className="text-sm text-teal-700">{msg}</p>}
        </div>
      </form>

      <div className="flex items-center gap-3">
        <h2 className="font-semibold">All images ({shown.length})</h2>
        <select className="border rounded-xl px-3 py-2 bg-white text-sm" value={filterProject} onChange={(e) => setFilterProject(e.target.value)}>
          <option value="">All projects</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shown.map((img) => (
          <ImageCard key={img._id} img={img} projects={projects} onChange={load} />
        ))}
      </div>
    </div>
  )
}

function ImageCard({ img, projects, onChange }) {
  const [caption, setCaption] = useState(img.caption || '')
  const update = async (data) => { await api.put(`/images/${img._id}`, data); onChange() }
  const remove = async () => {
    if (!confirm('Delete this image?')) return
    await api.delete(`/images/${img._id}`)
    onChange()
  }

  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <div className="relative">
        <img src={img.url} alt={img.caption} className="w-full h-40 object-cover" />
        {img.isCover && <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Cover</span>}
      </div>
      <div className="p-3 space-y-2 text-sm">
        <input value={caption} onChange={(e) => setCaption(e.target.value)}
          onBlur={() => caption !== (img.caption || '') && update({ caption })}
          placeholder="Caption" className="w-full border rounded-lg px-2 py-1.5" />
        <select value={img.category} onChange={(e) => update({ category: e.target.value })} className="w-full border rounded-lg px-2 py-1.5">
          {CATS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={img.projectId || ''} onChange={(e) => update({ projectId: e.target.value || null })} className="w-full border rounded-lg px-2 py-1.5">
          <option value="">No project</option>
          {projects.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        <div className="flex justify-between pt-1">
          <button disabled={!img.projectId || img.isCover} onClick={() => update({ isCover: true })}
            className="flex items-center gap-1 text-amber-600 disabled:text-slate-300"
            title={img.projectId ? 'Set as project cover' : 'Link to a project first'}>
            <Star size={16} /> Cover
          </button>
          <button onClick={remove} className="flex items-center gap-1 text-red-600"><Trash2 size={16} /> Delete</button>
        </div>
      </div>
    </div>
  )
}