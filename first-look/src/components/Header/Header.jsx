import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Header.css'; // Import the CSS file for styles

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="left-container">
          <a href="/" className="link"><h2>Aperçu</h2></a>
        </div>
        <div className="right-container">
          <Link to="/" className="link">Accueil</Link>
          <Link to="/about" className="link">À propos de nous</Link>
          <Link to="/contact" className="link">Contactez-nous</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
