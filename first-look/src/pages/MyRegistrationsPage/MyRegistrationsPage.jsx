import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import { isLoggedIn } from '../../services/auth';
import './MyRegistrationsPage.css';

function MyRegistrationsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(true);
  const [resendMsg, setResendMsg] = useState('');
  const navigate = useNavigate();

  const load = () => {
    api.getMyRegistrations()
      .then((res) => setEvents(res.data))
      .catch(() => setError('Failed to load your registrations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return; }
    api.getEmailVerifiedStatus().then((r) => setEmailVerified(r.data.email_verified)).catch(() => {});
    load();
  }, []);

  const handleCancel = async (eventId) => {
    if (!window.confirm('Cancel your registration for this event?')) return;
    await api.cancelRegistration(eventId);
    load();
  };

  return (
    <div className="my-reg-page">
      <Header />
      <div className="my-reg-container">
        <h1 className="my-reg-title">My Registrations</h1>

        {!emailVerified && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: '#fff8e1', border: '1px solid #f0a500', borderRadius: 8, fontSize: '0.9rem' }}>
            <strong>⚠ Your email is not verified.</strong> You won't be able to register for events until you confirm your email.{' '}
            <button
              onClick={async () => {
                try {
                  await api.resendVerification();
                  setResendMsg('A new verification link has been logged. Check the backend console.');
                } catch {
                  setResendMsg('Could not send. Please try again.');
                }
              }}
              style={{ background: 'none', border: 'none', color: '#1a6ef5', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: 'inherit' }}
            >
              Resend verification link
            </button>
            {resendMsg && <p style={{ margin: '0.5rem 0 0', color: '#555' }}>{resendMsg}</p>}
          </div>
        )}

        {loading && <p className="my-reg-status">Loading...</p>}
        {error && <p className="my-reg-status my-reg-error">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <div className="my-reg-empty">
            <p>You have not registered for any events yet.</p>
            <Link to="/events" className="my-reg-browse-btn">Browse Events</Link>
          </div>
        )}

        <div className="my-reg-list">
          {events.map((event) => (
            <div key={event.id} className="my-reg-card-wrapper">
              <Link to={`/events/${event.id}`} className="my-reg-card">
                <div className="my-reg-card-date">
                  {new Date(event.date).toLocaleDateString('en-CA', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </div>
                <h2 className="my-reg-card-title">{event.title}</h2>
                <p className="my-reg-card-location">{event.location}</p>
                <span className="my-reg-card-link">View event →</span>
              </Link>
              <button className="my-reg-cancel-btn" onClick={() => handleCancel(event.id)}>
                Cancel Registration
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyRegistrationsPage;
