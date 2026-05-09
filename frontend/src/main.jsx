// AT THE VERY TOP - must be before ANY other imports
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window; // Some legacy libs look for global
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketProvider } from './hooks/useSocket'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>,
)
