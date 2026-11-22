import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { token, login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (token) return <Navigate to="/admin" replace />

  async function go(e, p) {
    setErr('')
    setBusy(true)
    try {
      await login(e, p)
      nav('/admin')
    } catch {
      setErr('Invalid email or password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <form
        onSubmit={(ev) => { ev.preventDefault(); go(email, password) }}
        className="bg-white border rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
        <input type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-2.5" />
        <input type="password" required placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-2.5" />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={busy} className="w-full bg-teal-700 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60">
          Sign in
        </button>

        {/* DEMO ONLY: delete this button (and change the seeded password) before going live */}
        {/* <button type="button" disabled={busy} onClick={() => go('admin@demo.com', 'admin123')}
          className="w-full border border-amber-500 text-amber-700 font-semibold py-2.5 rounded-xl">
          1-Click Demo Login
        </button> */}
        <Link to="/" className="block text-center text-sm text-slate-500">← Back to website</Link>
      </form>
    </div>
  )
}