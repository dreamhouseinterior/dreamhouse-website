import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'

// import 'express-async-errors'

import authRoutes from './routes/auth.js'
import projectRoutes from './routes/projects.js'
import imageRoutes from './routes/images.js'
import leadRoutes from './routes/leads.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()


app.set('trust proxy', 1) // Render sits behind a proxy; needed for rate limiting to see real IPs

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, message: { message: 'Too many login attempts. Try again later.' } })
const leadLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 20, message: { message: 'Too many requests. Try again later.' } })
app.use('/api/auth/login', loginLimiter)
app.post('/api/leads', leadLimiter, (_req, _res, next) => next()) // only limits public submissions



app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json({ limit: '5mb' }))
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/images', imageRoutes)
app.use('/api/leads', leadRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

app.get('/api/health', (_, res) => res.json({ ok: true }))

connectDB().then(() =>
  app.listen(process.env.PORT, () => console.log(`API on :${process.env.PORT}`))
)