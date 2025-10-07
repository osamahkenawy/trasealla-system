'use client';

import React from 'react';
import { Alert, Card, CardBody } from 'react-bootstrap';
import { useAuthContext } from '@/context/useAuthContext';

/**
 * Role Guard Component
 * Checks if user has required role to access content
 */
const RoleGuard = ({ 
  children, 
  requiredRoles = ['admin'], 
  fallback = null,
  showError = true 
}) => {
  const { user, role, loading } = useAuthContext();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user has required role
  const hasRequiredRole = requiredRoles.includes(role);

  // If user doesn't have required role, show error or fallback
  if (!hasRequiredRole) {
    if (fallback) {
      return fallback;
    }

    if (showError) {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <Card className="border-0 shadow-sm">
                <CardBody className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-shield-exclamation display-1 text-warning"></i>
                  </div>
                  <h4 className="mb-3">Access Denied</h4>
                  <Alert variant="warning" className="mb-4">
                    <strong>Insufficient Permissions</strong>
                    <br />
                    You do not have permission to access this feature.
                    <br />
                    <strong>Required Role:</strong> {requiredRoles.join(' or ')}
                    <br />
                    <strong>Your Role:</strong> {role || 'Unknown'}
                  </Alert>
                  <p className="text-muted">
                    Please contact your administrator if you believe this is an error.
                  </p>
                  <div className="mt-4">
                    <button 
                      className="btn btn-primary"
                      onClick={() => window.history.back()}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Go Back
                    </button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  // User has required role, show children
  return <>{children}</>;
};

export default RoleGuard;
