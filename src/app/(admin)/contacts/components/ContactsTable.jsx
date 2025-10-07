'use client';

import React from 'react';
import { Table, Badge, Button, Spinner, Pagination } from 'react-bootstrap';
import { 
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS,
  INQUIRY_TYPE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS
} from '@/services/contactsService';

const ContactsTable = ({
  contacts,
  loading,
  pagination,
  onContactSelect,
  onStatusUpdate,
  onPageChange
}) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
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

  // Render pagination
  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const items = [];
    const { page, totalPages } = pagination;

    // Previous button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />
    );

    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => onPageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    // Next button
    items.push(
      <Pagination.Next
        key="next"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    );

    return (
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} contacts
        </div>
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="contacts-table">
      <div className="table-responsive">
        <Table hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th>Contact</th>
              <th>Inquiry Type</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <div className="text-muted">
                    <i className="bi bi-inbox display-4 d-block mb-2"></i>
                    No contacts found
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <div>
                      <div className="fw-medium">{contact.name}</div>
                      <div className="text-muted small">{contact.email}</div>
                      {contact.phone && (
                        <div className="text-muted small">{contact.phone}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <Badge bg="info" className="text-capitalize">
                      {INQUIRY_TYPE_LABELS[contact.inquiryType] || contact.inquiryType}
                    </Badge>
                  </td>
                  <td>
                    <div className="fw-medium">{contact.subject}</div>
                    <div className="text-muted small">
                      {truncateText(contact.message)}
                    </div>
                  </td>
                  <td>
                    <Badge bg={getStatusBadgeVariant(contact.status)} className="text-capitalize">
                      {CONTACT_STATUS_LABELS[contact.status] || contact.status}
                    </Badge>
                  </td>
                  <td>
                    {contact.priority && (
                      <Badge bg={getPriorityBadgeVariant(contact.priority)} className="text-capitalize">
                        {PRIORITY_LABELS[contact.priority] || contact.priority}
                      </Badge>
                    )}
                  </td>
                  <td>
                    {contact.assignedTo ? (
                      <div>
                        <div className="fw-medium">{contact.assignedTo.name}</div>
                        <div className="text-muted small">{contact.assignedTo.email}</div>
                      </div>
                    ) : (
                      <span className="text-muted">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <div className="text-muted small">
                      {formatDate(contact.createdAt)}
                    </div>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => onContactSelect(contact)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => onStatusUpdate(contact)}
                        title="Update Status"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default ContactsTable;
