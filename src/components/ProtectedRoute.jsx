'use client';

import { useAuthContext } from '@/context/useAuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from './Spinner';

/**
 * Protected Route Component
 * Wraps components that require authentication
 * Redirects to sign-in if not authenticated
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, role, getRedirectPath } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to sign-in
        router.push('/auth/sign-in');
      } else if (requiredRole && role !== requiredRole) {
        // Authenticated but doesn't have required role
        // Redirect to their appropriate dashboard
        const redirectPath = getRedirectPath();
        router.push(redirectPath);
      }
    }
  }, [isAuthenticated, loading, role, requiredRole, router, getRedirectPath]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner />
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If role is required but doesn't match, show nothing (will redirect)
  if (requiredRole && role !== requiredRole) {
    return null;
  }

  // User is authenticated and has correct role, show children
  return <>{children}</>;
};

export default ProtectedRoute;
