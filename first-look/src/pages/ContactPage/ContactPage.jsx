import React from 'react';
import ContactForm from '../../components/ConactForm/ContactForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './ContactPage.css';

function ContactPage() {
  return (
    <div className="contact-page">
      <Header />

      <section className="contact-hero">
        <h1 className="contact-hero-title">Get in Touch</h1>
        <p className="contact-hero-sub">Have a question or want to work together? We'd love to hear from you.</p>
      </section>

      <ContactForm />

      <Footer />
    </div>
  );
}

export default ContactPage;
