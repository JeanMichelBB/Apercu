import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import '../ForgetPasswordPage/ForgetPasswordPage.css';

const ResetPasswordPage = () => {
  const token = new URLSearchParams(window.location.search).get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login">
        <div className="container">
          <h1 className="heading">New Password</h1>
          <p className="text">Choose a new password for your account.</p>
          {success ? (
            <p className="success">Password updated! Redirecting to home...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="input"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button type="submit" className="button" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </button>
              {error && <p className="error">{error}</p>}
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
