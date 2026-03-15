import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './LoginPage.css';

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const redirect = new URLSearchParams(window.location.search).get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let token, role;
      try {
        const res = await api.userLogin({ email, password });
        token = res.data.token;
        role = JSON.parse(atob(token.split('.')[1])).role;
      } catch {
        const res = await api.adminLogin(email, password);
        token = res.data.token;
        role = 'admin';
      }
      localStorage.setItem('token', token);
      setToken(token);
      window.location.href = redirect ?? (role === 'admin' ? '/admin' : '/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-panel-right">
        <div className="auth-form-box">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="auth-form">
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
                autoFocus
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
                autoComplete="current-password"
              />
            </div>

            <div className="auth-forgot">
              <a href="/forget-password" className="auth-link">Forgot password?</a>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="auth-link auth-link-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="auth-panel-left">
        <div className="auth-panel-left-content">
          <p className="auth-brand-tagline">Your window into the best events.</p>
          <ul className="auth-feature-list">
            <li><span className="auth-feature-icon">✦</span>Discover and register for events near you</li>
            <li><span className="auth-feature-icon">✦</span>Follow speakers and get notified</li>
            <li><span className="auth-feature-icon">✦</span>Manage all your registrations in one place</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
