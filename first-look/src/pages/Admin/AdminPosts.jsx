import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_FORM = { title: '', content: '', published: false };

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.getAllPosts().then((r) => setPosts(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.updatePost(editId, form);
      } else {
        await api.createPost(form);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save post.');
    }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ title: p.title, content: p.content, published: p.published });
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const togglePublished = async (p) => {
    await api.updatePost(p.id, { published: !p.published });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.deletePost(id);
    load();
  };

  return (
    <div>
      <h1 className="admin-section-title">Blog Posts</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Edit Post' : 'New Post'}</h3>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required style={{ minHeight: '200px' }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <input name="published" type="checkbox" checked={form.published} onChange={handleChange} />
          Published
        </label>
        {error && <p style={{ color: '#c00', margin: 0, fontSize: '0.9rem' }}>{error}</p>}
        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary">{editId ? 'Save Changes' : 'Create Post'}</button>
          {editId && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && (
            <tr><td colSpan={4} className="admin-status">No posts yet.</td></tr>
          )}
          {posts.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
              <td>
                <span className={`badge ${p.published ? 'badge-published' : 'badge-draft'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn btn-secondary" onClick={() => togglePublished(p)}>
                    {p.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPosts;
