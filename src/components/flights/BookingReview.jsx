'use client';

import { useState } from 'react';
import {
  formatFlightDuration,
  formatFlightTime,
  formatFlightDate,
  getCurrencySymbol
} from '@/services/flightsService';

/**
 * Booking Review Component
 * Review and payment page before final booking
 */
const BookingReview = ({
  flight,
  travelers = [],
  selectedSeats = {},
  onConfirmBooking,
  onBack,
  isBooking = false
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  if (!flight) return null;

  const price = parseFloat(flight.price?.total || 0);
  const currency = flight.price?.currency || 'AED';
  const currencySymbol = getCurrencySymbol(currency);

  // Calculate seat charges
  const calculateSeatCharges = () => {
    let total = 0;
    
    // This would need to be calculated based on actual seat pricing
    // For now, return 0 as seat pricing is included in flight offer after confirmation
    
    return total;
  };

  const seatCharges = calculateSeatCharges();
  const totalPrice = price + seatCharges;

  // Render flight summary
  const renderFlightSummary = (itinerary, title) => {
    if (!itinerary) return null;

    const segments = itinerary.segments || [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    return (
      <div className="mb-3">
        <h6 className="text-primary mb-2">{title}</h6>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{firstSegment?.departure?.iataCode}</strong>
            <small className="text-muted mx-2">
              {formatFlightTime(firstSegment?.departure?.at)}
            </small>
          </div>
          <div className="text-center flex-grow-1">
            <i className="mdi mdi-airplane text-muted"></i>
            <small className="d-block text-muted">{formatFlightDuration(itinerary.duration)}</small>
          </div>
          <div className="text-end">
            <strong>{lastSegment?.arrival?.iataCode}</strong>
            <small className="text-muted mx-2">
              {formatFlightTime(lastSegment?.arrival?.at)}
            </small>
          </div>
        </div>
        <small className="text-muted">
          {firstSegment?.carrierCode} {firstSegment?.number}
          {segments.length > 1 && ` + ${segments.length - 1} stop(s)`}
        </small>
      </div>
    );
  };

  // Render traveler summary
  const renderTravelerSummary = () => (
    <div>
      <h6 className="text-primary mb-3">Travelers</h6>
      {travelers.map((traveler, index) => (
        <div key={traveler.id} className="mb-2">
          <div className="d-flex justify-content-between">
            <div>
              <strong>
                {traveler.name.firstName} {traveler.name.lastName}
              </strong>
              <span className="badge bg-secondary ms-2">{traveler.travelerType}</span>
            </div>
            {selectedSeats[traveler.id] && (
              <small className="text-muted">
                Seats: {Object.values(selectedSeats[traveler.id]).join(', ')}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Handle confirm booking
  const handleConfirm = () => {
    if (!acceptedTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    // Get passenger IDs from the flight offer's raw data
    const passengerIds = flight?.raw?.passengers?.map(p => p.id) || [];
    
    // Transform travelers to match API format with correct Duffel passenger IDs
    const transformedTravelers = travelers.map((traveler, index) => ({
      id: passengerIds[index] || traveler.id,  // Use Duffel passenger ID
      firstName: traveler.name?.firstName || '',
      lastName: traveler.name?.lastName || '',
      dateOfBirth: traveler.dateOfBirth,
      gender: traveler.gender,
      email: traveler.contact?.emailAddress || '',
      phoneCountryCode: traveler.contact?.phones?.[0]?.countryCallingCode || '971',
      phoneNumber: traveler.contact?.phones?.[0]?.number || '',
      documents: (traveler.documents || []).map(doc => ({
        documentType: doc.documentType,
        number: doc.number,
        expiryDate: doc.expiryDate,
        issuanceCountry: doc.issuanceCountry,
        nationality: doc.nationality,
        holder: doc.holder
      }))
    }));

    // Extract contact information from primary traveler
    const primaryTraveler = travelers[0];
    const contacts = primaryTraveler ? {
      email: primaryTraveler.contact?.emailAddress || '',
      phone: primaryTraveler.contact?.phones?.[0]?.number || ''
    } : null;

    onConfirmBooking({
      flightOffer: flight,
      travelers: transformedTravelers,
      contacts: contacts,
      selectedSeats: selectedSeats,
      paymentMethod: paymentMethod
    });
  };

  return (
    <div>
      <div className="mb-4">
        <h4>Review Your Booking</h4>
        <p className="text-muted">
          Please review your flight details and traveler information before confirming.
        </p>
      </div>

      <div className="row g-4">
        {/* Flight Details & Traveler Info */}
        <div className="col-lg-8">
          {/* Flight Details Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="mdi mdi-airplane me-2"></i>
                Flight Details
              </h5>
            </div>
            <div className="card-body">
              {renderFlightSummary(flight.itineraries?.[0], 'Outbound Flight')}
              {flight.itineraries?.[1] && (
                <>
                  <hr />
                  {renderFlightSummary(flight.itineraries[1], 'Return Flight')}
                </>
              )}

              {/* Baggage */}
              <hr />
              <div>
                <h6 className="text-primary mb-2">Baggage Allowance</h6>
                <p className="mb-0 text-muted">
                  <i className="mdi mdi-bag-suitcase me-2"></i>
                  {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags?.weight
                    ? `${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight}${flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weightUnit} checked baggage`
                    : 'Check with airline'} + 1 carry-on per person
                </p>
              </div>
            </div>
          </div>

          {/* Travelers Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="mdi mdi-account-multiple me-2"></i>
                Traveler Information
              </h5>
            </div>
            <div className="card-body">
              {renderTravelerSummary()}
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="mdi mdi-credit-card me-2"></i>
                Payment Method
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paymentCard"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="paymentCard">
                    <i className="mdi mdi-credit-card me-2"></i>
                    Credit/Debit Card
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paymentBank"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="paymentBank">
                    <i className="mdi mdi-bank me-2"></i>
                    Bank Transfer
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="paymentCash"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="paymentCash">
                    <i className="mdi mdi-cash me-2"></i>
                    Cash Payment
                  </label>
                </div>
              </div>

              <div className="alert alert-info mb-0">
                <i className="mdi mdi-information me-2"></i>
                <small>
                  Payment will be processed securely. Your card details are encrypted.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Price Summary Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="mdi mdi-cash-multiple me-2"></i>
                Price Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Flight Fare</span>
                  <span className="fw-semibold">
                    {currencySymbol}{price.toFixed(2)}
                  </span>
                </div>

                {seatCharges > 0 && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted small">Seat Selection</span>
                    <span className="text-muted small">
                      {currencySymbol}{seatCharges.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Taxes & Fees</span>
                  <span className="text-muted small">Included</span>
                </div>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-3">
                <strong>Total Amount</strong>
                <strong className="text-success fs-4">
                  {currencySymbol}{totalPrice.toFixed(2)}
                </strong>
              </div>

              <small className="text-muted d-block mb-3">
                For {travelers.length} traveler(s)
              </small>

              {/* Terms & Conditions */}
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label className="form-check-label small" htmlFor="acceptTerms">
                  I accept the{' '}
                  <a href="#" className="text-primary">
                    terms and conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary">
                    cancellation policy
                  </a>
                </label>
              </div>

              {/* Confirm Button */}
              <button
                className="btn btn-success w-100 mb-2"
                onClick={handleConfirm}
                disabled={!acceptedTerms || isBooking}
              >
                {isBooking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-check-circle me-2"></i>
                    Confirm & Pay
                  </>
                )}
              </button>

              <button
                className="btn btn-outline-secondary w-100"
                onClick={onBack}
                disabled={isBooking}
              >
                <i className="mdi mdi-chevron-left me-2"></i>
                Back
              </button>

              {/* Security Badge */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="mdi mdi-lock me-1"></i>
                  Secure Payment
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingReview;

