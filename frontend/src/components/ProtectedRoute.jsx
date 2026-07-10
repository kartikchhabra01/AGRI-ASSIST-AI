import { Navigate } from 'react-router-dom'
import { authAPI } from '../services/api'

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 * Preserves the intended destination for redirect after login
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = authAPI.isAuthenticated()

  if (!isAuthenticated) {
    // Store the current path for redirect after login
    const currentPath = window.location.pathname
    sessionStorage.setItem('redirectAfterLogin', currentPath)
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
