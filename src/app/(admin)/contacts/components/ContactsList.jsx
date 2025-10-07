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
import { useNotificationContext } from '@/context/useNotificationContext';
import ContactsTable from './ContactsTable';
import ContactsFilters from './ContactsFilters';
import ContactsStats from './ContactsStats';
import ContactDetailsModal from './ContactDetailsModal';
import ContactStatusModal from './ContactStatusModal';
import ExportSidebar from '@/components/ExportSidebar';
import IconActionButton from '@/components/IconActionButton';

const ContactsList = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationContext();
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
  const [showExportSidebar, setShowExportSidebar] = useState(false);

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
        const errorMsg = 'Authentication failed. Please login again.';
        setError(errorMsg);
        showError(errorMsg);
        // Clear tokens and redirect to login
        // localStorage.clear();
        // window.location.href = '/auth/sign-in';
      } else if (err.response?.status === 403 || err.message.includes('Access Denied')) {
        const errorMsg = 'Access Denied: You do not have permission to access contacts. This feature requires admin privileges.';
        setError(errorMsg);
        showError(errorMsg);
      } else if (err.message.includes('CORS')) {
        const errorMsg = 'CORS Error: Please check your backend server CORS configuration. Make sure it allows requests from localhost:3000';
        setError(errorMsg);
        showError(errorMsg);
      } else if (err.code === 'ERR_NETWORK') {
        const errorMsg = 'Network Error: Cannot connect to backend server. Please ensure your backend is running on localhost:5001';
        setError(errorMsg);
        showError(errorMsg);
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch contacts';
        setError(errorMsg);
        showError(errorMsg);
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
      showError('Failed to load contact statistics');
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
  const handleStatusUpdateSuccess = (updatedContact) => {
    fetchContacts(pagination.page);
    fetchStats();
    handleStatusModalClose();
    
    // Show success notification
    const contactName = updatedContact?.name || 'Contact';
    const newStatus = updatedContact?.status || 'updated';
    showSuccess(`${contactName} status updated to ${newStatus} successfully!`);
  };

  // Handle response success
  const handleResponseSuccess = (contactName) => {
    fetchContacts(pagination.page);
    fetchStats();
    handleDetailsModalClose();
    
    // Show success notification
    const name = contactName || selectedContact?.name || 'Contact';
    showSuccess(`Response sent to ${name} successfully!`);
  };

  // Export handlers
  const handleExportContacts = () => {
    setShowExportSidebar(true);
  };

  const handleExportSidebarClose = () => {
    setShowExportSidebar(false);
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

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Contacts Management</h5>
                  <small className="text-muted">
                    {contacts.length} contacts found
                  </small>
                </div>
                  <div className="d-flex gap-2">
                    {/* Export Contacts Button */}
                    <div className="d-flex align-items-center">
                      <IconActionButton
                        icon="csv"
                        onClick={handleExportContacts}
                        disabled={contacts.length === 0}
                        title="Export Contacts Data"
                      />
                      <small className="ms-2 text-muted">Export Data</small>
                    </div>
                  </div>
              </div>
            </CardBody>
          </Card>
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

        {/* Export Sidebar */}
        <ExportSidebar
          show={showExportSidebar}
          onHide={handleExportSidebarClose}
          data={contacts}
          title="Export Contacts Data"
          description="Select the format you want to download the contacts data."
          availableFields={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'subject', label: 'Subject' },
            { key: 'message', label: 'Message' },
            { key: 'status', label: 'Status' },
            { key: 'priority', label: 'Priority' },
            { key: 'assigned_to', label: 'Assigned To' },
            { key: 'created_at', label: 'Created Date' },
            { key: 'updated_at', label: 'Updated Date' }
          ]}
          defaultFields={['id', 'name', 'email', 'phone', 'subject', 'status', 'priority', 'created_at']}
          width={700}
        />
    </div>
  );
};

export default ContactsList;
