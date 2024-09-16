import React from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import './Home.css'; // Import the CSS file

const Home = () => {
  const { t } = useTranslation(); // Get the translation function

  return (
    <div className="home"> {/* Use className instead of inline styles */}
      <h1>{t('home.title')}</h1> {/* Use translation keys */}
      <p>{t('home.welcome')}</p>
    </div>
  );
};

export default Home;