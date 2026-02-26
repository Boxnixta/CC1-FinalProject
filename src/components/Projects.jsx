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
  { id: 'bachelor', name: 'Bachelor', hasVideo: true, scale: 2.2, aspectRatio: 1.95 }, 
  { id: 'coding', name: 'Coding', hasVideo: false, usePreview: true, previewCount: 1, isGif: true, scale: 0.9, aspectRatio: 1.2 }, 
  { id: 'coverart', name: 'Cover Art', hasVideo: false, usePreview: true, previewCount: 4, scale: 1.0, aspectRatio: 1.0 }, 
  { id: 'dreidprojekte', name: '3D Projekte', hasVideo: true, scale: 1.5, aspectRatio: 1.9 },
  { id: 'fotografiedreid', name: 'Fotografie 3D', hasVideo: false, usePreview: true, previewCount: 7, scale: 1.0, aspectRatio: 0.8 },
  { id: 'kleinseincomic', name: 'Kleinsein Comic', hasVideo: false, usePreview: true, previewCount: 14, scale: 1.4, aspectRatio: 1.5 },
  { id: 'magazine', name: 'Magazine', hasVideo: false, usePreview: true, previewCount: 16, scale: 1.8, aspectRatio: 1.8 },
  { id: 'novakinderbuch', name: 'Nova Kinderbuch', hasVideo: true, scale: 1.6, aspectRatio: 1.5 },
  { id: 'veranstaltungen', name: 'Veranstaltungen', hasVideo: true, scale: 1.1, aspectRatio: 0.7 },
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
      const floatSpeed = 0.03  

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
            newPositions[proj.id].x += Math.sin(floatPhase[proj.id]) * 0.15
            newPositions[proj.id].y += Math.cos(floatPhase[proj.id]) * 0.15

            // Sanfte Grenzen
            const maxX = window.innerWidth - 300
            const maxY = window.innerHeight - 250
            newPositions[proj.id].x = Math.max(0, Math.min(maxX, newPositions[proj.id].x))
            newPositions[proj.id].y = Math.max(0, Math.min(maxY, newPositions[proj.id].y))
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
      setPreviewIndex(prev => ({ ...prev, [projectId]: 0 }))
      
      const baseSpeed = 600
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

  return (
    <div style={{
      width: '100%',
      minHeight: '200vh',
      background: 'white',
      padding: '60px 40px 40px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
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
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              cursor: 'pointer',
            }}
            onMouseEnter={() => handleHover(project.id)}
            onMouseLeave={() => handleLeave(project.id)}
            onClick={() => handleProjectClick(project.id)}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: `${(1 / projectInfo.aspectRatio) * 100}%`,
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.3s ease',
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
                  key={`preview-${project.id}-${previewIndex[project.id]}`}
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
                  bottom: -2,
                  left: 0,
                  right: 0,
                  padding: '15px',
                  backdropFilter: 'blur(5px)',
                  color: '#1e00ff',
                  fontSize: '30px',
                  fontFamily: '"Pixelify Sans", sans-serif',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {project.name}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}