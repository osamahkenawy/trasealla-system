'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  clearAuthData,
  getCurrentUser,
  getToken,
  getUserRole,
  isAuthenticated,
  saveAuthData,
  getRedirectPathByRole
} from '@/utils/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

/**
 * Set token as cookie for middleware access
 */
const setTokenCookie = (token) => {
  if (typeof document !== 'undefined') {
    // Set cookie with 30 days expiration
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `trasealla_token=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
  }
};

/**
 * Remove token cookie
 */
const removeTokenCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = 'trasealla_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = getCurrentUser();
        const currentToken = getToken();
        const currentRole = getUserRole();

        setUser(currentUser);
        setToken(currentToken);
        setRole(currentRole);

        // Sync token to cookie if exists
        if (currentToken) {
          setTokenCookie(currentToken);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Response data
   */
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { user, token, refreshToken } = data.data;

        // Save auth data
        saveAuthData({ token, refreshToken, user });

        // Set token cookie for middleware
        setTokenCookie(token);

        // Update state
        setUser(user);
        setToken(token);
        setRole(user.role);

        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'An error occurred during login',
      };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    clearAuthData();
    removeTokenCookie();
    setUser(null);
    setToken(null);
    setRole(null);
    router.push('/auth/sign-in');
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const checkAuth = () => {
    return isAuthenticated();
  };

  /**
   * Get redirect path based on user role
   * @returns {string}
   */
  const getRedirectPath = () => {
    if (role) {
      return getRedirectPathByRole(role);
    }
    return '/dashboards';
  };

  const value = {
    user,
    token,
    role,
    loading,
    isAuthenticated: checkAuth(),
    login,
    logout,
    getRedirectPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 * @returns {Object} Auth context
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
