import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App'
import './global.css'
import './i18n';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
