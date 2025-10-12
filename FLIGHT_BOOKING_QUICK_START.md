# ✈️ Flight Booking - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start Your Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 2: Navigate to Flight Booking
1. Open your browser to `http://localhost:3000`
2. Login to the admin panel
3. Click "Flight Booking" in the sidebar
4. Select "Search Flights"

### Step 3: Test the Flow
1. **Search**: Dubai (DXB) → London (LHR)
2. **Date**: Select any future date
3. **Passengers**: 2 adults
4. **Click**: "Search Flights"

---

## 📁 Key Files Created

### Services
- `src/services/flightsService.js` - All API calls

### Context
- `src/context/useFlightContext.jsx` - State management

### Components (15 files)
```
src/components/flights/
├── AirportAutocomplete.jsx
├── FlightSearchForm.jsx
├── FlightCard.jsx
├── FlightFilters.jsx
├── FlightResultsList.jsx
├── FlightDetailsModal.jsx
├── TravelerForm.jsx
├── SeatSelection.jsx
├── BookingReview.jsx
├── BookingConfirmation.jsx
└── MyBookingsList.jsx
```

### Pages (5 files)
```
src/app/(admin)/flights/
├── search/page.jsx
├── booking/page.jsx
├── confirmation/page.jsx
├── bookings/page.jsx
└── bookings/[id]/page.jsx
```

---

## 🔌 API Endpoints Used

### Public (No Auth)
```javascript
GET /api/airports/search?q=dubai
GET /api/flights/search?origin=DXB&destination=LHR&...
```

### Protected (Requires Auth)
```javascript
POST /api/flights/confirm-price
POST /api/flights/seat-maps
POST /api/flights/create-order
GET /api/flights/my-orders
GET /api/flights/orders/:id
DELETE /api/flights/orders/:id
```

---

## 💻 Using the Components

### 1. Flight Search Form
```jsx
import FlightSearchForm from '@/components/flights/FlightSearchForm';
import { useFlightContext } from '@/context/useFlightContext';

const { handleSearchFlights, isSearching } = useFlightContext();

<FlightSearchForm
  onSearch={handleSearchFlights}
  isSearching={isSearching}
/>
```

### 2. Flight Results
```jsx
import FlightResultsList from '@/components/flights/FlightResultsList';

<FlightResultsList
  flights={filteredResults}
  filters={filters}
  sortBy={sortBy}
  onFilterChange={updateFilters}
  onSortChange={setSortBy}
  onClearFilters={clearFilters}
  onSelectFlight={handleSelectFlight}
/>
```

### 3. Flight Context
```jsx
'use client';
import { useFlightContext } from '@/context/useFlightContext';

const MyComponent = () => {
  const {
    searchFlights,
    selectFlight,
    handleCreateBooking,
    // ... all context values
  } = useFlightContext();
  
  // Use context values and methods
};
```

---

## 🎯 User Flow

```
Search → Select → Travelers → Seats → Review → Confirm → Success
```

### Complete Booking Flow
```javascript
// 1. Search flights
const results = await handleSearchFlights({
  origin: 'DXB',
  destination: 'LHR',
  departureDate: '2025-12-15',
  adults: 2
});

// 2. Select flight
await selectFlight(selectedFlight);

// 3. Confirm price (automatic)
await handleConfirmPrice();

// 4. Add travelers
updateTravelers([...travelerData]);

// 5. Select seats (optional)
selectSeat(travelerId, segmentId, seatNumber);

// 6. Create booking
const booking = await handleCreateBooking({
  flightOffer: confirmedFlight,
  travelers: travelers,
  selectedSeats: selectedSeats
});
```

---

## 🧪 Testing

### Test Search
```javascript
// Quick test in browser console
const testSearch = {
  origin: 'DXB',
  destination: 'LHR',
  departureDate: '2025-12-15',
  returnDate: '2025-12-22',
  adults: 2,
  children: 0,
  infants: 0,
  travelClass: 'ECONOMY'
};
```

### Test Traveler Data
```javascript
const testTraveler = {
  id: '1',
  travelerType: 'ADULT',
  name: {
    firstName: 'JOHN',
    lastName: 'DOE',
    title: 'MR'
  },
  dateOfBirth: '1990-01-01',
  gender: 'MALE',
  contact: {
    emailAddress: 'john@example.com',
    phones: [{
      deviceType: 'MOBILE',
      countryCallingCode: '971',
      number: '501234567'
    }]
  },
  documents: [{
    documentType: 'PASSPORT',
    number: 'AB1234567',
    expiryDate: '2030-01-01',
    issuanceCountry: 'US',
    nationality: 'US',
    holder: true
  }]
};
```

---

## 🎨 Customization

### Change Theme Colors
Edit `src/components/flights/FlightCard.jsx`:
```jsx
// Change primary color
className="btn btn-primary" // Change to btn-success, btn-info, etc.
```

### Modify Search Form
Edit `src/components/flights/FlightSearchForm.jsx`:
```jsx
// Add more fields, change layout, etc.
```

### Custom Filters
Edit `src/context/useFlightContext.jsx`:
```javascript
// Add new filter types in initializeFilters()
```

---

## 🔧 Common Tasks

### Add New Filter
```javascript
// In useFlightContext.jsx
const [filters, setFilters] = useState({
  // ... existing filters
  cabinClass: [] // New filter
});

// In FlightFilters.jsx
// Add UI for new filter
```

### Change Currency
```javascript
// In searchParams
currencyCode: 'USD' // Change from AED to USD
```

### Modify Validation
```javascript
// In TravelerForm.jsx - validateForm()
// Add or modify validation rules
```

---

## 📊 State Structure

```javascript
{
  // Search
  searchParams: { origin, destination, dates, passengers, ... },
  searchResults: [],
  filteredResults: [],
  isSearching: false,
  
  // Selected Flight
  selectedFlight: {},
  confirmedFlight: {},
  
  // Booking
  travelers: [],
  selectedSeats: {},
  seatMaps: [],
  
  // User Bookings
  myBookings: [],
  currentBooking: {},
  
  // UI State
  bookingStep: 1-6,
  filters: {},
  sortBy: 'recommended'
}
```

---

## 🐛 Troubleshooting

### Problem: No search results
**Solution**: Check API connection and CORS settings

### Problem: Airport autocomplete not working
**Solution**: Verify `/api/airports/search` endpoint is accessible

### Problem: Booking fails
**Solution**: Check authentication token and traveler data validation

### Problem: Seat maps not loading
**Solution**: Seat maps are optional - not all flights provide them

---

## 📚 Resources

- **Full Implementation Guide**: `FLIGHT_BOOKING_IMPLEMENTATION.md`
- **Original Requirements**: `FLIGHT_BOOKING_INTEGRATION_GUIDE.md`
- **API Docs**: `http://localhost:5001/api-docs`

---

## 🎉 You're Ready!

Everything is set up and ready to use. Just start your dev server and navigate to the Flight Booking section in the admin panel.

**Need help?** Check the implementation guide or reach out to support@trasealla.com

**Happy Coding! 🚀**

