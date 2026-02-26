import { useState, useEffect } from 'react'

export function useClickableHover() {
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const element = document.elementFromPoint(e.clientX, e.clientY)
      
      const isClickable = 
        element?.tagName === 'BUTTON' ||
        element?.tagName === 'A' ||
        element?.getAttribute('role') === 'button' ||
        element?.style?.cursor === 'pointer' ||
        element?.closest('button') ||
        element?.closest('a') ||
        element?.closest('[role="button"]')
      
      // DEBUG
      if (element?.style?.cursor === 'pointer') {
        console.log('Found clickable element:', element.tagName, element.getAttribute('role'))
      }
      
      setIsHoveringClickable(!!isClickable)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return isHoveringClickable
}