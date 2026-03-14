import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import api from '../../services/api';
import './EventsPage.css';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 9;

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getEvents({ page, limit, search: query || undefined })
      .then((res) => {
        setEvents(res.data.items);
        setTotal(res.data.total);
      })
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false));
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="events-page">
      <Header />
      <div className="events-container">
        <h1 className="events-title">Events</h1>

        <form className="events-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="events-search-input"
          />
          <button type="submit" className="events-search-btn">Search</button>
        </form>

        {loading && <p className="events-status">Loading...</p>}
        {error && <p className="events-status events-error">{error}</p>}

        {!loading && !error && events.length === 0 && (
          <p className="events-status">No events found.</p>
        )}

        <div className="events-grid">
          {events.map((event) => (
            <Link to={`/events/${event.id}`} key={event.id} className="event-card">
              <div className="event-card-date">
                {new Date(event.date).toLocaleDateString('en-CA', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </div>
              <h2 className="event-card-title">{event.title}</h2>
              <p className="event-card-location">{event.location}</p>
              <p className="event-card-desc">
                {event.description?.slice(0, 120)}{event.description?.length > 120 ? '...' : ''}
              </p>
              <span className="event-card-link">View details →</span>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="events-pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="pagination-btn"
            >
              ← Prev
            </button>
            <span className="pagination-info">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="pagination-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default EventsPage;
