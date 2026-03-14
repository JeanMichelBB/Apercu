import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import { getDisplayName, getTokenPayload } from '../../services/auth';
import './SettingsPage.css';

function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const payload = getTokenPayload();
  if (!payload) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');
    if (newPassword !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.changePassword({ current_password: currentPassword, new_password: newPassword });
      setStatus('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <Header />
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-profile">
          <div className="settings-avatar">{getDisplayName()?.charAt(0).toUpperCase()}</div>
          <div>
            <p className="settings-name">{getDisplayName()}</p>
            <p className="settings-role">{payload.role}</p>
          </div>
        </div>

        <div className="settings-section">
          <h2 className="settings-section-title">Change Password</h2>
          <form className="settings-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
            {error && <p className="settings-error">{error}</p>}
            {status && <p className="settings-success">{status}</p>}
            <button type="submit" className="settings-btn" disabled={loading}>
              {loading ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SettingsPage;
