import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './index.css'

// After a redeploy, a client holding a stale index.html may request chunk
// hashes that no longer exist. Vite emits `vite:preloadError`; reload once to
// pick up the fresh index.html instead of leaving the user on a broken page.
window.addEventListener('vite:preloadError', () => {
  if (!sessionStorage.getItem('chunk-reloaded')) {
    sessionStorage.setItem('chunk-reloaded', '1')
    window.location.reload()
  }
})

const RootFallback = (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      fontFamily: 'Outfit, sans-serif',
      color: '#ff6d00',
      textAlign: 'center',
      padding: '2rem',
    }}
  >
    <h1 style={{ margin: 0 }}>Durga Shankar</h1>
    <p style={{ color: '#555', maxWidth: 420 }}>
      Something went wrong loading the page. Please refresh.
    </p>
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: '0.6rem 1.4rem',
        border: 'none',
        borderRadius: 8,
        background: '#ff6d00',
        color: '#fff',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      Reload
    </button>
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback={RootFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
