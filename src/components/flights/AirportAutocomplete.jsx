'use client';

import { useState, useEffect, useRef } from 'react';
import { searchAirports } from '@/services/flightsService';

/**
 * Airport Autocomplete Component
 * Provides search and selection functionality for airports
 */
const AirportAutocomplete = ({
  value,
  onChange,
  placeholder = 'Search airport...',
  label,
  error,
  required = false,
  disabled = false,
  icon = '✈️',
  compact = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Update display value when value prop changes
  useEffect(() => {
    if (value) {
      // Display format: CODE - Title (City if different)
      const displayText = value.city && value.city !== value.title
        ? `${value.code} - ${value.title} (${value.city})`
        : `${value.code} - ${value.title}`;
      setQuery(displayText);
    } else {
      setQuery('');
    }
  }, [value]);

  // Handle search with debounce
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await searchAirports(query, 10);
        const airports = response.airports || [];
        setResults(airports);
        setIsOpen(airports.length > 0);
      } catch (error) {
        console.error('Airport search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle input change
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setHighlightedIndex(-1);

    // Clear selection if input is cleared
    if (!newQuery && value) {
      onChange(null);
    }
  };

  // Handle airport selection
  const handleSelect = (airport) => {
    const displayText = airport.city && airport.city !== airport.title
      ? `${airport.code} - ${airport.title} (${airport.city})`
      : `${airport.code} - ${airport.title}`;
    setQuery(displayText);
    onChange(airport);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex]);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    }
  };

  // Group airports by country
  const groupedResults = results.reduce((acc, airport) => {
    const country = airport.country || 'Other';
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(airport);
    return acc;
  }, {});

  return (
    <div className={`position-relative ${compact ? 'airport-autocomplete' : ''}`}>
      {!compact && label && (
        <label className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="position-relative">
        {!compact && (
          <span className="position-absolute top-50 start-0 translate-middle-y ms-3" style={{ fontSize: '1.2rem' }}>
            {icon}
          </span>
        )}
        
        <input
          ref={inputRef}
          type="text"
          className={`form-control ${compact ? '' : 'ps-5'} ${error ? 'is-invalid' : ''}`}
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />

        {isLoading && (
          <span className="position-absolute top-50 end-0 translate-middle-y me-3">
            <span className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </span>
          </span>
        )}
      </div>

      {!compact && error && (
        <div className="invalid-feedback d-block">{error}</div>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className={`dropdown-menu show w-100 shadow-lg ${compact ? 'autocomplete-dropdown' : ''}`}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 1050
          }}
        >
          {Object.keys(groupedResults).map((country) => (
            <div key={country}>
              {Object.keys(groupedResults).length > 1 && (
                <h6 className="dropdown-header text-muted">{country}</h6>
              )}
              
              {groupedResults[country].map((airport, index) => {
                const globalIndex = results.indexOf(airport);
                return (
                  <button
                    key={`${airport.code}-${index}`}
                    type="button"
                    className={`dropdown-item d-flex align-items-center py-2 ${
                      highlightedIndex === globalIndex ? 'active' : ''
                    }`}
                    onClick={() => handleSelect(airport)}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                  >
                    <span className="me-2" style={{ fontSize: '1.2rem' }}>✈️</span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">
                        <span className="text-primary">{airport.code}</span>
                        <span className="mx-1">-</span>
                        <span>{airport.title}</span>
                      </div>
                      {airport.city && airport.city !== airport.title && (
                        <small className="text-muted">{airport.city}</small>
                      )}
                    </div>
                    {airport.country && (
                      <small className="text-muted ms-2">{airport.country}</small>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
        <div
          ref={dropdownRef}
          className="dropdown-menu show w-100 shadow"
          style={{ zIndex: 1050 }}
        >
          <div className="dropdown-item-text text-muted text-center py-3">
            No airports found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportAutocomplete;

