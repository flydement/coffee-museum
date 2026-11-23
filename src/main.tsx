import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

if (
  'serviceWorker' in navigator &&
  window.location.protocol.startsWith('http') &&
  !window.coffeeMuseumDesktop?.isDesktop
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // Service worker registration is optional in non-HTTPS local preview
    })
  })
}
