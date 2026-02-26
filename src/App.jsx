import CursorCanvas from './components/CursorCanvas'
import DeskItems from './components/DeskItems'
import HintText from './components/HintText'
import Logo from './components/Logo'
import BurgerMenu from './components/BurgerMenu'

export default function App() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: 'white' }}>
      
      <CursorCanvas />
      <Logo />
      <BurgerMenu />

      {/* Landingpage */}
      <div style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <HintText text="Scroll um Projekte zu sehen" />
        
        {/* Infotext */}
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

        {/* PNGs kommen hier drüber */}
        <DeskItems />

      </div>

    </div>
  )
}