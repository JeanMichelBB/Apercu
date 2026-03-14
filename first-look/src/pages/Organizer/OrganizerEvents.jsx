import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const STATUS_BADGE = {
  published: { label: 'Published', cls: 'badge-published' },
  pending:   { label: 'Pending Approval', cls: 'badge-pending' },
  draft:     { label: 'Draft', cls: 'badge-draft' },
};

function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const navigate = useNavigate();

  const load = () => api.getMyEvents().then((r) => setEvents(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const viewRegistrations = async (event) => {
    if (selected?.id === event.id) {
      setSelected(null);
      setRegistrations([]);
      return;
    }
    setSelected(event);
    setRegsLoading(true);
    try {
      const res = await api.getEventRegistrations(event.id);
      setRegistrations(res.data);
    } catch {
      setRegistrations([]);
    } finally {
      setRegsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await api.deleteEvent(id);
    if (selected?.id === id) setSelected(null);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 className="admin-section-title" style={{ margin: 0 }}>My Events</h1>
        <button className="btn btn-primary" onClick={() => navigate('/organizer/create')}>+ New Event</button>
      </div>

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
            <tr><td colSpan={5} className="admin-status">No events yet. Create your first one!</td></tr>
          )}
          {events.map((event) => (
            <React.Fragment key={event.id}>
              <tr>
                <td>{event.title}</td>
                <td>{event.date ? new Date(event.date).toLocaleDateString() : '—'}</td>
                <td>{event.location}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[event.status]?.cls || 'badge-draft'}`}>
                    {STATUS_BADGE[event.status]?.label || event.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-secondary" onClick={() => viewRegistrations(event)}>
                      {selected?.id === event.id ? 'Hide' : 'Registrations'}
                    </button>
                    {event.status !== 'published' && (
                      <button className="btn btn-secondary" onClick={() => navigate(`/organizer/edit/${event.id}`)}>Edit</button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                  </div>
                </td>
              </tr>
              {selected?.id === event.id && (
                <tr>
                  <td colSpan={5} style={{ background: '#f9f9f9', padding: '1.25rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>
                      Registrations for "{event.title}"
                    </strong>
                    {regsLoading && <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.5rem 0 0' }}>Loading...</p>}
                    {!regsLoading && registrations.length === 0 && (
                      <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.5rem 0 0' }}>No registrations yet.</p>
                    )}
                    {!regsLoading && registrations.length > 0 && (
                      <table className="admin-table" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((r) => (
                            <tr key={r.id}>
                              <td>{r.name || '—'}</td>
                              <td>{r.email}</td>
                              <td>{r.registered_at ? new Date(r.registered_at).toLocaleDateString() : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizerEvents;
