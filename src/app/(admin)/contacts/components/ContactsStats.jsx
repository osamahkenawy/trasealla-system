'use client';

import React from 'react';
import { Row, Col, Card, CardBody } from 'react-bootstrap';

const ContactsStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Contacts',
      value: stats.total || 0,
      icon: 'bi-inbox',
      color: 'primary',
      bgColor: 'bg-primary'
    },
    {
      title: 'New Contacts',
      value: stats.new || 0,
      icon: 'bi-plus-circle',
      color: 'info',
      bgColor: 'bg-info'
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      icon: 'bi-clock',
      color: 'warning',
      bgColor: 'bg-warning'
    },
    {
      title: 'Resolved',
      value: stats.resolved || 0,
      icon: 'bi-check-circle',
      color: 'success',
      bgColor: 'bg-success'
    },
    {
      title: 'Closed',
      value: stats.closed || 0,
      icon: 'bi-x-circle',
      color: 'secondary',
      bgColor: 'bg-secondary'
    }
  ];

  return (
    <Row className="g-3">
      {statCards.map((stat, index) => (
        <Col key={index} md={2} sm={6}>
          <Card className="border-0 shadow-sm">
            <CardBody className="p-3">
              <div className="d-flex align-items-center">
                <div className={`${stat.bgColor} rounded-circle p-2 me-3`}>
                  <i className={`${stat.icon} text-white`}></i>
                </div>
                <div>
                  <h6 className="mb-0 text-muted small">{stat.title}</h6>
                  <h4 className={`mb-0 text-${stat.color} fw-bold`}>
                    {stat.value.toLocaleString()}
                  </h4>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ContactsStats;
