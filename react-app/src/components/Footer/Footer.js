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
    <footer className="footer"> {/* Apply the footer class */}
      <h2 className="title">Aperçu</h2>
      <div className="content"> {/* Apply the content class */}
        <div className="left-content"> {/* Apply the left-content class */}
          <p><strong>Coordonnées</strong></p>
          <p><strong>Phone:</strong> (450) 359-7171</p>
          <p><strong>Email:</strong> <a href="mailto:your-email@example.com">your-email@example.com</a></p>
          <p><strong>Address:</strong> 145 Boulevard Saint-Joseph Bureau 225, Saint-Jean-sur-Richelieu, Quebec J3B 1W5</p>
        </div>
        <span className="section"></span> {/* Apply the section class */}
        <div className="right-content"> {/* Apply the right-content class */}
          <p><Link to="/" className="link" onClick={scrollToTop}>Accueil</Link></p>
          <p><Link to="/about" className="link" onClick={scrollToTop}>À propos de nous</Link></p>
          <p><Link to="/contact" className="link" onClick={scrollToTop}>Contactez-nous</Link></p>
        </div>
      </div>
      <div className="copy-right">&copy; {new Date().getFullYear()} Bérubé et Associés Avocats. Tous droits réservés.</div>
    </footer>
  );
};

export default Footer;
