import React, { useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { isAdmin, signOut } from '../../services/auth';
import './Admin.css';

const Admin = ({ token }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !isAdmin()) navigate('/login');
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="admin-page">
      <Header />
      <div className="admin-layout">
        <nav className="admin-sidebar">
          <p className="admin-sidebar-title">Admin</p>
          <NavLink to="/admin" end className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Dashboard</NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Events</NavLink>
          <NavLink to="/admin/speakers" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Speakers</NavLink>
          <NavLink to="/admin/posts" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Blog Posts</NavLink>
          <NavLink to="/admin/contacts" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Contacts</NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => 'admin-nav-link' + (isActive ? ' active' : '')}>Users</NavLink>
          <div className="admin-sidebar-divider" />
          <button className="admin-nav-link admin-nav-signout" onClick={signOut}>Sign Out</button>
        </nav>
        <main className="admin-content">
          <Outlet context={{ token }} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
