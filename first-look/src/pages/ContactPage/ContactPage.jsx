// ContactPage.js
import React from 'react';
import ContactForm from '../../components/ConactForm/ContactForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Contact from '../../components/Contact/Contact';
import './ContactPage.css'; // Import the CSS file

function ContactPage() {
  return (
    <div>
      <Header />
      <Contact />
      <div className="info-text"> {/* Use className instead of inline styles */}
        Bienvenue sur notre page de contact. N'hésitez pas à nous contacter pour toute question,
        demande d'information ou assistance. Nous sommes là pour vous aider.
      </div>
      <ContactForm />
      <Footer />
    </div>
  );
}

export default ContactPage;
