/**
 * Contacts API Service
 * Handles all contact-related API operations
 */

import axiosInstance from '@/plugins/axios';

/**
 * Get all contacts with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.status - Contact status (new, in_progress, resolved, closed)
 * @param {string} params.inquiryType - Type of inquiry (booking, general, support, etc.)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @returns {Promise<Object>} Response data
 */
export const getContacts = async (params = {}) => {
  try {
    console.log('Fetching contacts with params:', params);
    console.log('API Base URL:', axiosInstance.defaults.baseURL);
    
    const response = await axiosInstance.get('/contact', { 
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Contacts response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    
    // Handle CORS errors specifically
    if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      throw new Error('CORS error: Please check your backend CORS configuration');
    }
    
    // Handle role-based authorization errors
    if (error.response?.status === 403 && error.response?.data?.message?.includes('not authorized')) {
      throw new Error('Access Denied: You do not have permission to access contacts. Admin role required.');
    }
    
    throw error;
  }
};

/**
 * Get contact by ID
 * @param {number} contactId - Contact ID
 * @returns {Promise<Object>} Contact data
 */
export const getContactById = async (contactId) => {
  try {
    const response = await axiosInstance.get(`/contact/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw error;
  }
};

/**
 * Update contact status
 * @param {number} contactId - Contact ID
 * @param {Object} statusData - Status update data
 * @param {string} statusData.status - New status
 * @param {string} statusData.priority - Priority level
 * @param {number} statusData.assignedTo - Assigned user ID
 * @param {string} statusData.notes - Admin notes
 * @returns {Promise<Object>} Updated contact data
 */
export const updateContactStatus = async (contactId, statusData) => {
  try {
    const response = await axiosInstance.put(`/contact/${contactId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
};

/**
 * Respond to contact
 * @param {number} contactId - Contact ID
 * @param {Object} responseData - Response data
 * @param {string} responseData.response - Response message
 * @returns {Promise<Object>} Response data
 */
export const respondToContact = async (contactId, responseData) => {
  try {
    const response = await axiosInstance.post(`/contact/${contactId}/respond`, responseData);
    return response.data;
  } catch (error) {
    console.error('Error responding to contact:', error);
    throw error;
  }
};

/**
 * Get contact statistics
 * @returns {Promise<Object>} Statistics data
 */
export const getContactStats = async () => {
  try {
    const response = await axiosInstance.get('/contact/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    throw error;
  }
};

/**
 * Get all users for assignment dropdown
 * @returns {Promise<Array>} Users list
 */
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    
    // Handle case where users endpoint is not implemented
    if (response.data.message && response.data.message.includes('not implemented')) {
      console.warn('Users API not implemented, returning empty array');
      return {
        success: true,
        data: {
          users: []
        }
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    
    // Return empty users array if endpoint fails
    return {
      success: true,
      data: {
        users: []
      }
    };
  }
};

// Contact status options
export const CONTACT_STATUS = {
  NEW: 'new',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

// Contact status labels
export const CONTACT_STATUS_LABELS = {
  [CONTACT_STATUS.NEW]: 'New',
  [CONTACT_STATUS.IN_PROGRESS]: 'In Progress',
  [CONTACT_STATUS.RESOLVED]: 'Resolved',
  [CONTACT_STATUS.CLOSED]: 'Closed'
};

// Contact status colors
export const CONTACT_STATUS_COLORS = {
  [CONTACT_STATUS.NEW]: 'primary',
  [CONTACT_STATUS.IN_PROGRESS]: 'warning',
  [CONTACT_STATUS.RESOLVED]: 'success',
  [CONTACT_STATUS.CLOSED]: 'secondary'
};

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Priority labels
export const PRIORITY_LABELS = {
  [PRIORITY_LEVELS.LOW]: 'Low',
  [PRIORITY_LEVELS.MEDIUM]: 'Medium',
  [PRIORITY_LEVELS.HIGH]: 'High',
  [PRIORITY_LEVELS.URGENT]: 'Urgent'
};

// Priority colors
export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.LOW]: 'success',
  [PRIORITY_LEVELS.MEDIUM]: 'info',
  [PRIORITY_LEVELS.HIGH]: 'warning',
  [PRIORITY_LEVELS.URGENT]: 'danger'
};

// Inquiry types
export const INQUIRY_TYPES = {
  BOOKING: 'booking',
  GENERAL: 'general',
  SUPPORT: 'support',
  COMPLAINT: 'complaint',
  FEEDBACK: 'feedback'
};

// Inquiry type labels
export const INQUIRY_TYPE_LABELS = {
  [INQUIRY_TYPES.BOOKING]: 'Booking',
  [INQUIRY_TYPES.GENERAL]: 'General',
  [INQUIRY_TYPES.SUPPORT]: 'Support',
  [INQUIRY_TYPES.COMPLAINT]: 'Complaint',
  [INQUIRY_TYPES.FEEDBACK]: 'Feedback'
};

export default {
  getContacts,
  getContactById,
  updateContactStatus,
  respondToContact,
  getContactStats,
  getUsers,
  CONTACT_STATUS,
  CONTACT_STATUS_LABELS,
  CONTACT_STATUS_COLORS,
  PRIORITY_LEVELS,
  PRIORITY_LABELS,
  PRIORITY_COLORS,
  INQUIRY_TYPES,
  INQUIRY_TYPE_LABELS
};
