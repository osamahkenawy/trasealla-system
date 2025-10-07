'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Spinner, Alert } from 'react-bootstrap';
import { 
  getContacts, 
  getContactStats,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS,
  INQUIRY_TYPE_LABELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS
} from '@/services/contactsService';
import ContactsTable from './ContactsTable';
import ContactsFilters from './ContactsFilters';
import ContactsStats from './ContactsStats';
import ContactDetailsModal from './ContactDetailsModal';
import ContactStatusModal from './ContactStatusModal';

const ContactsList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    status: '',
    inquiryType: '',
    priority: '',
    search: '',
    assignedTo: ''
  });

  // Modal states
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Fetch contacts
  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      const token = localStorage.getItem('trasealla_token') || localStorage.getItem('token');
      console.log('Current token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        // setError('No authentication token found. Please login again.');
        // return;
      }

      const params = {
        page,
        limit: pagination.limit,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      console.log('Fetching contacts with params:', params);
      const response = await getContacts(params);
      
      setContacts(response.data.contacts || []);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      });
    } catch (err) {
      console.error('Error fetching contacts:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear tokens and redirect to login
        // localStorage.clear();
        // window.location.href = '/auth/sign-in';
      } else if (err.response?.status === 403 || err.message.includes('Access Denied')) {
        setError('Access Denied: You do not have permission to access contacts. This feature requires admin privileges.');
      } else if (err.message.includes('CORS')) {
        setError('CORS Error: Please check your backend server CORS configuration. Make sure it allows requests from localhost:3000');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network Error: Cannot connect to backend server. Please ensure your backend is running on localhost:5001');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch contacts');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getContactStats();
      console.log('Stats response:', response.data); // Debug log
      setStats(response.data.stats); // Fix: Use response.data.stats instead of response.data
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchContacts(1);
    }
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchContacts(page);
  };

  // Handle contact selection
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setShowDetailsModal(true);
  };

  // Handle status update
  const handleStatusUpdate = (contact) => {
    setSelectedContact(contact);
    setShowStatusModal(true);
  };

  // Handle status modal close
  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    setSelectedContact(null);
  };

  // Handle details modal close
  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedContact(null);
  };

  // Handle status update success
  const handleStatusUpdateSuccess = () => {
    fetchContacts(pagination.page);
    fetchStats();
    handleStatusModalClose();
  };

  // Handle response success
  const handleResponseSuccess = () => {
    fetchContacts(pagination.page);
    fetchStats();
    handleDetailsModalClose();
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="contacts-list">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col>
          <ContactsStats stats={stats} loading={statsLoading} />
        </Col>
      </Row>

      {/* Filters */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <ContactsFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Contacts Table */}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <ContactsTable
                contacts={contacts}
                loading={loading}
                pagination={pagination}
                onContactSelect={handleContactSelect}
                onStatusUpdate={handleStatusUpdate}
                onPageChange={handlePageChange}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Contact Details Modal */}
      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          show={showDetailsModal}
          onHide={handleDetailsModalClose}
          onStatusUpdate={handleStatusUpdate}
          onResponseSuccess={handleResponseSuccess}
        />
      )}

      {/* Contact Status Modal */}
      {selectedContact && (
        <ContactStatusModal
          contact={selectedContact}
          show={showStatusModal}
          onHide={handleStatusModalClose}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ContactsList;
