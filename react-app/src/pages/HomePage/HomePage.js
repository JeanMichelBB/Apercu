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
        <div className="info-text">
          <h2>Bienvenue dans notre cabinet d'avocats</h2>
          <p>
            Dans notre cabinet d'avocats, nous nous consacrons à fournir des services juridiques de première classe
            en mettant l'accent sur la satisfaction du client et l'excellence. Voici quelques points clés à notre sujet :
          </p>
          <lu className='key-points'>
            <li>Équipe expérimentée de professionnels du droit</li>
            <li>Solutions juridiques personnalisées et adaptées</li>
            <li>Engagement envers le professionnalisme et l'intégrité</li>
            <li>Guidage des clients à travers les défis juridiques</li>
            <li>Passionnés par l'obtention des meilleurs résultats</li>
          </lu>
        </div>
        <Footer />
    </div>);
}

export default HomePage;

