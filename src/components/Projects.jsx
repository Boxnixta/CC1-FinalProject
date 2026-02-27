import { Center } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [hoveredProject, setHoveredProject] = useState(null)
  const [previewIndex, setPreviewIndex] = useState({})
  const [positions, setPositions] = useState({})
  const videoRefs = useRef({})
  const velocitiesRef = useRef({})
  const animationFrameRef = useRef()

const projectData = [
  { id: 'bachelor', name: 'Bachelor', description: 'Bachelorarbeit', hasVideo: true, scale: 1.5, aspectRatio: 1.95, shadowColor: '#9e4260' },
  { id: 'novakinderbuch', name: 'Nova Kinderbuch', description: 'Kinderbuch über Handball', hasVideo: true, scale: 1.2, aspectRatio: 1.5, shadowColor: '#875d00' },
  { id: 'kleinseincomic', name: 'Kleinsein Comic', description: 'Comic über das Kleinsein', hasVideo: false, usePreview: true, previewCount: 14, scale: 1.0, aspectRatio: 1.5, shadowColor: '#7f3259' },
  { id: 'magazine', name: 'Magazine', description: 'Dessau Magazin 03', hasVideo: false, usePreview: true, previewCount: 16, scale: 1.1, aspectRatio: 1.8, shadowColor: '#006d83' },
  { id: 'dreidprojekte', name: '3D Projekte', description: 'Verschiedene 3D Projekte', hasVideo: true, scale: 1.1, aspectRatio: 1.9, shadowColor: '#007400' },
  { id: 'veranstaltungen', name: 'Veranstaltungen', description: 'Veranstaltungen', hasVideo: true, scale: 0.7, aspectRatio: 0.7, shadowColor: '#6d006d' },
  { id: 'fotografiedreid', name: 'Fotografie 3D', description: 'Mix Foto & 3D', hasVideo: false, usePreview: true, previewCount: 7, scale: 0.6, aspectRatio: 0.8, shadowColor: '#6f6f00' },
  { id: 'coverart', name: 'Cover Art', description: 'Cover Artworks', hasVideo: false, usePreview: true, previewCount: 4, scale: 0.6, aspectRatio: 1.0, shadowColor: '#5d3300' },
  { id: 'coding', name: 'Coding', description: 'Coding', hasVideo: false, usePreview: true, previewCount: 1, isGif: true, scale: 0.5, aspectRatio: 1.2, shadowColor: '#005161' },
]

  const getCoverImage = (projectId) => {
    const coverMap = {
      'bachelor': '/projekte/bachelor/cover-ba.png',
      'coding': '/projekte/coding/kusama/cover-kusama.png',
      'coverart': '/projekte/coverart/bild-coverart.png',
      'dreidprojekte': '/projekte/dreidprojekte/bild-dreidprojekte.png',
      'fotografiedreid': '/projekte/fotografiedreid/preview/bild-a.jpg',
      'kleinseincomic': '/projekte/kleinseincomic/bild-kleinsein.jpg',
      'magazine': '/projekte/magazine/dmag/bild-dmag.png',
      'novakinderbuch': '/projekte/novakinderbuch/bild-nova.jpg',
      'veranstaltungen': '/projekte/veranstaltungen/bild-va.jpg',
    }
    return coverMap[projectId]
  }

  const getVideoSrc = (projectId) => {
    const videoMap = {
      'bachelor': '/projekte/bachelor/video-ba.mp4',
      'coding': '/projekte/coding/kusama/video-kusama.gif',
      'coverart': '/projekte/coverart/video-coverart.mp4',
      'dreidprojekte': '/projekte/dreidprojekte/video-dreidprojekte.mp4',
      'kleinseincomic': null,
      'magazine': null,
      'fotografiedreid': null,
      'novakinderbuch': '/projekte/novakinderbuch/video-nova.mp4',
      'veranstaltungen': '/projekte/veranstaltungen/video-va.mov',
    }
    return videoMap[projectId]
  }

  const getPreviewImage = (projectId, index) => {
    if (projectId === 'coding') {
      return `/projekte/${projectId}/kusama/video-kusama.gif`
    } else if (projectId === 'magazine') {
      return `/projekte/${projectId}/dmag/preview/${index + 1}.png`
    } else if (projectId === 'kleinseincomic') {
      return `/projekte/${projectId}/preview/bild-${index + 1}.jpg`
    } else if (projectId === 'fotografiedreid') {
      const imageNames = ['bild-a', 'bild-coc', 'bild-cor', 'bild-e', 'bild-l', 'bild-n', 'bild-v']
      return `/projekte/${projectId}/preview/${imageNames[index]}.jpg`
    } else if (projectId === 'coverart') {
      return `/projekte/${projectId}/preview/bild-${index + 1}.png`
    }
    return ''
  }

  const handleProjectClick = (projectId) => {
    console.log('Projekt geklickt:', projectId)
  }  

  // Initial Positioning
  useEffect(() => {
    const cardWidth = 280
    const cardHeight = 210
    const padding = 100

    const positions = {}
    const velocities = {}

    for (let i = 0; i < projectData.length; i++) {
      let x, y, overlapping = true
      let attempts = 0
      
      while (overlapping && attempts < 500) {
        overlapping = false
        x = Math.random() * (window.innerWidth - cardWidth - 40)
        y = Math.random() * (window.innerHeight - cardHeight - 40)

        for (let proj of projectData) {
          if (positions[proj.id]) {
            const dx = x - positions[proj.id].x
            const dy = y - positions[proj.id].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const minDistance = Math.sqrt((cardWidth + padding/2) ** 2 + (cardHeight + padding/2) ** 2)
            
            if (distance < minDistance) {
              overlapping = true
              break
            }
          }
        }
        attempts++
      }

      positions[projectData[i].id] = { x, y }
      velocities[projectData[i].id] = { vx: 0, vy: 0 }
    }

    setPositions(positions)
    velocitiesRef.current = velocities
  }, [])

    // Physics Loop
    useEffect(() => {
      const cardWidth = 280
      const cardHeight = 210
      const repelForce = 1.2
      const damping = 0.98
      const repelDistance = 250
      const floatSpeed = 0.1  

      let floatPhase = {}
      let floatSpeedPerCard = {}
      projectData.forEach(proj => {
        floatPhase[proj.id] = Math.random() * Math.PI * 2
        floatSpeedPerCard[proj.id] = floatSpeed * (0.005 + Math.random() * 0.01)
      })

      const animate = () => {
       setPositions(prev => {
          const newPositions = { ...prev }
         const velocities = velocitiesRef.current

         // Sanfte Abstoßung zwischen Karten
          projectData.forEach(proj1 => {
            if (!newPositions[proj1.id]) return

            let totalForceX = 0
            let totalForceY = 0

            projectData.forEach(proj2 => {
              if (proj1.id === proj2.id || !newPositions[proj2.id]) return

              const dx = newPositions[proj1.id].x - newPositions[proj2.id].x
              const dy = newPositions[proj1.id].y - newPositions[proj2.id].y
              const distance = Math.sqrt(dx * dx + dy * dy) + 1

              if (distance < repelDistance) {
                // Sanfte Kraft-Kurve statt aggressiv
                const force = repelForce * (1 - distance / repelDistance)
                totalForceX += (dx / distance) * force * 0.1
                totalForceY += (dy / distance) * force * 0.1
              }
            })

            velocities[proj1.id].vx = velocities[proj1.id].vx * damping + totalForceX
            velocities[proj1.id].vy = velocities[proj1.id].vy * damping + totalForceY
          })

         // Update Positionen
          projectData.forEach(proj => {
            if (!newPositions[proj.id]) return

            newPositions[proj.id].x += velocities[proj.id].vx * 0.5  
            newPositions[proj.id].y += velocities[proj.id].vy * 0.5  

            // Float-Animation
            floatPhase[proj.id] += floatSpeedPerCard[proj.id]
            newPositions[proj.id].x += Math.sin(floatPhase[proj.id]) * 0.3
            newPositions[proj.id].y += Math.cos(floatPhase[proj.id]) * 0.3

            // Sanfte Grenzen mit Abständen
            const minX = 180  // Links: Abstand für Logo + Burger Menu (ca 150px)
            const minY = 100  // Oben: Abstand für Header
            const maxX = window.innerWidth - 350  // Rechts: etwas Abstand
            const maxY = window.innerHeight - 50  // Unten

            const wallRepelForce = 2.5
            const wallRepelDistance = 100

            // Wall repulsion - immer aktiv!
            if (newPositions[proj.id].x < minX + wallRepelDistance) {
              const distance = newPositions[proj.id].x - minX
              velocities[proj.id].vx += wallRepelForce * Math.max(0, 1 - distance / wallRepelDistance)
            }
            if (newPositions[proj.id].x > maxX - wallRepelDistance) {
              const distance = maxX - newPositions[proj.id].x
              velocities[proj.id].vx -= wallRepelForce * Math.max(0, 1 - distance / wallRepelDistance)
            }
            if (newPositions[proj.id].y < minY + wallRepelDistance) {
              const distance = newPositions[proj.id].y - minY
              velocities[proj.id].vy += wallRepelForce * Math.max(0, 1 - distance / wallRepelDistance)
            }
            if (newPositions[proj.id].y > maxY - wallRepelDistance) {
              const distance = maxY - newPositions[proj.id].y
              velocities[proj.id].vy -= wallRepelForce * Math.max(0, 1 - distance / wallRepelDistance)
            }

            newPositions[proj.id].x = Math.max(minX, Math.min(maxX, newPositions[proj.id].x))
            newPositions[proj.id].y = Math.max(minY, Math.min(maxY, newPositions[proj.id].y))
          })

          return newPositions
        })

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animationFrameRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [])

  const handleHover = (projectId) => {
    setHoveredProject(projectId)
    const projectInfo = projectData.find(p => p.id === projectId)

    if (projectInfo?.hasVideo && !projectInfo?.isGif) {
      const videoElement = videoRefs.current[projectId]
      if (videoElement) {
        videoElement.play()
      }
    } else if (projectInfo?.usePreview) {
      for (let i = 0; i < projectInfo.previewCount; i++) {
        const img = new Image()
        img.src = getPreviewImage(projectId, i)
      }
      setPreviewIndex(prev => ({ ...prev, [projectId]: 0 }))
      
      const baseSpeed = 500
      const speed = baseSpeed
      
      const interval = setInterval(() => {
        setPreviewIndex(prev => ({
          ...prev,
          [projectId]: (prev[projectId] || 0) + 1
        }))
      }, speed)
      
      videoRefs.current[`${projectId}-interval`] = interval
    }
  }

  const handleLeave = (projectId) => {
    setHoveredProject(null)
    const projectInfo = projectData.find(p => p.id === projectId)
    const videoElement = videoRefs.current[projectId]

    if (projectInfo?.hasVideo) {
      if (videoElement) {
        videoElement.pause()
      }
    } else if (projectInfo?.usePreview) {
      clearInterval(videoRefs.current[`${projectId}-interval`])
    }
  }

useEffect(() => {
  const canvas = document.getElementById('grainCanvas')
  const ctx = canvas.getContext('2d')
  
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight 

  let mouseX = 0
  let mouseY = 0
  const particles = []

  // Erstelle Partikel überall auf der Canvas
  for (let i = 0; i < 200; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height + 45,
      vx: 0,
      vy: 0,
      size: Math.random() * 8 + 4, 
    })
  }

  const handleMouseMove = (e) => {
    mouseX = e.clientX
    mouseY = e.clientY 
  }

  window.addEventListener('mousemove', handleMouseMove)

  const drawGrain = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    particles.forEach(p => {
      // Abstoßung von der Maus
      const dx = p.x - mouseX
      const dy = p.y - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 300) {
        const force = (200 - distance) / 300
        p.vx += (dx / distance) * force * 3
        p.vy += (dy / distance) * force * 3
      }
      
      // Reibung
      p.vx *= 0.60
      p.vy *= 0.60
      
      // Position updaten
      p.x += p.vx
      p.y += p.vy
      
      // Grenzen
      if (p.x < 0) p.x = 0
      if (p.x > canvas.width) p.x = canvas.width
      if (p.y < 45) p.y = 45
      if (p.y > canvas.height * 2) p.y = canvas.height * 2
      
      // Zeichnen
      ctx.fillStyle = `rgba(255, 152, 224, 0.5)`
      ctx.fillRect(p.x, p.y, p.size * 1.6, p.size)
    })

    requestAnimationFrame(drawGrain)
  }

  drawGrain()

  return () => window.removeEventListener('mousemove', handleMouseMove)
}, [])

  return (
    <div style={{
      width: '100%',
      minHeight: '200vh',
      background: 'white',
      padding: '300px 40px 40px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grain Canvas */}
      <canvas
        id="grainCanvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          display: 'block',
        }}
      />

  <div style={{
    position: 'relative',
    zIndex: 10,
  }}></div>
      <div style={{
      position: 'absolute',
      left: '100px',
      top: '300px',
      fontFamily: '"Pixelify Sans", sans-serif',
      fontSize: '35px',
      color: '#0000ff',
      zIndex: 50,
      pointerEvents: 'none',
      writingMode: 'vertical-rl',
      textOrientation: 'upright',
      filter: 'drop-shadow(0px 0px 2.5px #0000ff)',
    }} 
    >
      Projekte
    </div>

    {/* Blur Effekt nach unten */}
    <div style={{
      position: 'absolute',
      top: '90px',
      left: 0,
      right: 0,
      height: '50px',
      background: 'linear-gradient(to bottom, rgba(0, 30, 255, 0.29), transparent)',
      pointerEvents: 'none',
      zIndex: 1,
    }}>
    </div>
      {projectData.map((project) => {
        const isHovered = hoveredProject === project.id
        const projectInfo = projectData.find(p => p.id === project.id)
        const pos = positions[project.id] || { x: 0, y: 0 }

        return (
          <div
            key={project.id}
            role="button"
            tabIndex={0}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              width: `${280 * projectInfo.scale}px`,
              transition: isHovered ? 'none' : 'none',
              zIndex: isHovered ? 1000 : 1,
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: `-10px 10px 25px ${projectInfo.shadowColor}20`,
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.5)' : 'scale(1)',
            }}
            onMouseEnter={() => handleHover(project.id)}
            onMouseLeave={() => handleLeave(project.id)}
            onClick={() => handleProjectClick(project.id)}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: `${(1 / projectInfo.aspectRatio) * 100}%`,
              cursor: 'pointer',
              background: '#eee',
            }}
            role="button"
            tabIndex={0}  
            >
              <img
                src={getCoverImage(project.id)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isHovered ? 0 : 1,
                  transition: 'opacity 0.3s',
                }}
              />

              {isHovered && projectInfo?.hasVideo && (
                <video
                  ref={el => videoRefs.current[project.id] = el}
                  src={getVideoSrc(project.id)}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loop
                  muted
                  autoPlay
                />
              )}

              {isHovered && projectInfo?.usePreview && (
                <img
                  key={`preview-${project.id}`}
                  src={getPreviewImage(project.id, (previewIndex[project.id] || 0) % projectInfo.previewCount)}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}

              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: '-1%',
                  left: 0,
                  right: 0,
                  padding: '15px',
                  maxHeight: '30px',
                  backdropFilter: 'blur(5px) brightness(1.2)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#0000ff',
                  fontSize: '15px',
                  fontFamily: '"Pixelify Sans", sans-serif',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textShadow: '0 0px 6px rgba(255, 133, 235, 0.64)',
                  boxSizing: 'border-box',
                }}>
                  {project.description || project.name}
                </div>
              )}
            </div>
          </div>
        )
      })}
      {/* Kontakt Button */}
      <div style={{
        position: 'absolute',
        bottom: '300px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        padding: '15px 40px',
        background: 'white',
        border: '5px solid #FF98E0',
        borderRadius: '15px',
        textAlign: 'center',
        fontSize: '24px',
        fontFamily: 'Helvetica, sans-serif',
        color: '#FF98E0',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(0, 0, 255, 0.5)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#FF98E0'
        e.currentTarget.style.color = 'white'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.color = '#FF98E0'
      }}
    >
        Kontakt
      </div>  
    </div>
  )
}