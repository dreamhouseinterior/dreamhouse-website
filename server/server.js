import './loadEnv.js'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'

import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import imageRoutes from './routes/images.js'
import leadRoutes from './routes/leads.js'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.set('trust proxy', 1) // behind the host's proxy, so rate limiting sees real IPs

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { message: 'Too many login attempts. Try again later.' } })
const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, message: { message: 'Too many requests. Try again later.' } })

// CSP is off because the site loads map tiles, Unsplash/Cloudinary images and Google fonts
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }))

// Site and API share one domain in production, so CORS is only needed if you set CLIENT_URL
const origins = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean)
app.use(cors({ origin: origins.length ? origins : false }))

app.use(express.json({ limit: '5mb' }))
app.use(morgan('dev'))

app.use('/api/auth/login', loginLimiter)
app.post('/api/leads', leadLimiter, (_req, _res, next) => next())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/leads', leadRoutes)
app.get('/api/health', (_, res) => res.json({ ok: true }))
app.use('/api', (_req, res) => res.status(404).json({ message: 'Not found' }))

// Serve the built React app (client/dist) and fall back to index.html for routes like /admin/login
const clientDist = path.join(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDist))
app.get('/{*splat}', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')))

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server on :${PORT}`)))
  .catch((e) => { console.error('Database connection failed:', e.message); process.exit(1) })













// import 'dotenv/config'
// import express from 'express'
// import cors from 'cors'
// import helmet from 'helmet'
// import morgan from 'morgan'
// import path from 'path'
// import rateLimit from 'express-rate-limit'
// import { fileURLToPath } from 'url'
// import connectDB from './config/db.js'

// // import 'express-async-errors'

// import authRoutes from './routes/auth.js'
// import projectRoutes from './routes/projects.js'
// import imageRoutes from './routes/images.js'
// import leadRoutes from './routes/leads.js'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))
// const app = express()


// app.set('trust proxy', 1) // Render sits behind a proxy; needed for rate limiting to see real IPs

// const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { message: 'Too many login attempts. Try again later.' } })
// const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, message: { message: 'Too many requests. Try again later.' } })
// app.use('/api/auth/login', loginLimiter)
// app.post('/api/leads', leadLimiter, (_req, _res, next) => next()) // only limits public submissions



// app.use(helmet({ crossOriginResourcePolicy: false }))
// app.use(cors({ origin: process.env.CLIENT_URL }))
// app.use(express.json({ limit: '5mb' }))
// app.use(morgan('dev'))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// app.use('/api/auth', authRoutes)
// app.use('/api/projects', projectRoutes)
// app.use('/api/images', imageRoutes)
// app.use('/api/leads', leadRoutes)

// app.use((err, _req, res, _next) => {
//   console.error(err)
//   res.status(err.status || 500).json({ message: err.message || 'Server error' })
// })

// app.get('/api/health', (_, res) => res.json({ ok: true }))

// connectDB().then(() =>
//   app.listen(process.env.PORT, () => console.log(`API on :${process.env.PORT}`))
// )