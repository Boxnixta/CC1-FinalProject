import { useState, useEffect } from 'react'

export default function HintText({ text }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'absolute',
      top: visible ? '32px' : '-120px',
      left: '50%',
      transform: 'translateX(-50%)',
      transition: 'top 2.0s cubic-bezier(0.22, 1, 0.36, 1)',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1px',
      pointerEvents: 'none',
      filter: 'drop-shadow(0px 0px 2.5px #0000ff)',
    }}>
      {/* Text */}
      <p style={{
          color: '#0000ff',
          fontSize: '32px',
          whiteSpace: 'nowrap',
          margin: 0,
          lineHeight: '1',
          display: 'flex',
          gap: '2px',
    }}>
      {text.split('').map((char, i) => {
    // Wenn es ein Leerzeichen ist
      if (char === ' ') {
        return (
          <span key={i} style={{ width: '12px' }}>
            {' '}
          </span>
        )
      }

      let fontFamily = '"Helvetica Neue", Helvetica, sans-serif'
      let fontSize = '40px'
      let translateY = '-5px'

      if (i === 0) {
        fontFamily = '"Great Vibes", cursive'
        fontSize = '50px'
        translateY = '-5px'
      } else if (i === 1) {
        fontFamily = '"Helvetica Neue", Helvetica, sans-serif'
        fontSize = '40px'
        translateY = '-5px'
      } else if (i === 2 || i === 3) {
        fontFamily = '"Pixelify Sans", sans-serif'
        fontSize = '40px'
        translateY = '-5px'
      } else if (i === 4 || i === 5) {
        fontFamily = '"Great Vibes", cursive'
        fontSize = '50px'
        translateY = '-5px'
      }

      return (
        <span key={i} style={{
          fontFamily,
          fontSize,
          fontWeight: i === 1 || i > 5 ? 'bold' : 'normal',
          transform: `translateY(${translateY})`,
          display: 'inline-block',
        }}>
          {char}
        </span>
     )
    })}
    </p>

      {/* SVG Pfeile mit abgerundeten Spitzen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
          <svg width="30" height="60" viewBox="0 0 30 60" style={{ fill: 'none', stroke: '#0000ff', strokeWidth: '5', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            {/* Vertikaler Strich */}
            <path d="M 15 2 L 15 22" strokeLinecap="round" />
            {/* Pfeilspitze nach unten */}
            <polyline points="5,15 15,25 25,15" />
          </svg>
      </div>
    </div>
  )
}