import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page-container">
      <Header />

      <main className="about-main-content">
        <section className="about-section">
          <h2>About Aperçu</h2>
          <p>
            Aperçu is an open event management platform that connects event organizers with attendees.
            Whether you're hosting a small workshop or a large conference, Aperçu gives you the tools
            to publish your event, manage registrations, and reach a wider audience.
          </p>
          <p>
            For attendees, Aperçu makes it easy to discover upcoming events, register in a few clicks,
            and keep track of everything in one place.
          </p>
        </section>

        <section className="about-section">
          <h2>For Attendees</h2>
          <ul className="about-list">
            <li>Browse published events by date and location</li>
            <li>Register for events with a free account</li>
            <li>Manage and cancel your registrations at any time</li>
            <li>Follow speakers and read related blog posts</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>For Organizers</h2>
          <ul className="about-list">
            <li>Create an organizer account and submit your events</li>
            <li>Events go through a quick review before going live</li>
            <li>Track registrations from your organizer dashboard</li>
            <li>Edit or cancel events at any time</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Contact</h2>
          <p>
            Questions or feedback? Use the <a href="/contact">contact page</a> to reach out — we read everything.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;
