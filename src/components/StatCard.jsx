'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import Image from 'next/image';
import { Icon } from '@iconify/react';

/**
 * Reusable Stat Card Component
 * Matches the Vue.js custom card design
 * Supports both image URLs and Iconify icons
 */
const StatCard = ({ 
  imageUrl,
  icon,
  iconColor,
  title, 
  value, 
  textColor = '#101828',
  className = '',
  loading = false,
  ...props 
}) => {
  return (
    <Card 
      className={`custom-stat-card ${className}`}
      {...props}
    >
      <div className="content-wrapper">
        {/* LEFT: Title + Value */}
        <div className="left-content">
          <div className="title">
            {title}
          </div>
          <div 
            className="value"
            style={{ color: textColor }}
          >
            {loading ? (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Loading...
              </div>
            ) : (
              value
            )}
          </div>
        </div>

        {/* RIGHT: Image or Icon */}
        <div className="image-wrapper">
          {icon ? (
            <Icon 
              icon={icon} 
              width={40} 
              height={40}
              style={{ color: iconColor }}
            />
          ) : imageUrl ? (
            <Image 
              src={imageUrl} 
              alt="icon" 
              className="image-icon"
              width={40}
              height={40}
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
