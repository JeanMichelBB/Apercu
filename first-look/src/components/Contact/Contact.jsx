import React from 'react';
import './Contact.css'; // Import the CSS file
import { useTranslation } from 'react-i18next'; // Import the hook for translation


const Contact = () => {
    const { t } = useTranslation();
  return (
    <div className="contactTitle"> 
      <h1>{t('Contact.contactTitle')}</h1>
    </div>
  );
};

export default Contact;
