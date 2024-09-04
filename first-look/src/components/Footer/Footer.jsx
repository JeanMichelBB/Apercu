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
          <p><strong>Coordonnées</strong></p>
          <p><strong>Phone:</strong> (555) 555-5555</p>
          <p><strong>Email:</strong> <a href="mailto:your-email@example.com">your-email@example.com</a></p>
          <p><strong>Address:</strong> 1234 rue de la rue, Ville, Province, Pays</p>
        </div>
        <span className="section"></span> 
        <div className="right-content"> 
          <p><Link to="/" className="link" onClick={scrollToTop}>Accueil</Link></p>
          <p><Link to="/about" className="link" onClick={scrollToTop}>À propos de nous</Link></p>
          <p><Link to="/contact" className="link" onClick={scrollToTop}>Contactez-nous</Link></p>
        </div>
      </div>
      <div className="copy-right">&copy; {new Date().getFullYear()} Tous droits réservés.</div>
    </footer>
  );
};

export default Footer;
