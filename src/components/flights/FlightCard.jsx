'use client';

import {
  formatFlightDuration,
  formatFlightTime,
  formatFlightDate,
  getStopsText,
  getCurrencySymbol
} from '@/services/flightsService';

/**
 * Flight Card Component
 * Displays a single flight offer in the search results
 */
const FlightCard = ({ flight, onSelect, onViewDetails, isSelected = false }) => {
  if (!flight) return null;

  const outbound = flight.itineraries?.[0];
  const returnFlight = flight.itineraries?.[1];
  
  const firstSegment = outbound?.segments?.[0];
  const lastSegment = outbound?.segments?.[outbound.segments.length - 1];
  
  const price = parseFloat(flight.price?.total || 0);
  const currency = flight.price?.currency || 'AED';
  const currencySymbol = getCurrencySymbol(currency);
  
  const numberOfStops = (outbound?.segments?.length || 1) - 1;
  const stopsText = getStopsText(numberOfStops);
  
  const duration = outbound?.duration;
  const durationText = formatFlightDuration(duration);
  
  const airlineCode = flight.validatingAirlineCodes?.[0] || firstSegment?.carrierCode;
  const flightNumber = `${firstSegment?.carrierCode}${firstSegment?.number}`;
  
  // Baggage allowance
  const baggageInfo = flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.includedCheckedBags;
  const baggageText = baggageInfo?.weight 
    ? `${baggageInfo.weight}${baggageInfo.weightUnit}` 
    : (baggageInfo?.quantity ? `${baggageInfo.quantity} piece(s)` : 'Check fare');
  
  const seatsAvailable = flight.numberOfBookableSeats;

  return (
    <div className={`card mb-3 shadow-sm hover-shadow ${isSelected ? 'border-primary' : ''}`}>
      <div className="card-body">
        <div className="row align-items-center g-3">
          {/* Airline Logo & Flight Number */}
          <div className="col-md-2 text-center">
            <div className="d-flex flex-column align-items-center">
              <div
                className="bg-light rounded p-2 mb-2"
                style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span style={{ fontSize: '2rem' }}>✈️</span>
              </div>
              <small className="text-muted fw-semibold">{airlineCode}</small>
              <small className="text-muted">{flightNumber}</small>
            </div>
          </div>

          {/* Flight Details - Outbound */}
          <div className="col-md-7">
            <div className="d-flex align-items-center justify-content-between mb-2">
              {/* Departure */}
              <div className="text-center">
                <h4 className="mb-0 fw-bold">{formatFlightTime(firstSegment?.departure?.at)}</h4>
                <p className="mb-0 fw-semibold">{firstSegment?.departure?.iataCode}</p>
                <small className="text-muted">{formatFlightDate(firstSegment?.departure?.at)}</small>
              </div>

              {/* Duration & Stops */}
              <div className="text-center flex-grow-1 mx-3">
                <small className="text-muted d-block">{durationText}</small>
                <div className="position-relative my-2">
                  <hr className="my-0" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-2">
                    {numberOfStops === 0 ? (
                      <i className="mdi mdi-airplane text-primary"></i>
                    ) : (
                      <span className="badge bg-warning text-dark">{numberOfStops}</span>
                    )}
                  </span>
                </div>
                <small className="text-muted">{stopsText}</small>
              </div>

              {/* Arrival */}
              <div className="text-center">
                <h4 className="mb-0 fw-bold">{formatFlightTime(lastSegment?.arrival?.at)}</h4>
                <p className="mb-0 fw-semibold">{lastSegment?.arrival?.iataCode}</p>
                <small className="text-muted">{formatFlightDate(lastSegment?.arrival?.at)}</small>
              </div>
            </div>

            {/* Return Flight Info (if applicable) */}
            {returnFlight && (
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-center">
                    <small className="fw-semibold">
                      {formatFlightTime(returnFlight.segments[0]?.departure?.at)}
                    </small>
                    <p className="mb-0 text-muted small">
                      {returnFlight.segments[0]?.departure?.iataCode}
                    </p>
                  </div>
                  
                  <div className="text-center flex-grow-1 mx-3">
                    <small className="text-muted">
                      {formatFlightDuration(returnFlight.duration)} • {getStopsText((returnFlight.segments?.length || 1) - 1)}
                    </small>
                  </div>
                  
                  <div className="text-center">
                    <small className="fw-semibold">
                      {formatFlightTime(returnFlight.segments[returnFlight.segments.length - 1]?.arrival?.at)}
                    </small>
                    <p className="mb-0 text-muted small">
                      {returnFlight.segments[returnFlight.segments.length - 1]?.arrival?.iataCode}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-3 d-flex gap-3 flex-wrap">
              <small className="text-muted">
                <i className="mdi mdi-bag-suitcase me-1"></i>
                Baggage: {baggageText}
              </small>
              {seatsAvailable && seatsAvailable <= 5 && (
                <small className="text-warning">
                  <i className="mdi mdi-alert me-1"></i>
                  Only {seatsAvailable} seats left
                </small>
              )}
              <small className="text-muted">
                <i className="mdi mdi-seat-passenger me-1"></i>
                {flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'Economy'}
              </small>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="col-md-3 text-md-end text-center">
            <div className="mb-3">
              <div className="text-muted small">Price per adult</div>
              <h3 className="mb-0 text-primary fw-bold">
                {currencySymbol}{price.toFixed(2)}
              </h3>
              <small className="text-muted">Total for {flight.travelerPricings?.length || 1} traveler(s)</small>
            </div>

            <div className="d-flex flex-column gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onSelect(flight)}
              >
                <i className="mdi mdi-check-circle me-1"></i>
                Select Flight
              </button>
              
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onViewDetails(flight)}
              >
                <i className="mdi mdi-information me-1"></i>
                View Details
              </button>
            </div>

            {!flight.pricingOptions?.includedCheckedBagsOnly && (
              <small className="text-muted d-block mt-2">
                <i className="mdi mdi-information-outline me-1"></i>
                Additional fees may apply
              </small>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;

