'use client';

import React from 'react';
import { Modal, Button, Row, Col, Badge, Card, ListGroup } from 'react-bootstrap';
import { 
  USER_ROLE_LABELS, 
  USER_ROLE_COLORS 
} from '@/services/usersService';

const UserDetailsModal = ({ user, show, onHide }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '-';
    }
  };

  const InfoItem = ({ label, value, badge, badgeColor }) => (
    <ListGroup.Item className="d-flex justify-content-between align-items-start border-0 px-0 py-2">
      <div className="ms-2 me-auto">
        <div className="fw-bold text-muted" style={{ fontSize: '0.875rem' }}>{label}</div>
        {badge ? (
          <Badge bg={badgeColor} className="mt-1">
            {value || '-'}
          </Badge>
        ) : (
          <div className="mt-1" style={{ fontSize: '1rem' }}>{value || '-'}</div>
        )}
      </div>
    </ListGroup.Item>
  );

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                 style={{ width: '50px', height: '50px', fontSize: '1.5rem', fontWeight: 'bold' }}>
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div>
              <h5 className="mb-0">{user.firstName} {user.lastName}</h5>
              <small className="text-muted">{user.email}</small>
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Row className="g-4">
          {/* Personal Information */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle text-primary" style={{ fontSize: '1.25rem' }}></i>
                  <h6 className="mb-0 fw-bold">Personal Information</h6>
                </div>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <InfoItem label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                  <InfoItem label="Email Address" value={user.email} />
                  <InfoItem label="Phone Number" value={user.phone || 'Not provided'} />
                  <InfoItem label="Date of Birth" value={user.dateOfBirth || 'Not provided'} />
                  <InfoItem label="Nationality" value={user.nationality || 'Not provided'} />
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Account Information */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Header className="bg-white border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <i className="bi bi-shield-check text-success" style={{ fontSize: '1.25rem' }}></i>
                  <h6 className="mb-0 fw-bold">Account Information</h6>
                </div>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <InfoItem label="User ID" value={`#${user.id}`} />
                  <InfoItem 
                    label="Role" 
                    value={USER_ROLE_LABELS[user.role] || user.role} 
                    badge={true}
                    badgeColor={USER_ROLE_COLORS[user.role] || 'secondary'}
                  />
                  <InfoItem 
                    label="Account Status" 
                    value={user.isActive ? 'Active' : 'Inactive'} 
                    badge={true}
                    badgeColor={user.isActive ? 'success' : 'danger'}
                  />
                  <InfoItem 
                    label="Email Verification" 
                    value={user.isEmailVerified ? 'Verified' : 'Not Verified'} 
                    badge={true}
                    badgeColor={user.isEmailVerified ? 'success' : 'warning'}
                  />
                  <InfoItem label="Member Since" value={formatDate(user.createdAt)} />
                  <InfoItem label="Last Updated" value={formatDate(user.updatedAt)} />
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* Address Information */}
          {(user.address || user.city || user.country) && (
            <Col lg={12}>
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-geo-alt text-danger" style={{ fontSize: '1.25rem' }}></i>
                    <h6 className="mb-0 fw-bold">Address Information</h6>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <InfoItem label="Street Address" value={user.address || 'Not provided'} />
                    </Col>
                    <Col md={3}>
                      <InfoItem label="City" value={user.city || 'Not provided'} />
                    </Col>
                    <Col md={3}>
                      <InfoItem label="Country" value={user.country || 'Not provided'} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )}

          {/* Additional Information */}
          <Col lg={12}>
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body>
                <Row className="text-center">
                  <Col md={4}>
                    <div className="p-3">
                      <i className="bi bi-calendar-check text-primary mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mb-1">Created Date</h6>
                      <small className="text-muted">{formatDate(user.createdAt)}</small>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-3">
                      <i className="bi bi-clock-history text-info mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mb-1">Last Updated</h6>
                      <small className="text-muted">{formatDate(user.updatedAt)}</small>
                    </div>
                  </Col>
                  <Col md={4}>
                    <div className="p-3">
                      <i className="bi bi-person-badge text-warning mb-2" style={{ fontSize: '2rem' }}></i>
                      <h6 className="mb-1">User ID</h6>
                      <small className="text-muted">#{user.id}</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer className="bg-light">
        <Button variant="primary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetailsModal;
