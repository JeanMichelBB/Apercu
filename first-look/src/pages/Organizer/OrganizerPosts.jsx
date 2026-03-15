import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
              <td>
                <span className={`badge ${{ published: 'badge-published', pending: 'badge-pending', draft: 'badge-draft' }[p.status] || 'badge-draft'}`}>
                  {{ published: 'Published', pending: 'Pending Approval', draft: 'Draft' }[p.status] || p.status}
                </span>
              </td>
              <td>
                <div className="btn-group">
                  <button className="btn btn-secondary" onClick={() => navigate(`/organizer/posts/edit/${p.id}`)}>Edit</button>
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

export default OrganizerPosts;
