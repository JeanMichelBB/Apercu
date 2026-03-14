import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, posts: 0, contacts: 0, registrations: 0 });
  const token = localStorage.getItem('token');

  useEffect(() => {
    Promise.allSettled([
      api.getAllEvents(),
      api.getAllPosts(),
      api.getContacts(token),
      api.getAllRegistrations(),
    ]).then(([events, posts, contacts, regs]) => {
      setStats({
        events: events.status === 'fulfilled' ? events.value.data.length : 0,
        posts: posts.status === 'fulfilled' ? posts.value.data.length : 0,
        contacts: contacts.status === 'fulfilled' ? contacts.value.data.length : 0,
        registrations: regs.status === 'fulfilled' ? regs.value.data.length : 0,
      });
    });
  }, []);

  const items = [
    { label: 'Events', value: stats.events },
    { label: 'Registrations', value: stats.registrations },
    { label: 'Blog Posts', value: stats.posts },
    { label: 'Contacts', value: stats.contacts },
  ];

  return (
    <div>
      <h1 className="admin-section-title">Dashboard</h1>
      <div className="admin-stats">
        {items.map((item) => (
          <div key={item.label} className="admin-stat-card">
            <div className="admin-stat-number">{item.value}</div>
            <div className="admin-stat-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
