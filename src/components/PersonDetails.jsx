'use client';

import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import './PersonDetails.scss';

/**
 * PersonDetails Component
 * Reusable component to display person information with avatar, name, and contact details
 * 
 * @param {string} name - Person's name (required)
 * @param {string} photo - Photo URL (optional)
 * @param {string} description - Description text (optional)
 * @param {boolean} iconOnly - Show only avatar without details (default: false)
 * @param {string} phone - Phone number (optional)
 * @param {string|number} gender - Gender (1/male or 2/female) (optional)
 * @param {string} email - Email address (optional)
 * @param {string} address - Address (optional)
 * @param {string} extra - Extra information to display (optional)
 * @param {function} onClick - Click handler (optional)
 * @param {number} maxNameLength - Maximum length for name before truncation (default: 20)
 */
const PersonDetails = ({
  name,
  photo = '',
  description = '',
  iconOnly = false,
  phone = '',
  gender = '',
  email = '',
  address = '',
  extra = '',
  onClick,
  maxNameLength = 20,
  className = ''
}) => {
  // Generate initials from name
  const getInitials = (fullName) => {
    return fullName
      .split(' ')
      .filter(n => n.trim() !== '')
      .map(n => n.substring(0, 1))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Determine gender class
  const getGenderClass = () => {
    const genderStr = gender.toString().toLowerCase();
    return (genderStr === '1' || genderStr === 'male') ? 'male-list' : 'female-list';
  };

  // Truncate name if needed
  const getTruncatedName = () => {
    if (name.length <= maxNameLength) return name;
    return name.substring(0, maxNameLength) + '...';
  };

  // Render tooltip button
  const renderTooltipButton = (icon, tooltipText) => {
    return (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>{tooltipText}</Tooltip>}
      >
        <button className="btn-init">
          <Icon icon={icon} style={{ width: '12px', height: '12px', color: '#04092152' }} />
        </button>
      </OverlayTrigger>
    );
  };

  return (
    <div 
      className={`name-photo-container d-inline-flex align-items-center ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={`image ${getGenderClass()}`}>
        {photo ? (
          <img src={photo} alt={name} className="auth-img" />
        ) : (
          <span className="initial-letter">
            {getInitials(name)}
          </span>
        )}
      </div>

      {!iconOnly && (
        <div className="name-photo-name-desc d-flex text-start flex-column ms-2">
          <OverlayTrigger
            placement="bottom"
            overlay={name.length > maxNameLength ? <Tooltip>{name}</Tooltip> : <></>}
          >
            <div className="fleet-profile-name">
              {getTruncatedName()}
            </div>
          </OverlayTrigger>

          {extra && <div className="name-extra">{extra}</div>}
          
          {description && (
            <div className="name-photo-desc text-muted">{description}</div>
          )}

          {(email || phone || address) && (
            <div className="name-photo-name d-flex align-items-center mt-1">
              {email && renderTooltipButton('mdi:email-outline', email)}
              {phone && renderTooltipButton('mdi:phone-outline', phone)}
              {address && renderTooltipButton('mdi:map-marker-outline', address)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PersonDetails;