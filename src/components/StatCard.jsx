'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import Image from 'next/image';

/**
 * Reusable Stat Card Component
 * Matches the Vue.js custom card design
 */
const StatCard = ({ 
  imageUrl, 
  title, 
  value, 
  textColor = '#101828',
  className = '',
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
            {value}
          </div>
        </div>

        {/* RIGHT: Image */}
        <div className="image-wrapper">
          <Image 
            src={imageUrl} 
            alt="icon" 
            className="image-icon"
            width={24}
            height={24}
          />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
