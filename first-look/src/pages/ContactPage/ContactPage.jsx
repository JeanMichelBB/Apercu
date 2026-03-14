import React from 'react';
import ContactForm from '../../components/ConactForm/ContactForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ContactPage.css';

function ContactPage() {
  return (
    <div>
      <Header />
      <div className="info-text">
        Have a question, a suggestion, or need help with your account? Fill out the form below and we'll get back to you.
      </div>
      <ContactForm />
      <Footer />
    </div>
  );
}

export default ContactPage;
