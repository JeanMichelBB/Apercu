import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import LazyImage from '../../components/LazyImage/LazyImage';
import api, { proxyImage } from '../../services/api';
import './SpeakerDetailPage.css';

function SpeakerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [speaker, setSpeaker] = useState(null);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.getSpeaker(id), api.getSpeakerEvents(id), api.getSpeakerPosts(id)])
      .then(([speakerRes, eventsRes, postsRes]) => {
        setSpeaker(speakerRes.data);
        setEvents(eventsRes.data);
        setPosts(postsRes.data);
      })
      .catch(() => setError('Speaker not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="speaker-detail-page"><Header /><p className="speaker-detail-status">Loading...</p><Footer /></div>;
  if (error) return <div className="speaker-detail-page"><Header /><p className="speaker-detail-status speaker-detail-error">{error}</p><Footer /></div>;

  return (
    <div className="speaker-detail-page">
      <Header />

      <div className="speaker-detail-container">
        <button className="speaker-detail-back" onClick={() => navigate('/speakers')}>← Back to Speakers</button>

        <div className="speaker-detail-profile">
          {speaker.photo_url ? (
            <img src={proxyImage(speaker.photo_url)} alt={speaker.name} className="speaker-detail-photo" />
          ) : (
            <div className="speaker-detail-avatar">{speaker.name.charAt(0)}</div>
          )}
          <div className="speaker-detail-info">
            <h1 className="speaker-detail-name">{speaker.name}</h1>
            <p className="speaker-detail-bio">{speaker.bio}</p>
          </div>
        </div>

        <div className="speaker-detail-events">
          <h2 className="speaker-detail-events-title">Speaking at</h2>

          {events.length === 0 && (
            <p className="speaker-detail-no-events">No upcoming events.</p>
          )}

          <div className="speaker-detail-events-grid">
            {events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="speaker-event-card">
                <LazyImage
                  className="speaker-event-img"
                  src={event.image_url || `https://picsum.photos/seed/${event.id}/800/400`}
                  alt={event.title}
                />
                <div className="speaker-event-body">
                  <div className="speaker-event-date">
                    {new Date(event.date).toLocaleDateString('en-CA', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </div>
                  <h3 className="speaker-event-title">{event.title}</h3>
                  <p className="speaker-event-location">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {posts.length > 0 && (
          <div className="speaker-detail-posts">
            <h2 className="speaker-detail-events-title">Blog Posts</h2>
            <div className="speaker-detail-posts-list">
              {posts.map((post) => (
                <Link to={`/blog/${post.id}`} key={post.id} className="speaker-post-card">
                  <LazyImage
                    className="speaker-post-img"
                    src={post.image_url || `https://picsum.photos/seed/${post.id}/800/300`}
                    alt={post.title}
                  />
                  <div className="speaker-post-body">
                    <div className="speaker-event-date">
                      {new Date(post.created_at).toLocaleDateString('en-CA', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </div>
                    <h3 className="speaker-event-title">{post.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SpeakerDetailPage;
