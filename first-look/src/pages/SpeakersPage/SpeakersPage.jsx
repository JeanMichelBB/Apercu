import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './SpeakersPage.css';

function SpeakersPage() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSpeakers()
      .then((res) => setSpeakers(res.data))
      .catch(() => setError('Failed to load speakers.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="speakers-page">
      <Header />
      <div className="speakers-container">
        <h1 className="speakers-title">Speakers</h1>

        {loading && <p className="speakers-status">Loading...</p>}
        {error && <p className="speakers-status speakers-error">{error}</p>}
        {!loading && !error && speakers.length === 0 && (
          <p className="speakers-status">No speakers yet.</p>
        )}

        <div className="speakers-grid">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="speaker-card">
              {speaker.photo_url ? (
                <img src={speaker.photo_url} alt={speaker.name} className="speaker-photo" />
              ) : (
                <div className="speaker-photo-placeholder">{speaker.name.charAt(0)}</div>
              )}
              <h2 className="speaker-name">{speaker.name}</h2>
              <p className="speaker-bio">{speaker.bio}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SpeakersPage;
