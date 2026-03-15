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
  const [selectedType, setSelectedType] = useState(null); // 'registrations' | 'speakers'
  const [registrations, setRegistrations] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [eventSpeakers, setEventSpeakers] = useState([]);
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [speakersLoading, setSpeakersLoading] = useState(false);
  const navigate = useNavigate();

  const load = () => api.getMyEvents().then((r) => setEvents(r.data)).catch(() => {});

  useEffect(() => {
    load();
    api.getSpeakers().then((r) => setAllSpeakers(r.data)).catch(() => {});
  }, []);

  const openPanel = async (event, type) => {
    if (selected?.id === event.id && selectedType === type) {
      setSelected(null);
      setSelectedType(null);
      return;
    }
    setSelected(event);
    setSelectedType(type);

    if (type === 'registrations') {
      setRegsLoading(true);
      try {
        const res = await api.getEventRegistrations(event.id);
        setRegistrations(res.data);
      } catch {
        setRegistrations([]);
      } finally {
        setRegsLoading(false);
      }
    }

    if (type === 'speakers') {
      setSpeakersLoading(true);
      try {
        const res = await api.getEventSpeakers(event.id);
        setEventSpeakers(res.data);
      } catch {
        setEventSpeakers([]);
      } finally {
        setSpeakersLoading(false);
      }
    }
  };

  const handleAddSpeaker = async (eventId, speakerId) => {
    try {
      await api.addEventSpeaker(eventId, speakerId);
      const res = await api.getEventSpeakers(eventId);
      setEventSpeakers(res.data);
    } catch {}
  };

  const handleRemoveSpeaker = async (eventId, speakerId) => {
    try {
      await api.removeEventSpeaker(eventId, speakerId);
      setEventSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
    } catch {}
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
                    <button className="btn btn-secondary" onClick={() => openPanel(event, 'speakers')}>
                      {selected?.id === event.id && selectedType === 'speakers' ? 'Hide' : 'Speakers'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => openPanel(event, 'registrations')}>
                      {selected?.id === event.id && selectedType === 'registrations' ? 'Hide' : 'Registrations'}
                    </button>
                    {event.status !== 'published' && (
                      <button className="btn btn-secondary" onClick={() => navigate(`/organizer/edit/${event.id}`)}>Edit</button>
                    )}
                    <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>Delete</button>
                  </div>
                </td>
              </tr>

              {/* Speakers panel */}
              {selected?.id === event.id && selectedType === 'speakers' && (
                <tr>
                  <td colSpan={5} style={{ background: '#f9f9f9', padding: '1.25rem' }}>
                    <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '1rem' }}>
                      Speakers for "{event.title}"
                    </strong>

                    {speakersLoading && <p style={{ fontSize: '0.9rem', color: '#555' }}>Loading...</p>}

                    {!speakersLoading && (
                      <>
                        {/* Current speakers */}
                        {eventSpeakers.length === 0 && (
                          <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: '1rem' }}>No speakers linked yet.</p>
                        )}
                        {eventSpeakers.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            {eventSpeakers.map((s) => (
                              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fff', border: '1px solid #ddd', padding: '0.4rem 0.75rem' }}>
                                <img src={s.photo_url} alt={s.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                                <span style={{ fontSize: '0.85rem' }}>{s.name}</span>
                                <button
                                  className="btn btn-danger"
                                  style={{ padding: '0.1rem 0.5rem', fontSize: '0.75rem' }}
                                  onClick={() => handleRemoveSpeaker(event.id, s.id)}
                                >✕</button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add speaker dropdown */}
                        {allSpeakers.filter((s) => !eventSpeakers.find((es) => es.id === s.id)).length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <select
                              className="admin-select"
                              defaultValue=""
                              onChange={(e) => { if (e.target.value) handleAddSpeaker(event.id, e.target.value); e.target.value = ''; }}
                              style={{ fontSize: '0.9rem', padding: '0.4rem 0.75rem', border: '1px solid #000' }}
                            >
                              <option value="" disabled>Add a speaker…</option>
                              {allSpeakers
                                .filter((s) => !eventSpeakers.find((es) => es.id === s.id))
                                .map((s) => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                          </div>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              )}

              {/* Registrations panel */}
              {selected?.id === event.id && selectedType === 'registrations' && (
                <tr>
                  <td colSpan={5} style={{ background: '#f9f9f9', padding: '1.25rem' }}>
                    <strong style={{ fontSize: '0.9rem' }}>Registrations for "{event.title}"</strong>
                    {regsLoading && <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.5rem 0 0' }}>Loading...</p>}
                    {!regsLoading && registrations.length === 0 && (
                      <p style={{ fontSize: '0.9rem', color: '#555', margin: '0.5rem 0 0' }}>No registrations yet.</p>
                    )}
                    {!regsLoading && registrations.length > 0 && (
                      <table className="admin-table" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                        <thead>
                          <tr><th>Name</th><th>Email</th><th>Registered</th></tr>
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
