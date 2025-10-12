'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { getFlightOrderById } from '@/services/flightsService';
import {
  formatFlightTime,
  formatFlightDate,
  getCurrencySymbol,
  BOOKING_STATUS_COLORS
} from '@/services/flightsService';
import { useNotificationContext } from '@/context/useNotificationContext';

/**
 * Flight Booking Details Page
 * Detailed view of a single booking
 */
const FlightBookingDetailsPage = ({ params }) => {
  const router = useRouter();
  const { showError } = useNotificationContext();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await getFlightOrderById(params.id);
        setBooking(response.data);
      } catch (error) {
        console.error('Error loading booking:', error);
        showError('Failed to load booking details');
        router.push('/flights/bookings');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadBooking();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const currency = booking.currency || 'AED';
  const currencySymbol = getCurrencySymbol(currency);
  const statusColor = BOOKING_STATUS_COLORS[booking.status] || 'secondary';

  return (
    <>
      <PageTitle
        breadCrumbItems={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Flights', path: '/flights/search' },
          { label: 'My Bookings', path: '/flights/bookings' },
          { label: 'Details', path: `/flights/bookings/${params.id}`, active: true }
        ]}
        title="Booking Details"
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-8">
            {/* Booking Reference Card */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">
                      Booking Reference: {booking.pnr || booking.bookingReference}
                    </h4>
                    <p className="text-muted mb-0">
                      Booking ID: #{booking.id}
                    </p>
                  </div>
                  <div>
                    <span className={`badge bg-${statusColor} fs-6`}>
                      {booking.status || 'Confirmed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Details Card */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="mdi mdi-airplane me-2"></i>
                  Flight Details
                </h5>
              </div>
              <div className="card-body">
                {booking.segments?.map((segment, index) => (
                  <div key={index} className={index > 0 ? 'mt-4 pt-4 border-top' : ''}>
                    <div className="row align-items-center">
                      <div className="col-5">
                        <h5 className="mb-0">
                          {segment.departure?.iataCode || segment.departureAirport}
                        </h5>
                        <p className="text-muted mb-0">
                          {formatFlightDate(segment.departureTime || segment.departure?.at)}
                        </p>
                        <h6>
                          {formatFlightTime(segment.departureTime || segment.departure?.at)}
                        </h6>
                        {segment.departure?.terminal && (
                          <small className="text-muted">Terminal {segment.departure.terminal}</small>
                        )}
                      </div>

                      <div className="col-2 text-center">
                        <i className="mdi mdi-airplane text-primary" style={{ fontSize: '2rem' }}></i>
                        <p className="mb-0 text-muted small">
                          {segment.carrierCode} {segment.flightNumber || segment.number}
                        </p>
                      </div>

                      <div className="col-5 text-end">
                        <h5 className="mb-0">
                          {segment.arrival?.iataCode || segment.arrivalAirport}
                        </h5>
                        <p className="text-muted mb-0">
                          {formatFlightDate(segment.arrivalTime || segment.arrival?.at)}
                        </p>
                        <h6>
                          {formatFlightTime(segment.arrivalTime || segment.arrival?.at)}
                        </h6>
                        {segment.arrival?.terminal && (
                          <small className="text-muted">Terminal {segment.arrival.terminal}</small>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers Card */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="mdi mdi-account-multiple me-2"></i>
                  Travelers
                </h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>E-Ticket</th>
                        <th>Seat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.travelers?.map((traveler, index) => (
                        <tr key={index}>
                          <td>
                            <strong>
                              {traveler.name?.firstName || traveler.firstName}{' '}
                              {traveler.name?.lastName || traveler.lastName}
                            </strong>
                          </td>
                          <td>
                            <span className="badge bg-secondary">
                              {traveler.travelerType || 'ADULT'}
                            </span>
                          </td>
                          <td>
                            {traveler.eTicketNumber || 'N/A'}
                          </td>
                          <td>
                            {traveler.seat || 'Not selected'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Price Summary */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="mdi mdi-cash-multiple me-2"></i>
                  Price Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total Paid</strong>
                  <strong className="text-success fs-4">
                    {currencySymbol}{parseFloat(booking.totalPrice || 0).toFixed(2)}
                  </strong>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => window.print()}
                  >
                    <i className="mdi mdi-printer me-2"></i>
                    Print Ticket
                  </button>
                  
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => router.push('/flights/bookings')}
                  >
                    <i className="mdi mdi-arrow-left me-2"></i>
                    Back to Bookings
                  </button>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="card shadow-sm">
              <div className="card-header bg-light">
                <h6 className="mb-0">Booking Information</h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <small className="text-muted d-block">Booked On</small>
                  <strong>
                    {formatFlightDate(booking.createdAt || booking.bookingDate)}
                  </strong>
                </div>

                {booking.pnr && (
                  <div className="mb-3">
                    <small className="text-muted d-block">PNR</small>
                    <strong>{booking.pnr}</strong>
                  </div>
                )}

                {booking.bookingReference && (
                  <div className="mb-3">
                    <small className="text-muted d-block">Booking Reference</small>
                    <strong>{booking.bookingReference}</strong>
                  </div>
                )}

                <div>
                  <small className="text-muted d-block">Status</small>
                  <span className={`badge bg-${statusColor}`}>
                    {booking.status || 'Confirmed'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightBookingDetailsPage;

