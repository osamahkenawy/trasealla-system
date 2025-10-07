'use client';

import React, { useState } from 'react';
import { Modal, Button, Badge, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS,
  INQUIRY_TYPE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  respondToContact
} from '@/services/contactsService';

const ContactDetailsModal = ({ 
  contact, 
  show, 
  onHide, 
  onStatusUpdate, 
  onResponseSuccess 
}) => {
  const [response, setResponse] = useState('');
  const [sendingResponse, setSendingResponse] = useState(false);
  const [responseError, setResponseError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status) => {
    const colorMap = {
      primary: 'primary',
      warning: 'warning',
      success: 'success',
      secondary: 'secondary'
    };
    return colorMap[CONTACT_STATUS_COLORS[status]] || 'secondary';
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority) => {
    const colorMap = {
      success: 'success',
      info: 'info',
      warning: 'warning',
      danger: 'danger'
    };
    return colorMap[PRIORITY_COLORS[priority]] || 'secondary';
  };

  // Handle response submit
  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    try {
      setSendingResponse(true);
      setResponseError(null);

      await respondToContact(contact.id, { response: response.trim() });
      
      setResponseSuccess(true);
      setResponse('');
      
      // Call success callback after a delay
      setTimeout(() => {
        onResponseSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error sending response:', error);
      setResponseError(error.response?.data?.message || 'Failed to send response');
    } finally {
      setSendingResponse(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setResponse('');
    setResponseError(null);
    setResponseSuccess(false);
    onHide();
  };

  if (!contact) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Contact Details
          <Badge 
            bg={getStatusBadgeVariant(contact.status)} 
            className="ms-2 text-capitalize"
          >
            {CONTACT_STATUS_LABELS[contact.status] || contact.status}
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-3">
          {/* Contact Information */}
          <Col md={6}>
            <div className="border rounded p-3 h-100">
              <h6 className="mb-3">
                <i className="bi bi-person me-2"></i>
                Contact Information
              </h6>
              
              <div className="mb-2">
                <strong>Name:</strong> {contact.name}
              </div>
              <div className="mb-2">
                <strong>Email:</strong> 
                <a href={`mailto:${contact.email}`} className="ms-1">
                  {contact.email}
                </a>
              </div>
              {contact.phone && (
                <div className="mb-2">
                  <strong>Phone:</strong> 
                  <a href={`tel:${contact.phone}`} className="ms-1">
                    {contact.phone}
                  </a>
                </div>
              )}
              <div className="mb-2">
                <strong>Inquiry Type:</strong>
                <Badge bg="info" className="ms-1 text-capitalize">
                  {INQUIRY_TYPE_LABELS[contact.inquiryType] || contact.inquiryType}
                </Badge>
              </div>
              {contact.priority && (
                <div className="mb-2">
                  <strong>Priority:</strong>
                  <Badge bg={getPriorityBadgeVariant(contact.priority)} className="ms-1 text-capitalize">
                    {PRIORITY_LABELS[contact.priority] || contact.priority}
                  </Badge>
                </div>
              )}
            </div>
          </Col>

          {/* Assignment & Status */}
          <Col md={6}>
            <div className="border rounded p-3 h-100">
              <h6 className="mb-3">
                <i className="bi bi-gear me-2"></i>
                Assignment & Status
              </h6>
              
              <div className="mb-2">
                <strong>Status:</strong>
                <Badge bg={getStatusBadgeVariant(contact.status)} className="ms-1 text-capitalize">
                  {CONTACT_STATUS_LABELS[contact.status] || contact.status}
                </Badge>
              </div>
              
              <div className="mb-2">
                <strong>Assigned To:</strong>
                {contact.assignedTo ? (
                  <div className="ms-1">
                    <div>{contact.assignedTo.name}</div>
                    <small className="text-muted">{contact.assignedTo.email}</small>
                  </div>
                ) : (
                  <span className="ms-1 text-muted">Unassigned</span>
                )}
              </div>
              
              <div className="mb-2">
                <strong>Created:</strong>
                <span className="ms-1">{formatDate(contact.createdAt)}</span>
              </div>
              
              {contact.updatedAt && contact.updatedAt !== contact.createdAt && (
                <div className="mb-2">
                  <strong>Last Updated:</strong>
                  <span className="ms-1">{formatDate(contact.updatedAt)}</span>
                </div>
              )}
              
              {contact.notes && (
                <div className="mb-2">
                  <strong>Admin Notes:</strong>
                  <div className="ms-1 text-muted small">{contact.notes}</div>
                </div>
              )}
            </div>
          </Col>

          {/* Message */}
          <Col md={12}>
            <div className="border rounded p-3">
              <h6 className="mb-3">
                <i className="bi bi-chat-dots me-2"></i>
                Message
              </h6>
              <div className="mb-2">
                <strong>Subject:</strong> {contact.subject}
              </div>
              <div>
                <strong>Message:</strong>
                <div className="mt-2 p-3 bg-light rounded">
                  {contact.message}
                </div>
              </div>
            </div>
          </Col>

          {/* Response Form */}
          <Col md={12}>
            <div className="border rounded p-3">
              <h6 className="mb-3">
                <i className="bi bi-reply me-2"></i>
                Send Response
              </h6>
              
              {responseSuccess && (
                <Alert variant="success" className="mb-3">
                  <i className="bi bi-check-circle me-2"></i>
                  Response sent successfully!
                </Alert>
              )}
              
              {responseError && (
                <Alert variant="danger" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {responseError}
                </Alert>
              )}
              
              <Form onSubmit={handleResponseSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Response Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your response here..."
                    disabled={sendingResponse}
                    required
                  />
                </Form.Group>
                
                <div className="d-flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={sendingResponse || !response.trim()}
                  >
                    {sendingResponse ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Send Response
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="warning" onClick={() => onStatusUpdate(contact)}>
          <i className="bi bi-pencil me-2"></i>
          Update Status
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactDetailsModal;
