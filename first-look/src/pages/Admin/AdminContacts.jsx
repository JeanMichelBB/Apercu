import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminContacts({ token }) {
  const [contacts, setContacts] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [editedContact, setEditedContact] = useState(null);

  const load = () => api.getContacts(token).then((r) => setContacts(r.data)).catch(() => {});

  useEffect(() => { load(); }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    await api.deleteContact(id, token);
    load();
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('Delete ALL contacts?')) return;
    await api.deleteAllContacts(token);
    load();
  };

  const startEdit = (contact) => setEditedContact({ ...contact });
  const cancelEdit = () => setEditedContact(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact((c) => ({ ...c, [name]: value }));
  };

  const saveEdit = async () => {
    await api.updateContact(editedContact.id, editedContact, token);
    setEditedContact(null);
    load();
  };

  return (
    <div>
      <h1 className="admin-section-title">Contacts</h1>

      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-danger" onClick={handleDeleteAll}>Delete All</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 && (
            <tr><td colSpan={5} className="admin-status">No contacts yet.</td></tr>
          )}
          {contacts.map((c) => (
            <React.Fragment key={c.id}>
              <tr
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveId((id) => id === c.id ? null : c.id)}
              >
                <td>{c.subject}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.email}</td>
                <td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="btn-group">
                    <button className="btn btn-secondary" onClick={() => startEdit(c)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </td>
              </tr>
              {activeId === c.id && (
                <tr>
                  <td colSpan={5} style={{ background: '#f9f9f9', padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem' }}><strong>Phone:</strong> {c.phone_number}</p>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Info:</strong> {c.additional_info}</p>
                  </td>
                </tr>
              )}
              {editedContact?.id === c.id && (
                <tr>
                  <td colSpan={5} style={{ padding: '1rem', background: '#f0f0f0' }}>
                    <div className="admin-form" style={{ margin: 0, border: 'none', padding: 0 }}>
                      {['subject', 'first_name', 'last_name', 'email', 'phone_number', 'additional_info'].map((field) => (
                        <input
                          key={field}
                          name={field}
                          value={editedContact[field] || ''}
                          onChange={handleInputChange}
                          placeholder={field.replace('_', ' ')}
                        />
                      ))}
                      <div className="admin-form-actions">
                        <button className="btn btn-primary" onClick={saveEdit}>Save</button>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
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

export default AdminContacts;
