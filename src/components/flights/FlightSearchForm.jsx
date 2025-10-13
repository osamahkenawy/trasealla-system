'use client';

import { useState, useEffect } from 'react';
import AirportAutocomplete from './AirportAutocomplete';
import { TRAVEL_CLASSES, TRAVEL_CLASS_LABELS } from '@/services/flightsService';
import CustomFlatpickr from '@/components/CustomFlatpickr';
import './FlightSearchForm.scss';

/**
 * Flight Search Form Component
 */
const FlightSearchForm = ({
  onSearch,
  isSearching = false,
  initialValues = null
}) => {
  const [tripType, setTripType] = useState('roundtrip'); // oneway, roundtrip
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 2,
    children: 0,
    infants: 0
  });
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [nonStop, setNonStop] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);

  // Initialize with values if provided
  useEffect(() => {
    if (initialValues) {
      if (initialValues.origin) setOrigin(initialValues.origin);
      if (initialValues.destination) setDestination(initialValues.destination);
      if (initialValues.departureDate) setDepartureDate(initialValues.departureDate);
      if (initialValues.returnDate) {
        setReturnDate(initialValues.returnDate);
        setTripType('roundtrip');
      }
      if (initialValues.passengers) setPassengers(initialValues.passengers);
      if (initialValues.travelClass) setTravelClass(initialValues.travelClass);
      if (initialValues.nonStop !== undefined) setNonStop(initialValues.nonStop);
    }
  }, [initialValues]);

  // Update trip type when return date is cleared
  useEffect(() => {
    if (tripType === 'oneway' && returnDate) {
      setReturnDate(null);
    }
  }, [tripType, returnDate]);

  // Clear date errors when dates are selected
  useEffect(() => {
    if (departureDate && departureDate.trim() !== '') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.departureDate;
        return newErrors;
      });
    }
  }, [departureDate]);

  useEffect(() => {
    if (returnDate && returnDate.trim() !== '') {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.returnDate;
        return newErrors;
      });
    }
  }, [returnDate]);

  // Update passenger count
  const updatePassengerCount = (type, value) => {
    const newValue = Math.max(0, Math.min(9, value));
    
    setPassengers((prev) => {
      const updated = { ...prev, [type]: newValue };
      
      // Validation: Infants cannot exceed adults
      if (type === 'infants' && updated.infants > updated.adults) {
        updated.infants = updated.adults;
      }
      if (type === 'adults' && updated.adults < updated.infants) {
        updated.infants = updated.adults;
      }
      
      return updated;
    });
  };

  // Calculate total passengers
  const getTotalPassengers = () => {
    return passengers.adults + passengers.children + passengers.infants;
  };

  // Get passenger summary text
  const getPassengerSummary = () => {
    const parts = [];
    if (passengers.adults > 0) parts.push(`${passengers.adults} Adult${passengers.adults > 1 ? 's' : ''}`);
    if (passengers.children > 0) parts.push(`${passengers.children} Child${passengers.children > 1 ? 'ren' : ''}`);
    if (passengers.infants > 0) parts.push(`${passengers.infants} Infant${passengers.infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  // Format date for display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!origin) {
      newErrors.origin = 'Please select origin airport';
    }

    if (!destination) {
      newErrors.destination = 'Please select destination airport';
    }

    if (origin && destination && origin.code === destination.code) {
      newErrors.destination = 'Destination must be different from origin';
    }

    if (!departureDate || departureDate.trim() === '') {
      newErrors.departureDate = 'Please select departure date';
    }

    if (tripType === 'roundtrip') {
      if (!returnDate || returnDate.trim() === '') {
        newErrors.returnDate = 'Please select return date for round trip';
      }
    }

    if (departureDate && returnDate && departureDate.trim() !== '' && returnDate.trim() !== '') {
      const depDate = new Date(departureDate);
      const retDate = new Date(returnDate);
      
      if (depDate >= retDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }

    if (getTotalPassengers() === 0) {
      newErrors.passengers = 'At least one passenger is required';
    }

    if (getTotalPassengers() > 9) {
      newErrors.passengers = 'Maximum 9 passengers allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const searchParams = {
      origin: origin.code,
      destination: destination.code,
      departureDate: departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      travelClass: travelClass,
      nonStop: nonStop,
      currencyCode: 'AED'
    };

    onSearch(searchParams);
  };

  return (
    <div className="flight-search-form-compact">
      <form onSubmit={handleSubmit}>
        <div className="search-container">
          {/* Trip Type Dropdown */}
          <div className="trip-type-selector">
            <select
              className="form-select"
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
            >
              <option value="oneway">→ One-way</option>
              <option value="roundtrip">⇄ Round-trip</option>
            </select>
          </div>

          {/* Main Search Row */}
          <div className="search-fields-row">
            {/* Flying From */}
            <div className="search-field flying-from">
              <label className="field-label">Flying from</label>
              <div className="field-value">
                <AirportAutocomplete
                  placeholder="Select airport or city"
                  value={origin}
                  onChange={setOrigin}
                  error={errors.origin}
                  compact={true}
                  searchMode="duffel-locations"
                />
              </div>
            </div>

            {/* Flying To */}
            <div className="search-field flying-to">
              <label className="field-label">Flying to</label>
              <div className="field-value">
                <AirportAutocomplete
                  placeholder="Select airport or city"
                  value={destination}
                  onChange={setDestination}
                  error={errors.destination}
                  compact={true}
                  searchMode="duffel-locations"
                />
              </div>
            </div>

            {/* Depart Date */}
            <div className="search-field depart-date">
              <label className="field-label">Depart</label>
              <div className="field-value">
                <CustomFlatpickr
                  value={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  options={{
                    minDate: 'today',
                    dateFormat: 'Y-m-d'
                  }}
                  placeholder="Select date"
                  className={`form-control-compact ${errors.departureDate ? 'is-invalid' : ''}`}
                />
                <div className="date-display">
                  {departureDate ? formatDateDisplay(departureDate) : 'Select date'}
                </div>
              </div>
              {errors.departureDate && (
                <div className="field-error">{errors.departureDate}</div>
              )}
            </div>

            {/* Return Date (if round trip) */}
            {tripType === 'roundtrip' && (
              <div className="search-field return-date">
                <label className="field-label">Return</label>
                <div className="field-value">
                  <CustomFlatpickr
                    value={returnDate}
                    onChange={(date) => setReturnDate(date)}
                    options={{
                      minDate: departureDate || 'today',
                      dateFormat: 'Y-m-d'
                    }}
                    placeholder="Select date"
                    className={`form-control-compact ${errors.returnDate ? 'is-invalid' : ''}`}
                  />
                  <div className="date-display">
                    {returnDate ? formatDateDisplay(returnDate) : 'Select date'}
                  </div>
                </div>
                {errors.returnDate && (
                  <div className="field-error">{errors.returnDate}</div>
                )}
              </div>
            )}

            {/* Passengers & Class */}
            <div className="search-field passengers-class">
              <label className="field-label">Passengers</label>
              <div className="field-value">
                <div className="dropdown">
                  <button
                    type="button"
                    className={`btn-compact ${errors.passengers ? 'is-invalid' : ''}`}
                    onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  >
                    <div className="passenger-summary">
                      <div className="passenger-count">{getPassengerSummary()}</div>
                      <div className="travel-class-badge">{TRAVEL_CLASS_LABELS[travelClass]}</div>
                    </div>
                    <i className="mdi mdi-chevron-down"></i>
                  </button>
                  
                  {showPassengerDropdown && (
                    <>
                      <div 
                        className="dropdown-backdrop" 
                        onClick={() => setShowPassengerDropdown(false)}
                      ></div>
                      <div className="dropdown-menu-compact show">
                        {/* Travel Class Selection */}
                        <div className="passenger-section">
                          <h6 className="section-title">Travel Class</h6>
                          <div className="class-options">
                            {Object.keys(TRAVEL_CLASSES).map((key) => (
                              <button
                                key={key}
                                type="button"
                                className={`class-option ${travelClass === TRAVEL_CLASSES[key] ? 'active' : ''}`}
                                onClick={() => setTravelClass(TRAVEL_CLASSES[key])}
                              >
                                {TRAVEL_CLASS_LABELS[TRAVEL_CLASSES[key]]}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        {/* Passenger Counts */}
                        <div className="passenger-section">
                          <h6 className="section-title">Passengers</h6>
                          
                          {/* Adults */}
                          <div className="passenger-row">
                            <div className="passenger-info">
                              <div className="passenger-type">Adults</div>
                              <small className="passenger-desc">12+ years</small>
                            </div>
                            <div className="passenger-counter">
                              <button
                                type="button"
                                className="btn-counter"
                                onClick={() => updatePassengerCount('adults', passengers.adults - 1)}
                                disabled={passengers.adults <= 1}
                              >
                                <i className="mdi mdi-minus"></i>
                              </button>
                              <span className="counter-value">{passengers.adults}</span>
                              <button
                                type="button"
                                className="btn-counter"
                                onClick={() => updatePassengerCount('adults', passengers.adults + 1)}
                                disabled={getTotalPassengers() >= 9}
                              >
                                <i className="mdi mdi-plus"></i>
                              </button>
                            </div>
                          </div>

                          {/* Children */}
                          <div className="passenger-row">
                            <div className="passenger-info">
                              <div className="passenger-type">Children</div>
                              <small className="passenger-desc">2-11 years</small>
                            </div>
                            <div className="passenger-counter">
                              <button
                                type="button"
                                className="btn-counter"
                                onClick={() => updatePassengerCount('children', passengers.children - 1)}
                                disabled={passengers.children <= 0}
                              >
                                <i className="mdi mdi-minus"></i>
                              </button>
                              <span className="counter-value">{passengers.children}</span>
                              <button
                                type="button"
                                className="btn-counter"
                                onClick={() => updatePassengerCount('children', passengers.children + 1)}
                                disabled={getTotalPassengers() >= 9}
                              >
                                <i className="mdi mdi-plus"></i>
                              </button>
                            </div>
                          </div>

                          {/* Infants */}
                          <div className="passenger-row">
                            <div className="passenger-info">
                              <div className="passenger-type">Infants</div>
                              <small className="passenger-desc">Under 2 years</small>
                            </div>
                            <div className="passenger-counter">
                              <button
                                type="button"
                                className="btn-counter"
                                onClick={() => updatePassengerCount('infants', passengers.infants - 1)}
                                disabled={passengers.infants <= 0}
                              >
                                <i className="mdi mdi-minus"></i>
                              </button>
                              <span className="counter-value">{passengers.infants}</span>
                              <button
                                type="button"
                                className="btn-counter"
                                onClick={() => updatePassengerCount('infants', passengers.infants + 1)}
                                disabled={passengers.infants >= passengers.adults || getTotalPassengers() >= 9}
                              >
                                <i className="mdi mdi-plus"></i>
                              </button>
                            </div>
                          </div>

                          <div className="passenger-note">
                            <i className="mdi mdi-information"></i>
                            <small>Infants must be accompanied by adults</small>
                          </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        {/* Direct Flights Option */}
                        <div className="passenger-section">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="nonStop"
                              checked={nonStop}
                              onChange={(e) => setNonStop(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="nonStop">
                              Direct flights only
                            </label>
                          </div>
                        </div>

                        <div className="dropdown-actions">
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            onClick={() => setShowPassengerDropdown(false)}
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {errors.passengers && (
                <div className="field-error">{errors.passengers}</div>
              )}
            </div>

            {/* Search Button */}
            <div className="search-button-container">
              <button
                type="submit"
                className="btn-search"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-magnify"></i>
                    <span className="search-text">Search</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FlightSearchForm;
