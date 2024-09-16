import React from 'react';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutPage.css';

function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="about-page-container">
      <Header />

      <main className="about-main-content">
        <section className="about-section">
          <h2>{t('aboutPage.aboutMe.title')}</h2>
          <p>{t('aboutPage.aboutMe.intro')}</p>
          <p>{t('aboutPage.aboutMe.experience')}</p>
        </section>

        <section className="contact-section">
          <h3>{t('aboutPage.contact.title')}</h3>
          <ul>
            <li>
              <a href="https://github.com/jeanmichelbb" target="_blank" rel="noopener noreferrer">
                {t('aboutPage.contact.links.github')}
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/jeanmichelbb" target="_blank" rel="noopener noreferrer">
                {t('aboutPage.contact.links.linkedin')}
              </a>
            </li>
            <li>
              <a href="https://jeanmichelbb.github.io/" target="_blank" rel="noopener noreferrer">
                {t('aboutPage.contact.links.portfolio')}
              </a>
            </li>
          </ul>
        </section>

        <section className="values-section">
          <h3>{t('aboutPage.values.title')}</h3>
          <p>{t('aboutPage.values.text')}</p>
        </section>

        <section className="skills-section">
          <h3>{t('aboutPage.skills.title')}</h3>
          <p>{t('aboutPage.skills.intro')}</p>
          <ul>
            {t('aboutPage.skills.list', { returnObjects: true }).map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </section>

        <section className="location-section">
          <h3>{t('aboutPage.location.title')}</h3>
          <p>{t('aboutPage.location.text')}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;