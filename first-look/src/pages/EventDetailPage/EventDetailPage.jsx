import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './EventDetailPage.css';

function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetches = [api.getEvent(id)];
    if (isLoggedIn) fetches.push(api.isRegistered(id));

    Promise.allSettled(fetches).then(([eventRes, regRes]) => {
      if (eventRes.status === 'fulfilled') setEvent(eventRes.value.data);
      else setError('Event not found.');
      if (regRes?.status === 'fulfilled') setRegistered(regRes.value.data.registered);
      setLoading(false);
    });
  }, [id]);

  const handleLoginToRegister = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.dispatchEvent(new CustomEvent('openLoginDropdown')), 250);
  };

  const handleRegister = async () => {
    if (!isLoggedIn) {
      handleLoginToRegister();
      return;
    }
    try {
      await api.registerForEvent(id);
      setRegistered(true);
      setActionMsg('');
    } catch (err) {
      setActionMsg(err.response?.data?.detail || 'Registration failed.');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel your registration for this event?')) return;
    try {
      await api.cancelRegistration(id);
      setRegistered(false);
      setActionMsg('');
    } catch (err) {
      setActionMsg(err.response?.data?.detail || 'Failed to cancel.');
    }
  };

  if (loading) return <div className="event-detail-page"><Header /><p className="event-detail-status">Loading...</p><Footer /></div>;
  if (error) return <div className="event-detail-page"><Header /><p className="event-detail-status event-detail-error">{error}</p><Footer /></div>;

  return (
    <div className="event-detail-page">
      <Header />
      <div className="event-detail-container">
        <button className="event-detail-back" onClick={() => navigate('/events')}>← Back to Events</button>

        <div className="event-detail-header">
          <h1 className="event-detail-title">{event.title}</h1>
          <div className="event-detail-meta">
            <span>📅 {new Date(event.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>📍 {event.location}</span>
            {event.capacity && <span>👥 Capacity: {event.capacity}</span>}
          </div>
        </div>

        <div className="event-detail-body">
          <p className="event-detail-description">{event.description}</p>
        </div>

        <div className="event-detail-register">
          {!isLoggedIn && (
            <button className="event-detail-btn" onClick={handleLoginToRegister}>
              Sign In to Register
            </button>
          )}
          {isLoggedIn && registered && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
              <p className="event-detail-success" style={{ margin: 0 }}>✓ You are registered for this event</p>
              <button className="event-detail-btn event-detail-btn-cancel" onClick={handleCancel}>
                Cancel Registration
              </button>
            </div>
          )}
          {isLoggedIn && !registered && (
            <button className="event-detail-btn" onClick={handleRegister}>
              Register for this Event
            </button>
          )}
          {actionMsg && <p className="event-detail-error" style={{ marginTop: '0.75rem' }}>{actionMsg}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EventDetailPage;
