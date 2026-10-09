import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { inject } from '@vercel/analytics'
import './styles/globals.css'
import App from './App'
import { applyTextOverrides } from './v2/textOverrides'

// Initialize Vercel Web Analytics
inject()
applyTextOverrides()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
