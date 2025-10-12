'use client';

import { useState } from 'react';
import FlightCard from './FlightCard';
import FlightFilters from './FlightFilters';
import FlightDetailsModal from './FlightDetailsModal';

/**
 * Flight Results List Component
 * Displays search results with filters and sorting
 */
const FlightResultsList = ({
  flights = [],
  filters,
  sortBy,
  onFilterChange,
  onSortChange,
  onClearFilters,
  onSelectFlight,
  isLoading = false
}) => {
  const [selectedFlightForDetails, setSelectedFlightForDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Handle view details
  const handleViewDetails = (flight) => {
    setSelectedFlightForDetails(flight);
    setShowDetailsModal(true);
  };

  // Handle close details modal
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedFlightForDetails(null);
  };

  // Handle select from details modal
  const handleSelectFromDetails = (flight) => {
    handleCloseDetails();
    onSelectFlight(flight);
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Searching for the best flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {/* Filters Sidebar */}
        <div className="col-lg-3">
          <div className="sticky-top" style={{ top: '20px' }}>
            <FlightFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onClearAll={onClearFilters}
              resultsCount={flights.length}
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="col-lg-9">
          {/* Sort Bar */}
          <div className="card shadow-sm mb-3">
            <div className="card-body py-2">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">
                    <strong>{flights.length}</strong> flight{flights.length !== 1 ? 's' : ''} available
                  </h5>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-md-end gap-2">
                    <label className="mb-0 text-muted">Sort by:</label>
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 'auto' }}
                      value={sortBy}
                      onChange={(e) => onSortChange(e.target.value)}
                    >
                      <option value="recommended">Recommended</option>
                      <option value="cheapest">Cheapest First</option>
                      <option value="fastest">Fastest First</option>
                      <option value="earliest">Earliest Departure</option>
                      <option value="latest">Latest Departure</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Cards */}
          {flights.length > 0 ? (
            <div>
              {flights.map((flight, index) => (
                <FlightCard
                  key={flight.id || index}
                  flight={flight}
                  onSelect={onSelectFlight}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="mdi mdi-airplane-off" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                <h4 className="mt-3">No flights found</h4>
                <p className="text-muted">
                  Try adjusting your filters or search criteria to see more results.
                </p>
                <button
                  className="btn btn-primary mt-3"
                  onClick={onClearFilters}
                >
                  <i className="mdi mdi-filter-remove me-2"></i>
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Flight Details Modal */}
      {showDetailsModal && selectedFlightForDetails && (
        <FlightDetailsModal
          flight={selectedFlightForDetails}
          onClose={handleCloseDetails}
          onSelect={handleSelectFromDetails}
        />
      )}
    </div>
  );
};

export default FlightResultsList;

