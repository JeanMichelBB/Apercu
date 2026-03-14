import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <Header />

      <section className="home-hero">
        <h1 className="home-hero-title">Discover &amp; Attend Events</h1>
        <p className="home-hero-sub">
          Find conferences, workshops, and meetups — or create your own and reach your audience.
        </p>
        <div className="home-hero-ctas">
          <Link to="/events" className="home-cta-primary">Browse Events</Link>
          <Link to="/register" className="home-cta-secondary">Host an Event</Link>
        </div>
      </section>

      <section className="home-how">
        <h2 className="home-how-title">How it works</h2>
        <div className="home-how-steps">
          <div className="home-step">
            <span className="home-step-number">01</span>
            <h3>Browse</h3>
            <p>Explore upcoming events filtered by date, location, or topic.</p>
          </div>
          <div className="home-step">
            <span className="home-step-number">02</span>
            <h3>Register</h3>
            <p>Create a free account and register for the events you want to attend.</p>
          </div>
          <div className="home-step">
            <span className="home-step-number">03</span>
            <h3>Attend</h3>
            <p>Show up, connect with speakers and attendees, and grow your network.</p>
          </div>
        </div>
      </section>

      <section className="home-organizer">
        <h2>Want to host an event?</h2>
        <p>Create an organizer account and submit your event for review. Once approved it goes live to all attendees.</p>
        <Link to="/register" className="home-cta-primary">Get Started as Organizer</Link>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
