import CursorCanvas from './components/CursorCanvas'
import DeskItems from './components/DeskItems'
import HintText from './components/HintText'
import Logo from './components/Logo'
import BurgerMenu from './components/BurgerMenu'
import Projects from './components/Projects'

export default function App() {
  return (
    <>
      {/* Fixed Elemente (Cursor, Logo, Menü) */}
      <CursorCanvas />
      <Logo />
      <BurgerMenu />

      {/* Scrollable Content */}
      <div style={{ width: '100vw' }}>
        
        {/* Landingpage */}
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          position: 'relative',
          overflow: 'visible',
        }}>
          <HintText text="Scroll um Projekte zu sehen" />
          
          <div style={{
            textAlign: 'center',
            fontFamily: 'sans-serif',
            fontSize: '16px',
            lineHeight: '1.6',
            maxWidth: '400px',
            zIndex: 1,
            pointerEvents: 'none',
          }}>
            <p>Bonita von Gizycki</p>
            <p>Designer und Creative Technologist ✩‧༺☆⋆.˚✮˚.⋆☆༻‧✩ 2D & 3D Grafikdesign (und UX/UI), Coding, Illustration, Storytelling, Animation & Film. (*ᴗ͈ˬᴗ͈)ꕤ*.ﾟ</p>
          </div>

          <DeskItems />
        </div>

        {/* Projekte */}
        <Projects />

      </div>
    </>
  )
}