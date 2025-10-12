'use client';

import {
  formatFlightTime,
  formatFlightDate,
  getCurrencySymbol
} from '@/services/flightsService';

/**
 * Booking Confirmation Component
 * Success page after flight booking
 */
const BookingConfirmation = ({ booking, onViewBooking, onNewSearch }) => {
  if (!booking) return null;

  const currency = booking.currency || 'AED';
  const currencySymbol = getCurrencySymbol(currency);

  // Render flight summary
  const renderFlightInfo = () => {
    const segments = booking.segments || [];
    if (segments.length === 0) return null;

    const outboundSegments = segments.filter(s => s.direction === 'outbound' || !s.direction);
    const returnSegments = segments.filter(s => s.direction === 'return');

    const renderSegments = (segs, title) => {
      if (segs.length === 0) return null;
      
      const firstSeg = segs[0];
      const lastSeg = segs[segs.length - 1];

      return (
        <div className="mb-3">
          <h6 className="text-primary mb-2">{title}</h6>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">{firstSeg.departure?.iataCode || firstSeg.departureAirport}</h5>
              <small className="text-muted">
                {formatFlightDate(firstSeg.departureTime || firstSeg.departure?.at)}
              </small>
              <p className="mb-0">
                {formatFlightTime(firstSeg.departureTime || firstSeg.departure?.at)}
              </p>
            </div>
            <div className="text-center">
              <i className="mdi mdi-airplane text-primary" style={{ fontSize: '2rem' }}></i>
              <p className="mb-0 text-muted small">
                {segs.length === 1 ? 'Direct' : `${segs.length - 1} stop(s)`}
              </p>
            </div>
            <div className="text-end">
              <h5 className="mb-0">{lastSeg.arrival?.iataCode || lastSeg.arrivalAirport}</h5>
              <small className="text-muted">
                {formatFlightDate(lastSeg.arrivalTime || lastSeg.arrival?.at)}
              </small>
              <p className="mb-0">
                {formatFlightTime(lastSeg.arrivalTime || lastSeg.arrival?.at)}
              </p>
            </div>
          </div>
        </div>
      );
    };

    return (
      <>
        {renderSegments(outboundSegments, 'Outbound Flight')}
        {returnSegments.length > 0 && (
          <>
            <hr />
            {renderSegments(returnSegments, 'Return Flight')}
          </>
        )}
      </>
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Success Animation */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <div
                className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: '80px', height: '80px' }}
              >
                <i className="mdi mdi-check text-white" style={{ fontSize: '3rem' }}></i>
              </div>
            </div>
            <h2 className="text-success mb-2">Booking Confirmed!</h2>
            <p className="text-muted">
              Your flight has been successfully booked. A confirmation email has been sent to your email address.
            </p>
          </div>

          {/* Booking Reference Card */}
          <div className="card shadow-lg mb-4">
            <div className="card-body text-center bg-primary text-white">
              <h5 className="mb-2">Booking Reference</h5>
              <h1 className="mb-2 fw-bold">{booking.pnr || booking.bookingReference}</h1>
              <p className="mb-0">
                <small>Please save this reference number for your records</small>
              </p>
            </div>
          </div>

          {/* Flight Details Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="mdi mdi-airplane me-2"></i>
                Flight Details
              </h5>
            </div>
            <div className="card-body">
              {renderFlightInfo()}
            </div>
          </div>

          {/* Travelers Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="mdi mdi-account-multiple me-2"></i>
                Travelers
              </h5>
            </div>
            <div className="card-body">
              {booking.travelers?.map((traveler, index) => (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <div>
                    <strong>
                      {traveler.name?.firstName || traveler.firstName}{' '}
                      {traveler.name?.lastName || traveler.lastName}
                    </strong>
                    {traveler.travelerType && (
                      <span className="badge bg-secondary ms-2">{traveler.travelerType}</span>
                    )}
                  </div>
                  {traveler.eTicketNumber && (
                    <small className="text-muted">E-Ticket: {traveler.eTicketNumber}</small>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="mdi mdi-cash-multiple me-2"></i>
                Payment Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Total Amount Paid</span>
                <strong className="text-success fs-5">
                  {currencySymbol}{parseFloat(booking.totalPrice || 0).toFixed(2)}
                </strong>
              </div>
              <small className="text-muted">
                Status:{' '}
                <span className={`badge bg-${booking.status === 'confirmed' ? 'success' : 'warning'}`}>
                  {booking.status || 'Confirmed'}
                </span>
              </small>
            </div>
          </div>

          {/* Next Steps Card */}
          <div className="card shadow-sm mb-4 border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="mdi mdi-information me-2"></i>
                What's Next?
              </h5>
            </div>
            <div className="card-body">
              <ul className="mb-0">
                <li className="mb-2">
                  <strong>Check your email</strong> - You'll receive a confirmation email with your e-ticket and booking details.
                </li>
                <li className="mb-2">
                  <strong>Online Check-in</strong> - Check-in opens 24-48 hours before departure.
                </li>
                <li className="mb-2">
                  <strong>Arrive Early</strong> - Arrive at the airport at least 3 hours before international flights.
                </li>
                <li className="mb-2">
                  <strong>Valid Documents</strong> - Ensure you have valid passport and required visas.
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="row g-3">
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={() => onViewBooking(booking.id)}
              >
                <i className="mdi mdi-eye me-2"></i>
                View Booking
              </button>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => window.print()}
              >
                <i className="mdi mdi-printer me-2"></i>
                Print Ticket
              </button>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={onNewSearch}
              >
                <i className="mdi mdi-magnify me-2"></i>
                New Search
              </button>
            </div>
          </div>

          {/* Support Info */}
          <div className="text-center mt-4">
            <small className="text-muted">
              Need help? Contact our support at{' '}
              <a href="mailto:support@trasealla.com">support@trasealla.com</a>
              {' '}or call <a href="tel:+971501234567">+971 50 123 4567</a>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

