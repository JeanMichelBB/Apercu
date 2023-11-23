// ContactPage.js
import React from 'react';
import ContactForm from '../components/ContactForm';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Contact from '../components/Contact';

function ContactPage() {
  return (
    <div>
      <Header />
      <Contact />
      <div style={infoTextStyle}>
        Bienvenue sur notre page de contact. N'hésitez pas à nous contacter pour toute question,
        demande d'information ou assistance juridique. Nous sommes là pour vous aider.
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

export default ContactPage;
