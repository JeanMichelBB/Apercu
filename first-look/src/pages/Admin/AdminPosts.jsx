import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const EMPTY_FORM = { title: '', content: '', published: false, image_url: '' };

function PostPreviewModal({ post, onClose, onApprove, onReject, onEdit }) {
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  if (!post) return null;

  const handleApprove = async () => { await onApprove(post.id); onClose(); };
  const handleReject  = async () => {
    if (!rejectReason.trim()) return;
    await onReject(post.id, rejectReason.trim());
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', maxWidth: 680, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '2rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{post.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1, color: '#666' }}>✕</button>
        </div>
        {post.image_url && (
          <img src={post.image_url} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', marginBottom: '1rem' }} />
        )}
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: '#333', margin: '0 0 1.5rem', fontSize: '0.9rem' }}>{post.content}</p>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
          {!rejecting ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {post.status === 'pending' && <button className="btn btn-primary" onClick={handleApprove}>Approve</button>}
              {post.status === 'pending' && <button className="btn btn-danger" onClick={() => setRejecting(true)}>Reject…</button>}
              <button className="btn btn-secondary" onClick={() => { onEdit(post); onClose(); }}>Edit</button>
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

function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

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
    setForm({ title: p.title, content: p.content, published: p.published, image_url: p.image_url ?? '' });
    setTimeout(() => document.querySelector('.admin-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const cancelEdit = () => { setEditId(null); setForm(EMPTY_FORM); };

  const handleApprove = async (id) => { await api.approvePost(id); load(); };
  const handleReject  = async (id, reason) => {
    const r = reason ?? rejectReason;
    if (!r.trim()) return;
    await api.rejectPost(id, r.trim());
    setRejectingId(null);
    setRejectReason('');
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.deletePost(id);
    load();
  };

  const STATUS = {
    published: { label: 'Published', cls: 'badge-published' },
    pending:   { label: 'Pending',   cls: 'badge-pending'   },
    draft:     { label: 'Draft',     cls: 'badge-draft'     },
  };

  const pending = posts.filter((p) => p.status === 'pending');
  const rest    = posts.filter((p) => p.status !== 'pending');

  return (
    <div>
      <h1 className="admin-section-title">Blog Posts</h1>

      <PostPreviewModal
        post={preview}
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
              <tr><th>Title</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <React.Fragment key={p.id}>
                  <tr>
                    <td>
                      <button
                        onClick={() => setPreview(p)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, color: '#1a6ef5', textDecoration: 'underline', fontSize: 'inherit' }}
                      >
                        {p.title}
                      </button>
                    </td>
                    <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-secondary" onClick={() => setPreview(p)}>Preview</button>
                        <button className="btn btn-secondary" onClick={() => startEdit(p)}>Edit</button>
                        <button className="btn btn-primary" onClick={() => handleApprove(p.id)}>Approve</button>
                        {rejectingId === p.id ? (
                          <button className="btn btn-secondary" onClick={() => { setRejectingId(null); setRejectReason(''); }}>Cancel</button>
                        ) : (
                          <button className="btn btn-danger" onClick={() => { setRejectingId(p.id); setRejectReason(''); }}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {rejectingId === p.id && (
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
                            onClick={() => handleReject(p.id)}
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

      {/* Create / edit form */}
      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editId ? 'Edit Post' : 'New Post'}</h3>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required style={{ minHeight: '200px' }} />
        <input name="image_url" type="url" placeholder="Image URL (optional — leave blank for auto)" value={form.image_url} onChange={handleChange} />
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

      {/* All other posts */}
      <table className="admin-table">
        <thead>
          <tr><th>Title</th><th>Date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rest.length === 0 && (
            <tr><td colSpan={4} className="admin-status">No posts yet.</td></tr>
          )}
          {rest.map((p) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
              <td>
                <span className={`badge ${STATUS[p.status]?.cls || 'badge-draft'}`}>
                  {STATUS[p.status]?.label || p.status}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={() => startEdit(p)}>Edit</button>
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
