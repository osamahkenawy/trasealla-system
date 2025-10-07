'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { 
  updateContactStatus,
  getUsers,
  CONTACT_STATUS_LABELS,
  PRIORITY_LABELS
} from '@/services/contactsService';

const ContactStatusModal = ({ contact, show, onHide, onSuccess }) => {
  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    notes: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load users and set initial form data
  useEffect(() => {
    if (show && contact) {
      // Set initial form data
      setFormData({
        status: contact.status || '',
        priority: contact.priority || '',
        assignedTo: contact.assignedTo?.id || '',
        notes: contact.notes || ''
      });

      // Load users
      const fetchUsers = async () => {
        try {
          const response = await getUsers();
          setUsers(response.data.users || []);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
  }, [show, contact]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Prepare update data
      const updateData = {
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
        notes: formData.notes
      };

      // Remove empty values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

      await updateContactStatus(contact.id, updateData);
      onSuccess();
    } catch (err) {
      console.error('Error updating contact status:', err);
      setError(err.response?.data?.message || 'Failed to update contact status');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    setFormData({
      status: '',
      priority: '',
      assignedTo: '',
      notes: ''
    });
    setError(null);
    onHide();
  };

  if (!contact) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Contact Status</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <strong>Contact:</strong> {contact.name} ({contact.email})
        </div>
        <div className="mb-3">
          <strong>Subject:</strong> {contact.subject}
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Status */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Status</option>
                  {Object.entries(CONTACT_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Priority */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Select Priority</option>
                  {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Assigned To */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Assign To</Form.Label>
                <Form.Select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Notes */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Admin Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any internal notes..."
                  disabled={loading}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading || !formData.status}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Updating...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-2"></i>
              Update Status
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactStatusModal;
