import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { proxyImage } from '../../services/api';

const EMPTY = { title: '', content: '', published: false, image_url: '' };

function OrganizerCreatePost() {
  const { id } = useParams();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [linkedSpeakers, setLinkedSpeakers] = useState([]);
  const [allSpeakers, setAllSpeakers] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    api.getMySpeakers().then((r) => setAllSpeakers(r.data.filter((s) => s.status === 'approved'))).catch(() => {});
    if (id) {
      api.getMyPosts().then((r) => {
        const post = r.data.find((p) => p.id === id);
        if (post) setForm({ title: post.title, content: post.content, published: post.published, image_url: post.image_url ?? '' });
      });
      api.getPostSpeakers(id).then((r) => setLinkedSpeakers(r.data)).catch(() => {});
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (id) {
        await api.updatePost(id, form);
      } else {
        const res = await api.createPost(form);
        const newId = res.data.id;
        await Promise.all(linkedSpeakers.map((s) => api.addPostSpeaker(newId, s.id)));
      }
      navigate('/organizer/posts');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpeaker = async () => {
    if (!selectedSpeaker) return;
    const speaker = allSpeakers.find((s) => s.id === selectedSpeaker);
    if (!speaker) return;
    if (id) {
      await api.addPostSpeaker(id, selectedSpeaker);
      const r = await api.getPostSpeakers(id);
      setLinkedSpeakers(r.data);
    } else {
      setLinkedSpeakers((prev) => [...prev, speaker]);
    }
    setSelectedSpeaker('');
  };

  const handleRemoveSpeaker = async (speakerId) => {
    if (id) {
      await api.removePostSpeaker(id, speakerId);
    }
    setLinkedSpeakers((prev) => prev.filter((s) => s.id !== speakerId));
  };

  const unlinkedSpeakers = allSpeakers.filter((s) => !linkedSpeakers.find((l) => l.id === s.id));

  return (
    <div>
      <h1 className="admin-section-title">{id ? 'Edit Post' : 'New Post'}</h1>

      <form className="admin-form" onSubmit={handleSubmit} style={{ maxWidth: 660 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
          style={{ minHeight: 240 }}
        />
        <input name="image_url" type="url" placeholder="Image URL (optional — leave blank for auto)" value={form.image_url} onChange={handleChange} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <input name="published" type="checkbox" checked={form.published} onChange={handleChange} />
          Submit for review (will be visible once admin approves)
        </label>
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : id ? 'Save Changes' : 'Create Post'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/organizer/posts')}>Cancel</button>
        </div>
      </form>

      {allSpeakers.length > 0 && (
        <div style={{ maxWidth: 660, marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Authors / Speakers</h3>

          {linkedSpeakers.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {linkedSpeakers.map((s) => (
                <span
                  key={s.id}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    background: '#f0f0f0', borderRadius: '2rem', padding: '0.3rem 0.75rem',
                    fontSize: '0.875rem',
                  }}
                >
                  <img
                    src={proxyImage(s.photo_url)}
                    alt={s.name}
                    style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  {s.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpeaker(s.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontWeight: 'bold', padding: 0, lineHeight: 1 }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          {unlinkedSpeakers.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={selectedSpeaker}
                onChange={(e) => setSelectedSpeaker(e.target.value)}
                style={{ flex: 1 }}
              >
                <option value="">— Add a speaker —</option>
                {unlinkedSpeakers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button type="button" className="btn btn-primary" onClick={handleAddSpeaker} disabled={!selectedSpeaker}>
                Add
              </button>
            </div>
          ) : (
            <p style={{ color: '#888', fontSize: '0.875rem', margin: 0 }}>All your speakers are already linked.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OrganizerCreatePost;
