import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_FORM = { name: '', bio: '', photo_url: '' };

const STATUS_BADGE = {
  approved: { label: 'Approved', cls: 'badge-published' },
  pending:  { label: 'Pending Approval', cls: 'badge-pending' },
};

function OrganizerSpeakers() {
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => api.getMySpeakers().then((r) => setSpeakers(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.submitSpeaker(form);
      setForm(EMPTY_FORM);
      setSuccess('Speaker submitted for admin review.');
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit speaker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="admin-section-title">My Speakers</h1>

      <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#555', maxWidth: 500 }}>
        Submit a speaker profile for admin review. Once approved, they will appear publicly and can be linked to your events.
      </p>

      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
        <h3>Submit a Speaker</h3>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} required style={{ minHeight: 100 }} />
        <input name="photo_url" type="url" placeholder="Photo URL (optional)" value={form.photo_url} onChange={handleChange} />
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        {success && <p style={{ color: '#1a7a1a', margin: 0, fontSize: '0.9rem' }}>{success}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {speakers.length === 0 && (
            <tr><td colSpan={3} className="admin-status">No speakers submitted yet.</td></tr>
          )}
          {speakers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.bio?.slice(0, 80)}{s.bio?.length > 80 ? '...' : ''}</td>
              <td>
                <span className={`badge ${STATUS_BADGE[s.status]?.cls || 'badge-draft'}`}>
                  {STATUS_BADGE[s.status]?.label || s.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizerSpeakers;
