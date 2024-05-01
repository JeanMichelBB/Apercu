// AboutPage.js
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import About from '../../components/About/About';
import TeamSection from '../../components/TeamSection/TeamSection';
import IntroductionAboutUs from '../../components/IntroductionAboutUs/IntroductionAboutUs';
import 'leaflet/dist/leaflet.css';
import LocationMap from '../../components/LocationMap/LocationMap';
import './AboutPage.css';

function AboutPage() {
  return (
    <div>
      <Header />
      <About />
      <IntroductionAboutUs />
      <TeamSection />
      <br/><br/> 
      <p style={{textAlign: 'center', fontSize: '30px', fontWeight: 'bold'}}>Notre emplacement</p>
      <LocationMap />
      <br/><br/>
      <Footer />
    </div>
  );
}

export default AboutPage;
