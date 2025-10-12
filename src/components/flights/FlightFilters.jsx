'use client';

import { useState, useEffect } from 'react';
import { getCurrencySymbol } from '@/services/flightsService';

/**
 * Flight Filters Component
 * Sidebar filters for flight search results
 */
const FlightFilters = ({ filters, onFilterChange, onClearAll, resultsCount = 0 }) => {
  const [priceRange, setPriceRange] = useState([0, 50000]);

  // Update local price range when filters change
  useEffect(() => {
    if (filters?.selectedPriceRange) {
      setPriceRange([filters.selectedPriceRange.min, filters.selectedPriceRange.max]);
    }
  }, [filters?.selectedPriceRange]);

  // Handle price range change
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([filters.priceRange.min, value]);
  };

  // Apply price filter
  const applyPriceFilter = () => {
    onFilterChange({
      selectedPriceRange: {
        min: filters.priceRange.min,
        max: priceRange[1]
      }
    });
  };

  // Toggle airline filter
  const toggleAirline = (airlineCode) => {
    const updatedAirlines = filters.airlines.map((airline) =>
      airline.code === airlineCode
        ? { ...airline, selected: !airline.selected }
        : airline
    );
    onFilterChange({ airlines: updatedAirlines });
  };

  // Toggle stops filter
  const toggleStops = (value) => {
    const updatedStops = filters.stops.map((stop) =>
      stop.value === value
        ? { ...stop, selected: !stop.selected }
        : stop
    );
    onFilterChange({ stops: updatedStops });
  };

  // Toggle time filter
  const toggleTime = (type, value) => {
    const filterKey = type === 'departure' ? 'departureTime' : 'arrivalTime';
    const updatedTimes = filters[filterKey].map((time) =>
      time.value === value
        ? { ...time, selected: !time.selected }
        : time
    );
    onFilterChange({ [filterKey]: updatedTimes });
  };

  const currencySymbol = getCurrencySymbol('AED');

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="mdi mdi-filter-variant me-2"></i>
          Filters
        </h5>
        <button
          className="btn btn-sm btn-link text-decoration-none"
          onClick={onClearAll}
        >
          Clear All
        </button>
      </div>

      <div className="card-body">
        {/* Results Count */}
        <div className="alert alert-info">
          <i className="mdi mdi-airplane me-2"></i>
          <strong>{resultsCount}</strong> flights found
        </div>

        {/* Price Range Filter */}
        <div className="mb-4">
          <h6 className="mb-3">Price Range</h6>
          <div className="px-2">
            <input
              type="range"
              className="form-range"
              min={filters?.priceRange?.min || 0}
              max={filters?.priceRange?.max || 50000}
              step="100"
              value={priceRange[1]}
              onChange={handlePriceChange}
              onMouseUp={applyPriceFilter}
              onTouchEnd={applyPriceFilter}
            />
            <div className="d-flex justify-content-between mt-2">
              <span className="text-muted small">
                {currencySymbol}{filters?.priceRange?.min?.toFixed(0) || 0}
              </span>
              <span className="fw-semibold text-primary">
                {currencySymbol}{priceRange[1].toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <hr />

        {/* Stops Filter */}
        <div className="mb-4">
          <h6 className="mb-3">Number of Stops</h6>
          {filters?.stops?.map((stop) => (
            <div key={stop.value} className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id={`stops-${stop.value}`}
                checked={stop.selected}
                onChange={() => toggleStops(stop.value)}
              />
              <label className="form-check-label" htmlFor={`stops-${stop.value}`}>
                {stop.label}
              </label>
            </div>
          ))}
        </div>

        <hr />

        {/* Airlines Filter */}
        {filters?.airlines && filters.airlines.length > 0 && (
          <>
            <div className="mb-4">
              <h6 className="mb-3">Airlines</h6>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {filters.airlines.map((airline) => (
                  <div key={airline.code} className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`airline-${airline.code}`}
                      checked={airline.selected}
                      onChange={() => toggleAirline(airline.code)}
                    />
                    <label className="form-check-label" htmlFor={`airline-${airline.code}`}>
                      <span className="me-2">✈️</span>
                      {airline.code}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <hr />
          </>
        )}

        {/* Departure Time Filter */}
        <div className="mb-4">
          <h6 className="mb-3">Departure Time</h6>
          {filters?.departureTime?.map((time) => (
            <div key={time.value} className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id={`dept-${time.value}`}
                checked={time.selected}
                onChange={() => toggleTime('departure', time.value)}
              />
              <label className="form-check-label" htmlFor={`dept-${time.value}`}>
                <i className={`mdi mdi-${getTimeIcon(time.value)} me-2`}></i>
                {time.label}
              </label>
            </div>
          ))}
        </div>

        <hr />

        {/* Arrival Time Filter */}
        <div className="mb-4">
          <h6 className="mb-3">Arrival Time</h6>
          {filters?.arrivalTime?.map((time) => (
            <div key={time.value} className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id={`arr-${time.value}`}
                checked={time.selected}
                onChange={() => toggleTime('arrival', time.value)}
              />
              <label className="form-check-label" htmlFor={`arr-${time.value}`}>
                <i className={`mdi mdi-${getTimeIcon(time.value)} me-2`}></i>
                {time.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get time icon
const getTimeIcon = (timeValue) => {
  switch (timeValue) {
    case 'morning':
      return 'weather-sunny';
    case 'afternoon':
      return 'weather-cloudy';
    case 'evening':
      return 'weather-sunset';
    case 'night':
      return 'weather-night';
    default:
      return 'clock-outline';
  }
};

export default FlightFilters;

