'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Row, Spinner, Alert } from 'react-bootstrap';
import { 
  getUsers, 
  getUserStats,
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS
} from '@/services/usersService';
import { useNotificationContext } from '@/context/useNotificationContext';
import UsersTable from './UsersTable';
import UsersFilters from './UsersFilters';
import UsersStats from './UsersStats';
import UserDetailsModal from './UserDetailsModal';
import UserEditModal from './UserEditModal';
import UserStatusModal from './UserStatusModal';
import ExportSidebar from '@/components/ExportSidebar';
import IconActionButton from '@/components/IconActionButton';

const UsersList = () => {
  const { showSuccess, showError, showWarning, showInfo } = useNotificationContext();
  const [users, setUsers] = useState([]);
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
    role: '',
    status: '',
    search: ''
  });

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showExportSidebar, setShowExportSidebar] = useState(false);

  // Fetch users
  const fetchUsers = async (page = 1) => {
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

      console.log('Fetching users with params:', params);
      const response = await getUsers(params);
      
      setUsers(response.data.users || []);
      setPagination({
        page: response.data.page || 1,
        limit: response.data.limit || 10,
        total: response.data.total || 0,
        totalPages: response.data.totalPages || 0
      });
    } catch (err) {
      console.error('Error fetching users:', err);
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
        const errorMsg = 'Access Denied: You do not have permission to access users. This feature requires admin privileges.';
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
        const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch users';
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
      const response = await getUserStats();
      console.log('Stats response:', response.data); // Debug log
      setStats(response.data); // Use response.data directly as it contains the stats structure
    } catch (err) {
      console.error('Error fetching stats:', err);
      showError('Failed to load user statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchUsers(1);
    }
  }, [filters]);

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle status update
  const handleStatusUpdate = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Handle status modal close
  const handleStatusModalClose = () => {
    setShowStatusModal(false);
    setSelectedUser(null);
  };

  // Handle details modal close
  const handleDetailsModalClose = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  // Handle edit success
  const handleEditSuccess = (updatedUser) => {
    fetchUsers(pagination.page);
    fetchStats();
    handleEditModalClose();
    
    // Show success notification
    const userName = updatedUser?.firstName + ' ' + updatedUser?.lastName || 'User';
    showSuccess(`${userName} profile updated successfully!`);
  };

  // Handle status update success
  const handleStatusUpdateSuccess = (updatedUser) => {
    fetchUsers(pagination.page);
    fetchStats();
    handleStatusModalClose();
    
    // Show success notification
    const userName = updatedUser?.firstName + ' ' + updatedUser?.lastName || 'User';
    const newStatus = updatedUser?.status || 'updated';
    showSuccess(`${userName} status updated to ${USER_STATUS_LABELS[newStatus] || newStatus} successfully!`);
  };

  // Export handlers
  const handleExportUsers = () => {
    setShowExportSidebar(true);
  };

  const handleExportSidebarClose = () => {
    setShowExportSidebar(false);
  };

  if (loading && users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="users-list">
      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col>
          <UsersStats stats={stats} loading={statsLoading} />
        </Col>
      </Row>

      {/* Action Buttons */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Users Management</h5>
                  <small className="text-muted">
                    {users.length} users found
                  </small>
                </div>
                  <div className="d-flex gap-2">
                    {/* Export Users Button */}
                    <div className="d-flex align-items-center">
                      <IconActionButton
                        icon="csv"
                        onClick={handleExportUsers}
                        disabled={users.length === 0}
                        title="Export Users Data"
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
              <UsersFilters
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

      {/* Users Table */}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <UsersTable
                users={users}
                loading={loading}
                pagination={pagination}
                onUserSelect={handleUserSelect}
                onEditUser={handleEditUser}
                onStatusUpdate={handleStatusUpdate}
                onPageChange={handlePageChange}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          show={showDetailsModal}
          onHide={handleDetailsModalClose}
        />
      )}

      {/* User Edit Modal */}
      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          show={showEditModal}
          onHide={handleEditModalClose}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* User Status Modal */}
      {selectedUser && (
        <UserStatusModal
          user={selectedUser}
          show={showStatusModal}
          onHide={handleStatusModalClose}
          onSuccess={handleStatusUpdateSuccess}
        />
      )}

        {/* Export Sidebar */}
        <ExportSidebar
          show={showExportSidebar}
          onHide={handleExportSidebarClose}
          data={users}
          title="Export Users Data"
          description="Select the format you want to download the users data."
          availableFields={[
            { key: 'id', label: 'ID' },
            { key: 'firstName', label: 'First Name' },
            { key: 'lastName', label: 'Last Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'role', label: 'Role' },
            { key: 'isActive', label: 'Is Active' },
            { key: 'isEmailVerified', label: 'Email Verified' },
            { key: 'dateOfBirth', label: 'Date of Birth' },
            { key: 'nationality', label: 'Nationality' },
            { key: 'address', label: 'Address' },
            { key: 'city', label: 'City' },
            { key: 'country', label: 'Country' },
            { key: 'createdAt', label: 'Created Date' },
            { key: 'updatedAt', label: 'Updated Date' }
          ]}
          defaultFields={['id', 'firstName', 'lastName', 'email', 'phone', 'role', 'isActive', 'isEmailVerified', 'createdAt']}
          width={700}
          itemType="user"
        />
    </div>
  );
};

export default UsersList;
