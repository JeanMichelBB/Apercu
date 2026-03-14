import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_API_URL;

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'access-token': token } : {};
}

const api = {
  // Events
  getEvents: (params = {}) =>
    axios.get(`${BASE_URL}/events`, { params }),

  getEvent: (id) =>
    axios.get(`${BASE_URL}/events/${id}`),

  getAllEvents: () =>
    axios.get(`${BASE_URL}/events/admin/all`, { headers: authHeaders() }),

  getPendingEvents: () =>
    axios.get(`${BASE_URL}/events/admin/pending`, { headers: authHeaders() }),

  approveEvent: (id) =>
    axios.put(`${BASE_URL}/events/${id}/approve`, {}, { headers: authHeaders() }),

  rejectEvent: (id) =>
    axios.put(`${BASE_URL}/events/${id}/reject`, {}, { headers: authHeaders() }),

  getMyEvents: () =>
    axios.get(`${BASE_URL}/events/organizer/my-events`, { headers: authHeaders() }),

  getEventRegistrations: (id) =>
    axios.get(`${BASE_URL}/events/${id}/registrations`, { headers: authHeaders() }),

  createEvent: (data) =>
    axios.post(`${BASE_URL}/events`, data, { headers: authHeaders() }),

  updateEvent: (id, data) =>
    axios.put(`${BASE_URL}/events/${id}`, data, { headers: authHeaders() }),

  deleteEvent: (id) =>
    axios.delete(`${BASE_URL}/events/${id}`, { headers: authHeaders() }),

  isRegistered: (id) =>
    axios.get(`${BASE_URL}/events/${id}/is-registered`, { headers: authHeaders() }),

  registerForEvent: (id) =>
    axios.post(`${BASE_URL}/events/${id}/register`, {}, { headers: authHeaders() }),

  cancelRegistration: (id) =>
    axios.delete(`${BASE_URL}/events/${id}/register`, { headers: authHeaders() }),

  getMyRegistrations: () =>
    axios.get(`${BASE_URL}/events/my/registrations`, { headers: authHeaders() }),

  // Speakers
  getSpeakers: () =>
    axios.get(`${BASE_URL}/speakers`),

  getSpeaker: (id) =>
    axios.get(`${BASE_URL}/speakers/${id}`),

  createSpeaker: (data) =>
    axios.post(`${BASE_URL}/speakers`, data, { headers: authHeaders() }),

  updateSpeaker: (id, data) =>
    axios.put(`${BASE_URL}/speakers/${id}`, data, { headers: authHeaders() }),

  deleteSpeaker: (id) =>
    axios.delete(`${BASE_URL}/speakers/${id}`, { headers: authHeaders() }),

  // Blog posts
  getPosts: (params = {}) =>
    axios.get(`${BASE_URL}/posts`, { params }),

  getPost: (id) =>
    axios.get(`${BASE_URL}/posts/${id}`),

  getAllPosts: () =>
    axios.get(`${BASE_URL}/posts/all`, { headers: authHeaders() }),

  createPost: (data) =>
    axios.post(`${BASE_URL}/posts`, data, { headers: authHeaders() }),

  updatePost: (id, data) =>
    axios.put(`${BASE_URL}/posts/${id}`, data, { headers: authHeaders() }),

  deletePost: (id) =>
    axios.delete(`${BASE_URL}/posts/${id}`, { headers: authHeaders() }),

  // Registrations (admin)
  getAllRegistrations: () =>
    axios.get(`${BASE_URL}/events/registrations/all`, { headers: authHeaders() }),

  // Contacts (admin)
  getContacts: (token) =>
    axios.get(`${BASE_URL}/contacts`, { headers: { 'access-token': token } }),

  deleteContact: (id, token) =>
    axios.delete(`${BASE_URL}/delete-contact/${id}`, { headers: { 'access-token': token } }),

  deleteAllContacts: (token) =>
    axios.delete(`${BASE_URL}/delete-all-contacts`, { headers: { 'access-token': token } }),

  updateContact: (id, data, token) =>
    axios.put(`${BASE_URL}/update-contact/${id}`, data, { headers: { 'access-token': token } }),

  // Users (admin)
  getUsers: () =>
    axios.get(`${BASE_URL}/users`, { headers: authHeaders() }),

  updateUserRole: (id, role) =>
    axios.put(`${BASE_URL}/users/${id}/role?role=${role}`, {}, { headers: authHeaders() }),

  deleteUser: (id) =>
    axios.delete(`${BASE_URL}/users/${id}`, { headers: authHeaders() }),

  // Auth
  register: (data) =>
    axios.post(`${BASE_URL}/auth/register`, data),

  userLogin: (data) =>
    axios.post(`${BASE_URL}/auth/user-login`, data),

  adminLogin: (email, password) =>
    axios.post(`${BASE_URL}/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),

  changePassword: (data) =>
    axios.put(`${BASE_URL}/auth/password`, data, { headers: authHeaders() }),

  forgotPassword: (email) =>
    axios.post(`${BASE_URL}/auth/forgot-password`, { email }),

  verifyResetCode: (email, code) =>
    axios.post(`${BASE_URL}/auth/verify-reset-code`, { email, code }),

  resetPassword: (reset_token, new_password) =>
    axios.post(`${BASE_URL}/auth/reset-password`, { reset_token, new_password }),
};

export default api;
