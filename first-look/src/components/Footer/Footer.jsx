import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">

      {/* Brand */}
      <div className="footer-brand">
        <Link to="/" className="footer-logo" onClick={scrollToTop}>Aperçu</Link>
        <p className="footer-tagline">
          Discover, attend, and host events — all in one place.
        </p>
        <p className="footer-portfolio-note">
          A full-stack portfolio project built with React&nbsp;&amp;&nbsp;FastAPI.
        </p>
      </div>

      {/* Explore */}
      <div className="footer-col">
        <h4 className="footer-col-title">Explore</h4>
        <Link to="/events" className="footer-link" onClick={scrollToTop}>Events</Link>
        <Link to="/blog" className="footer-link" onClick={scrollToTop}>Blog</Link>
        <Link to="/speakers" className="footer-link" onClick={scrollToTop}>Speakers</Link>
      </div>

      {/* Platform */}
      <div className="footer-col">
        <h4 className="footer-col-title">Platform</h4>
        <Link to="/host" className="footer-link" onClick={scrollToTop}>Host an Event</Link>
        <Link to="/register" className="footer-link" onClick={scrollToTop}>Create Account</Link>
        <Link to="/login" className="footer-link" onClick={scrollToTop}>Sign In</Link>
      </div>

      {/* Company */}
      <div className="footer-col">
        <h4 className="footer-col-title">Company</h4>
        <Link to="/about" className="footer-link" onClick={scrollToTop}>About</Link>
        <Link to="/contact" className="footer-link" onClick={scrollToTop}>Contact</Link>
      </div>

    </div>

    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Aperçu. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
