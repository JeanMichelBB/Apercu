// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={{textAlign: 'center', padding: '3rem'}}>
      {/* gap bewtwin all element */}
      <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
        <h3>Bérubé et Associés Avocats</h3>
        <p>Coordonnées</p>
        <p>Phone: (450) 359-7171</p>
        <p>Email:
          <a href="mailto:your-email@example.com">your-email@example.com</a>
        </p>
        <p>Address:  145 Boulevard Saint-Joseph Bureau 225, Saint-Jean-sur-Richelieu, Quebec J3B 1W5</p>
        <p>&copy; {new Date().getFullYear()} Bérubé et Associés Avocats. Tout droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;
