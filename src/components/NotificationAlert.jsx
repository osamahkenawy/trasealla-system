'use client';

import React, { useState, useEffect } from 'react';
import { Alert, Toast, ToastContainer } from 'react-bootstrap';

/**
 * Reusable Notification Alert Component
 * Supports both inline alerts and toast notifications
 */
const NotificationAlert = ({ 
  show, 
  onClose, 
  type = 'success', 
  title, 
  message, 
  duration = 5000,
  variant = 'toast', // 'toast' or 'inline'
  position = 'top-end' // for toast positioning
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // Toast variant
  if (variant === 'toast') {
    return (
      <ToastContainer position={position} className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={visible} 
          onClose={handleClose}
          autohide={duration > 0}
          delay={duration}
          className={`custom-toast custom-toast-${type}`}
        >
          <Toast.Header closeButton={true} className={`custom-toast-header custom-toast-header-${type}`}>
            <strong className="me-auto">
              {title || getDefaultTitle(type)}
            </strong>
          </Toast.Header>
          <Toast.Body className={`custom-toast-body custom-toast-body-${type}`}>
            {message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    );
  }

  // Inline variant
  return (
    <Alert 
      variant={type} 
      show={visible} 
      dismissible 
      onClose={handleClose}
      className="mb-3"
    >
      <Alert.Heading>
        {title || getDefaultTitle(type)}
      </Alert.Heading>
      {message}
    </Alert>
  );
};

// Helper function to get default titles
const getDefaultTitle = (type) => {
  switch (type) {
    case 'success':
      return 'Success!';
    case 'danger':
      return 'Error!';
    case 'warning':
      return 'Warning!';
    case 'info':
      return 'Information';
    default:
      return 'Notification';
  }
};

export default NotificationAlert;

// Add some inline styles for better toast appearance
const toastStyles = `
  .custom-toast {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  .custom-toast-header {
    border-radius: 12px 12px 0 0;
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .custom-toast-body {
    padding: 12px 16px 16px 16px;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .custom-toast .btn-close {
    padding: 8px;
    margin: -8px -8px -8px auto;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('toast-custom-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'toast-custom-styles';
  styleSheet.textContent = toastStyles;
  document.head.appendChild(styleSheet);
}
