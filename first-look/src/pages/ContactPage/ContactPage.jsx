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
      <div className="additional-info">
        <h2>Have a Plan in Mind?</h2>
        <p>
          If you have a project or idea and want to know how we can assist you, visit our 
          <a href="/service" className="services-link"> Services Page</a> to learn more about 
          the solutions we offer and how we can bring your vision to life.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;
