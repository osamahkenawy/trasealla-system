'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  searchFlights,
  searchAirports,
  confirmFlightPrice,
  getSeatMaps,
  createFlightOrder,
  getMyFlightOrders,
  getFlightOrderById
} from '@/services/flightsService';

const FlightContext = createContext(undefined);

export const FlightProvider = ({ children }) => {
  // Search state
  const [searchParams, setSearchParams] = useState({
    origin: null,
    destination: null,
    departureDate: null,
    returnDate: null,
    passengers: {
      adults: 1,
      children: 0,
      infants: 0
    },
    travelClass: 'ECONOMY',
    nonStop: false,
    currencyCode: 'AED'
  });

  // Results state
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 50000 },
    airlines: [],
    stops: [],
    departureTime: [],
    arrivalTime: [],
    duration: { min: 0, max: 1440 } // minutes
  });

  // Sort state
  const [sortBy, setSortBy] = useState('recommended'); // recommended, cheapest, fastest, earliest, latest

  // Selected flight state
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [confirmedFlight, setConfirmedFlight] = useState(null);
  const [isPriceConfirming, setIsPriceConfirming] = useState(false);
  const [priceConfirmError, setPriceConfirmError] = useState(null);

  // Seat maps state
  const [seatMaps, setSeatMaps] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [isLoadingSeatMaps, setIsLoadingSeatMaps] = useState(false);

  // Traveler information state
  const [travelers, setTravelers] = useState([]);

  // Booking state
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);

  // User bookings state
  const [myBookings, setMyBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Multi-step booking progress
  const [bookingStep, setBookingStep] = useState(1); // 1: Search, 2: Select, 3: Travelers, 4: Seats, 5: Review, 6: Confirmation

  /**
   * Update search parameters
   */
  const updateSearchParams = (params) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  /**
   * Search for flights
   */
  const handleSearchFlights = async (params = searchParams) => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setFilteredResults([]);

    try {
      const response = await searchFlights(params);
      const flights = response.data || [];
      
      setSearchResults(flights);
      setFilteredResults(flights);
      setBookingStep(2); // Move to select flight step
      
      // Initialize filters based on results
      if (flights.length > 0) {
        initializeFilters(flights);
      }

      return flights;
    } catch (error) {
      console.error('Flight search error:', error);
      setSearchError(error.response?.data?.message || 'Failed to search flights. Please try again.');
      throw error;
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Initialize filters based on search results
   */
  const initializeFilters = (flights) => {
    const prices = flights.map(f => parseFloat(f.price?.total || 0));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    const airlines = [...new Set(flights.map(f => f.validatingAirlineCodes?.[0]).filter(Boolean))];

    setFilters({
      priceRange: { min: minPrice, max: maxPrice },
      selectedPriceRange: { min: minPrice, max: maxPrice },
      airlines: airlines.map(code => ({ code, selected: true })),
      stops: [
        { value: 0, label: 'Non-stop', selected: false },
        { value: 1, label: '1 stop', selected: false },
        { value: 2, label: '2+ stops', selected: false }
      ],
      departureTime: [
        { value: 'morning', label: 'Morning (6am - 12pm)', selected: false },
        { value: 'afternoon', label: 'Afternoon (12pm - 6pm)', selected: false },
        { value: 'evening', label: 'Evening (6pm - 12am)', selected: false },
        { value: 'night', label: 'Night (12am - 6am)', selected: false }
      ],
      arrivalTime: [
        { value: 'morning', label: 'Morning (6am - 12pm)', selected: false },
        { value: 'afternoon', label: 'Afternoon (12pm - 6pm)', selected: false },
        { value: 'evening', label: 'Evening (6pm - 12am)', selected: false },
        { value: 'night', label: 'Night (12am - 6am)', selected: false }
      ]
    });
  };

  /**
   * Apply filters to search results
   */
  useEffect(() => {
    if (searchResults.length === 0) {
      setFilteredResults([]);
      return;
    }

    let filtered = [...searchResults];

    // Price filter
    if (filters.selectedPriceRange) {
      filtered = filtered.filter(flight => {
        const price = parseFloat(flight.price?.total || 0);
        return price >= filters.selectedPriceRange.min && price <= filters.selectedPriceRange.max;
      });
    }

    // Airlines filter
    const selectedAirlines = filters.airlines?.filter(a => a.selected).map(a => a.code);
    if (selectedAirlines && selectedAirlines.length > 0) {
      filtered = filtered.filter(flight => 
        selectedAirlines.includes(flight.validatingAirlineCodes?.[0])
      );
    }

    // Stops filter
    const selectedStops = filters.stops?.filter(s => s.selected).map(s => s.value);
    if (selectedStops && selectedStops.length > 0) {
      filtered = filtered.filter(flight => {
        const stops = flight.itineraries?.[0]?.segments?.length - 1 || 0;
        if (selectedStops.includes(0) && stops === 0) return true;
        if (selectedStops.includes(1) && stops === 1) return true;
        if (selectedStops.includes(2) && stops >= 2) return true;
        return false;
      });
    }

    // Sort results
    filtered = sortFlights(filtered, sortBy);

    setFilteredResults(filtered);
  }, [searchResults, filters, sortBy]);

  /**
   * Sort flights
   */
  const sortFlights = (flights, sortType) => {
    const sorted = [...flights];

    switch (sortType) {
      case 'cheapest':
        return sorted.sort((a, b) => 
          parseFloat(a.price?.total || 0) - parseFloat(b.price?.total || 0)
        );
      
      case 'fastest':
        return sorted.sort((a, b) => {
          const durationA = parseDuration(a.itineraries?.[0]?.duration);
          const durationB = parseDuration(b.itineraries?.[0]?.duration);
          return durationA - durationB;
        });
      
      case 'earliest':
        return sorted.sort((a, b) => {
          const timeA = new Date(a.itineraries?.[0]?.segments?.[0]?.departure?.at);
          const timeB = new Date(b.itineraries?.[0]?.segments?.[0]?.departure?.at);
          return timeA - timeB;
        });
      
      case 'latest':
        return sorted.sort((a, b) => {
          const timeA = new Date(a.itineraries?.[0]?.segments?.[0]?.departure?.at);
          const timeB = new Date(b.itineraries?.[0]?.segments?.[0]?.departure?.at);
          return timeB - timeA;
        });
      
      case 'recommended':
      default:
        // Recommended: Balance of price and duration
        return sorted.sort((a, b) => {
          const scoreA = calculateRecommendedScore(a);
          const scoreB = calculateRecommendedScore(b);
          return scoreB - scoreA;
        });
    }
  };

  /**
   * Parse ISO 8601 duration to minutes
   */
  const parseDuration = (duration) => {
    if (!duration) return 0;
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    if (!match) return 0;
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  };

  /**
   * Calculate recommended score
   */
  const calculateRecommendedScore = (flight) => {
    const price = parseFloat(flight.price?.total || 0);
    const duration = parseDuration(flight.itineraries?.[0]?.duration);
    const stops = flight.itineraries?.[0]?.segments?.length - 1 || 0;

    // Normalize scores (lower is better for price, duration, stops)
    const priceScore = 100 - (price / 100); // Normalize price
    const durationScore = 100 - (duration / 10); // Normalize duration
    const stopsScore = stops === 0 ? 100 : (stops === 1 ? 50 : 0);

    // Weighted average
    return (priceScore * 0.4) + (durationScore * 0.3) + (stopsScore * 0.3);
  };

  /**
   * Update filters
   */
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    if (searchResults.length > 0) {
      initializeFilters(searchResults);
    }
  };

  /**
   * Select a flight
   */
  const selectFlight = async (flight) => {
    setSelectedFlight(flight);
    // Move to next step after selection
    setBookingStep(3);
  };

  /**
   * Confirm flight price
   */
  const handleConfirmPrice = async (flight = selectedFlight) => {
    if (!flight) {
      throw new Error('No flight selected');
    }

    setIsPriceConfirming(true);
    setPriceConfirmError(null);

    try {
      const response = await confirmFlightPrice(flight);
      const confirmed = response.data?.flightOffers?.[0] || response.data;
      
      setConfirmedFlight(confirmed);
      return confirmed;
    } catch (error) {
      console.error('Price confirmation error:', error);
      setPriceConfirmError(error.response?.data?.message || 'Failed to confirm price. Please try again.');
      throw error;
    } finally {
      setIsPriceConfirming(false);
    }
  };

  /**
   * Load seat maps
   */
  const loadSeatMaps = async (flight = confirmedFlight) => {
    if (!flight) {
      throw new Error('No flight confirmed');
    }

    setIsLoadingSeatMaps(true);

    try {
      const response = await getSeatMaps(flight);
      const maps = response.data || [];
      
      setSeatMaps(maps);
      return maps;
    } catch (error) {
      console.error('Seat maps loading error:', error);
      // Seat maps are optional, so we don't throw
      setSeatMaps([]);
      return [];
    } finally {
      setIsLoadingSeatMaps(false);
    }
  };

  /**
   * Select a seat
   */
  const selectSeat = (travelerId, segmentId, seatNumber) => {
    setSelectedSeats((prev) => ({
      ...prev,
      [travelerId]: {
        ...prev[travelerId],
        [segmentId]: seatNumber
      }
    }));
  };

  /**
   * Update travelers
   */
  const updateTravelers = (travelersData) => {
    setTravelers(travelersData);
  };

  /**
   * Create booking
   */
  const handleCreateBooking = async (bookingData = null) => {
    setBookingInProgress(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      // If bookingData is provided, use it directly (already transformed)
      if (bookingData) {
        const response = await createFlightOrder(bookingData);
        const booking = response.data;
        
        setCurrentBooking(booking);
        setBookingSuccess(true);
        setBookingStep(6);
        
        setTimeout(() => {
          resetBookingFlow();
        }, 300000);
        
        return booking;
      }

      // Otherwise, transform travelers to match API format
      // Get passenger IDs from the flight offer's raw data
      const passengerIds = confirmedFlight?.raw?.passengers?.map(p => p.id) || [];
      
      const transformedTravelers = travelers.map((traveler, index) => ({
        id: passengerIds[index] || traveler.id,  // Use Duffel passenger ID
        firstName: traveler.name?.firstName || '',
        lastName: traveler.name?.lastName || '',
        dateOfBirth: traveler.dateOfBirth,
        gender: traveler.gender,
        email: traveler.contact?.emailAddress || '',
        phoneCountryCode: traveler.contact?.phones?.[0]?.countryCallingCode || '971',
        phoneNumber: traveler.contact?.phones?.[0]?.number || '',
        documents: (traveler.documents || []).map(doc => ({
          documentType: doc.documentType,
          number: doc.number,
          expiryDate: doc.expiryDate,
          issuanceCountry: doc.issuanceCountry,
          nationality: doc.nationality,
          holder: doc.holder
        }))
      }));

      // Extract contact information from primary traveler
      const primaryTraveler = travelers[0];
      const contacts = primaryTraveler ? {
        email: primaryTraveler.contact?.emailAddress || '',
        phone: primaryTraveler.contact?.phones?.[0]?.number || ''
      } : null;

      const data = {
        flightOffer: confirmedFlight,
        travelers: transformedTravelers,
        contacts: contacts,
        selectedSeats: selectedSeats
      };

      const response = await createFlightOrder(data);
      const booking = response.data;
      
      setCurrentBooking(booking);
      setBookingSuccess(true);
      setBookingStep(6); // Move to confirmation step

      // Clear booking data after success
      setTimeout(() => {
        resetBookingFlow();
      }, 300000); // Clear after 5 minutes

      return booking;
    } catch (error) {
      console.error('Booking creation error:', error);
      setBookingError(error.response?.data?.message || 'Failed to create booking. Please try again.');
      throw error;
    } finally {
      setBookingInProgress(false);
    }
  };

  /**
   * Load user bookings
   */
  const loadMyBookings = async (params = {}) => {
    setIsLoadingBookings(true);

    try {
      const response = await getMyFlightOrders(params);
      const bookings = response.data || [];
      
      setMyBookings(bookings);
      return bookings;
    } catch (error) {
      console.error('Bookings loading error:', error);
      throw error;
    } finally {
      setIsLoadingBookings(false);
    }
  };

  /**
   * Load booking by ID
   */
  const loadBookingById = async (orderId) => {
    try {
      const response = await getFlightOrderById(orderId);
      return response.data;
    } catch (error) {
      console.error('Booking loading error:', error);
      throw error;
    }
  };

  /**
   * Reset booking flow
   */
  const resetBookingFlow = () => {
    setSelectedFlight(null);
    setConfirmedFlight(null);
    setSeatMaps([]);
    setSelectedSeats({});
    setTravelers([]);
    setCurrentBooking(null);
    setBookingSuccess(false);
    setBookingError(null);
    setBookingStep(1);
  };

  /**
   * Go to specific booking step
   */
  const goToStep = (step) => {
    setBookingStep(step);
  };

  const value = {
    // Search state
    searchParams,
    searchResults,
    filteredResults,
    isSearching,
    searchError,
    updateSearchParams,
    handleSearchFlights,

    // Filters
    filters,
    sortBy,
    updateFilters,
    clearFilters,
    setSortBy,

    // Selected flight
    selectedFlight,
    confirmedFlight,
    isPriceConfirming,
    priceConfirmError,
    selectFlight,
    handleConfirmPrice,

    // Seat maps
    seatMaps,
    selectedSeats,
    isLoadingSeatMaps,
    loadSeatMaps,
    selectSeat,

    // Travelers
    travelers,
    updateTravelers,

    // Booking
    bookingInProgress,
    bookingSuccess,
    bookingError,
    currentBooking,
    handleCreateBooking,

    // User bookings
    myBookings,
    isLoadingBookings,
    loadMyBookings,
    loadBookingById,

    // Booking flow
    bookingStep,
    goToStep,
    resetBookingFlow
  };

  return (
    <FlightContext.Provider value={value}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlightContext = () => {
  const context = useContext(FlightContext);
  if (context === undefined) {
    throw new Error('useFlightContext must be used within FlightProvider');
  }
  return context;
};

export default FlightContext;

