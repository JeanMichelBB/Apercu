import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './RegisterPage.css';

const RegisterPage = ({ setToken }) => {
  const initialRole = new URLSearchParams(window.location.search).get('role') === 'organizer' ? 'organizer' : 'user';
  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const redirect = new URLSearchParams(window.location.search).get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, role });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      window.location.href = redirect ?? (role === 'organizer' ? '/organizer' : '/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-panel-right">
          <div className="auth-form-box">
            <h1 className="auth-title">Create an Account</h1>
            <p className="auth-subtitle">Choose your account type to get started</p>

            <div className="register-tabs">
              <button
                className={`register-tab ${role === 'user' ? 'active' : ''}`}
                onClick={() => setRole('user')}
                type="button"
              >
                Attendee
              </button>
              <button
                className={`register-tab ${role === 'organizer' ? 'active' : ''}`}
                onClick={() => setRole('organizer')}
                type="button"
              >
                Organizer
              </button>
            </div>

            <p className="register-role-desc">
              {role === 'user'
                ? 'Browse and register for events.'
                : 'Create and manage your own events.'}
            </p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">Full Name</label>
                <input
                  type="text"
                  placeholder="Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Creating account...' : `Sign Up as ${role === 'user' ? 'Attendee' : 'Organizer'}`}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="auth-link auth-link-bold">
                Sign In
              </Link>
            </p>
          </div>
      </div>

      <div className="auth-panel-left">
        <div className="auth-panel-left-content">
          <p className="auth-brand-tagline">Join a community of event-goers and creators.</p>
          <ul className="auth-feature-list">
            <li><span className="auth-feature-icon">✦</span>Register for events with one click</li>
            <li><span className="auth-feature-icon">✦</span>Host your own events and reach your audience</li>
            <li><span className="auth-feature-icon">✦</span>Track all your past and upcoming events</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
