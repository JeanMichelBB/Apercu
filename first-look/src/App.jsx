import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter, useNavigate, Outlet } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import ServicePage from './pages/ServicePage/ServicePage';
import PricingPage from './pages/PricingPage/PricingPage';
import NoPage from './pages/NoPage/NoPage';
import Admin from './pages/Admin/Admin';
import LoginPage from './pages/LoginPage/LoginPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage/ForgetPasswordPage';
import './global.css';

function AdminLayout({ token }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  } 

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState('');

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NoPage />} />
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/login" element={<LoginPage setToken={setToken} />} />
          <Route path="/admin" element={<AdminLayout token={token} />}>
            <Route index element={<Admin token={token} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
