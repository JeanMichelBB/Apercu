import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './ContactForm.css';
import { apiUrl } from '../../api';
import { useTranslation } from 'react-i18next';

const useCharacterLimit = (initialValue, limit) => {
  const [value, setValue] = useState(initialValue);
  const handleChange = (newValue) => {
    if (newValue.length <= limit) setValue(newValue);
  };
  return [() => value, handleChange, setValue];
};

const ContactForm = () => {
  const location = useLocation();
  const [planName, setPlanName] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    if (plan) setPlanName(plan);
  }, [location.search]);

  const [getSubject, setSubject, resetSubject] = useCharacterLimit('', 50);
  const [getFirstName, setFirstName] = useCharacterLimit('', 50);
  const [getLastName, setLastName] = useCharacterLimit('', 50);
  const [getEmail, setEmail] = useCharacterLimit('', 50);
  const [getPhoneNumber, setPhoneNumber] = useCharacterLimit('', 20);
  const [getAdditionalInfo, setAdditionalInfo] = useCharacterLimit('', 250);
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    if (planName) setSubject(t('contactForm.inquirySubject', { planName }));
  }, [planName, setSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    setLoading(true);
    try {
      await axios.post(`${apiUrl}/submit-form`, {
        subject: getSubject(),
        first_name: getFirstName(),
        last_name: getLastName(),
        email: getEmail(),
        phone_number: getPhoneNumber(),
        additional_info: getAdditionalInfo(),
      });
      resetSubject('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setAdditionalInfo('');
      setSubmissionStatus('success');
    } catch {
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-body">
      <div className="contact-info">
        <h2 className="contact-info-title">Contact Information</h2>
        <p className="contact-info-desc">Fill out the form and our team will get back to you within 24 hours.</p>

        <div className="contact-info-cards">
          <div className="contact-info-card">
            <span className="contact-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <div>
              <p className="contact-info-label">Email</p>
              <p className="contact-info-value">hello@sacenpapier.org</p>
            </div>
          </div>

          <div className="contact-info-card">
            <span className="contact-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <div>
              <p className="contact-info-label">Location</p>
              <p className="contact-info-value">Québec, Canada</p>
            </div>
          </div>

          <div className="contact-info-card">
            <span className="contact-info-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </span>
            <div>
              <p className="contact-info-label">Response time</p>
              <p className="contact-info-value">Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <h2 className="contact-form-title">Send a Message</h2>

        {submissionStatus === 'success' && (
          <div className="contact-success">
            Message sent successfully! We'll be in touch soon.
          </div>
        )}
        {submissionStatus === 'error' && (
          <div className="contact-error">
            Something went wrong. Please try again.
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-row">
            <div className="contact-field">
              <label className="contact-label">First Name</label>
              <input
                type="text"
                value={getFirstName()}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="contact-input"
                placeholder="Jean"
              />
            </div>
            <div className="contact-field">
              <label className="contact-label">Last Name</label>
              <input
                type="text"
                value={getLastName()}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="contact-input"
                placeholder="Dupont"
              />
            </div>
          </div>

          <div className="contact-field">
            <label className="contact-label">Email</label>
            <input
              type="email"
              value={getEmail()}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="contact-input"
              placeholder="you@example.com"
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">Phone <span className="contact-label-optional">(optional)</span></label>
            <input
              type="tel"
              value={getPhoneNumber()}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="contact-input"
              placeholder="+1 (514) 000-0000"
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">Subject</label>
            <input
              type="text"
              value={getSubject()}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="contact-input"
              placeholder="How can we help?"
            />
          </div>

          <div className="contact-field">
            <label className="contact-label">Message</label>
            <textarea
              value={getAdditionalInfo()}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              required
              className="contact-input contact-textarea"
              placeholder="Tell us more..."
            />
            <span className="contact-char-count">{getAdditionalInfo().length}/250</span>
          </div>

          {/* Honeypot */}
          <div style={{ display: 'none' }}>
            <input type="text" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <button type="submit" className="contact-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
