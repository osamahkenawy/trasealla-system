'use client';

import React, { useState } from 'react';
import { Card, Row, Col, Button, Badge, Table, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { IconifyIcon } from '@/components/wrapper/IconifyIcon';
import { ComponentContainerCard } from '@/components/ComponentContainerCard';
import { TRASEALLA_SERVICES } from '@/assets/data/trasealla-services';

const FlightTicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample flight data
  const flightData = [
    {
      id: 1,
      customer: 'Ahmed Al-Rashid',
      email: 'ahmed@example.com',
      phone: '+971501234567',
      from: 'DXB',
      to: 'LHR',
      departure: '2024-02-15',
      return: '2024-02-22',
      passengers: 2,
      total: 4500,
      status: 'confirmed',
      bookingDate: '2024-01-20'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+971509876543',
      from: 'AUH',
      to: 'CDG',
      departure: '2024-02-18',
      return: '2024-02-25',
      passengers: 1,
      total: 3200,
      status: 'pending',
      bookingDate: '2024-01-22'
    },
    {
      id: 3,
      customer: 'Mohammed Hassan',
      email: 'mohammed@example.com',
      phone: '+971501112223',
      from: 'DXB',
      to: 'JFK',
      departure: '2024-03-01',
      return: '2024-03-15',
      passengers: 3,
      total: 8500,
      status: 'confirmed',
      bookingDate: '2024-01-25'
    }
  ];

  const getStatusBadge = (status) => {
    const variants = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'danger',
      completed: 'info'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const filteredFlights = flightData.filter(flight => {
    const matchesSearch = flight.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || flight.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box">
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <a href="/dashboards">Dashboard</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/services">Services</a>
                </li>
                <li className="breadcrumb-item active">Flight Tickets</li>
              </ol>
            </div>
            <h4 className="page-title">
              <IconifyIcon icon="solar:airplane-outline" className="me-2" />
              Flight Tickets Management
            </h4>
          </div>
        </div>
      </div>

      {/* Service Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <IconifyIcon icon="solar:airplane-outline" className="text-primary mb-2" size={32} />
              <h5 className="mb-1">Total Bookings</h5>
              <h3 className="text-primary mb-0">1,247</h3>
              <small className="text-muted">+12% this month</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <IconifyIcon icon="solar:check-circle-outline" className="text-success mb-2" size={32} />
              <h5 className="mb-1">Confirmed</h5>
              <h3 className="text-success mb-0">1,089</h3>
              <small className="text-muted">87.3% success rate</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <IconifyIcon icon="solar:clock-circle-outline" className="text-warning mb-2" size={32} />
              <h5 className="mb-1">Pending</h5>
              <h3 className="text-warning mb-0">158</h3>
              <small className="text-muted">12.7% pending</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <IconifyIcon icon="solar:dollar-minimalistic-outline" className="text-info mb-2" size={32} />
              <h5 className="mb-1">Revenue</h5>
              <h3 className="text-info mb-0">AED 2.4M</h3>
              <small className="text-muted">+8% this month</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Service Information */}
      <ComponentContainerCard
        title="Flight Tickets Service"
        subtitle="Domestic & International flight booking with flexible fares"
      >
        <Row>
          <Col md={6}>
            <h6>Service Features:</h6>
            <ul className="list-unstyled">
              <li><IconifyIcon icon="solar:check-circle-outline" className="text-success me-2" />Domestic & International flights</li>
              <li><IconifyIcon icon="solar:check-circle-outline" className="text-success me-2" />Flexible date changes</li>
              <li><IconifyIcon icon="solar:check-circle-outline" className="text-success me-2" />Add-ons (baggage, seats, meals)</li>
              <li><IconifyIcon icon="solar:check-circle-outline" className="text-success me-2" />24/7 customer support</li>
            </ul>
          </Col>
          <Col md={6}>
            <h6>Popular Destinations:</h6>
            <div className="d-flex flex-wrap gap-2">
              <Badge bg="light" text="dark">London (LHR)</Badge>
              <Badge bg="light" text="dark">Paris (CDG)</Badge>
              <Badge bg="light" text="dark">New York (JFK)</Badge>
              <Badge bg="light" text="dark">Dubai (DXB)</Badge>
              <Badge bg="light" text="dark">Abu Dhabi (AUH)</Badge>
              <Badge bg="light" text="dark">Istanbul (IST)</Badge>
            </div>
          </Col>
        </Row>
      </ComponentContainerCard>

      {/* Flight Bookings Table */}
      <ComponentContainerCard
        title="Recent Flight Bookings"
        subtitle="Manage and track all flight reservations"
      >
        <Row className="mb-3">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <IconifyIcon icon="solar:magnifer-outline" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>
          <Col md={3} className="text-end">
            <Button variant="primary">
              <IconifyIcon icon="solar:add-circle-outline" className="me-1" />
              New Booking
            </Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Customer</th>
                <th>Route</th>
                <th>Dates</th>
                <th>Passengers</th>
                <th>Total</th>
                <th>Status</th>
                <th>Booking Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.map((flight) => (
                <tr key={flight.id}>
                  <td>
                    <div>
                      <h6 className="mb-0">{flight.customer}</h6>
                      <small className="text-muted">{flight.email}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{flight.from} → {flight.to}</strong>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div>Depart: {flight.departure}</div>
                      <div>Return: {flight.return}</div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="light" text="dark">{flight.passengers} pax</Badge>
                  </td>
                  <td>
                    <strong>AED {flight.total.toLocaleString()}</strong>
                  </td>
                  <td>{getStatusBadge(flight.status)}</td>
                  <td>{flight.bookingDate}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="light" size="sm">
                        <IconifyIcon icon="solar:menu-dots-outline" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item>
                          <IconifyIcon icon="solar:eye-outline" className="me-2" />
                          View Details
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <IconifyIcon icon="solar:pen-outline" className="me-2" />
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item>
                          <IconifyIcon icon="solar:printer-outline" className="me-2" />
                          Print Ticket
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">
                          <IconifyIcon icon="solar:trash-bin-outline" className="me-2" />
                          Cancel
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </ComponentContainerCard>
    </div>
  );
};

export default FlightTicketsPage;
