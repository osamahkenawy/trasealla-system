/**
 * API Configuration and Helper Functions
 */

import { authenticatedFetch, logout } from './auth';

// API Base URL - Update this based on your environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * API Error class
 */
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await authenticatedFetch(url, options);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (response.ok) {
        return { success: true };
      }
      throw new APIError(
        'Server returned non-JSON response',
        response.status,
        null
      );
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.message || 'API request failed',
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    throw new APIError(
      error.message || 'Network error occurred',
      0,
      null
    );
  }
};

/**
 * GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<any>} Response data
 */
export const get = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  
  return apiRequest(url, {
    method: 'GET',
  });
};

/**
 * POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>} Response data
 */
export const post = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>} Response data
 */
export const put = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * PATCH request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request body
 * @returns {Promise<any>} Response data
 */
export const patch = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint
 * @returns {Promise<any>} Response data
 */
export const del = async (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};

/**
 * Upload file(s)
 * @param {string} endpoint - API endpoint
 * @param {FormData} formData - Form data with files
 * @returns {Promise<any>} Response data
 */
export const upload = async (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await authenticatedFetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new APIError(
        data.message || 'Upload failed',
        response.status,
        data
      );
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error.message || 'Upload error occurred',
      0,
      null
    );
  }
};

// Example API endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  
  // Add more endpoints as needed
};

export default {
  get,
  post,
  put,
  patch,
  del,
  upload,
  apiRequest,
  API_ENDPOINTS,
};
