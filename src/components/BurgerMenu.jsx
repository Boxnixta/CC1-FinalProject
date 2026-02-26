import { useState } from 'react'

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'Work', href: '#work' },
    { label: 'Kontakt', href: '#kontakt' },
    { label: 'About', href: '#about' },
  ]

  return (
    <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '10px',
          zIndex: 1001,
          position: 'relative',
        }}
      >
        <div style={{ width: '40px', height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          <div style={{ width: '100%', height: '4px', background: '#000', borderRadius: '2px' }} />
          <div style={{ width: '100%', height: '4px', background: '#000', borderRadius: '2px' }} />
          <div style={{ width: '100%', height: '4px', background: '#000', borderRadius: '2px' }} />
        </div>
      </button>

      {/* Overlay zum schließen */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999,
          }}
        />
      )}

      {/* Menu Box */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            background: '#FF98E0',
            borderRadius: '20px',
            padding: '30px',
            minWidth: '200px',
            boxShadow: '0 5px 30px rgba(255, 130, 215, 0.79)',
            zIndex: 1002,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => setIsOpen(false)}
                style={{
                  fontSize: '30px',
                  fontFamily: '"Pixelify Sans", sans-serif',
                  fontWeight: 'normal',
                  cursor: 'pointer',
                  color: '#fff',
                  textShadow: '2px 2px 4px rgba(75, 8, 47, 0.48)',
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}