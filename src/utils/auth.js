/**
 * Authentication utility functions for managing tokens and user sessions
 */

const TOKEN_KEY = 'trasealla_token';
const REFRESH_TOKEN_KEY = 'trasealla_refresh_token';
const USER_KEY = 'trasealla_user';
const USER_ROLE_KEY = 'trasealla_user_role';

/**
 * Save authentication data to localStorage
 * @param {Object} data - Authentication data
 * @param {string} data.token - Access token
 * @param {string} data.refreshToken - Refresh token
 * @param {Object} data.user - User object
 */
export const saveAuthData = ({ token, refreshToken, user }) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ROLE_KEY, user.role);
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
};

/**
 * Get the access token from localStorage
 * @returns {string|null} Access token or null
 */
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Get the refresh token from localStorage
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Get the current user from localStorage
 * @returns {Object|null} User object or null
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Get the current user role from localStorage
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(USER_ROLE_KEY);
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = getCurrentUser();
  return !!(token && user);
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Logout user and clear all auth data
 */
export const logout = () => {
  clearAuthData();
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/sign-in';
  }
};

/**
 * Get redirect path based on user role
 * @param {string} role - User role
 * @returns {string} Redirect path
 */
export const getRedirectPathByRole = (role) => {
  switch (role) {
    case 'admin':
      return '/dashboards';
    case 'agent':
      return '/dashboards';
    default:
      return '/dashboards';
  }
};

/**
 * Make authenticated API request
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // If token is expired, try to refresh
  if (response.status === 401) {
    const refreshToken = getRefreshToken();
    
    if (refreshToken) {
      try {
        // Try to refresh the token
        const refreshResponse = await fetch('http://localhost:5001/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          
          if (data.success) {
            // Save new tokens
            saveAuthData({
              token: data.data.token,
              refreshToken: data.data.refreshToken,
              user: getCurrentUser(),
            });
            
            // Retry the original request with new token
            headers['Authorization'] = `Bearer ${data.data.token}`;
            return fetch(url, {
              ...options,
              headers,
            });
          }
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
    
    // If refresh failed, logout user
    logout();
  }
  
  return response;
};

/**
 * Decode JWT token (simple base64 decode, not for verification)
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
