import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CookieBanner.css';

const STORAGE_KEY = 'cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY));

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-banner-content">

        <div className="cookie-project-notice">
          <span className="cookie-project-badge">Portfolio Project</span>
          <p className="cookie-project-text">
            Aperçu is a full-stack event management platform built as a portfolio project.
            It demonstrates a React + FastAPI + MySQL stack with role-based auth, event workflows,
            organizer dashboards, and a blog — currently in active development.
          </p>
        </div>

        <div className="cookie-divider" />

        <div className="cookie-consent-row">
          <p className="cookie-banner-text">
            This site uses cookies to improve your experience.{' '}
            <Link to="/about" className="cookie-banner-link">Learn more</Link>
          </p>
          <div className="cookie-banner-actions">
            <button className="cookie-btn cookie-btn-decline" onClick={handleDecline}>
              Decline
            </button>
            <button className="cookie-btn cookie-btn-accept" onClick={handleAccept}>
              Accept
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CookieBanner;
