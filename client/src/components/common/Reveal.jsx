import { useEffect, useRef, useState } from 'react'

// Fades/slides children in when they scroll into view.
// dir: '' (up) | 'left' | 'right' | 'zoom'     delay: ms (use for staggering)
export function Reveal({ children, as: Tag = 'div', dir = '', delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect() }
    }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} style={{ '--d': `${delay}ms` }} className={`reveal ${dir} ${shown ? 'in' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

// Counts up from 0 when scrolled into view
export function CountUp({ end, duration = 1600, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        setVal(end * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [end, duration])

  return <span ref={ref}>{prefix}{Math.round(val).toLocaleString('en-IN')}{suffix}</span>
}

// Smoothly tweens to a new number whenever `value` changes (used by the ROI calculator)
export function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString('en-IN'), duration = 500 }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)

  useEffect(() => {
    const a = from.current
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const v = a + (value - a) * (1 - Math.pow(1 - p, 3))
      from.current = v
      setShown(v)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <>{format(shown)}</>
}