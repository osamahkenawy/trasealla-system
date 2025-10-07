'use client';

import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { 
  CONTACT_STATUS_LABELS,
  INQUIRY_TYPE_LABELS,
  PRIORITY_LABELS,
  getUsers
} from '@/services/contactsService';

const ContactsFilters = ({ filters, onFilterChange, loading }) => {
  const [users, setUsers] = useState([]);

  // Fetch users for assignment filter
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle filter change
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  // Clear all filters
  const clearFilters = () => {
    onFilterChange({
      status: '',
      inquiryType: '',
      priority: '',
      search: '',
      assignedTo: ''
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="contacts-filters">
      <Row className="g-3">
        {/* Search */}
        <Col md={3}>
          <Form.Group>
            <Form.Label>Search</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search contacts..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                disabled={loading}
              />
            </InputGroup>
          </Form.Group>
        </Col>

        {/* Status Filter */}
        <Col md={2}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              disabled={loading}
            >
              <option value="">All Status</option>
              {Object.entries(CONTACT_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Inquiry Type Filter */}
        <Col md={2}>
          <Form.Group>
            <Form.Label>Inquiry Type</Form.Label>
            <Form.Select
              value={filters.inquiryType}
              onChange={(e) => handleFilterChange('inquiryType', e.target.value)}
              disabled={loading}
            >
              <option value="">All Types</option>
              {Object.entries(INQUIRY_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Priority Filter */}
        <Col md={2}>
          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              disabled={loading}
            >
              <option value="">All Priorities</option>
              {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Assigned To Filter */}
        <Col md={2}>
          <Form.Group>
            <Form.Label>Assigned To</Form.Label>
            <Form.Select
              value={filters.assignedTo}
              onChange={(e) => handleFilterChange('assignedTo', e.target.value)}
              disabled={loading}
            >
              <option value="">All Users</option>
              <option value="unassigned">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Actions */}
        <Col md={1}>
          <Form.Group>
            <Form.Label>&nbsp;</Form.Label>
            <div className="d-flex gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={clearFilters}
                disabled={loading || !hasActiveFilters}
                title="Clear Filters"
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </div>
          </Form.Group>
        </Col>
      </Row>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Row className="mt-3">
          <Col>
            <div className="d-flex flex-wrap gap-2">
              <span className="text-muted small">Active filters:</span>
              {filters.status && (
                <span className="badge bg-primary">
                  Status: {CONTACT_STATUS_LABELS[filters.status]}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('status', '')}
                  ></button>
                </span>
              )}
              {filters.inquiryType && (
                <span className="badge bg-info">
                  Type: {INQUIRY_TYPE_LABELS[filters.inquiryType]}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('inquiryType', '')}
                  ></button>
                </span>
              )}
              {filters.priority && (
                <span className="badge bg-warning">
                  Priority: {PRIORITY_LABELS[filters.priority]}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('priority', '')}
                  ></button>
                </span>
              )}
              {filters.search && (
                <span className="badge bg-secondary">
                  Search: {filters.search}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('search', '')}
                  ></button>
                </span>
              )}
              {filters.assignedTo && (
                <span className="badge bg-success">
                  Assigned: {filters.assignedTo === 'unassigned' ? 'Unassigned' : users.find(u => u.id == filters.assignedTo)?.name || 'Unknown'}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.7em' }}
                    onClick={() => handleFilterChange('assignedTo', '')}
                  ></button>
                </span>
              )}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default ContactsFilters;
