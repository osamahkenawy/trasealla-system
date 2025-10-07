'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import NotificationAlert from '@/components/NotificationAlert';

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Add a new notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'success',
      duration: 5000,
      variant: 'toast',
      position: 'top-end',
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Success notification
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Success!',
      message,
      ...options
    });
  }, [addNotification]);

  // Error notification
  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'danger',
      title: 'Error!',
      message,
      duration: 7000, // Longer duration for errors
      ...options
    });
  }, [addNotification]);

  // Warning notification
  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Warning!',
      message,
      ...options
    });
  }, [addNotification]);

  // Info notification
  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Information',
      message,
      ...options
    });
  }, [addNotification]);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Render all notifications */}
      {notifications.map(notification => (
        <NotificationAlert
          key={notification.id}
          show={true}
          onClose={() => removeNotification(notification.id)}
          {...notification}
        />
      ))}
    </NotificationContext.Provider>
  );
};