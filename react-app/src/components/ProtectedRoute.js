import { Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ element, ...rest }) {
  const isAuthenticated = localStorage.getItem('token');

  return isAuthenticated ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" />
  );
}

export default ProtectedRoute;