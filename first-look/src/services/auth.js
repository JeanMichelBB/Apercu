export function getTokenPayload() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getTokenPayload();
}

export function isAdmin() {
  return getTokenPayload()?.role === 'admin';
}

export function isOrganizer() {
  return getTokenPayload()?.role === 'organizer';
}

export function getDisplayName() {
  const payload = getTokenPayload();
  if (!payload) return null;
  if (payload.name) return payload.name;
  return payload.email;
}

export function getInitial() {
  const name = getDisplayName();
  return name ? name.charAt(0).toUpperCase() : '?';
}

export function signOut() {
  localStorage.removeItem('token');
  window.location.href = '/';
}
