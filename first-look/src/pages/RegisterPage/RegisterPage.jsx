import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './RegisterPage.css';

const RegisterPage = ({ setToken }) => {
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
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
    <div>
      <Header />
      <div className="register">
        <div className="register-container">
          <h1 className="heading">Create an Account</h1>

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

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              required
              autoComplete="name"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
              autoComplete="new-password"
              minLength={6}
            />
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Creating account...' : `Sign Up as ${role === 'user' ? 'Attendee' : 'Organizer'}`}
            </button>
            {error && <p className="error">{error}</p>}
          </form>

          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            Already have an account? <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} style={{ color: '#000', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
