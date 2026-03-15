import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const EMPTY = { title: '', description: '', location: '', date: '', capacity: '', image_url: '' };

function OrganizerCreateEvent() {
  const { id } = useParams(); // present when editing
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      api.getEvent(id).then((r) => {
        const e = r.data;
        setForm({
          title: e.title,
          description: e.description,
          location: e.location,
          date: e.date ? e.date.slice(0, 16) : '',
          capacity: e.capacity ?? '',
          image_url: e.image_url ?? '',
        });
      });
    }
  }, [id]);

  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.date && new Date(form.date) <= new Date()) {
      setError('Event date must be in the future.');
      return;
    }
    setLoading(true);
    const payload = { ...form, capacity: Number(form.capacity) || null };
    try {
      if (id) {
        await api.updateEvent(id, payload);
      } else {
        await api.createEvent(payload);
      }
      navigate('/organizer');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-section-title">{id ? 'Edit Event' : 'Create Event'}</h1>

      {!id && (
        <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555', maxWidth: 500 }}>
          Your event will be submitted for admin review before it appears publicly.
        </p>
      )}

      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
        <input name="title" placeholder="Event title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required min={minDateTime} />
        <input name="capacity" type="number" placeholder="Capacity (optional)" value={form.capacity} onChange={handleChange} min="1" />
        <input name="image_url" type="url" placeholder="Image URL (optional — leave blank for auto)" value={form.image_url} onChange={handleChange} />
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Save Changes' : 'Submit for Review'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/organizer')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default OrganizerCreateEvent;
