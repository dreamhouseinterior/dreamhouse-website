import './loadEnv.js'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 10) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (10+ characters)')
  process.exit(1)
}

await mongoose.connect(process.env.MONGO_URI)
await Admin.findOneAndUpdate(
  { email: ADMIN_EMAIL.toLowerCase() },
  { passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10) },
  { upsert: true }
)
console.log('Admin ready:', ADMIN_EMAIL)
process.exit(0)