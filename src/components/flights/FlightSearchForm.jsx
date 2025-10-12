'use client';

import { useState, useEffect } from 'react';
import AirportAutocomplete from './AirportAutocomplete';
import { TRAVEL_CLASSES, TRAVEL_CLASS_LABELS } from '@/services/flightsService';
import CustomFlatpickr from '@/components/CustomFlatpickr';

/**
 * Flight Search Form Component
 */
const FlightSearchForm = ({
  onSearch,
  isSearching = false,
  initialValues = null
}) => {
  const [tripType, setTripType] = useState('roundtrip'); // oneway, roundtrip, multicity
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [nonStop, setNonStop] = useState(false);
  const [flexibleDates, setFlexibleDates] = useState(false);
  
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
    if (tripType === 'roundtrip' && !returnDate) {
      // User cleared return date, but don't auto-switch
    }
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

  // Swap origin and destination
  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

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

    // Check if departureDate is a valid string with length > 0
    if (!departureDate || departureDate.trim() === '') {
      newErrors.departureDate = 'Please select departure date';
    }

    // For round trip, validate return date
    if (tripType === 'roundtrip') {
      if (!returnDate || returnDate.trim() === '') {
        newErrors.returnDate = 'Please select return date for round trip';
      }
    }

    // Only validate date comparison if both dates are provided
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
    <div className="card shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Trip Type Selector */}
          <div className="mb-4">
            <div className="btn-group" role="group">
              <input
                type="radio"
                className="btn-check"
                name="tripType"
                id="roundtrip"
                checked={tripType === 'roundtrip'}
                onChange={() => setTripType('roundtrip')}
              />
              <label className="btn btn-outline-primary" htmlFor="roundtrip">
                <i className="mdi mdi-airplane-takeoff me-1"></i>
                Round Trip
              </label>

              <input
                type="radio"
                className="btn-check"
                name="tripType"
                id="oneway"
                checked={tripType === 'oneway'}
                onChange={() => setTripType('oneway')}
              />
              <label className="btn btn-outline-primary" htmlFor="oneway">
                <i className="mdi mdi-airplane me-1"></i>
                One Way
              </label>
            </div>
          </div>

          <div className="row g-3">
            {/* Origin Airport */}
            <div className="col-md-6 col-lg-3">
              <AirportAutocomplete
                label="From"
                placeholder="Origin airport"
                value={origin}
                onChange={setOrigin}
                error={errors.origin}
                required
                icon="🛫"
              />
            </div>

            {/* Swap Button */}
            <div className="col-auto d-none d-lg-flex align-items-end pb-2">
              <button
                type="button"
                className="btn btn-light btn-icon"
                onClick={handleSwapAirports}
                title="Swap airports"
              >
                <i className="mdi mdi-swap-horizontal"></i>
              </button>
            </div>

            {/* Destination Airport */}
            <div className="col-md-6 col-lg-3">
              <AirportAutocomplete
                label="To"
                placeholder="Destination airport"
                value={destination}
                onChange={setDestination}
                error={errors.destination}
                required
                icon="🛬"
              />
            </div>

            {/* Departure Date */}
            <div className="col-md-6 col-lg-2">
              <label className="form-label">
                Departure <span className="text-danger">*</span>
              </label>
              <CustomFlatpickr
                value={departureDate}
                onChange={(date) => setDepartureDate(date)}
                options={{
                  minDate: 'today',
                  dateFormat: 'Y-m-d'
                }}
                placeholder="Select date"
                className={errors.departureDate ? 'is-invalid' : ''}
              />
              {errors.departureDate && (
                <div className="invalid-feedback d-block">{errors.departureDate}</div>
              )}
            </div>

            {/* Return Date */}
            <div className="col-md-6 col-lg-2">
              <label className="form-label">
                Return {tripType === 'roundtrip' && <span className="text-danger">*</span>}
              </label>
              <CustomFlatpickr
                value={returnDate}
                onChange={(date) => setReturnDate(date)}
                options={{
                  minDate: departureDate || 'today',
                  dateFormat: 'Y-m-d'
                }}
                placeholder={tripType === 'oneway' ? 'One way' : 'Select date'}
                className={errors.returnDate ? 'is-invalid' : ''}
                disabled={tripType === 'oneway'}
              />
              {errors.returnDate && (
                <div className="invalid-feedback d-block">{errors.returnDate}</div>
              )}
            </div>

            {/* Passengers Dropdown */}
            <div className="col-md-6 col-lg-2">
              <label className="form-label">
                Passengers <span className="text-danger">*</span>
              </label>
              <div className="dropdown">
                <button
                  type="button"
                  className={`btn btn-light dropdown-toggle w-100 text-start ${
                    errors.passengers ? 'is-invalid' : ''
                  }`}
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                >
                  <i className="mdi mdi-account-multiple me-1"></i>
                  {getTotalPassengers()} {getTotalPassengers() === 1 ? 'Passenger' : 'Passengers'}
                </button>
                
                {showPassengerDropdown && (
                  <div className="dropdown-menu show w-100 p-3 shadow-lg" style={{ minWidth: '280px' }}>
                    {/* Adults */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-semibold">Adults</div>
                        <small className="text-muted">12+ years</small>
                      </div>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updatePassengerCount('adults', passengers.adults - 1)}
                          disabled={passengers.adults <= 1}
                        >
                          <i className="mdi mdi-minus"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                          {passengers.adults}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updatePassengerCount('adults', passengers.adults + 1)}
                          disabled={getTotalPassengers() >= 9}
                        >
                          <i className="mdi mdi-plus"></i>
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-semibold">Children</div>
                        <small className="text-muted">2-11 years</small>
                      </div>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updatePassengerCount('children', passengers.children - 1)}
                          disabled={passengers.children <= 0}
                        >
                          <i className="mdi mdi-minus"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                          {passengers.children}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updatePassengerCount('children', passengers.children + 1)}
                          disabled={getTotalPassengers() >= 9}
                        >
                          <i className="mdi mdi-plus"></i>
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="fw-semibold">Infants</div>
                        <small className="text-muted">Under 2 years</small>
                      </div>
                      <div className="btn-group" role="group">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updatePassengerCount('infants', passengers.infants - 1)}
                          disabled={passengers.infants <= 0}
                        >
                          <i className="mdi mdi-minus"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                          {passengers.infants}
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => updatePassengerCount('infants', passengers.infants + 1)}
                          disabled={passengers.infants >= passengers.adults || getTotalPassengers() >= 9}
                        >
                          <i className="mdi mdi-plus"></i>
                        </button>
                      </div>
                    </div>

                    <small className="text-muted">
                      <i className="mdi mdi-information me-1"></i>
                      Infants must be accompanied by adults
                    </small>

                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-sm btn-primary w-100"
                        onClick={() => setShowPassengerDropdown(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {errors.passengers && (
                <div className="invalid-feedback d-block">{errors.passengers}</div>
              )}
            </div>

            {/* Travel Class */}
            <div className="col-md-6 col-lg-2">
              <label className="form-label">Travel Class</label>
              <select
                className="form-select"
                value={travelClass}
                onChange={(e) => setTravelClass(e.target.value)}
              >
                {Object.keys(TRAVEL_CLASSES).map((key) => (
                  <option key={key} value={TRAVEL_CLASSES[key]}>
                    {TRAVEL_CLASS_LABELS[TRAVEL_CLASSES[key]]}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Options */}
            <div className="col-12">
              <div className="d-flex gap-3 flex-wrap">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="nonStop"
                    checked={nonStop}
                    onChange={(e) => setNonStop(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="nonStop">
                    Non-stop flights only
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexibleDates"
                    checked={flexibleDates}
                    onChange={(e) => setFlexibleDates(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="flexibleDates">
                    Flexible dates (±3 days)
                  </label>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Searching Flights...
                  </>
                ) : (
                  <>
                    <i className="mdi mdi-magnify me-2"></i>
                    Search Flights
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightSearchForm;

