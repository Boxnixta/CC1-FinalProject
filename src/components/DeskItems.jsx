import { useRef, useEffect } from 'react'

const items = [
  { id: 0, src: '/grafiken/canon.png',      x: 55, y: 45, rotation: -200, width: 330, zIndex: 2  },
  { id: 1, src: '/grafiken/chips2.png',     x: 25, y: 30, rotation: 8,    width: 220, zIndex: 1  },
  { id: 2, src: '/grafiken/festplatte.png', x: 10, y: 35, rotation: -40,  width: 300, zIndex: 3  },
  { id: 3, src: '/grafiken/fischstift.png', x: 50, y: 20, rotation: 230,  width: 80,  zIndex: 7  },
  { id: 4, src: '/grafiken/kaugummi.png',   x: 50, y: 35, rotation: -30,  width: 150, zIndex: 10 },
  { id: 5, src: '/grafiken/lineal.png',     x: 50, y: 25, rotation: 140,  width: 650, zIndex: 2  },
  { id: 6, src: '/grafiken/maus.png',       x: 75, y: 40, rotation: 130,  width: 150, zIndex: 6  },
  { id: 7, src: '/grafiken/papiermull.png', x: 40, y: 20, rotation: 6,    width: 180, zIndex: 9  },
  { id: 8, src: '/grafiken/stempel.png',    x: 60, y: 30, rotation: -10,  width: 150, zIndex: 7  },
  { id: 9, src: '/grafiken/tastatur.png',   x: 35, y: 30, rotation: -80,  width: 200, zIndex: 5  },
]

export default function DeskItems() {
  const imgRefs = useRef([])
  const positions = useRef(items.map(item => ({
    x: item.x, y: item.y,
    rotation: item.rotation,
    tilt: 0,
  })))
  const mouse = useRef({ x: -999, y: -999 })
  const rafRef = useRef()

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 100
      mouse.current.y = (e.clientY / window.innerHeight) * 100
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
  positions.current.forEach((pos, i) => {
    const el = imgRefs.current[i]
    if (!el) return

    // In Pixel umrechnen
    const elRect = el.getBoundingClientRect()
    const elCenterX = elRect.left + elRect.width / 2
    const elCenterY = elRect.top + elRect.height / 2

    const mouseXpx = (mouse.current.x / 100) * window.innerWidth
    const mouseYpx = (mouse.current.y / 100) * window.innerHeight

    const dx = mouseXpx - elCenterX
    const dy = mouseYpx - elCenterY
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Repel Radius in Pixel – abhängig von Bildgröße
    const repelRadius = Math.max(elRect.width, elRect.height) * 0.8

    if (dist < repelRadius && dist > 0) {
  const force = (repelRadius - dist) / repelRadius
  const angle = Math.atan2(dy, dx)
  pos.x -= (Math.cos(angle) * force * 8 / window.innerWidth) * 100
  pos.y -= (Math.sin(angle) * force * 8 / window.innerHeight) * 100
  pos.tilt += (force * 15 - pos.tilt) * 0.2
} else {
  pos.tilt *= 0.9
}

// Grenzen – maximal 2/3 raus, immer noch 1/3 sichtbar

const minX = -(elRect.width * 0.4 / window.innerWidth) * 100
const maxX = 100 - (elRect.width * 0.6 / window.innerWidth) * 100
const minY = -(elRect.height * 0.4 / window.innerHeight) * 100
const maxY = 100 - (elRect.height * 0.6 / window.innerHeight) * 100

pos.x = Math.max(minX, Math.min(maxX, pos.x))
pos.y = Math.max(minY, Math.min(maxY, pos.y))

    el.style.left = `${pos.x}%`
    el.style.top = `${pos.y}%`
    el.querySelector('img').style.transform = `rotate(${pos.rotation + pos.tilt}deg)`
  })

  rafRef.current = requestAnimationFrame(animate)
}

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0,
      width: '100%', height: '100%',
      zIndex: 10,
    }}>
      {items.map((item, i) => (
        <div
          key={item.id}
          ref={el => imgRefs.current[i] = el}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${item.width}px`,
            // filter: 'drop-shadow(-4px 5px 4px rgba(0,0,0,0.2))',
            zIndex: item.zIndex,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {/* Farbiger Schatten – gleiches Bild, nur unscharf und verschoben */}
          <img
            src={item.src}
            style={{
              width: '100%',
              transform: `rotate(${item.rotation + (positions.current[i]?.tilt || 0)}deg)`,
              display: 'block',
              position: 'absolute',
              top: '8px',
              left: '-6px',
              filter: 'blur(8px) opacity(0.5)',
              zIndex: 0,
            }}
          />
          {/* Das eigentliche Bild oben drauf */}
          <img
            src={item.src}
            style={{
              width: '100%',
              transform: `rotate(${item.rotation + (positions.current[i]?.tilt || 0)}deg)`,
              display: 'block',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </div>
      ))}
    </div>
  )
}