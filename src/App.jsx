import { useEffect, useRef, useState } from 'react'
import './App.css'

const COLORS = ['cyan', 'pink', 'green', 'gold', 'violet']
const SPEED = 260

function App() {
  const logoRef = useRef(null)
  const rafRef = useRef(0)
  const positionRef = useRef({ x: 38, y: 42, dx: 1, dy: 1 })
  const [position, setPosition] = useState({ x: 38, y: 42 })
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (reduceMotion.matches) {
      return undefined
    }

    let previousTime = performance.now()

    const moveLogo = (time) => {
      const logo = logoRef.current

      if (!logo) {
        rafRef.current = requestAnimationFrame(moveLogo)
        return
      }

      const delta = Math.min((time - previousTime) / 1000, 0.05)
      previousTime = time

      const bounds = logo.getBoundingClientRect()
      const maxX = Math.max(window.innerWidth - bounds.width, 0)
      const maxY = Math.max(window.innerHeight - bounds.height, 0)
      const next = { ...positionRef.current }
      let bounced = false

      next.x += next.dx * SPEED * delta
      next.y += next.dy * SPEED * delta

      if (next.x <= 0 || next.x >= maxX) {
        next.x = Math.min(Math.max(next.x, 0), maxX)
        next.dx *= -1
        bounced = true
      }

      if (next.y <= 0 || next.y >= maxY) {
        next.y = Math.min(Math.max(next.y, 0), maxY)
        next.dy *= -1
        bounced = true
      }

      positionRef.current = next
      setPosition({ x: next.x, y: next.y })

      if (bounced) {
        setColorIndex((current) => (current + 1) % COLORS.length)
      }

      rafRef.current = requestAnimationFrame(moveLogo)
    }

    rafRef.current = requestAnimationFrame(moveLogo)

    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <main className="screen" aria-label="Retro Anish Gogineni bouncing logo">
      <div className="screen__glow" aria-hidden="true" />
      <div className="screen__grid" aria-hidden="true" />
      <div className="screen__scanlines" aria-hidden="true" />

      <div
        ref={logoRef}
        className={`dvd-name dvd-name--${COLORS[colorIndex]}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        <span className="dvd-name__tiny">now entering</span>
        <span className="dvd-name__main">Anish</span>
        <span className="dvd-name__sub">Gogineni.com</span>
      </div>

      <p className="status">under construction, unfortunately with style</p>
    </main>
  )
}

export default App
