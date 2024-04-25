// AboutPage.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';
import TeamSection from '../components/TeamSection';
import IntroductionAboutUs from '../components/IntroductionAboutUs';
import 'leaflet/dist/leaflet.css';
import LocationMap from '../components/LocationMap';

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
