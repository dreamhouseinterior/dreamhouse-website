import { useState } from 'react'
import { BRAND } from '../../utils/brand.js'

export default function Logo({ size = 40, showName = true, dark = false, className = '' }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {failed ? (
        <span style={{ width: size, height: size }}
          className="rounded-xl bg-linear-to-br from-teal-600 to-emerald-500 text-white font-bold flex items-center justify-center shadow">
          {BRAND.name.charAt(0)}
        </span>
      ) : (
        <img src={BRAND.logo} alt={`${BRAND.name} logo`} style={{ height: size }}
          className="w-auto object-contain" onError={() => setFailed(true)} />
      )}
      {showName && (
        <span className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>{BRAND.name}</span>
      )}
    </span>
  )
}