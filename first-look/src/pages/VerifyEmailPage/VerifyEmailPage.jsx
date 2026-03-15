import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found in the link.');
      return;
    }
    setStatus('loading');
    try {
      const res = await api.verifyEmail(token);
      setStatus('success');
      setMessage(res.data.detail || 'Email verified successfully!');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'This link is invalid or has already been used.');
    }
  };

  return (
    <div>
      <Header />
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          {status === 'idle' && (
            <>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Verify your email</h1>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>
                Click the button below to confirm your email address and unlock event registration.
              </p>
              <button
                onClick={handleVerify}
                style={{
                  background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 6,
                  padding: '0.75rem 2rem', fontSize: '1rem', cursor: 'pointer', fontWeight: 600,
                }}
              >
                Verify my email
              </button>
            </>
          )}

          {status === 'loading' && (
            <p style={{ color: '#555' }}>Verifying...</p>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✓</div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#1a7a1a' }}>Email verified!</h1>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>{message}</p>
              <Link
                to="/events"
                style={{
                  background: '#1a1a1a', color: '#fff', borderRadius: 6,
                  padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: 600, textDecoration: 'none',
                }}
              >
                Browse Events
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✕</div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: '#c00' }}>Verification failed</h1>
              <p style={{ color: '#555', marginBottom: '1.5rem' }}>{message}</p>
              <Link to="/" style={{ color: '#1a6ef5', textDecoration: 'underline' }}>Go back home</Link>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VerifyEmailPage;
