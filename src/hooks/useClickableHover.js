import { useState, useEffect } from 'react'

export function useClickableHover() {
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const element = document.elementFromPoint(e.clientX, e.clientY)
      
      // Check ob über einem clickbaren Element
      const isClickable = 
        element?.tagName === 'BUTTON' ||
        element?.tagName === 'A' ||
        element?.style?.cursor === 'pointer' ||
        element?.closest('button') ||
        element?.closest('a')
      
      setIsHoveringClickable(!!isClickable)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return isHoveringClickable
}