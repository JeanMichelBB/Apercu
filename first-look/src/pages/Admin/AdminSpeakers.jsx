import React, { useState, useEffect } from 'react';
import api, { proxyImage } from '../../services/api';

const EMPTY_FORM = { name: '', bio: '', photo_url: '', gender: '' };

function SpeakerPreviewModal({ speaker, onClose, onApprove, onReject, onEdit }) {
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  if (!speaker) return null;

  const handleApprove = async () => { await onApprove(speaker.id); onClose(); };
  const handleReject  = async () => {
    if (!rejectReason.trim()) return;
    await onReject(speaker.id, rejectReason.trim());
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', maxWidth: 520, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{speaker.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666', lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
          <img
            src={proxyImage(speaker.photo_url)}
            alt={speaker.name}
            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            {speaker.gender && <p style={{ margin: '0 0 0.25rem' }}>Gender: <strong>{speaker.gender}</strong></p>}
            <p style={{ margin: 0 }}>
              Status: <span className={`badge badge-${speaker.status === 'approved' ? 'published' : speaker.status}`} style={{ fontSize: '0.75rem' }}>{speaker.status}</span>
            </p>
          </div>
        </div>

        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#333', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>{speaker.bio}</p>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {speaker.status === 'pending' && (
            <>
              {!rejecting ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={handleApprove}>Approve</button>
                  <button className="btn btn-danger" onClick={() => setRejecting(true)}>Reject…</button>
                  <button className="btn btn-secondary" onClick={() => { onEdit(speaker); onClose(); }}>Edit</button>
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
            </>
          )}
          {speaker.status !== 'pending' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => { onEdit(speaker); onClose(); }}>Edit</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminSpeakers() {
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [preview, setPreview] = useState(null);

  const load = () => api.getAllSpeakersAdmin().then((r) => setSpeakers(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.updateSpeaker(editId, form);
      } else {
        await api.createSpeaker(form);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save speaker.');
    }
  };

  const startEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, bio: s.bio, photo_url: s.photo_url || '', gender: s.gender || '' });
    // Scroll form into view
    setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const handleApprove = async (id) => { await api.approveSpeaker(id); load(); };

  const handleReject = async (id, reason) => {
    const r = reason ?? rejectReason;
    if (!r.trim()) return;
    await api.rejectSpeaker(id, r.trim());
    setRejectingId(null);
    setRejectReason('');
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this speaker?')) return;
    await api.deleteSpeaker(id);
    load();
  };

  const pending  = speakers.filter((s) => s.status === 'pending');
  const approved = speakers.filter((s) => s.status === 'approved');

  return (
    <div>
      <h1 className="admin-section-title">Speakers</h1>

      <SpeakerPreviewModal
        speaker={preview}
        onClose={() => setPreview(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        onEdit={startEdit}
      />

      {/* Pending approvals */}
      {pending.length > 0 && (
        <>
          <h3 style={{ marginBottom: '1rem' }}>Pending Approval ({pending.length})</h3>
          <table className="admin-table" style={{ marginBottom: '2.5rem' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((s) => (
                <React.Fragment key={s.id}>
                  <tr>
                    <td>
                      <button onClick={() => setPreview(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1a6ef5', textDecoration: 'underline', fontSize: 'inherit', textAlign: 'left' }}>
                        {s.name}
                      </button>
                    </td>
                    <td>{s.bio?.slice(0, 80)}{s.bio?.length > 80 ? '...' : ''}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-secondary" onClick={() => setPreview(s)}>Preview</button>
                        <button className="btn btn-primary" onClick={() => handleApprove(s.id)}>Approve</button>
                        {rejectingId === s.id ? (
                          <button className="btn btn-secondary" onClick={() => { setRejectingId(null); setRejectReason(''); }}>Cancel</button>
                        ) : (
                          <button className="btn btn-danger" onClick={() => { setRejectingId(s.id); setRejectReason(''); }}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {rejectingId === s.id && (
                    <tr>
                      <td colSpan={3} style={{ background: '#fff8f0', padding: '0.75rem 1rem' }}>
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
                            onClick={() => handleReject(s.id)}
                          >Confirm Reject</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Add/edit form */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Edit Speaker' : 'New Speaker'}</h3>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} required />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Gender (for avatar fallback)</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input name="photo_url" placeholder="Photo URL (optional)" value={form.photo_url} onChange={handleChange} />
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Speaker'}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      {/* Approved speakers */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approved.length === 0 && (
            <tr><td colSpan={3} className="admin-status">No approved speakers yet.</td></tr>
          )}
          {approved.map((s) => (
            <tr key={s.id}>
              <td>
                <button onClick={() => setPreview(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#1a6ef5', textDecoration: 'underline', fontSize: 'inherit', textAlign: 'left' }}>
                  {s.name}
                </button>
              </td>
              <td>{s.bio?.slice(0, 80)}{s.bio?.length > 80 ? '...' : ''}</td>
              <td>
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={() => setPreview(s)}>Preview</button>
                  <button className="btn btn-secondary" onClick={() => startEdit(s)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminSpeakers;
