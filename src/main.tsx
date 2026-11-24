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
  let refreshing = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return
    refreshing = true
    window.location.reload()
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { updateViaCache: 'none' })
      .then((reg) => {
        void reg.update()
      })
      .catch(() => {
        // Service worker registration is optional in local preview
      })
  })
}
