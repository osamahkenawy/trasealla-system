/**
 * Flights API Service
 * Handles all flight-related API operations for Amadeus/Duffel integration
 */

import axiosInstance from '@/plugins/axios';

/**
 * Search airports (autocomplete)
 * @param {string} query - Search query
 * @param {number} limit - Maximum results
 * @returns {Promise<Object>} Airport search results
 */
export const searchAirports = async (query, limit = 10) => {
  try {
    const response = await axiosInstance.get('/airports/search', {
      params: { q: query, limit }
    });
    
    // Flatten airport groups to include subAirports in the main list
    const airports = response.data.airports || [];
    const flattenedAirports = [];
    
    airports.forEach(airport => {
      if (airport.__typename === 'AirportGroup' && airport.subAirports) {
        // Add all subAirports from the group
        flattenedAirports.push(...airport.subAirports);
      } else if (airport.__typename === 'SingleAirport') {
        // Add single airport
        flattenedAirports.push(airport);
      }
    });
    
    return {
      ...response.data,
      airports: flattenedAirports
    };
  } catch (error) {
    console.error('Error searching airports:', error);
    throw error;
  }
};

/**
 * Get airport by code
 * @param {string} code - Airport IATA code
 * @returns {Promise<Object>} Airport details
 */
export const getAirportByCode = async (code) => {
  try {
    const response = await axiosInstance.get(`/airports/${code}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airport:', error);
    throw error;
  }
};

/**
 * Get all airports
 * @param {number} limit - Maximum results
 * @param {boolean} active - Only active airports
 * @returns {Promise<Object>} All airports
 */
export const getAllAirports = async (limit = 100, active = true) => {
  try {
    const response = await axiosInstance.get('/airports', {
      params: { limit, active }
    });
    
    // Flatten airport groups
    const airports = response.data.airports || [];
    const flattenedAirports = [];
    
    airports.forEach(airport => {
      if (airport.__typename === 'AirportGroup' && airport.subAirports) {
        flattenedAirports.push(...airport.subAirports);
      } else if (airport.__typename === 'SingleAirport') {
        flattenedAirports.push(airport);
      }
    });
    
    return {
      ...response.data,
      airports: flattenedAirports
    };
  } catch (error) {
    console.error('Error fetching airports:', error);
    throw error;
  }
};

/**
 * Search flights
 * @param {Object} searchParams - Flight search parameters
 * @param {string} searchParams.origin - Origin airport IATA code
 * @param {string} searchParams.destination - Destination airport IATA code
 * @param {string} searchParams.departureDate - Departure date (YYYY-MM-DD)
 * @param {string} searchParams.returnDate - Return date (YYYY-MM-DD) - optional
 * @param {number} searchParams.adults - Number of adults (default: 1)
 * @param {number} searchParams.children - Number of children (default: 0)
 * @param {number} searchParams.infants - Number of infants (default: 0)
 * @param {string} searchParams.travelClass - Travel class (ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST)
 * @param {boolean} searchParams.nonStop - Non-stop flights only (default: false)
 * @param {string} searchParams.currencyCode - Currency code (default: AED)
 * @param {number} searchParams.maxResults - Maximum results (default: 50)
 * @returns {Promise<Object>} Flight search results
 */
export const searchFlights = async (searchParams) => {
  try {
    console.log('Searching flights with params:', searchParams);
    
    const params = {
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      adults: searchParams.adults || 1,
      children: searchParams.children || 0,
      infants: searchParams.infants || 0,
      travelClass: searchParams.travelClass || 'ECONOMY',
      currencyCode: searchParams.currencyCode || 'AED',
      nonStop: searchParams.nonStop || false,
      maxResults: searchParams.maxResults || 50
    };

    // Add return date if provided (round trip)
    if (searchParams.returnDate) {
      params.returnDate = searchParams.returnDate;
    }

    const response = await axiosInstance.get('/flights/search', { params });
    console.log('Flight search response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error searching flights:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Get flight price analysis
 * @param {string} origin - Origin airport IATA code
 * @param {string} destination - Destination airport IATA code
 * @param {string} departureDate - Departure date (YYYY-MM-DD)
 * @returns {Promise<Object>} Price analysis data
 */
export const getFlightPriceAnalysis = async (origin, destination, departureDate) => {
  try {
    const response = await axiosInstance.get('/flights/price-analysis', {
      params: { origin, destination, departureDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price analysis:', error);
    throw error;
  }
};

/**
 * Confirm flight price (before booking)
 * @param {Object} flightOffer - Flight offer object from search
 * @returns {Promise<Object>} Confirmed pricing data
 */
export const confirmFlightPrice = async (flightOffer) => {
  try {
    console.log('Confirming flight price for offer:', flightOffer.id);
    
    const response = await axiosInstance.post('/flights/confirm-price', {
      flightOffer
    });
    
    console.log('Price confirmation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error confirming flight price:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Get seat maps for a flight
 * @param {Object} flightOffer - Flight offer object
 * @returns {Promise<Object>} Seat map data
 */
export const getSeatMaps = async (flightOffer) => {
  try {
    console.log('Fetching seat maps for offer:', flightOffer.id);
    
    const response = await axiosInstance.post('/flights/seat-maps', {
      flightOffer
    });
    
    console.log('Seat maps response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching seat maps:', error);
    console.error('Error response:', error.response?.data);
    
    // Seat maps might not be available for all flights
    if (error.response?.status === 404 || error.response?.status === 400) {
      console.warn('Seat maps not available for this flight');
      return { success: false, data: [], message: 'Seat maps not available' };
    }
    
    throw error;
  }
};

/**
 * Create flight order (book flight)
 * @param {Object} bookingData - Booking data
 * @param {Object} bookingData.flightOffer - Confirmed flight offer
 * @param {Array} bookingData.travelers - Array of traveler information
 * @param {Object} bookingData.remarks - Booking remarks (optional)
 * @param {Object} bookingData.selectedSeats - Selected seats map (optional)
 * @returns {Promise<Object>} Created flight order
 */
export const createFlightOrder = async (bookingData) => {
  try {
    console.log('Creating flight order with data:', bookingData);
    
    const response = await axiosInstance.post('/flights/create-order', bookingData);
    
    console.log('Flight order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating flight order:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Get user's flight orders
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (confirmed, cancelled, pending)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise<Object>} User's flight orders
 */
export const getMyFlightOrders = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/flights/my-orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching flight orders:', error);
    throw error;
  }
};

/**
 * Get flight order details
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Flight order details
 */
export const getFlightOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/flights/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching flight order:', error);
    throw error;
  }
};

/**
 * Cancel flight order
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} Cancellation result
 */
export const cancelFlightOrder = async (orderId) => {
  try {
    console.log('Cancelling flight order:', orderId);
    
    const response = await axiosInstance.delete(`/flights/orders/${orderId}`);
    
    console.log('Flight order cancelled:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error cancelling flight order:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Get airline information
 * @param {string} airlineCode - IATA airline code
 * @returns {Promise<Object>} Airline information
 */
export const getAirlineInfo = async (airlineCode) => {
  try {
    const response = await axiosInstance.get(`/flights/airlines/${airlineCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching airline info:', error);
    // Return fallback data if API fails
    return {
      success: false,
      data: {
        code: airlineCode,
        name: airlineCode
      }
    };
  }
};

// Flight-related constants

/**
 * Travel class options
 */
export const TRAVEL_CLASSES = {
  ECONOMY: 'ECONOMY',
  PREMIUM_ECONOMY: 'PREMIUM_ECONOMY',
  BUSINESS: 'BUSINESS',
  FIRST: 'FIRST'
};

export const TRAVEL_CLASS_LABELS = {
  [TRAVEL_CLASSES.ECONOMY]: 'Economy',
  [TRAVEL_CLASSES.PREMIUM_ECONOMY]: 'Premium Economy',
  [TRAVEL_CLASSES.BUSINESS]: 'Business',
  [TRAVEL_CLASSES.FIRST]: 'First Class'
};

/**
 * Traveler types
 */
export const TRAVELER_TYPES = {
  ADULT: 'ADULT',
  CHILD: 'CHILD',
  INFANT: 'INFANT',
  SENIOR: 'SENIOR'
};

/**
 * Gender options
 */
export const GENDER_OPTIONS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

/**
 * Document types
 */
export const DOCUMENT_TYPES = {
  PASSPORT: 'PASSPORT',
  IDENTITY_CARD: 'IDENTITY_CARD',
  VISA: 'VISA'
};

/**
 * Booking status
 */
export const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  PENDING: 'pending',
  CANCELLED: 'cancelled',
  TICKETED: 'ticketed',
  REFUNDED: 'refunded'
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.TICKETED]: 'Ticketed',
  [BOOKING_STATUS.REFUNDED]: 'Refunded'
};

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.CONFIRMED]: 'success',
  [BOOKING_STATUS.PENDING]: 'warning',
  [BOOKING_STATUS.CANCELLED]: 'danger',
  [BOOKING_STATUS.TICKETED]: 'info',
  [BOOKING_STATUS.REFUNDED]: 'secondary'
};

/**
 * Seat status
 */
export const SEAT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  BLOCKED: 'BLOCKED'
};

/**
 * Meal preferences
 */
export const MEAL_PREFERENCES = [
  { value: 'VGML', label: 'Vegetarian' },
  { value: 'NVML', label: 'Non-Vegetarian' },
  { value: 'HNML', label: 'Hindu' },
  { value: 'MOML', label: 'Muslim' },
  { value: 'KSML', label: 'Kosher' },
  { value: 'LCML', label: 'Low Calorie' },
  { value: 'DBML', label: 'Diabetic' },
  { value: 'GFML', label: 'Gluten Free' },
  { value: 'SFML', label: 'Seafood' },
  { value: 'BLML', label: 'Bland' }
];

/**
 * Special service requests
 */
export const SPECIAL_SERVICES = [
  { value: 'WCHR', label: 'Wheelchair - Ramp' },
  { value: 'WCHS', label: 'Wheelchair - Steps' },
  { value: 'WCHC', label: 'Wheelchair - Completely Immobile' },
  { value: 'BLND', label: 'Blind Passenger' },
  { value: 'DEAF', label: 'Deaf Passenger' },
  { value: 'DPNA', label: 'Disabled Passenger' },
  { value: 'PETC', label: 'Pet in Cabin' },
  { value: 'AVIH', label: 'Pet in Hold' }
];

/**
 * Currency codes
 */
export const CURRENCY_CODES = [
  { value: 'AED', label: 'AED (UAE Dirham)', symbol: 'د.إ' },
  { value: 'USD', label: 'USD (US Dollar)', symbol: '$' },
  { value: 'EUR', label: 'EUR (Euro)', symbol: '€' },
  { value: 'GBP', label: 'GBP (British Pound)', symbol: '£' },
  { value: 'SAR', label: 'SAR (Saudi Riyal)', symbol: 'ر.س' }
];

/**
 * Helper function to format flight duration
 * @param {string} duration - ISO 8601 duration (e.g., "PT13H30M")
 * @returns {string} Formatted duration (e.g., "13h 30m")
 */
export const formatFlightDuration = (duration) => {
  if (!duration) return '';
  
  const match = duration.match(/PT(\d+H)?(\d+M)?/);
  if (!match) return duration;
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  
  if (hours && minutes) {
    return `${hours}h ${minutes}m`;
  } else if (hours) {
    return `${hours}h`;
  } else if (minutes) {
    return `${minutes}m`;
  }
  
  return duration;
};

/**
 * Helper function to format flight time
 * @param {string} dateTime - ISO 8601 datetime
 * @returns {string} Formatted time (e.g., "14:30")
 */
export const formatFlightTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Helper function to format flight date
 * @param {string} dateTime - ISO 8601 datetime
 * @returns {string} Formatted date (e.g., "Dec 15, 2025")
 */
export const formatFlightDate = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Helper function to calculate layover duration
 * @param {string} arrivalTime - Arrival time of previous segment
 * @param {string} departureTime - Departure time of next segment
 * @returns {string} Layover duration
 */
export const calculateLayoverDuration = (arrivalTime, departureTime) => {
  if (!arrivalTime || !departureTime) return '';
  
  const arrival = new Date(arrivalTime);
  const departure = new Date(departureTime);
  const diffMs = departure - arrival;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
};

/**
 * Helper function to get stops text
 * @param {number} numberOfStops - Number of stops
 * @returns {string} Stops text (e.g., "Non-stop", "1 stop")
 */
export const getStopsText = (numberOfStops) => {
  if (numberOfStops === 0) return 'Non-stop';
  if (numberOfStops === 1) return '1 stop';
  return `${numberOfStops} stops`;
};

/**
 * Helper function to get currency symbol
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const currency = CURRENCY_CODES.find(c => c.value === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

export default {
  searchAirports,
  getAirportByCode,
  getAllAirports,
  searchFlights,
  getFlightPriceAnalysis,
  confirmFlightPrice,
  getSeatMaps,
  createFlightOrder,
  getMyFlightOrders,
  getFlightOrderById,
  cancelFlightOrder,
  getAirlineInfo,
  TRAVEL_CLASSES,
  TRAVEL_CLASS_LABELS,
  TRAVELER_TYPES,
  GENDER_OPTIONS,
  DOCUMENT_TYPES,
  BOOKING_STATUS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  SEAT_STATUS,
  MEAL_PREFERENCES,
  SPECIAL_SERVICES,
  CURRENCY_CODES,
  formatFlightDuration,
  formatFlightTime,
  formatFlightDate,
  calculateLayoverDuration,
  getStopsText,
  getCurrencySymbol
};

