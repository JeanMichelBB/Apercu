// AboutPage.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import About from '../components/About';
import ContactForm from '../components/ContactForm';
import TeamSection from '../components/TeamSection';
import IntroductionAboutUs from '../components/IntroductionAboutUs';

function AboutPage() {
  return (
    <div>
      <Header />
      <About />
      <IntroductionAboutUs />
      <TeamSection />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default AboutPage;
