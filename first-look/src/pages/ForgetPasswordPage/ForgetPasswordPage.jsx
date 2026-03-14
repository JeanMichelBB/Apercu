import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './ForgetPasswordPage.css';

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      navigate(`/reset-code?email=${encodeURIComponent(email)}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login">
        <div className="container">
          <h1 className="heading">Forgot Password</h1>
          <p className="text">Enter your email and we'll send you a reset code.</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
              autoComplete="email"
            />
            <button type="submit" className="button" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgetPasswordPage;
