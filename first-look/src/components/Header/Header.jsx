import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './Header.css';

const Header = () => {
  const { t, i18n } = useTranslation(); // Get the translation function and i18n instance

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Determine the other language
  const currentLanguage = i18n.language;
  const otherLanguage = currentLanguage === 'en' ? 'fr' : 'en';

  return (
    <header className="header">
      <div className="header-container">
        <div className="left-container">
          {/* <a href="/" className="link"><h2 className='text-logo'>{t('header.logo')}</h2></a> */}
          <Link to="/" className="Link"><h2 className='text-logo'>{t('header.logo')}</h2></Link>
        </div>
        <div className="right-container">
          <Link to="/service" className="link">{t('header.services')}</Link>
          <Link to="/pricing" className="link">{t('header.pricing')}</Link>
          <a href="https://jeanmichelbb.github.io/" className="link">{t('header.portfolio')}</a>
          <Link to="/about" className="link">{t('header.about')}</Link>
          <Link to="/contact" className="link">{t('header.contact')}</Link>
          {/* Language button */}
          <button className="language-button" onClick={() => handleLanguageChange(otherLanguage)}>
            {otherLanguage.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;