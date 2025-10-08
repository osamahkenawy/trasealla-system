'use client';

import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { 
  USER_ROLE_LABELS, 
  USER_STATUS_LABELS 
} from '@/services/usersService';

const UsersFilters = ({ filters, onFilterChange, loading }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      role: '',
      status: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.role || filters.status || filters.search;

  return (
    <div className="users-filters">
      <Row className="g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Search Users</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by name, email..."
              value={filters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={filters.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              disabled={loading}
            >
              <option value="">All Roles</option>
              {Object.entries(USER_ROLE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={loading}
            >
              <option value="">All Statuses</option>
              {Object.entries(USER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3} className="d-flex align-items-end">
          <div className="d-flex gap-2 w-100">
            <Button
              variant="outline-secondary"
              onClick={clearFilters}
              disabled={loading || !hasActiveFilters}
              className="flex-fill"
            >
              Clear Filters
            </Button>
          </div>
        </Col>
      </Row>

      {hasActiveFilters && (
        <Row className="mt-3">
          <Col>
            <div className="d-flex flex-wrap gap-2">
              {filters.search && (
                <span className="badge bg-primary">
                  Search: {filters.search}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    onClick={() => handleInputChange('search', '')}
                    style={{ fontSize: '0.7em' }}
                  />
                </span>
              )}
              {filters.role && (
                <span className="badge bg-warning">
                  Role: {USER_ROLE_LABELS[filters.role]}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    onClick={() => handleInputChange('role', '')}
                    style={{ fontSize: '0.7em' }}
                  />
                </span>
              )}
              {filters.status && (
                <span className="badge bg-info">
                  Status: {USER_STATUS_LABELS[filters.status]}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    onClick={() => handleInputChange('status', '')}
                    style={{ fontSize: '0.7em' }}
                  />
                </span>
              )}
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default UsersFilters;
