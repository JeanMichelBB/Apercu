import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Home from '../../components/Home/Home';
import './HomePage.css';

function HomePage() {
  return (
      <div >
        <Header />
        <Home />
        {/* Aperçu demo site web */}
        <div className="info-text">
          <h2>Bienvenue dans  notre site Web!</h2>
          <p>
            Nous sommes heureux de vous accueillir. et nous sommes là pour vous aider.
          </p>
          <ul className='key-points'>
            <li>Des informations sur notre entreprise</li>
            <li>Des informations sur nos produits et services</li>
            <li>Des informations de contact</li>
            <li>Un formulaire de contact</li>
            <li>Des liens vers nos pages de médias sociaux</li>
          </ul>
        </div>
        <Footer />
    </div>);
}

export default HomePage;

