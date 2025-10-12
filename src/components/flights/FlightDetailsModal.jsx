'use client';

import { Modal } from 'react-bootstrap';
import {
  formatFlightDuration,
  formatFlightTime,
  formatFlightDate,
  calculateLayoverDuration,
  getStopsText,
  getCurrencySymbol
} from '@/services/flightsService';

/**
 * Flight Details Modal Component
 * Displays detailed information about a flight offer
 */
const FlightDetailsModal = ({ flight, onClose, onSelect }) => {
  if (!flight) return null;

  const price = parseFloat(flight.price?.total || 0);
  const basePrice = parseFloat(flight.price?.base || 0);
  const currency = flight.price?.currency || 'AED';
  const currencySymbol = getCurrencySymbol(currency);

  const renderSegment = (segment, segmentIndex, totalSegments) => {
    const isLastSegment = segmentIndex === totalSegments - 1;

    return (
      <div key={segment.id || segmentIndex} className="mb-4">
        <div className="card bg-light">
          <div className="card-body">
            <div className="row">
              {/* Departure */}
              <div className="col-5">
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <i className="mdi mdi-airplane-takeoff text-success" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1">{formatFlightTime(segment.departure.at)}</h5>
                    <p className="mb-0 fw-semibold">{segment.departure.iataCode}</p>
                    {segment.departure.terminal && (
                      <small className="text-muted">Terminal {segment.departure.terminal}</small>
                    )}
                    <p className="mb-0 text-muted small">{formatFlightDate(segment.departure.at)}</p>
                  </div>
                </div>
              </div>

              {/* Flight Info */}
              <div className="col-2 text-center">
                <i className="mdi mdi-airplane text-primary" style={{ fontSize: '1.5rem' }}></i>
                <p className="mb-0 small text-muted">{formatFlightDuration(segment.duration)}</p>
              </div>

              {/* Arrival */}
              <div className="col-5">
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <i className="mdi mdi-airplane-landing text-danger" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-1">{formatFlightTime(segment.arrival.at)}</h5>
                    <p className="mb-0 fw-semibold">{segment.arrival.iataCode}</p>
                    {segment.arrival.terminal && (
                      <small className="text-muted">Terminal {segment.arrival.terminal}</small>
                    )}
                    <p className="mb-0 text-muted small">{formatFlightDate(segment.arrival.at)}</p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-3" />

            <div className="row">
              <div className="col-md-6">
                <small className="text-muted d-block mb-1">
                  <i className="mdi mdi-airplane me-1"></i>
                  <strong>{segment.carrierCode} {segment.number}</strong>
                  {segment.operating?.carrierCode && segment.operating.carrierCode !== segment.carrierCode && (
                    <span> (Operated by {segment.operating.carrierCode})</span>
                  )}
                </small>
                <small className="text-muted d-block">
                  <i className="mdi mdi-seat-passenger me-1"></i>
                  Aircraft: {segment.aircraft?.code || 'N/A'}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Layover */}
        {!isLastSegment && (
          <div className="text-center my-3">
            <div className="badge bg-warning text-dark">
              <i className="mdi mdi-clock-outline me-1"></i>
              Layover: {calculateLayoverDuration(
                segment.arrival.at,
                flight.itineraries[0].segments[segmentIndex + 1]?.departure?.at
              )} at {segment.arrival.iataCode}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderItinerary = (itinerary, title) => {
    if (!itinerary) return null;

    const segments = itinerary.segments || [];
    const numberOfStops = segments.length - 1;

    return (
      <div className="mb-4">
        <h5 className="mb-3">
          <i className="mdi mdi-airplane-takeoff me-2"></i>
          {title}
        </h5>
        
        <div className="alert alert-info">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>{segments[0]?.departure?.iataCode}</strong>
              <i className="mdi mdi-arrow-right mx-2"></i>
              <strong>{segments[segments.length - 1]?.arrival?.iataCode}</strong>
            </div>
            <div>
              <span className="badge bg-primary me-2">{formatFlightDuration(itinerary.duration)}</span>
              <span className="badge bg-secondary">{getStopsText(numberOfStops)}</span>
            </div>
          </div>
        </div>

        {segments.map((segment, index) => renderSegment(segment, index, segments.length))}
      </div>
    );
  };

  const renderBaggageInfo = () => {
    const baggageInfo = flight.travelerPricings?.[0]?.fareDetailsBySegment || [];
    
    return (
      <div className="mb-4">
        <h5 className="mb-3">
          <i className="mdi mdi-bag-suitcase me-2"></i>
          Baggage Allowance
        </h5>
        
        {baggageInfo.map((fareDetails, index) => {
          const segment = flight.itineraries[0].segments[index];
          const baggage = fareDetails.includedCheckedBags;
          
          return (
            <div key={index} className="card mb-2">
              <div className="card-body py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{segment?.departure?.iataCode} → {segment?.arrival?.iataCode}</strong>
                  </div>
                  <div>
                    {baggage?.weight ? (
                      <span className="badge bg-success">
                        {baggage.weight}{baggage.weightUnit} checked
                      </span>
                    ) : baggage?.quantity ? (
                      <span className="badge bg-success">
                        {baggage.quantity} piece(s) checked
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark">Check with airline</span>
                    )}
                    <span className="badge bg-info ms-2">1 carry-on</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFareBreakdown = () => {
    const travelerPricings = flight.travelerPricings || [];
    const fees = flight.price?.fees || [];

    return (
      <div className="mb-4">
        <h5 className="mb-3">
          <i className="mdi mdi-cash-multiple me-2"></i>
          Fare Breakdown
        </h5>
        
        <div className="card">
          <div className="card-body">
            {travelerPricings.map((pricing, index) => (
              <div key={index} className="d-flex justify-content-between mb-2">
                <span>
                  {pricing.travelerType} × 1
                </span>
                <span className="fw-semibold">
                  {currencySymbol}{parseFloat(pricing.price.total).toFixed(2)}
                </span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span>Base Fare</span>
              <span>{currencySymbol}{basePrice.toFixed(2)}</span>
            </div>

            {fees.map((fee, index) => (
              fee.amount && parseFloat(fee.amount) > 0 && (
                <div key={index} className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">{fee.type} Fee</span>
                  <span className="text-muted small">
                    {currencySymbol}{parseFloat(fee.amount).toFixed(2)}
                  </span>
                </div>
              )
            ))}

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Taxes & Fees</span>
              <span className="text-muted small">
                {currencySymbol}{(price - basePrice).toFixed(2)}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between">
              <strong>Total Price</strong>
              <strong className="text-primary fs-5">
                {currencySymbol}{price.toFixed(2)}
              </strong>
            </div>

            <small className="text-muted d-block mt-2">
              For {travelerPricings.length} traveler(s)
            </small>
          </div>
        </div>
      </div>
    );
  };

  const renderFareRules = () => {
    const refundable = flight.pricingOptions?.refundableFare;
    const changeable = flight.pricingOptions?.changeableFare;
    const lastTicketingDate = flight.lastTicketingDate;

    return (
      <div className="mb-4">
        <h5 className="mb-3">
          <i className="mdi mdi-file-document-outline me-2"></i>
          Fare Conditions
        </h5>
        
        <div className="card">
          <div className="card-body">
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <i className={`mdi mdi-${refundable ? 'check-circle text-success' : 'close-circle text-danger'} me-2`}></i>
                {refundable ? 'Refundable' : 'Non-refundable'}
              </li>
              <li className="mb-2">
                <i className={`mdi mdi-${changeable ? 'check-circle text-success' : 'close-circle text-danger'} me-2`}></i>
                {changeable ? 'Changes allowed (fees may apply)' : 'Changes not allowed'}
              </li>
              {lastTicketingDate && (
                <li className="mb-2">
                  <i className="mdi mdi-calendar-clock text-warning me-2"></i>
                  Must be ticketed by: {formatFlightDate(lastTicketingDate)}
                </li>
              )}
              {flight.numberOfBookableSeats && flight.numberOfBookableSeats <= 5 && (
                <li className="mb-2">
                  <i className="mdi mdi-alert text-warning me-2"></i>
                  Only {flight.numberOfBookableSeats} seats available at this price
                </li>
              )}
            </ul>

            <div className="alert alert-warning mb-0 mt-3">
              <small>
                <i className="mdi mdi-information-outline me-1"></i>
                Prices shown are subject to availability and may change before booking.
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      show={true}
      onHide={onClose}
      size="lg"
      scrollable
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="mdi mdi-airplane me-2"></i>
          Flight Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Outbound Flight */}
        {renderItinerary(flight.itineraries?.[0], 'Outbound Flight')}

        {/* Return Flight */}
        {flight.itineraries?.[1] && renderItinerary(flight.itineraries[1], 'Return Flight')}

        {/* Baggage Information */}
        {renderBaggageInfo()}

        {/* Fare Breakdown */}
        {renderFareBreakdown()}

        {/* Fare Rules */}
        {renderFareRules()}
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn btn-secondary"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="btn btn-primary"
          onClick={() => onSelect(flight)}
        >
          <i className="mdi mdi-check-circle me-2"></i>
          Select This Flight
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default FlightDetailsModal;

