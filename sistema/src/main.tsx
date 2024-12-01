import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("No se encontró el elemento con id 'root' en el HTML.")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
