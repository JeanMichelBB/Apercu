import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_FORM = { title: '', description: '', location: '', date: '', capacity: '', status: 'draft' };

function EventPreviewModal({ event, onClose, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  if (!event) return null;

  const handleApprove = async () => { await onApprove(event.id); onClose(); };
  const handleReject  = async () => {
    if (!rejectReason.trim()) return;
    await onReject(event.id, rejectReason.trim());
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', maxWidth: 620, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{event.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666', lineHeight: 1 }}>✕</button>
        </div>

        {event.image_url && (
          <img src={event.image_url} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', marginBottom: '1.25rem' }} />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 1.5rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          <div><span style={{ color: '#888' }}>Date</span><br /><strong>{event.date ? new Date(event.date).toLocaleString() : '—'}</strong></div>
          <div><span style={{ color: '#888' }}>Location</span><br /><strong>{event.location}</strong></div>
          <div><span style={{ color: '#888' }}>Capacity</span><br /><strong>{event.capacity ?? 'Unlimited'}</strong></div>
        </div>

        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#333', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>{event.description}</p>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          {!rejecting ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={handleApprove}>Approve</button>
              <button className="btn btn-danger" onClick={() => setRejecting(true)}>Reject…</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                autoFocus
                placeholder="Reason for rejection (required)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', border: '1px solid #c00', fontSize: '0.9rem' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-danger" disabled={!rejectReason.trim()} onClick={handleReject}>Confirm Reject</button>
                <button className="btn btn-secondary" onClick={() => { setRejecting(false); setRejectReason(''); }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [pending, setPending] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [preview, setPreview] = useState(null);

  const load = () => {
    api.getAllEvents().then((r) => setEvents(r.data)).catch(() => {});
    api.getPendingEvents().then((r) => setPending(r.data)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const minDateTime = new Date(Date.now() + 60000).toISOString().slice(0, 16);

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
  const handleReject = async (id, reason) => {
    const r = reason ?? rejectReason;
    if (!r.trim()) return;
    await api.rejectEvent(id, r.trim());
    setRejectingId(null);
    setRejectReason('');
    load();
  };

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

      <EventPreviewModal
        event={preview}
        onClose={() => setPreview(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

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
                <React.Fragment key={e.id}>
                  <tr>
                    <td>
                      <button onClick={() => setPreview(e)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1a6ef5', textDecoration: 'underline', fontSize: 'inherit', textAlign: 'left' }}>
                        {e.title}
                      </button>
                    </td>
                    <td>{e.date ? new Date(e.date).toLocaleDateString() : '—'}</td>
                    <td>{e.location}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-secondary" onClick={() => setPreview(e)}>Preview</button>
                        <button className="btn btn-primary" onClick={() => handleApprove(e.id)}>Approve</button>
                        {rejectingId === e.id ? (
                          <button className="btn btn-secondary" onClick={() => { setRejectingId(null); setRejectReason(''); }}>Cancel</button>
                        ) : (
                          <button className="btn btn-danger" onClick={() => { setRejectingId(e.id); setRejectReason(''); }}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {rejectingId === e.id && (
                    <tr>
                      <td colSpan={4} style={{ background: '#fff8f0', padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            autoFocus
                            placeholder="Reason for rejection (required)"
                            value={rejectReason}
                            onChange={(ev) => setRejectReason(ev.target.value)}
                            style={{ flex: 1, padding: '0.4rem 0.6rem', border: '1px solid #c00', fontSize: '0.9rem' }}
                          />
                          <button
                            className="btn btn-danger"
                            disabled={!rejectReason.trim()}
                            onClick={() => handleReject(e.id)}
                          >Confirm Reject</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
        <input name="date" type="datetime-local" value={form.date} onChange={handleChange} required min={editId ? undefined : minDateTime} />
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
