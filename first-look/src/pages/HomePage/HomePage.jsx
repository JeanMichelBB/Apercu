import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the hook for translation
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Home from '../../components/Home/Home';
import './HomePage.css';

function HomePage() {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <div className="home-page">
      <Header />
      <Home />
      <div className="home-intro-section">
        <h1>{t('homePage.welcomeTitle')}</h1>
        <p>{t('homePage.welcomeText1')}</p>
        <p>{t('homePage.welcomeText2')}</p>
      </div>
      <div className="home-service-details">
        <h2>{t('homePage.servicesTitle')}</h2>
        <ul className='home-service-list'>
          <li><strong>{t('homePage.service1')}</strong></li>
          <li><strong>{t('homePage.service2')}</strong></li>
          <li><strong>{t('homePage.service3')}</strong></li>
          <li><strong>{t('homePage.service4')}</strong></li>
          <li><strong>{t('homePage.service5')}</strong></li>
        </ul>
      </div>
      <div className="home-contact-info">
        <h2>{t('homePage.getStartedTitle')}</h2>
        <p>{t('homePage.getStartedText')}</p>
        <div className="link-buttons">
          <a href="/contact" className="contact-button">{t('homePage.contactButton')}</a>
          <a href="/service" className="service-button">{t('homePage.serviceButton')}</a>
          <a href="/pricing" className="pricing-button">{t('homePage.pricingButton')}</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;