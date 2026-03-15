import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const STATUS_BADGE = {
  published: { label: 'Published', cls: 'badge-published' },
  pending:   { label: 'Pending Approval', cls: 'badge-pending' },
  draft:     { label: 'Draft', cls: 'badge-draft' },
  rejected:  { label: 'Rejected', cls: 'badge-rejected' },
};

function OrganizerPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const load = () => api.getMyPosts().then((r) => setPosts(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.deletePost(id);
    load();
  };

  const handleResubmit = async (id) => {
    await api.resubmitPost(id);
    load();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 className="admin-section-title" style={{ margin: 0 }}>My Blog Posts</h1>
        <button className="btn btn-primary" onClick={() => navigate('/organizer/posts/create')}>+ New Post</button>
      </div>

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
            <tr><td colSpan={4} className="admin-status">No posts yet. Write your first one!</td></tr>
          )}
          {posts.map((p) => (
            <React.Fragment key={p.id}>
              <tr>
                <td>{p.title}</td>
                <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                <td>
                  <span className={`badge ${STATUS_BADGE[p.status]?.cls || 'badge-draft'}`}>
                    {STATUS_BADGE[p.status]?.label || p.status}
                  </span>
                </td>
                <td>
                  <div className="btn-group">
                    {p.status === 'rejected' && (
                      <button className="btn btn-primary" onClick={() => handleResubmit(p.id)}>Resubmit</button>
                    )}
                    <button className="btn btn-secondary" onClick={() => navigate(`/organizer/posts/edit/${p.id}`)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </div>
                </td>
              </tr>
              {p.status === 'rejected' && p.rejection_reason && (
                <tr>
                  <td colSpan={4} style={{ background: '#fff0f0', padding: '0.5rem 1rem', borderLeft: '3px solid #c00' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#c00' }}>Rejection reason: </strong>
                    <span style={{ fontSize: '0.82rem', color: '#444' }}>{p.rejection_reason}</span>
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

export default OrganizerPosts;
