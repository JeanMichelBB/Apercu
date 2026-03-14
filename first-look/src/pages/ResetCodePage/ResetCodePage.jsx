import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import '../ForgetPasswordPage/ForgetPasswordPage.css';
import './ResetCodePage.css';

const DIGITS = 6;

const ResetCodePage = () => {
  const email = new URLSearchParams(window.location.search).get('email') || '';
  const [digits, setDigits] = useState(Array(DIGITS).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const code = digits.join('');

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < DIGITS - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGITS);
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIndex = Math.min(pasted.length, DIGITS - 1);
    inputsRef.current[focusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.verifyResetCode(email, code);
      navigate(`/reset-password?token=${encodeURIComponent(res.data.reset_token)}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired code.');
      setDigits(Array(DIGITS).fill(''));
      inputsRef.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="login">
        <div className="container">
          <h1 className="heading">Enter Reset Code</h1>
          <p className="text">
            A 6-digit code was sent to <strong>{email}</strong>.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="otp-inputs">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="otp-digit"
                  autoComplete="one-time-code"
                />
              ))}
            </div>
            <button type="submit" className="button" disabled={loading || code.length !== DIGITS}>
              {loading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetCodePage;
