/**
 * Authentication Plugin
 * Helper functions for authentication and storage
 */

import config from '../../config/config';

const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];

/**
 * Get portal name from localStorage
 * @returns {string}
 */
export const getPortal = () => {
  if (typeof window === 'undefined') return 'admin';
  return localStorage.getItem('portal') || 'admin';
};

/**
 * Get item from localStorage
 * @param {string} key
 * @returns {string|null}
 */
export const getItem = (key) => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting item from localStorage:', error);
    return null;
  }
};

/**
 * Set item in localStorage
 * @param {string} key
 * @param {string} value
 */
export const setItem = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting item in localStorage:', error);
  }
};

/**
 * Remove item from localStorage
 * @param {string} key
 */
export const removeItem = (key) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from localStorage:', error);
  }
};

/**
 * Get auth token for specific portal
 * @param {string} portal
 * @returns {string|null}
 */
export const getAuthToken = (portal = null) => {
  const portalName = portal || getPortal();
  const sessionData = getItem(`trasealla-${portalName}`);
  
  if (!sessionData) {
    // Fallback to trasealla_token for backward compatibility
    return getItem('trasealla_token');
  }
  
  try {
    const parsed = JSON.parse(sessionData);
    return parsed.token ? `Bearer ${parsed.token}` : null;
  } catch (error) {
    console.error('Error parsing session data:', error);
    return null;
  }
};

/**
 * Get refresh token
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return getItem('refresh_token') || getItem('trasealla_refresh_token');
};

/**
 * Get base URL for API
 * @returns {string}
 */
export const getBaseUrl = () => {
  const baseUrl = [
    environmentConfig.api_url,
    environmentConfig.api_port || null
  ].filter(f => f).join(':');
  
  // Ensure trailing slash
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

/**
 * Save auth session
 * @param {Object} data
 * @param {string} data.token - Access token
 * @param {string} data.refreshToken - Refresh token
 * @param {Object} data.user - User object
 * @param {string} portal - Portal name
 */
export const saveAuthSession = (data, portal = null) => {
  const { token, refreshToken, user } = data;
  const portalName = portal || getPortal();
  
  // Save refresh token
  setItem('refresh_token', refreshToken);
  setItem('token', token);
  
  // Save session data
  const sessionData = {
    token: token,
    unauthorized: false,
    userInfo: user
  };
  
  setItem(`trasealla-${portalName}`, JSON.stringify(sessionData));
  
  // Backward compatibility with trasealla tokens
  setItem('trasealla_token', token);
  setItem('trasealla_refresh_token', refreshToken);
  setItem('trasealla_user', JSON.stringify(user));
  setItem('trasealla_user_role', user.role);
  
  // Set portal
  setItem('portal', portalName);
};

/**
 * Clear auth session
 * @param {string} portal - Portal name
 */
export const clearAuthSession = (portal = null) => {
  const portalName = portal || getPortal();
  
  // Remove session data
  removeItem(`trasealla-${portalName}`);
  removeItem('refresh_token');
  removeItem('token');
  removeItem('portal');
  
  // Remove trasealla tokens for backward compatibility
  removeItem('trasealla_token');
  removeItem('trasealla_refresh_token');
  removeItem('trasealla_user');
  removeItem('trasealla_user_role');
};

/**
 * Get current user from session
 * @param {string} portal - Portal name
 * @returns {Object|null}
 */
export const getCurrentUser = (portal = null) => {
  const portalName = portal || getPortal();
  const sessionData = getItem(`trasealla-${portalName}`);
  
  if (!sessionData) {
    // Fallback to trasealla_user for backward compatibility
    const user = getItem('trasealla_user');
    return user ? JSON.parse(user) : null;
  }
  
  try {
    const parsed = JSON.parse(sessionData);
    return parsed.userInfo || null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @param {string} portal - Portal name
 * @returns {boolean}
 */
export const isAuthenticated = (portal = null) => {
  const token = getAuthToken(portal);
  const user = getCurrentUser(portal);
  return !!(token && user);
};

/**
 * Get timezone
 * @returns {string}
 */
export const getTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    return 'UTC';
  }
};

export default {
  getPortal,
  getItem,
  setItem,
  removeItem,
  getAuthToken,
  getRefreshToken,
  getBaseUrl,
  saveAuthSession,
  clearAuthSession,
  getCurrentUser,
  isAuthenticated,
  getTimezone,
};
