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
          bg={type}
          autohide={duration > 0}
          delay={duration}
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">
              {title || getDefaultTitle(type)}
            </strong>
          </Toast.Header>
          <Toast.Body className={type === 'success' ? 'text-white' : ''}>
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
