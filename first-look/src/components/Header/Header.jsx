import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Header.css'; // Import the CSS file for styles

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="left-container">
          <a href="/" className="link"><h2 className='text-logo'>Aperçu</h2></a>
        </div>
        <div className="right-container">
          <Link to="/service" className="link">Services</Link>
          <Link to="/pricing" className="link">Tarification</Link>
          {/* use a url for the portfolio */}
          <a href="https://jeanmichelbb.github.io/" className="link">Portfolio</a>
          <Link to="/about" className="link">À propos</Link>
          <Link to="/contact" className="link">Contactez-nous</Link>
          {/* language button */}
          <button className="language-button">EN</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
