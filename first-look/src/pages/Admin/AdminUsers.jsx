import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ROLE_BADGE = {
  user:      { label: 'User',      cls: 'badge-draft' },
  organizer: { label: 'Organizer', cls: 'badge-pending' },
};

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.getUsers().then((r) => setUsers(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (id, role) => {
    await api.updateUserRole(id, role);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    await api.deleteUser(id);
    load();
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="admin-section-title">Users</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '0.5rem 0.75rem', border: '1px solid #000', fontSize: '0.95rem', marginBottom: '1.5rem', width: '100%', maxWidth: 360 }}
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr><td colSpan={5} className="admin-status">No users found.</td></tr>
          )}
          {filtered.map((u) => (
            <tr key={u.id}>
              <td>{u.name || '—'}</td>
              <td>{u.email}</td>
              <td>
                <span className={`badge ${ROLE_BADGE[u.role]?.cls || 'badge-draft'}`}>
                  {ROLE_BADGE[u.role]?.label || u.role}
                </span>
              </td>
              <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
              <td>
                <div className="btn-group">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', border: '1px solid #000', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    <option value="user">User</option>
                    <option value="organizer">Organizer</option>
                  </select>
                  <button className="btn btn-danger" onClick={() => handleDelete(u.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ fontSize: '0.8rem', color: '#888' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</p>
    </div>
  );
}

export default AdminUsers;
