import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_FORM = { title: '', description: '', location: '', date: '', capacity: '', status: 'draft' };

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [pending, setPending] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => {
    api.getAllEvents().then((r) => setEvents(r.data)).catch(() => {});
    api.getPendingEvents().then((r) => setPending(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...form, capacity: Number(form.capacity) || null };
    try {
      if (editId) {
        await api.updateEvent(editId, payload);
      } else {
        await api.createEvent(payload);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save event.');
    }
  };

  const handleApprove = async (id) => { await api.approveEvent(id); load(); };
  const handleReject = async (id) => { await api.rejectEvent(id); load(); };

  const startEdit = (event) => {
    setEditId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date ? event.date.slice(0, 16) : '',
      capacity: event.capacity ?? '',
      status: event.status,
    });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const togglePublished = async (event) => {
    await api.updateEvent(event.id, { published: !event.published });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await api.deleteEvent(id);
    load();
  };

  return (
    <div>
      <h1 className="admin-section-title">Events</h1>

      {pending.length > 0 && (
        <div style={{ marginBottom: '2.5rem', border: '1px solid #f0a500', padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem', color: '#856400' }}>
            ⏳ Pending Approval ({pending.length})
          </h2>
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Date</th><th>Location</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pending.map((e) => (
                <tr key={e.id}>
                  <td>{e.title}</td>
                  <td>{e.date ? new Date(e.date).toLocaleDateString() : '—'}</td>
                  <td>{e.location}</td>
                  <td>
                    <div className="btn-group">
                      <button className="btn btn-primary" onClick={() => handleApprove(e.id)}>Approve</button>
                      <button className="btn btn-danger" onClick={() => handleReject(e.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Edit Event' : 'New Event'}</h3>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required />
        <input name="capacity" type="number" placeholder="Capacity (optional)" value={form.capacity} onChange={handleChange} min="1" />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
        </select>
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Event'}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr><td colSpan={5} className="admin-status">No events yet.</td></tr>
          )}
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.date ? new Date(event.date).toLocaleDateString() : '—'}</td>
              <td>{event.location}</td>
              <td>
                <span className={`badge badge-${event.status}`}>
                  {event.status}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={() => startEdit(event)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEvents;
