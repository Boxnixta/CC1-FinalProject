import { useState } from 'react'

export default function Logo() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '15px',
        left: '15px',
        zIndex: 100,
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src="/grafiken/logo.png"
        style={{
          width: '150px',
          height: 'auto',
          // filter: 'drop-shadow(2px 3px 4px rgba(0,0,0,0.2))',
          animation: isHovering ? 'wiggle 0.5s ease-in-out infinite' : 'none',
          transition: 'all 0.2s ease',
        }}
      />
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-2deg); }
          75% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  )
}