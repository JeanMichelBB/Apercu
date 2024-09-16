// ContactPage.js
import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import ContactForm from '../../components/ConactForm/ContactForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Contact from '../../components/Contact/Contact';
import './ContactPage.css'; // Import the CSS file

function ContactPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <Contact />
      <div className="info-text">
        {t('contactPage.infoText')}
      </div>
      <ContactForm />
      <div className="additional-info">
        <h2>{t('contactPage.additionalInfo.title')}</h2>
        <p dangerouslySetInnerHTML={{ __html: t('contactPage.additionalInfo.text') }} />
      </div>
      <Footer />
    </div>
  );
}
export default ContactPage;
