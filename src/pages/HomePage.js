// HomePage.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../components/Home';
import ContactForm from '../components/ContactForm';

function HomePage() {
  return (
    <div>
      <Header />
      <Home />
      <div style={infoTextStyle}>
        <h2>Bienvenue dans notre cabinet d'avocats</h2>
        <p>
          Dans notre cabinet d'avocats, nous nous consacrons à fournir des services juridiques de première classe
          en mettant l'accent sur la satisfaction du client et l'excellence. Voici quelques points clés à notre sujet :
        </p>
        <ul>
          <li>Équipe expérimentée de professionnels du droit</li>
          <li>Solutions juridiques personnalisées et adaptées</li>
          <li>Engagement envers le professionnalisme et l'intégrité</li>
          <li>Guidage des clients à travers les défis juridiques</li>
          <li>Passionnés par l'obtention des meilleurs résultats</li>
        </ul>

      </div>
      <ContactForm />
      <Footer />
    </div>
  );
}

// Styles
const infoTextStyle = {
  padding: '5rem 20rem', // Adjust the padding as needed
  textAlign: 'center',
  // text size and line height
  fontSize: '1.2rem',
  lineHeight: '2rem',

};

export default HomePage;
