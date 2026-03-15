import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import LazyImage from '../../components/LazyImage/LazyImage';
import api, { proxyImage } from '../../services/api';
import './HomePage.css';

const MOSAIC_SEEDS = ['event42', 'festival7', 'concert18', 'summit3', 'workshop99', 'meetup55'];

function HomePage() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.getEvents({ page: 1, limit: 3 }).then((r) => setFeatured(r.data.items)).catch(() => {});
  }, []);

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
          <Link to="/host" className="home-cta-secondary">Host an Event</Link>
        </div>
      </section>

      {/* Vibrant image mosaic strip */}
      <div className="home-mosaic">
        {MOSAIC_SEEDS.map((seed) => (
          <LazyImage
            key={seed}
            className="home-mosaic-img"
            src={`https://picsum.photos/seed/${seed}/600/400`}
            alt=""
          />
        ))}
      </div>

      {/* Featured Events */}
      {featured.length > 0 && (
        <section className="home-featured">
          <h2 className="home-featured-title">Featured Events</h2>
          <div className="home-featured-grid">
            {featured.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="home-featured-card">
                <LazyImage
                  className="home-featured-img"
                  src={event.image_url || `https://picsum.photos/seed/${event.id}/800/400`}
                  alt={event.title}
                />
                <div className="home-featured-body">
                  <div className="home-featured-date">
                    {new Date(event.date).toLocaleDateString('en-CA', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </div>
                  <h3 className="home-featured-name">{event.title}</h3>
                  <p className="home-featured-location">{event.location}</p>
                  {event.speakers?.length > 0 && (
                    <div className="home-featured-speakers">
                      {event.speakers.map((s) => (
                        <div key={s.id} className="home-featured-speaker">
                          <img src={proxyImage(s.photo_url)} alt={s.name} className="home-featured-speaker-photo" />
                          <span>{s.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="home-featured-more">
            <Link to="/events" className="home-cta-secondary">View All Events →</Link>
          </div>
        </section>
      )}

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
