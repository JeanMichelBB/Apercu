import axios from 'axios';

const BASE_URL = import.meta.env.VITE_APP_API_URL;

export function proxyImage(url) {
  if (!url) return url;
  return `${BASE_URL}/proxy/image?url=${encodeURIComponent(url)}`;
}

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

  rejectEvent: (id, reason) =>
    axios.put(`${BASE_URL}/events/${id}/reject`, { reason }, { headers: authHeaders() }),

  resubmitEvent: (id) =>
    axios.post(`${BASE_URL}/events/${id}/resubmit`, {}, { headers: authHeaders() }),

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

  getSpeakerEvents: (id) =>
    axios.get(`${BASE_URL}/speakers/${id}/events`),

  getSpeakerPosts: (id) =>
    axios.get(`${BASE_URL}/speakers/${id}/posts`),

  getPostSpeakers: (id) =>
    axios.get(`${BASE_URL}/posts/${id}/speakers`),

  getEventSpeakers: (id) =>
    axios.get(`${BASE_URL}/events/${id}/speakers`),

  addEventSpeaker: (eventId, speakerId) =>
    axios.post(`${BASE_URL}/events/${eventId}/speakers/${speakerId}`, {}, { headers: authHeaders() }),

  removeEventSpeaker: (eventId, speakerId) =>
    axios.delete(`${BASE_URL}/events/${eventId}/speakers/${speakerId}`, { headers: authHeaders() }),

  // Organizer speaker actions
  submitSpeaker: (data) =>
    axios.post(`${BASE_URL}/speakers/submit`, data, { headers: authHeaders() }),

  getMySpeakers: () =>
    axios.get(`${BASE_URL}/speakers/organizer/my-speakers`, { headers: authHeaders() }),

  // Admin speaker actions
  getAllSpeakersAdmin: () =>
    axios.get(`${BASE_URL}/speakers/admin/all`, { headers: authHeaders() }),

  approveSpeaker: (id) =>
    axios.put(`${BASE_URL}/speakers/${id}/approve`, {}, { headers: authHeaders() }),

  rejectSpeaker: (id, reason) =>
    axios.put(`${BASE_URL}/speakers/${id}/reject`, { reason }, { headers: authHeaders() }),

  resubmitSpeaker: (id) =>
    axios.post(`${BASE_URL}/speakers/${id}/resubmit`, {}, { headers: authHeaders() }),

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

  getMyPosts: () =>
    axios.get(`${BASE_URL}/posts/organizer/my-posts`, { headers: authHeaders() }),

  createPost: (data) =>
    axios.post(`${BASE_URL}/posts`, data, { headers: authHeaders() }),

  updatePost: (id, data) =>
    axios.put(`${BASE_URL}/posts/${id}`, data, { headers: authHeaders() }),

  deletePost: (id) =>
    axios.delete(`${BASE_URL}/posts/${id}`, { headers: authHeaders() }),

  approvePost: (id) =>
    axios.put(`${BASE_URL}/posts/${id}/approve`, {}, { headers: authHeaders() }),

  rejectPost: (id, reason) =>
    axios.put(`${BASE_URL}/posts/${id}/reject`, { reason }, { headers: authHeaders() }),

  resubmitPost: (id) =>
    axios.post(`${BASE_URL}/posts/${id}/resubmit`, {}, { headers: authHeaders() }),

  addPostSpeaker: (postId, speakerId) =>
    axios.post(`${BASE_URL}/posts/${postId}/speakers/${speakerId}`, {}, { headers: authHeaders() }),

  removePostSpeaker: (postId, speakerId) =>
    axios.delete(`${BASE_URL}/posts/${postId}/speakers/${speakerId}`, { headers: authHeaders() }),

  // Comments & likes
  getComments: (postId) =>
    axios.get(`${BASE_URL}/posts/${postId}/comments`),

  addComment: (postId, content) =>
    axios.post(`${BASE_URL}/posts/${postId}/comments`, { content }, { headers: authHeaders() }),

  deleteComment: (postId, commentId) =>
    axios.delete(`${BASE_URL}/posts/${postId}/comments/${commentId}`, { headers: authHeaders() }),

  getLikes: (postId) =>
    axios.get(`${BASE_URL}/posts/${postId}/likes`, { headers: authHeaders() }),

  toggleLike: (postId) =>
    axios.post(`${BASE_URL}/posts/${postId}/like`, {}, { headers: authHeaders() }),

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
    axios.post(`${BASE_URL}/login`, { email, password }),

  changePassword: (data) =>
    axios.put(`${BASE_URL}/auth/password`, data, { headers: authHeaders() }),

  forgotPassword: (email) =>
    axios.post(`${BASE_URL}/auth/forgot-password`, { email }),

  resendVerification: () =>
    axios.post(`${BASE_URL}/auth/resend-verification`, {}, { headers: authHeaders() }),

  getEmailVerifiedStatus: () =>
    axios.get(`${BASE_URL}/auth/email-verified`, { headers: authHeaders() }),

  verifyEmail: (token) =>
    axios.get(`${BASE_URL}/auth/verify-email`, { params: { token } }),

  verifyResetCode: (email, code) =>
    axios.post(`${BASE_URL}/auth/verify-reset-code`, { email, code }),

  resetPassword: (reset_token, new_password) =>
    axios.post(`${BASE_URL}/auth/reset-password`, { reset_token, new_password }),
};

export default api;
