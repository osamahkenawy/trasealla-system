'use client';

import { useState, useEffect } from 'react';
import CustomFlatpickr from '@/components/CustomFlatpickr';
import { GENDER_OPTIONS, DOCUMENT_TYPES, MEAL_PREFERENCES, SPECIAL_SERVICES } from '@/services/flightsService';

/**
 * Traveler Form Component
 * Form for collecting traveler information including passport details
 */
const TravelerForm = ({ 
  travelers = [],
  passengerCounts,
  onTravelersChange,
  onValidate
}) => {
  const [travelersData, setTravelersData] = useState([]);
  const [errors, setErrors] = useState({});
  const [expandedTraveler, setExpandedTraveler] = useState(0);

  // Initialize travelers based on passenger counts
  useEffect(() => {
    if (!travelers || travelers.length === 0) {
      const initialTravelers = [];
      let travelerId = 1;

      // Add adults
      for (let i = 0; i < (passengerCounts?.adults || 1); i++) {
        initialTravelers.push(createEmptyTraveler(travelerId++, 'ADULT'));
      }

      // Add children
      for (let i = 0; i < (passengerCounts?.children || 0); i++) {
        initialTravelers.push(createEmptyTraveler(travelerId++, 'CHILD'));
      }

      // Add infants
      for (let i = 0; i < (passengerCounts?.infants || 0); i++) {
        initialTravelers.push(createEmptyTraveler(travelerId++, 'INFANT'));
      }

      setTravelersData(initialTravelers);
      onTravelersChange(initialTravelers);
    } else {
      setTravelersData(travelers);
    }
  }, [passengerCounts]);

  // Create empty traveler object
  const createEmptyTraveler = (id, type) => ({
    id: String(id),
    travelerType: type,
    name: {
      firstName: '',
      lastName: '',
      title: type === 'CHILD' || type === 'INFANT' ? 'MSTR' : 'MR'
    },
    dateOfBirth: '',
    gender: 'MALE',
    contact: {
      emailAddress: '',
      phones: [
        {
          deviceType: 'MOBILE',
          countryCallingCode: '971',
          number: ''
        }
      ]
    },
    documents: [
      {
        documentType: 'PASSPORT',
        number: '',
        expiryDate: '',
        issuanceDate: '',
        issuanceCountry: '',
        issuanceLocation: '',
        nationality: '',
        birthPlace: '',
        holder: true
      }
    ],
    specialRequests: {
      meal: '',
      wheelchair: '',
      other: ''
    }
  });

  // Update traveler field
  const updateTravelerField = (index, path, value) => {
    const updated = [...travelersData];
    const pathArray = path.split('.');
    
    let current = updated[index];
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;

    setTravelersData(updated);
    onTravelersChange(updated);

    // Clear error for this field
    const errorKey = `${index}.${path}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    travelersData.forEach((traveler, index) => {
      // Name validation
      if (!traveler.name.firstName?.trim()) {
        newErrors[`${index}.name.firstName`] = 'First name is required';
      }
      if (!traveler.name.lastName?.trim()) {
        newErrors[`${index}.name.lastName`] = 'Last name is required';
      }

      // Date of birth validation
      if (!traveler.dateOfBirth) {
        newErrors[`${index}.dateOfBirth`] = 'Date of birth is required';
      } else {
        const age = calculateAge(traveler.dateOfBirth);
        if (traveler.travelerType === 'ADULT' && age < 12) {
          newErrors[`${index}.dateOfBirth`] = 'Adults must be 12+ years old';
        } else if (traveler.travelerType === 'CHILD' && (age < 2 || age >= 12)) {
          newErrors[`${index}.dateOfBirth`] = 'Children must be 2-11 years old';
        } else if (traveler.travelerType === 'INFANT' && age >= 2) {
          newErrors[`${index}.dateOfBirth`] = 'Infants must be under 2 years old';
        }
      }

      // Contact info (only for first traveler/primary)
      if (index === 0) {
        if (!traveler.contact.emailAddress) {
          newErrors[`${index}.contact.emailAddress`] = 'Email is required';
        } else if (!isValidEmail(traveler.contact.emailAddress)) {
          newErrors[`${index}.contact.emailAddress`] = 'Invalid email format';
        }

        if (!traveler.contact.phones[0].number) {
          newErrors[`${index}.contact.phones.0.number`] = 'Phone number is required';
        }
      }

      // Passport validation
      const passport = traveler.documents[0];
      if (!passport.number?.trim()) {
        newErrors[`${index}.documents.0.number`] = 'Passport number is required';
      }
      if (!passport.expiryDate) {
        newErrors[`${index}.documents.0.expiryDate`] = 'Passport expiry date is required';
      } else if (new Date(passport.expiryDate) < new Date()) {
        newErrors[`${index}.documents.0.expiryDate`] = 'Passport has expired';
      }
      if (!passport.issuanceCountry?.trim()) {
        newErrors[`${index}.documents.0.issuanceCountry`] = 'Issuing country is required';
      }
      if (!passport.nationality?.trim()) {
        newErrors[`${index}.documents.0.nationality`] = 'Nationality is required';
      }
    });

    setErrors(newErrors);
    
    if (onValidate) {
      onValidate(Object.keys(newErrors).length === 0);
    }

    return Object.keys(newErrors).length === 0;
  };

  // Calculate age
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Validate email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Get error for field
  const getError = (index, path) => {
    return errors[`${index}.${path}`];
  };

  // Toggle traveler expansion
  const toggleTraveler = (index) => {
    setExpandedTraveler(expandedTraveler === index ? -1 : index);
  };

  // Render single traveler form
  const renderTravelerForm = (traveler, index) => {
    const isExpanded = expandedTraveler === index;
    const isPrimary = index === 0;

    return (
      <div key={traveler.id} className="card mb-3 shadow-sm">
        <div 
          className="card-header bg-primary text-white d-flex justify-content-between align-items-center"
          onClick={() => toggleTraveler(index)}
          style={{ cursor: 'pointer' }}
        >
          <h6 className="mb-0">
            <i className="mdi mdi-account me-2"></i>
            {traveler.travelerType} {index + 1}
            {isPrimary && <span className="badge bg-warning text-dark ms-2">Primary Contact</span>}
            {traveler.name.firstName && ` - ${traveler.name.firstName} ${traveler.name.lastName}`}
          </h6>
          <i className={`mdi mdi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
        </div>

        {isExpanded && (
          <div className="card-body">
            <div className="row g-3">
              {/* Title */}
              <div className="col-md-2">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={traveler.name.title}
                  onChange={(e) => updateTravelerField(index, 'name.title', e.target.value)}
                >
                  <option value="MR">Mr</option>
                  <option value="MRS">Mrs</option>
                  <option value="MS">Ms</option>
                  <option value="DR">Dr</option>
                  <option value="MSTR">Master</option>
                  <option value="MISS">Miss</option>
                </select>
              </div>

              {/* First Name */}
              <div className="col-md-5">
                <label className="form-label">First Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${getError(index, 'name.firstName') ? 'is-invalid' : ''}`}
                  value={traveler.name.firstName}
                  onChange={(e) => updateTravelerField(index, 'name.firstName', e.target.value.toUpperCase())}
                  placeholder="As shown on passport"
                />
                {getError(index, 'name.firstName') && (
                  <div className="invalid-feedback">{getError(index, 'name.firstName')}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="col-md-5">
                <label className="form-label">Last Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${getError(index, 'name.lastName') ? 'is-invalid' : ''}`}
                  value={traveler.name.lastName}
                  onChange={(e) => updateTravelerField(index, 'name.lastName', e.target.value.toUpperCase())}
                  placeholder="As shown on passport"
                />
                {getError(index, 'name.lastName') && (
                  <div className="invalid-feedback">{getError(index, 'name.lastName')}</div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="col-md-6">
                <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                <CustomFlatpickr
                  value={traveler.dateOfBirth}
                  onChange={(date) => updateTravelerField(index, 'dateOfBirth', date)}
                  options={{
                    maxDate: 'today',
                    dateFormat: 'Y-m-d'
                  }}
                  placeholder="Select date"
                  className={getError(index, 'dateOfBirth') ? 'is-invalid' : ''}
                />
                {getError(index, 'dateOfBirth') && (
                  <div className="invalid-feedback d-block">{getError(index, 'dateOfBirth')}</div>
                )}
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <label className="form-label">Gender <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  value={traveler.gender}
                  onChange={(e) => updateTravelerField(index, 'gender', e.target.value)}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div className="col-12">
                <hr />
                <h6 className="text-primary mb-3">
                  <i className="mdi mdi-passport me-2"></i>
                  Passport Information
                </h6>
              </div>

              {/* Passport Number */}
              <div className="col-md-6">
                <label className="form-label">Passport Number <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${getError(index, 'documents.0.number') ? 'is-invalid' : ''}`}
                  value={traveler.documents[0].number}
                  onChange={(e) => updateTravelerField(index, 'documents.0.number', e.target.value.toUpperCase())}
                  placeholder="Passport number"
                />
                {getError(index, 'documents.0.number') && (
                  <div className="invalid-feedback">{getError(index, 'documents.0.number')}</div>
                )}
              </div>

              {/* Passport Expiry Date */}
              <div className="col-md-6">
                <label className="form-label">Passport Expiry Date <span className="text-danger">*</span></label>
                <CustomFlatpickr
                  value={traveler.documents[0].expiryDate}
                  onChange={(date) => updateTravelerField(index, 'documents.0.expiryDate', date)}
                  options={{
                    minDate: 'today',
                    dateFormat: 'Y-m-d'
                  }}
                  placeholder="Select date"
                  className={getError(index, 'documents.0.expiryDate') ? 'is-invalid' : ''}
                />
                {getError(index, 'documents.0.expiryDate') && (
                  <div className="invalid-feedback d-block">{getError(index, 'documents.0.expiryDate')}</div>
                )}
              </div>

              {/* Issuing Country */}
              <div className="col-md-6">
                <label className="form-label">Issuing Country <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${getError(index, 'documents.0.issuanceCountry') ? 'is-invalid' : ''}`}
                  value={traveler.documents[0].issuanceCountry}
                  onChange={(e) => updateTravelerField(index, 'documents.0.issuanceCountry', e.target.value.toUpperCase())}
                  placeholder="Country code (e.g., US, AE)"
                  maxLength={2}
                />
                {getError(index, 'documents.0.issuanceCountry') && (
                  <div className="invalid-feedback">{getError(index, 'documents.0.issuanceCountry')}</div>
                )}
              </div>

              {/* Nationality */}
              <div className="col-md-6">
                <label className="form-label">Nationality <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${getError(index, 'documents.0.nationality') ? 'is-invalid' : ''}`}
                  value={traveler.documents[0].nationality}
                  onChange={(e) => updateTravelerField(index, 'documents.0.nationality', e.target.value.toUpperCase())}
                  placeholder="Nationality code (e.g., US, AE)"
                  maxLength={2}
                />
                {getError(index, 'documents.0.nationality') && (
                  <div className="invalid-feedback">{getError(index, 'documents.0.nationality')}</div>
                )}
              </div>

              {/* Contact Information (Primary Traveler Only) */}
              {isPrimary && (
                <>
                  <div className="col-12">
                    <hr />
                    <h6 className="text-primary mb-3">
                      <i className="mdi mdi-email me-2"></i>
                      Contact Information
                    </h6>
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label">Email Address <span className="text-danger">*</span></label>
                    <input
                      type="email"
                      className={`form-control ${getError(index, 'contact.emailAddress') ? 'is-invalid' : ''}`}
                      value={traveler.contact.emailAddress}
                      onChange={(e) => updateTravelerField(index, 'contact.emailAddress', e.target.value)}
                      placeholder="email@example.com"
                    />
                    {getError(index, 'contact.emailAddress') && (
                      <div className="invalid-feedback">{getError(index, 'contact.emailAddress')}</div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="col-md-6">
                    <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                    <div className="input-group">
                      <span className="input-group-text">+971</span>
                      <input
                        type="tel"
                        className={`form-control ${getError(index, 'contact.phones.0.number') ? 'is-invalid' : ''}`}
                        value={traveler.contact.phones[0].number}
                        onChange={(e) => updateTravelerField(index, 'contact.phones.0.number', e.target.value)}
                        placeholder="501234567"
                      />
                      {getError(index, 'contact.phones.0.number') && (
                        <div className="invalid-feedback">{getError(index, 'contact.phones.0.number')}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Special Requests */}
              <div className="col-12">
                <hr />
                <h6 className="text-primary mb-3">
                  <i className="mdi mdi-silverware-fork-knife me-2"></i>
                  Special Requests (Optional)
                </h6>
              </div>

              {/* Meal Preference */}
              <div className="col-md-6">
                <label className="form-label">Meal Preference</label>
                <select
                  className="form-select"
                  value={traveler.specialRequests?.meal || ''}
                  onChange={(e) => updateTravelerField(index, 'specialRequests.meal', e.target.value)}
                >
                  <option value="">No preference</option>
                  {MEAL_PREFERENCES.map((meal) => (
                    <option key={meal.value} value={meal.value}>
                      {meal.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Service */}
              <div className="col-md-6">
                <label className="form-label">Special Assistance</label>
                <select
                  className="form-select"
                  value={traveler.specialRequests?.wheelchair || ''}
                  onChange={(e) => updateTravelerField(index, 'specialRequests.wheelchair', e.target.value)}
                >
                  <option value="">No assistance needed</option>
                  {SPECIAL_SERVICES.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <h4>Traveler Information</h4>
        <p className="text-muted">
          Please provide details for all travelers as they appear on their passports.
        </p>
      </div>

      {travelersData.map((traveler, index) => renderTravelerForm(traveler, index))}

      <div className="d-flex justify-content-between mt-4">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => {
            // Validate and go back
            if (onValidate) {
              validateForm();
            }
          }}
        >
          <i className="mdi mdi-chevron-left me-2"></i>
          Back
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={validateForm}
        >
          Continue
          <i className="mdi mdi-chevron-right ms-2"></i>
        </button>
      </div>
    </div>
  );
};

export default TravelerForm;

