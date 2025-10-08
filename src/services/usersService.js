/**
 * Users API Service
 * Handles all user-related API operations
 */

import axiosInstance from '@/plugins/axios';

/**
 * Get all users with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.role - User role (customer, agent, admin)
 * @param {string} params.status - User status (active, inactive, suspended)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @returns {Promise<Object>} Response data
 */
export const getUsers = async (params = {}) => {
  try {
    console.log('Fetching users with params:', params);
    console.log('API Base URL:', axiosInstance.defaults.baseURL);
    
    const response = await axiosInstance.get('/auth/users', { 
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Users response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    
    // Handle CORS errors specifically
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      throw new Error('CORS error: Please check your backend CORS configuration');
    }
    
    // Handle role-based authorization errors
    if (error.response?.status === 403 && error.response?.data?.message?.includes('not authorized')) {
      throw new Error('Access Denied: You do not have permission to access users. Admin role required.');
    }
    
    throw error;
  }
};

/**
 * Get user by ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`/auth/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

/**
 * Update user role
 * @param {number} userId - User ID
 * @param {Object} roleData - Role update data
 * @param {string} roleData.role - New role
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserRole = async (userId, roleData) => {
  try {
    const response = await axiosInstance.put(`/auth/update-role/${userId}`, roleData);
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

/**
 * Update user status
 * @param {number} userId - User ID
 * @param {Object} statusData - Status update data
 * @param {string} statusData.status - New status
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserStatus = async (userId, statusData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Create new user
 * @param {Object} userData - User creation data
 * @returns {Promise<Object>} Created user data
 */
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/create-admin', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getUserStats = async () => {
  try {
    const response = await axiosInstance.get('/users/stats/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Update user profile (general update)
 * @param {number} userId - User ID
 * @param {Object} userData - User update data
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get user statistics
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User statistics data
 */
export const getUserStatistics = async (userId) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    throw error;
  }
};

/**
 * Assign user to branch
 * @param {number} userId - User ID
 * @param {Object} branchData - Branch assignment data
 * @param {number} branchData.branchId - Branch ID
 * @returns {Promise<Object>} Updated user data
 */
export const assignUserToBranch = async (userId, branchData) => {
  try {
    const response = await axiosInstance.put(`/users/${userId}/assign-branch`, branchData);
    return response.data;
  } catch (error) {
    console.error('Error assigning user to branch:', error);
    throw error;
  }
};

/**
 * Delete user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// User role options
export const USER_ROLES = {
  CUSTOMER: 'customer',
  AGENT: 'agent',
  ADMIN: 'admin'
};

// User role labels
export const USER_ROLE_LABELS = {
  [USER_ROLES.CUSTOMER]: 'Customer',
  [USER_ROLES.AGENT]: 'Agent',
  [USER_ROLES.ADMIN]: 'Admin'
};

// User role colors
export const USER_ROLE_COLORS = {
  [USER_ROLES.CUSTOMER]: 'primary',
  [USER_ROLES.AGENT]: 'warning',
  [USER_ROLES.ADMIN]: 'danger'
};

// User status options
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// User status labels
export const USER_STATUS_LABELS = {
  [USER_STATUS.ACTIVE]: 'Active',
  [USER_STATUS.INACTIVE]: 'Inactive',
  [USER_STATUS.SUSPENDED]: 'Suspended'
};

// User status colors
export const USER_STATUS_COLORS = {
  [USER_STATUS.ACTIVE]: 'success',
  [USER_STATUS.INACTIVE]: 'secondary',
  [USER_STATUS.SUSPENDED]: 'danger'
};

export default {
  getUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  updateUserProfile,
  createUser,
  getUserStats,
  getUserStatistics,
  assignUserToBranch,
  deleteUser,
  USER_ROLES,
  USER_ROLE_LABELS,
  USER_ROLE_COLORS,
  USER_STATUS,
  USER_STATUS_LABELS,
  USER_STATUS_COLORS
};
