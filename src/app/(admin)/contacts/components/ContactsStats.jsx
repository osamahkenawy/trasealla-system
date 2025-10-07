'use client';

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatCard from '@/components/StatCard';

const ContactsStats = ({ stats, loading = false }) => {
  console.log('ContactsStats received stats:', stats); // Debug log
  console.log('ContactsStats loading:', loading); // Debug log
  
  // Ensure stats is an object with default values
  const safeStats = stats || {};
  
  const statCards = [
    {
      title: 'Total Contacts',
      value: safeStats.total || 0,
      imageUrl: '/assets/images/icons/inbox-icon.svg',
      textColor: '#101828',
      variant: 'primary'
    },
    {
      title: 'New Contacts',
      value: safeStats.new || 0,
      imageUrl: '/assets/images/icons/plus-circle-icon.svg',
      textColor: '#0D6EFD',
      variant: 'info'
    },
    {
      title: 'In Progress',
      value: safeStats.inProgress || 0,
      imageUrl: '/assets/images/icons/clock-icon.svg',
      textColor: '#FD7E14',
      variant: 'warning'
    },
    {
      title: 'Resolved',
      value: safeStats.resolved || 0,
      imageUrl: '/assets/images/icons/check-circle-icon.svg',
      textColor: '#198754',
      variant: 'success'
    },
    {
      title: 'Closed',
      value: safeStats.closed || 0,
      imageUrl: '/assets/images/icons/x-circle-icon.svg',
      textColor: '#6C757D',
      variant: 'secondary'
    }
  ];

  return (
    <Row className="g-3">
      {statCards.map((stat, index) => (
        <Col key={index} md={2} sm={6}>
          <StatCard
            title={stat.title}
            value={stat.value.toLocaleString()}
            imageUrl={stat.imageUrl}
            textColor={stat.textColor}
            className={stat.variant}
            loading={loading}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ContactsStats;
