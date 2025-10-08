'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { updateUserStatus } from '@/services/usersService';
import { 
  USER_STATUS_LABELS, 
  USER_STATUS 
} from '@/services/usersService';

const UserStatusModal = ({ user, show, onHide, onSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setSelectedStatus(user.status || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      setError('Please select a status');
      return;
    }

    if (selectedStatus === user?.status) {
      setError('Please select a different status');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await updateUserStatus(user.id, { status: selectedStatus });
      
      onSuccess({
        ...user,
        status: selectedStatus
      });
      
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus('');
    setError('');
    onHide();
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update User Status</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="mb-3">
            <strong>User:</strong> {user.firstName} {user.lastName}
          </div>
          
          <div className="mb-3">
            <strong>Current Status:</strong> {USER_STATUS_LABELS[user.status] || user.status}
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Select New Status</Form.Label>
            <Form.Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              required
            >
              <option value="">Choose a status...</option>
              {Object.entries(USER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key} disabled={key === user.status}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Alert variant="info" className="mb-0">
            <small>
              <strong>Note:</strong> Status changes will affect the user's access to the system immediately.
            </small>
          </Alert>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !selectedStatus || selectedStatus === user.status}
          >
            {loading && <Spinner animation="border" size="sm" className="me-2" />}
            Update Status
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UserStatusModal;
