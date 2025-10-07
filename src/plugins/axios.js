/**
 * Axios Instance with Interceptors
 * Handles authentication, token refresh, and API requests
 */

import axios from 'axios';
import config from '../../config/config';
import { getAuthToken, getItem, setItem, getBaseUrl, getPortal, getTimezone } from './Auth';

const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

/**
 * Create axios instance with default configuration
 */
const options = {
  baseURL: [
    environmentConfig.api_url,
    environmentConfig.api_port || null
  ].filter(f => f).join(':') + '/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Disable credentials for CORS
  timeout: 10000 // 10 second timeout
};

// Add auth token if exists
if (getAuthToken(getPortal())) {
  options.headers['Authorization'] = getAuthToken(getPortal());
}

const axiosInstance = axios.create(options);

/**
 * Request Interceptor
 * Adds authentication token to every request
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const portal = getPortal();
    const sessionData = getItem(`trasealla-${portal}`);
    
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        if (parsed.token) {
          config.headers['Authorization'] = `Bearer ${parsed.token}`;
        }
      } catch (error) {
        console.error('Error parsing session data in request interceptor:', error);
      }
    }
    
    // Add timezone to every request (only if backend supports it)
    // config.headers['timezone'] = getTimezone();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles token refresh on 401/403 errors
 */
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 or 403 (Unauthorized/Forbidden)
    if (error.response && error.response.status && (error.response.status === 403 || error.response.status === 401)) {
      
      // Prevent infinite loop
      if (originalRequest._retry) {
        // Token refresh failed, clear session and redirect to login
        if (typeof window !== 'undefined') {
          localStorage.clear();
          window.location.href = '/auth/sign-in';
        }
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      // Use existing refresh promise if one is in progress
      if (!refreshPromise) {
        refreshPromise = new Promise(async (resolve, reject) => {
          const refreshingToken = localStorage.getItem('refresh_token') || localStorage.getItem('trasealla_refresh_token');
          
          try {
            if (!refreshingToken) {
              throw new Error('Refresh token does not exist');
            }

            // Call refresh token endpoint
            const response = await axios.post(getBaseUrl() + 'auth/refresh', {
              refreshToken: refreshingToken
            }, {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (response && response.data) {
              const { token, refreshToken } = response.data.data || response.data;
              
              // Update tokens in localStorage
              setItem('refresh_token', refreshToken);
              setItem('token', token);
              
              // Update session data
              const portal = getPortal();
              const localSession = JSON.parse(getItem(`trasealla-${portal}`) || '{}');
              localSession.token = token;
              localSession.unauthorized = false;
              
              setItem(`trasealla-${portal}`, JSON.stringify(localSession));
              
              // Update trasealla tokens for backward compatibility
              setItem('trasealla_token', token);
              setItem('trasealla_refresh_token', refreshToken);
              
              resolve(token);
            } else {
              throw new Error('Invalid response from refresh token endpoint');
            }
          } catch (e) {
            console.error('Token refresh failed:', e);
            
            // Clear all localStorage and redirect to login
            if (typeof window !== 'undefined') {
              localStorage.clear();
              window.location.href = '/auth/sign-in';
            }
            
            reject(e);
          } finally {
            // Reset the refreshPromise so subsequent requests can trigger a new refresh
            refreshPromise = null;
          }
        });
      }

      try {
        // Wait for the token refresh to complete
        await refreshPromise;
        
        // Update the original request with new token
        const portal = getPortal();
        const sessionData = getItem(`trasealla-${portal}`);
        
        if (sessionData) {
          const parsed = JSON.parse(sessionData);
          originalRequest.headers['Authorization'] = `Bearer ${parsed.token}`;
        }
        
        // Retry the original request
        return axios.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, reject as normal
    return Promise.reject(error);
  }
);

export default axiosInstance;
