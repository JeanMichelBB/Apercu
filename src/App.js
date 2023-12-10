import {Route, Routes, BrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import NoPage from './pages/NoPage'

export default function App() {
  return (
    <div>
    <BrowserRouter>
        <Routes>
          <Route path="*" element={<NoPage />} />
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
    </BrowserRouter>
    </div>
  )
}
