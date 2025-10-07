/**
 * API Test Service
 * Simple functions to test API connectivity
 */

import axios from 'axios';

/**
 * Test API health
 */
export const testApiHealth = async () => {
  try {
    console.log('Testing API health...');
    const response = await axios.get('http://localhost:5001/health');
    console.log('API Health Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    throw error;
  }
};

/**
 * Test API with auth
 */
export const testApiWithAuth = async () => {
  try {
    const token = localStorage.getItem('trasealla_token') || localStorage.getItem('token');
    console.log('Testing API with auth token:', token ? 'Token exists' : 'No token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('http://localhost:5001/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Auth Test Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Auth Test Failed:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    throw error;
  }
};

export default {
  testApiHealth,
  testApiWithAuth
};
