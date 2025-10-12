'use client';

import {
  formatFlightDuration,
  formatFlightTime,
  formatFlightDate,
  getCurrencySymbol
} from '@/services/flightsService';
import './FlightCard.scss';

/**
 * Flight Card Component
 * Displays a single flight offer in the search results
 * Matches the design with airline logo, clean layout, and detailed information
 */
const FlightCard = ({ flight, onSelect, onViewDetails, isSelected = false }) => {
  if (!flight) return null;

  const outbound = flight.itineraries?.[0];
  const returnFlight = flight.itineraries?.[1];
  
  const firstSegment = outbound?.segments?.[0];
  const lastSegment = outbound?.segments?.[outbound.segments.length - 1];
  
  const price = parseFloat(flight.price?.total || 0);
  const currency = flight.price?.currency || 'USD';
  const currencySymbol = getCurrencySymbol(currency);
  
  const numberOfStops = (outbound?.segments?.length || 1) - 1;
  const duration = outbound?.duration;
  const durationText = formatFlightDuration(duration);
  
  // Get airline logo from raw data (Duffel format)
  const airlineLogo = flight.raw?.owner?.logo_symbol_url || 
                      flight.raw?.slices?.[0]?.segments?.[0]?.marketing_carrier?.logo_symbol_url;
  
  const airlineName = flight.raw?.owner?.name || 
                      flight.raw?.slices?.[0]?.segments?.[0]?.marketing_carrier?.name || 
                      firstSegment?.carrierName;
  
  // Get destination city names
  const originCity = firstSegment?.departure?.cityName || firstSegment?.departure?.iataCode;
  const destinationCity = lastSegment?.arrival?.cityName || lastSegment?.arrival?.iataCode;
  
  // Get flight type (Direct or with stops)
  const flightType = numberOfStops === 0 ? 'Direct' : `${numberOfStops} Stop${numberOfStops > 1 ? 's' : ''}`;

  // Total price including all passengers
  const totalPrice = flight.price?.grandTotal || flight.price?.total;
  const passengerCount = flight.passengers?.length || 1;

  return (
    <div className={`card flight-card mb-3 ${isSelected ? 'border-primary' : ''}`}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center">
          {/* Left Section: Time, Route, and Logo */}
          <div className="flight-details-section flex-grow-1">
            <div className="d-flex align-items-center justify-content-between">
              {/* Time and Route Info */}
              <div className="flex-grow-1">
                {/* Time Display */}
                <h3 className="mb-2 fw-bold" style={{ fontSize: '1.5rem', lineHeight: '1.2' }}>
                  {formatFlightTime(firstSegment?.departure?.at)} - {formatFlightTime(lastSegment?.arrival?.at)}
                  {lastSegment?.arrival?.at && 
                   new Date(lastSegment.arrival.at).getDate() !== new Date(firstSegment?.departure?.at).getDate() && 
                   <span className="ms-2" style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>(+1)</span>
                  }
                </h3>

                {/* Route Information */}
                <h5 className="mb-2 fw-normal" style={{ fontSize: '1rem', color: '#424242' }}>
                  {originCity} to {destinationCity}
                </h5>

                {/* Flight Type and Duration */}
                <p className="mb-0" style={{ fontSize: '0.9rem', color: '#666' }}>
                  <span className="fw-bold">{flightType}</span>, {durationText}
                </p>
              </div>

              {/* Airline Logo */}
              {airlineLogo && (
                <div className="ms-4">
                  <div 
                    className="airline-logo-container"
                    style={{ 
                      height: '40px',
                      minWidth: '80px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img 
                      src={airlineLogo} 
                      alt={airlineName}
                      style={{ 
                        maxHeight: '40px',
                        maxWidth: '100px',
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div 
            className="flight-divider mx-4" 
            style={{ 
              width: '1px', 
              height: '100px', 
              backgroundColor: '#e0e0e0',
              flexShrink: 0
            }}
          />

          {/* Right Section: Price and Actions */}
          <div className="price-actions-section" style={{ minWidth: '280px' }}>
            <div className="text-end">
              {/* Baggage Info Link */}
              <div className="mb-2">
                <button
                  className="btn btn-link p-0 text-decoration-none text-muted"
                  onClick={() => onViewDetails(flight)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <i className="mdi mdi-bag-suitcase me-1" style={{ fontSize: '1rem' }}></i>
                  Check fare rules for baggage details
                </button>
              </div>

              {/* View Details Link */}
              <div className="mb-3">
                <button
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => onViewDetails(flight)}
                  style={{ fontSize: '0.85rem', color: '#0066cc' }}
                >
                  <i className="mdi mdi-airplane me-1" style={{ fontSize: '1rem' }}></i>
                  View flight details in full
                </button>
              </div>

              {/* Price Section */}
              <div className="price-section mb-3">
                <div className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>Price per adult</div>
                <h2 className="mb-1 fw-bold" style={{ fontSize: '2.2rem', color: '#0091ea', lineHeight: '1' }}>
                  {currency} {Math.round(price).toLocaleString()}
                </h2>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                  (Total price <span className="fw-bold">{currency} {Math.round(totalPrice).toLocaleString()}</span>)
                </div>
              </div>

              {/* Select Button */}
              <div>
                <button
                  className="btn btn-primary btn-lg btn-select px-4"
                  onClick={() => onSelect(flight)}
                  style={{ 
                    borderRadius: '50px',
                    fontWeight: '600',
                    minWidth: '140px',
                    fontSize: '1rem',
                    backgroundColor: '#0091ea',
                    borderColor: '#0091ea',
                    padding: '8px 24px'
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Return Flight Info (if applicable) */}
        {returnFlight && (
          <div className="mt-4 pt-4 border-top">
            <div className="d-flex align-items-center">
              <div className="flight-details-section flex-grow-1">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h5 className="mb-2 fw-bold">
                      {formatFlightTime(returnFlight.segments[0]?.departure?.at)} - {formatFlightTime(returnFlight.segments[returnFlight.segments.length - 1]?.arrival?.at)}
                      {returnFlight.segments[returnFlight.segments.length - 1]?.arrival?.at && 
                       new Date(returnFlight.segments[returnFlight.segments.length - 1].arrival.at).getDate() !== 
                       new Date(returnFlight.segments[0]?.departure?.at).getDate() && 
                       <span className="ms-2" style={{ fontSize: '0.85rem', fontWeight: 'normal' }}>(+1)</span>
                      }
                    </h5>
                    <p className="mb-0 text-muted">
                      <span className="fw-bold">
                        {(returnFlight.segments?.length || 1) - 1 === 0 ? 'Direct' : `${(returnFlight.segments?.length || 1) - 1} Stop(s)`}
                      </span>, {formatFlightDuration(returnFlight.duration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;

