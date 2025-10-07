'use client';

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatCard from '@/components/StatCard';

const ContactsStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.total || 0,
      imageUrl: '/assets/images/icons/inbox-icon.svg',
      textColor: '#101828',
      variant: 'primary'
    },
    {
      title: 'New Contacts',
      value: stats.new || 0,
      imageUrl: '/assets/images/icons/plus-circle-icon.svg',
      textColor: '#0D6EFD',
      variant: 'info'
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      imageUrl: '/assets/images/icons/clock-icon.svg',
      textColor: '#FD7E14',
      variant: 'warning'
    },
    {
      title: 'Resolved',
      value: stats.resolved || 0,
      imageUrl: '/assets/images/icons/check-circle-icon.svg',
      textColor: '#198754',
      variant: 'success'
    },
    {
      title: 'Closed',
      value: stats.closed || 0,
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
          />
        </Col>
      ))}
    </Row>
  );
};

export default ContactsStats;
