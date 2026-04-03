import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#111118',
          border: '1px solid #2A2A3A',
          color: '#F0EFFF',
          fontFamily: 'DM Sans, sans-serif',
        },
      }}
    />
  </StrictMode>,
)
