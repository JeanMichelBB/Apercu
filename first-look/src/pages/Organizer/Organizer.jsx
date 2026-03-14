import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { getTokenPayload, signOut } from '../../services/auth';
import './Organizer.css';

function Organizer() {
  const navigate = useNavigate();

  useEffect(() => {
    const payload = getTokenPayload();
    if (!payload || !['organizer', 'admin'].includes(payload.role)) {
      navigate('/login');
    }
  }, []);

  return (
    <div className="organizer-page">
      <Header />
      <div className="organizer-layout">
        <nav className="organizer-sidebar">
          <p className="organizer-sidebar-title">Organizer</p>
          <NavLink to="/organizer" end className={({ isActive }) => 'organizer-nav-link' + (isActive ? ' active' : '')}>My Events</NavLink>
          <NavLink to="/organizer/create" className={({ isActive }) => 'organizer-nav-link' + (isActive ? ' active' : '')}>Create Event</NavLink>
          <div className="organizer-sidebar-divider" />
          <button className="organizer-nav-link organizer-nav-signout" onClick={signOut}>Sign Out</button>
        </nav>
        <main className="organizer-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Organizer;
