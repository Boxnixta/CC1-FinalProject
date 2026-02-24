import CursorCanvas from './components/CursorCanvas'

export default function App() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', background: 'white' }}>
      
      {/* Cursor läuft über allem */}
      <CursorCanvas />

      {/* Hier kommt später dein Portfolio-Inhalt rein */}
      <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
        <p>Portfolio kommt hier rein...</p>
      </div>

    </div>
  )
}