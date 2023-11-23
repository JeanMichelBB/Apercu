// Header.js
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const Header = () => {
  return (
    <header style={headerStyle}>
      <div style={leftContainerStyle}>
        <a href = "/" style={linkStyle} >Bérubé et Associés Avocats</a>
      </div>
      <div style={rightContainerStyle}>
        <Link to="/about" style={linkStyle}>À propos de nous</Link>
        <Link to="/contact" style={linkStyle}>Contactez-nous</Link>
      </div>
    </header>
  );
};

// Styles
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '2rem',
  background: '#fff', // Set your desired background color
};

const leftContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const rightContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const linkStyle = {
  margin: '0 10px',
  // text size 
  fontSize: '1.5rem', // Set your desired font size
  textDecoration: 'none',
};

export default Header;
