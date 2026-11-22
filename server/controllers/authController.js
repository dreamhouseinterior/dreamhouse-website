import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export async function login(req, res) {
  const { email, password } = req.body
  const admin = await Admin.findOne({ email: (email || '').toLowerCase() })
  if (!admin || !(await bcrypt.compare(password || '', admin.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const token = jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, email: admin.email })
}