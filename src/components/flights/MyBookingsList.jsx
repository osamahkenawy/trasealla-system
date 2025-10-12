'use client';

import { useState } from 'react';
import {
  formatFlightTime,
  formatFlightDate,
  getCurrencySymbol,
  BOOKING_STATUS_COLORS
} from '@/services/flightsService';

/**
 * My Bookings List Component
 * Display user's flight bookings
 */
const MyBookingsList = ({
  bookings = [],
  onViewDetails,
  onCancelBooking,
  isLoading = false
}) => {
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  // Filter bookings
  const getFilteredBookings = () => {
    const now = new Date();
    
    return bookings.filter((booking) => {
      if (filter === 'all') return true;
      
      // Get first departure date
      const firstSegment = booking.segments?.[0];
      const departureDate = new Date(firstSegment?.departureTime || firstSegment?.departure?.at);
      
      if (filter === 'upcoming') {
        return departureDate > now && booking.status !== 'cancelled';
      } else if (filter === 'past') {
        return departureDate < now && booking.status !== 'cancelled';
      } else if (filter === 'cancelled') {
        return booking.status === 'cancelled';
      }
      
      return true;
    });
  };

  const filteredBookings = getFilteredBookings();

  // Render single booking card
  const renderBookingCard = (booking) => {
    const segments = booking.segments || [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];
    
    const currency = booking.currency || 'AED';
    const currencySymbol = getCurrencySymbol(currency);
    
    const statusColor = BOOKING_STATUS_COLORS[booking.status] || 'secondary';

    // Check if booking is upcoming and can be cancelled
    const departureDate = new Date(firstSegment?.departureTime || firstSegment?.departure?.at);
    const canCancel = departureDate > new Date() && booking.status === 'confirmed';

    return (
      <div key={booking.id} className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row align-items-center">
            {/* Booking Reference & Status */}
            <div className="col-md-3 mb-3 mb-md-0">
              <h6 className="mb-1">
                <i className="mdi mdi-ticket me-2 text-primary"></i>
                {booking.pnr || booking.bookingReference}
              </h6>
              <span className={`badge bg-${statusColor}`}>
                {booking.status || 'Confirmed'}
              </span>
              <p className="mb-0 text-muted small mt-2">
                Booked: {formatFlightDate(booking.createdAt || booking.bookingDate)}
              </p>
            </div>

            {/* Flight Info */}
            <div className="col-md-5 mb-3 mb-md-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">
                    {firstSegment?.departure?.iataCode || firstSegment?.departureAirport}
                  </h5>
                  <small className="text-muted">
                    {formatFlightTime(firstSegment?.departureTime || firstSegment?.departure?.at)}
                  </small>
                  <p className="mb-0 text-muted small">
                    {formatFlightDate(firstSegment?.departureTime || firstSegment?.departure?.at)}
                  </p>
                </div>

                <div className="text-center mx-3">
                  <i className="mdi mdi-airplane text-primary"></i>
                  <p className="mb-0 text-muted small">
                    {segments.length === 1 ? 'Direct' : `${segments.length - 1} stop(s)`}
                  </p>
                </div>

                <div className="text-end">
                  <h5 className="mb-0">
                    {lastSegment?.arrival?.iataCode || lastSegment?.arrivalAirport}
                  </h5>
                  <small className="text-muted">
                    {formatFlightTime(lastSegment?.arrivalTime || lastSegment?.arrival?.at)}
                  </small>
                  <p className="mb-0 text-muted small">
                    {formatFlightDate(lastSegment?.arrivalTime || lastSegment?.arrival?.at)}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <small className="text-muted">
                  <i className="mdi mdi-account-multiple me-1"></i>
                  {booking.travelers?.length || 1} passenger(s)
                </small>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="col-md-4 text-md-end">
              <h4 className="mb-2 text-primary">
                {currencySymbol}{parseFloat(booking.totalPrice || 0).toFixed(2)}
              </h4>

              <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onViewDetails(booking.id)}
                >
                  <i className="mdi mdi-eye me-1"></i>
                  View Details
                </button>

                {canCancel && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      if (confirm('Are you sure you want to cancel this booking?')) {
                        onCancelBooking(booking.id);
                      }
                    }}
                  >
                    <i className="mdi mdi-close-circle me-1"></i>
                    Cancel
                  </button>
                )}

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => window.print()}
                >
                  <i className="mdi mdi-printer me-1"></i>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading bookings...</span>
        </div>
        <p className="mt-3 text-muted">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>My Flight Bookings</h4>

        {/* Filter Tabs */}
        <div className="btn-group" role="group">
          <input
            type="radio"
            className="btn-check"
            name="bookingFilter"
            id="filterAll"
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          />
          <label className="btn btn-outline-primary" htmlFor="filterAll">
            All ({bookings.length})
          </label>

          <input
            type="radio"
            className="btn-check"
            name="bookingFilter"
            id="filterUpcoming"
            checked={filter === 'upcoming'}
            onChange={() => setFilter('upcoming')}
          />
          <label className="btn btn-outline-primary" htmlFor="filterUpcoming">
            Upcoming
          </label>

          <input
            type="radio"
            className="btn-check"
            name="bookingFilter"
            id="filterPast"
            checked={filter === 'past'}
            onChange={() => setFilter('past')}
          />
          <label className="btn btn-outline-primary" htmlFor="filterPast">
            Past
          </label>

          <input
            type="radio"
            className="btn-check"
            name="bookingFilter"
            id="filterCancelled"
            checked={filter === 'cancelled'}
            onChange={() => setFilter('cancelled')}
          />
          <label className="btn btn-outline-primary" htmlFor="filterCancelled">
            Cancelled
          </label>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div>
          {filteredBookings.map((booking) => renderBookingCard(booking))}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="mdi mdi-ticket-outline" style={{ fontSize: '4rem', color: '#ccc' }}></i>
            <h4 className="mt-3">No Bookings Found</h4>
            <p className="text-muted">
              {filter === 'all'
                ? "You haven't made any flight bookings yet."
                : `No ${filter} bookings found.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsList;

