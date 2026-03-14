import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_FORM = { name: '', bio: '', photo_url: '' };

function AdminSpeakers() {
  const [speakers, setSpeakers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.getSpeakers().then((r) => setSpeakers(r.data)).catch(() => {});

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
    setForm({ name: s.name, bio: s.bio, photo_url: s.photo_url || '' });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this speaker?')) return;
    await api.deleteSpeaker(id);
    load();
  };

  return (
    <div>
      <h1 className="admin-section-title">Speakers</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Edit Speaker' : 'New Speaker'}</h3>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <textarea name="bio" placeholder="Bio" value={form.bio} onChange={handleChange} required />
        <input name="photo_url" placeholder="Photo URL (optional)" value={form.photo_url} onChange={handleChange} />
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Add Speaker'}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Bio</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {speakers.length === 0 && (
            <tr><td colSpan={3} className="admin-status">No speakers yet.</td></tr>
          )}
          {speakers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.bio?.slice(0, 80)}{s.bio?.length > 80 ? '...' : ''}</td>
              <td>
                <div className="btn-group">
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
