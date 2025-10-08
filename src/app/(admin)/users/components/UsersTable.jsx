'use client';

import React from 'react';
import { Table, Badge, Button, Spinner } from 'react-bootstrap';
import { 
  USER_ROLE_LABELS, 
  USER_ROLE_COLORS,
  USER_STATUS_LABELS, 
  USER_STATUS_COLORS 
} from '@/services/usersService';

const UsersTable = ({ 
  users, 
  loading, 
  pagination, 
  onUserSelect, 
  onEditUser,
  onStatusUpdate,
  onPageChange 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '-';
    }
  };

  const handleUserClick = (user) => {
    onUserSelect(user);
  };

  const handleEditUser = (e, user) => {
    e.stopPropagation();
    onEditUser(user);
  };

  const handleStatusUpdate = (e, user) => {
    e.stopPropagation();
    onStatusUpdate(user);
  };

  if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading users...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="users-table">
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Active</th>
            <th>Email Verified</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr 
              key={user.id} 
              style={{ cursor: 'pointer' }}
              onClick={() => handleUserClick(user)}
            >
              <td>{user.id}</td>
              <td>
                <div>
                  <strong>{user.firstName} {user.lastName}</strong>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.phone || '-'}</td>
              <td>
                <Badge 
                  bg={USER_ROLE_COLORS[user.role] || 'secondary'}
                  className="text-capitalize"
                >
                  {USER_ROLE_LABELS[user.role] || user.role}
                </Badge>
              </td>
              <td>
                <Badge 
                  bg={user.isActive ? 'success' : 'danger'}
                  className="text-capitalize"
                >
                  {user.isActive ? 'Yes' : 'No'}
                </Badge>
              </td>
              <td>
                <Badge 
                  bg={user.isEmailVerified ? 'success' : 'warning'}
                  className="text-capitalize"
                >
                  {user.isEmailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <div className="d-flex gap-1">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserSelect(user);
                    }}
                    title="View Details"
                  >
                    <i className="bi bi-eye"></i>
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => handleEditUser(e, user)}
                    title="Edit User"
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={(e) => handleStatusUpdate(e, user)}
                    title="Toggle Status"
                  >
                    <i className="bi bi-toggle-on"></i>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {users.length === 0 && !loading && (
        <div className="text-center py-4">
          <p className="text-muted">No users found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          
          <div className="d-flex gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
            >
              Previous
            </Button>
            
            <span className="d-flex align-items-center px-3">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
