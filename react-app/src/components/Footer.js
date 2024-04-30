// Footer.js
import React from 'react';
import { Link } from 'react-router-dom'; 

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <h2 style={titleStyle}>Bérubé et Associés Avocats</h2>
      <div style={contentStyle}>
        <div style={leftContentStyle}>
          <p><strong>Coordonnées</strong></p>
          <p><strong>Phone:</strong> (450) 359-7171</p>
          <p><strong>Email:</strong> <a href="mailto:your-email@example.com">your-email@example.com</a></p>
          <p><strong>Address:</strong> 145 Boulevard Saint-Joseph Bureau 225, Saint-Jean-sur-Richelieu, Quebec J3B 1W5</p>
        </div>
        <span style={sectionStyle}></span>
        <div style={rightContentStyle}>
          <Link to="/" style={linkStyle}>Accueil</Link>
          <Link to="/about" style={linkStyle}>À propos de nous</Link>
          <Link to="/contact" style={linkStyle}>Contactez-nous</Link>
        </div>
      </div>
      <div style={copyRightStyle}>&copy; {new Date().getFullYear()} Bérubé et Associés Avocats. Tous droits réservés.</div>
    </footer>
  );
};

const footerStyle = {
  padding: '3rem 0 1rem 0',
  background: '#F9F7F7',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '2rem',
  margin: '0',
  textAlign: 'left  ',
  paddingLeft: '5rem',
  
  
};

const contentStyle = {
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: '5rem',
  paddingTop: '1rem',

};

const leftContentStyle = {
  flex: '1',
  textAlign: 'left',
  paddingRight: '2rem',
};

const rightContentStyle = {
  flex: '1',
  textAlign: 'left',
};

const linkStyle = {
  fontSize: '1.2rem',
  textDecoration: 'none',
  color: '#333',
  display: 'block',
  margin: '1rem 0',
};

const copyRightStyle = {
  marginTop: '2rem',
  padding: '1rem 0',
};
// "; background-color: #F3F5F6; padding: 0 10px;"
const sectionStyle = {
  borderLeft: '1px solid #333',
  height: '100px',
  margin: '0 2rem',
};
  

export default Footer;
