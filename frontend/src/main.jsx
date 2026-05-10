import { Buffer } from 'buffer'
if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.global = window
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { SocketProvider } from './hooks/useSocket'
// import { WalletContext } from './components/WalletContextProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      {/* <WalletContext> */}
        <App />
      {/* </WalletContext> */}
    </SocketProvider>
  </StrictMode>,
)
