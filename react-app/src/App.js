import {Route, Routes, BrowserRouter } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import AboutPage from './pages/AboutPage/AboutPage'
import ContactPage from './pages/ContactPage/ContactPage'
import NoPage from './pages/NoPage/NoPage'
import DB from './pages/DB/DB'
import LoginPage from './pages/LoginPage/LoginPage'
import './global.css'

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/db" element={<DB />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
