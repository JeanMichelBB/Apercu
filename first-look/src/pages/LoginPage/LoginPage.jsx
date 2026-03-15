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
      // Try user login first, fall back to admin login
      let token;
      let role;
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
    <div>
      <Header />
      <div className="login">
        <div className="container">
          <h1 className="heading">Sign In</h1>
          <p className="text">Welcome back</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              autoComplete="email"
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              autoComplete="current-password"
            />
            <a href="/forget-password" className="link">Forgot password?</a>
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <p className="error">{error}</p>}
          </form>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Don't have an account? <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} style={{ color: '#000', fontWeight: 600 }}>Sign Up</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
