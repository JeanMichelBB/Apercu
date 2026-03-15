import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api, { proxyImage } from '../../services/api';
import './SpeakersPage.css';

function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getSpeakers()
      .then((res) => setSpeakers(res.data))
      .catch(() => setError('Failed to load speakers.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = speakers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.bio?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="speakers-page">
      <Header />

      <section className="speakers-hero">
        <h1 className="speakers-hero-title">Meet the Speakers</h1>
        <p className="speakers-hero-sub">
          Discover the experts, thinkers, and creators behind our events.
          Click on any speaker to explore their talks and articles.
        </p>
        <div className="speakers-search-wrap">
          <svg className="speakers-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="speakers-search"
            placeholder="Search by name or topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <div className="speakers-container">
        {loading && (
          <div className="speakers-status-wrap">
            <p className="speakers-status">Loading speakers...</p>
          </div>
        )}
        {error && (
          <div className="speakers-status-wrap">
            <p className="speakers-status speakers-error">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="speakers-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <p>{search ? `No speakers match "${search}"` : 'No speakers yet.'}</p>
            {search && (
              <button className="speakers-clear-search" onClick={() => setSearch('')}>Clear search</button>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="speakers-count">{filtered.length} speaker{filtered.length !== 1 ? 's' : ''}</p>
            <div className="speakers-grid">
              {filtered.map((speaker) => (
                <Link to={`/speakers/${speaker.id}`} key={speaker.id} className="speaker-card">
                  <div className="speaker-card-photo-wrap">
                    {speaker.photo_url ? (
                      <img src={proxyImage(speaker.photo_url)} alt={speaker.name} className="speaker-photo" />
                    ) : (
                      <div className="speaker-photo-placeholder">{speaker.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="speaker-card-body">
                    <h2 className="speaker-name">{speaker.name}</h2>
                    <p className="speaker-bio">{speaker.bio}</p>
                  </div>
                  <span className="speaker-profile-link">View profile →</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <section className="speakers-cta">
        <h2 className="speakers-cta-title">Want to speak at one of our events?</h2>
        <p className="speakers-cta-sub">Create an organizer account and submit a speaker profile for review.</p>
        <Link to="/register?role=organizer" className="speakers-cta-btn">Get Started</Link>
      </section>

      <Footer />
    </div>
  );
}

export default SpeakersPage;
