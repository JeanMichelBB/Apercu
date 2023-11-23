// Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={leftContainerStyle}>
        {/* Add your company logo or name */}
        <img src="/path/to/your/logo.png" alt="Logo" style={logoStyle} />
        <p>&copy; {new Date().getFullYear()} Bérubé et Associés Avocats</p>
      </div>
      <div style={rightContainerStyle}>
        <Link to="/privacy" style={linkStyle}>Politique de confidentialité</Link>
        <Link to="/terms" style={linkStyle}>Conditions d'utilisation</Link>
        <a href="mailto:info@example.com" style={linkStyle}>Contactez-nous</a>
      </div>
    </footer>
  );
};

// Styles
const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 0', // Increased padding for more height
  background: '#333', // Set your desired background color
  color: '#fff', // Set your desired text color
  bottom: 0,
  width: '100%',
};

const leftContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 1rem',
};

const logoStyle = {
  width: '50px', // Set your desired width
  height: '50px', // Set your desired height
  marginRight: '10px', // Adjust the margin as needed
};

const rightContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 1rem 0 0',
};

const linkStyle = {
  margin: '0 15px', // Increased margin for spacing
  color: '#fff', // Set your desired link color
  textDecoration: 'none',
};

export default Footer;
