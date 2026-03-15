import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isLoggedIn, isAdmin, isOrganizer, getInitial, getDisplayName, signOut } from '../../services/auth';
import api from '../../services/api';
import './Header.css';

const Header = () => {
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginIconPulse, setLoginIconPulse] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      if (!isLoggedIn()) {
        setLoginError('');
        setDropdownOpen(true);
        setLoginIconPulse(true);
        setTimeout(() => setLoginIconPulse(false), 600);
      }
    };
    window.addEventListener('openLoginDropdown', handler);
    return () => window.removeEventListener('openLoginDropdown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      let token;
      try {
        const res = await api.userLogin({ email, password });
        token = res.data.token;
      } catch {
        const res = await api.adminLogin(email, password);
        token = res.data.token;
      }
      localStorage.setItem('token', token);
      window.location.reload();
    } catch {
      setLoginError('Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const navLinks = [
    { to: '/events', label: 'Events' },
    { to: '/speakers', label: 'Speakers' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: t('header.about') },
    { to: '/contact', label: t('header.contact') },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="Link"><h2 className="text-logo">{t('header.logo')}</h2></Link>

        <nav className={`header-nav${mobileOpen ? ' header-nav--open' : ''}`}>
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `link${isActive ? ' link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="header-auth">
          {!loggedIn && (
            <Link to="/register" className="header-signup-btn">Sign Up</Link>
          )}

          {loggedIn ? (
            <div className="auth-dropdown" ref={dropdownRef}>
              <button
                className="auth-avatar"
                onClick={() => setDropdownOpen((o) => !o)}
                title={getDisplayName()}
              >
                {getInitial()}
              </button>
              {dropdownOpen && (
                <div className="auth-dropdown-menu">
                  <p className="auth-dropdown-name">{getDisplayName()}</p>
                  {isAdmin() && (
                    <Link to="/admin" className="auth-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  {isOrganizer() && (
                    <Link to="/organizer" className="auth-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      My Dashboard
                    </Link>
                  )}
                  {!isAdmin() && !isOrganizer() && (
                    <Link to="/my-registrations" className="auth-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      My Registrations
                    </Link>
                  )}
                  <Link to="/settings" className="auth-dropdown-item" onClick={() => setDropdownOpen(false)}>
                    Settings
                  </Link>
                  <button className="auth-dropdown-item auth-dropdown-signout" onClick={signOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-dropdown" ref={dropdownRef}>
              <button
                className={`auth-login-icon${loginIconPulse ? ' auth-login-icon--pulse' : ''}`}
                onClick={() => { setDropdownOpen((o) => !o); setLoginError(''); }}
                title="Sign In"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="auth-dropdown-menu auth-login-dropdown">
                  <p className="auth-dropdown-name">Sign In</p>
                  <form className="auth-login-form" onSubmit={handleLogin}>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="auth-login-input"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="auth-login-input"
                    />
                    {loginError && <p className="auth-login-error">{loginError}</p>}
                    <button type="submit" className="auth-login-btn" disabled={loginLoading}>
                      {loginLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>
                  <div className="auth-login-footer">
                    <Link to="/forget-password" className="auth-dropdown-item" onClick={() => setDropdownOpen(false)}>
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            className={`hamburger${mobileOpen ? ' hamburger--open' : ''}`}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `mobile-nav-link${isActive ? ' mobile-nav-link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
