'use client';

import { useState, useEffect } from 'react';
import { getCurrencySymbol } from '@/services/flightsService';

/**
 * Seat Selection Component
 * Interactive seat map for flight booking
 */
const SeatSelection = ({
  seatMaps = [],
  travelers = [],
  selectedSeats = {},
  onSeatSelect,
  onSkip,
  onContinue,
  isLoading = false
}) => {
  const [currentTravelerIndex, setCurrentTravelerIndex] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  const currentTraveler = travelers[currentTravelerIndex];
  const currentSeatMap = seatMaps[currentSegmentIndex];

  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (!seat || !currentTraveler) return;

    // Check if seat is available
    const availability = seat.travelerPricing?.find(
      (tp) => tp.travelerId === currentTraveler.id
    );

    if (availability?.seatAvailabilityStatus !== 'AVAILABLE') {
      return;
    }

    // Select seat
    onSeatSelect(currentTraveler.id, currentSeatMap.segmentId, seat.number);

    // Move to next traveler or segment
    if (currentTravelerIndex < travelers.length - 1) {
      setCurrentTravelerIndex(currentTravelerIndex + 1);
    } else if (currentSegmentIndex < seatMaps.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
      setCurrentTravelerIndex(0);
    }
  };

  // Get seat status for display
  const getSeatStatus = (seat) => {
    if (!seat || !currentTraveler) return 'unavailable';

    const availability = seat.travelerPricing?.find(
      (tp) => tp.travelerId === currentTraveler.id
    );

    // Check if already selected
    const isSelected =
      selectedSeats[currentTraveler.id]?.[currentSeatMap.segmentId] === seat.number;

    if (isSelected) return 'selected';

    switch (availability?.seatAvailabilityStatus) {
      case 'AVAILABLE':
        return 'available';
      case 'BLOCKED':
      case 'OCCUPIED':
        return 'unavailable';
      default:
        return 'unavailable';
    }
  };

  // Get seat price
  const getSeatPrice = (seat) => {
    if (!seat || !currentTraveler) return null;

    const pricing = seat.travelerPricing?.find(
      (tp) => tp.travelerId === currentTraveler.id
    );

    return pricing?.price?.total ? parseFloat(pricing.price.total) : 0;
  };

  // Get seat CSS class
  const getSeatClass = (seat) => {
    const status = getSeatStatus(seat);
    const characteristics = seat.characteristicsCodes || [];

    let className = 'seat';

    // Status classes
    if (status === 'available') className += ' seat-available';
    else if (status === 'selected') className += ' seat-selected';
    else className += ' seat-unavailable';

    // Characteristic classes
    if (characteristics.includes('W')) className += ' seat-window';
    if (characteristics.includes('A')) className += ' seat-aisle';
    if (characteristics.includes('1')) className += ' seat-extra-legroom';
    if (characteristics.includes('E')) className += ' seat-exit-row';

    return className;
  };

  // Render seat
  const renderSeat = (seat) => {
    const status = getSeatStatus(seat);
    const price = getSeatPrice(seat);
    const characteristics = seat.characteristicsCodes || [];

    return (
      <div
        key={seat.number}
        className={getSeatClass(seat)}
        onClick={() => status === 'available' && handleSeatClick(seat)}
        title={`${seat.number} ${price > 0 ? `- ${getCurrencySymbol('AED')}${price}` : ''}`}
      >
        <div className="seat-number">{seat.number}</div>
        {price > 0 && <div className="seat-price">+{price}</div>}
        {characteristics.includes('1') && <span className="seat-badge">+</span>}
      </div>
    );
  };

  // Render deck
  const renderDeck = (deck) => {
    if (!deck || !deck.seats) return null;

    // Group seats by row
    const seatRows = {};
    deck.seats.forEach((seat) => {
      const row = seat.number.replace(/[A-Z]/g, '');
      if (!seatRows[row]) {
        seatRows[row] = [];
      }
      seatRows[row].push(seat);
    });

    // Sort rows
    const sortedRows = Object.keys(seatRows).sort((a, b) => parseInt(a) - parseInt(b));

    return (
      <div className="seat-deck mb-4">
        <h6 className="text-muted mb-3">{deck.deckType} Deck</h6>
        
        <div className="seat-map">
          {sortedRows.map((row) => (
            <div key={row} className="seat-row">
              <div className="seat-row-number">{row}</div>
              <div className="seat-row-seats">
                {seatRows[row]
                  .sort((a, b) => a.number.localeCompare(b.number))
                  .map((seat) => renderSeat(seat))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render legend
  const renderLegend = () => (
    <div className="seat-legend">
      <div className="legend-item">
        <div className="seat seat-available"></div>
        <span>Available</span>
      </div>
      <div className="legend-item">
        <div className="seat seat-selected"></div>
        <span>Selected</span>
      </div>
      <div className="legend-item">
        <div className="seat seat-unavailable"></div>
        <span>Occupied</span>
      </div>
      <div className="legend-item">
        <div className="seat seat-extra-legroom seat-available"></div>
        <span>Extra Legroom</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading seat maps...</span>
        </div>
        <p className="mt-3 text-muted">Loading seat maps...</p>
      </div>
    );
  }

  if (!seatMaps || seatMaps.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i className="mdi mdi-seat" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h4 className="mt-3">Seat Selection Not Available</h4>
          <p className="text-muted">
            Seat maps are not available for this flight. You can select seats during check-in.
          </p>
          <button className="btn btn-primary mt-3" onClick={onSkip}>
            Continue Without Seats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4>Select Your Seats</h4>
        <p className="text-muted">
          Choose your preferred seats for the flight. Some seats may have additional charges.
        </p>
      </div>

      {/* Current Selection Info */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h6 className="mb-2">
                <i className="mdi mdi-airplane me-2"></i>
                {currentSeatMap?.carrierCode} {currentSeatMap?.number}
              </h6>
              <p className="mb-0 text-muted small">
                {currentSeatMap?.departure?.iataCode} → {currentSeatMap?.arrival?.iataCode}
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <h6 className="mb-2">
                <i className="mdi mdi-account me-2"></i>
                Selecting for: {currentTraveler?.name?.firstName} {currentTraveler?.name?.lastName}
              </h6>
              <p className="mb-0 text-muted small">
                Traveler {currentTravelerIndex + 1} of {travelers.length}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="progress mt-3" style={{ height: '5px' }}>
            <div
              className="progress-bar"
              style={{
                width: `${((currentSegmentIndex * travelers.length + currentTravelerIndex) /
                  (seatMaps.length * travelers.length)) *
                  100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="card mb-4">
        <div className="card-body">
          {/* Legend */}
          {renderLegend()}

          {/* Deck(s) */}
          {currentSeatMap?.decks?.map((deck, index) => (
            <div key={index}>{renderDeck(deck)}</div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex justify-content-between">
        <button className="btn btn-outline-secondary" onClick={onSkip}>
          <i className="mdi mdi-skip-next me-2"></i>
          Skip Seat Selection
        </button>

        <div className="d-flex gap-2">
          {(currentTravelerIndex > 0 || currentSegmentIndex > 0) && (
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                if (currentTravelerIndex > 0) {
                  setCurrentTravelerIndex(currentTravelerIndex - 1);
                } else if (currentSegmentIndex > 0) {
                  setCurrentSegmentIndex(currentSegmentIndex - 1);
                  setCurrentTravelerIndex(travelers.length - 1);
                }
              }}
            >
              <i className="mdi mdi-chevron-left me-2"></i>
              Previous
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={onContinue}
            disabled={Object.keys(selectedSeats).length === 0}
          >
            Continue to Payment
            <i className="mdi mdi-chevron-right ms-2"></i>
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .seat-map {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 20px 0;
        }

        .seat-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .seat-row-number {
          width: 30px;
          text-align: center;
          font-weight: 600;
          color: #666;
        }

        .seat-row-seats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .seat {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .seat-available {
          background: #d4edda;
          border: 2px solid #28a745;
          color: #155724;
        }

        .seat-available:hover {
          background: #28a745;
          color: white;
          transform: scale(1.1);
        }

        .seat-selected {
          background: #007bff;
          border: 2px solid #0056b3;
          color: white;
        }

        .seat-unavailable {
          background: #f8f9fa;
          border: 2px solid #dee2e6;
          color: #6c757d;
          cursor: not-allowed;
        }

        .seat-extra-legroom {
          border-color: #ffc107;
        }

        .seat-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ffc107;
          color: #000;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .seat-price {
          position: absolute;
          bottom: -18px;
          font-size: 9px;
          white-space: nowrap;
          color: #666;
        }

        .seat-legend {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-item .seat {
          width: 30px;
          height: 30px;
          cursor: default;
        }

        .legend-item .seat:hover {
          transform: none;
        }
      `}</style>
    </div>
  );
};

export default SeatSelection;

