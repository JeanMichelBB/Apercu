import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Footer.css'; // Import the CSS file

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const Footer = () => {
  const { t } = useTranslation(); // Use the translation function

  return (
    <footer className="footer"> 
      <h2 className="title">{t('footer.title')}</h2> 
      <div className="content"> 
        <div className="left-content"> 
          <p><Link to="/" className="link" onClick={scrollToTop}>{t('footer.home')}</Link></p>
          <p><Link to="/service" className="link" onClick={scrollToTop}>{t('footer.services')}</Link></p>
          <p><Link to="/pricing" className="link" onClick={scrollToTop}>{t('footer.pricing')}</Link></p>
        </div>
        <span className="section"></span> 
        <div className="right-content"> 
          <p><Link to="/about" className="link" onClick={scrollToTop}>{t('footer.about')}</Link></p>
          <p><Link to="/contact" className="link" onClick={scrollToTop}>{t('footer.contact')}</Link></p>
        </div>
      </div>
      <div className="copy-right">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
};

export default Footer;