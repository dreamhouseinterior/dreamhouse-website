import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { ADMIN_BASE } from '../../utils/config.js'
import { BRAND } from '../../utils/brand.js'
import Logo from '../../components/common/Logo.jsx'

export default function Login() {
  const { token, login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  if (token) return <Navigate to={ADMIN_BASE} replace />

  async function go(e, p) {
    setErr(''); setBusy(true)
    try {
      await login(e, p)
      nav(ADMIN_BASE)
    } catch {
      setErr('Invalid email or password')
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600'

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form onSubmit={(ev) => { ev.preventDefault(); go(email, password) }}
        className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-2xl">
        <div className="text-center">
          <Logo size={56} showName={false} className="justify-center" />
          <h1 className="mt-3 text-2xl font-bold text-slate-800">Admin Login</h1>
          <p className="text-sm text-slate-500">{BRAND.name}</p>
        </div>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={busy} className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2.5 rounded-xl disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        {/* Demo button only exists while running locally (npm run dev). It is removed from production builds automatically. */}
        {import.meta.env.DEV && (
          <button type="button" disabled={busy} onClick={() => go('admin@demo.com', 'admin123')}
            className="w-full border border-amber-500 text-amber-700 font-semibold py-2.5 rounded-xl">
            1-Click Demo Login (dev only)
          </button>
        )}
        <Link to="/" className="block text-center text-sm text-slate-500 hover:text-slate-700">← Back to website</Link>
      </form>
    </div>
  )
}