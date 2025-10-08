'use client';

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import StatCard from '@/components/StatCard';
import { Spinner } from 'react-bootstrap';

const UsersStats = ({ stats, loading }) => {
  if (loading) {
    return (
      <Row>
        <Col>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '120px' }}>
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading stats...</span>
            </Spinner>
          </div>
        </Col>
      </Row>
    );
  }

  if (!stats) {
    return null;
  }

  // Extract data from the API response structure
  const overview = stats.overview || {};
  const distribution = stats.distribution || {};
  const registrations = stats.registrations || {};

  // Get role counts from distribution
  const roleCounts = distribution.byRole || [];
  const customerCount = roleCounts.find(r => r.role === 'customer')?.count || 0;
  const adminCount = roleCounts.find(r => r.role === 'admin')?.count || 0;

  const statCards = [
    {
      title: 'Total Users',
      value: overview.totalUsers || 0,
      icon: 'users',
      color: 'primary',
      trend: registrations.thisWeek || 0
    },
    {
      title: 'Active Users',
      value: overview.activeUsers || 0,
      icon: 'user-check',
      color: 'success',
      trend: overview.activeInLast7Days || 0
    },
    {
      title: 'Customers',
      value: customerCount,
      icon: 'user-tie',
      color: 'info',
      trend: 0
    },
    {
      title: 'Admins',
      value: adminCount,
      icon: 'user-shield',
      color: 'warning',
      trend: 0
    }
  ];

  return (
    <Row>
      {statCards.map((card, index) => (
        <Col key={index} lg={3} md={6} className="mb-4">
          <StatCard {...card} />
        </Col>
      ))}
    </Row>
  );
};

export default UsersStats;
