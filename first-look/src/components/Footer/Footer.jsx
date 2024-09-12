import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Import the CSS file

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const Footer = () => {
  return (
    <footer className="footer"> 
      <h2 className="title">Aperçu</h2> 
      <div className="content"> 
        <div className="left-content"> 
          <p><Link to="/" className="link" onClick={scrollToTop}>Accueil</Link></p>
          <p><Link to="/service" className="link" onClick={scrollToTop}>Services</Link></p>
          <p><Link to="/pricing" className="link" onClick={scrollToTop}>Tarification</Link></p>
        </div>
        <span className="section"></span> 
        <div className="right-content"> 
          <p><Link to="/about" className="link" onClick={scrollToTop}>À propos de nous</Link></p>
          <p><Link to="/contact" className="link" onClick={scrollToTop}>Contactez-nous</Link></p>
        </div>
      </div>
      <div className="copy-right">&copy; {new Date().getFullYear()} Tous droits réservés.</div>
    </footer>
  );
};

export default Footer;
