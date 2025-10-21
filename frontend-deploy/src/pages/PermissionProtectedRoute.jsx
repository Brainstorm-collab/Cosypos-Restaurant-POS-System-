import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

/**
 * Permission-based route protection
 * Checks if user has the required permission to access a page
 */
export default function PermissionProtectedRoute({ children, requiredPermission }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#111315',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#FAC1D9',
        fontSize: 18,
        fontWeight: 500
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin and SubAdmin always have access to everything (except manage-access for SubAdmin, handled in routes)
  if (user.role === 'ADMIN' || user.role === 'SUBADMIN') {
    return children;
  }

  // Check user permissions
  const hasPermission = () => {
    try {
      const permissions = typeof user.permissions === 'string' 
        ? JSON.parse(user.permissions) 
        : user.permissions || {};
      
      return permissions[requiredPermission] === true;
    } catch {
      return false;
    }
  };

  // If user doesn't have permission, redirect to dashboard
  if (!hasPermission()) {
    console.warn(`🚫 Access denied: User lacks "${requiredPermission}" permission`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

