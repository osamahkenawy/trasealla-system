# Flight Card UI - Quick Reference

## ✅ What's New

### Flight Card Layout

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                    │
│  14:15 - 18:40       [Emirates]     🛍️ Check baggage details     │
│                                      ✈️ View details in full      │
│  Dubai to London Heathrow                                         │
│  Direct, 07h 25m                    Price per adult               │
│                                      AED 2,204                    │
│                                      (Total price AED 4,408)      │
│                                                                    │
│                                      [ Select ]                   │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

**Exact Layout:**
- Left section: Time (hyphen separator), Route, Flight type + Duration, Logo on right
- Right section: Baggage link, Details link, Price, Total price, Select button
- All aligned and spaced to match the reference image

## 🎨 Key Features

### 1. **Airline Branding**
- Real airline logos from API
- Professional logo container with border
- Hover effect on logo

### 2. **Clear Time Display**
- Large 1.75rem font for times
- City names for clarity
- Flight type (Direct/Stops)
- Total duration

### 3. **Pricing**
- Per-person price prominently displayed
- Total price in parentheses
- Currency properly formatted
- Large, readable numbers

### 4. **Action Buttons**
- "Check fare rules for baggage details" - Opens modal
- "View flight details in full" - Shows amenities
- "Select" - Rounded blue button to book

## 🔍 Flight Details Modal

When user clicks "View flight details in full":

### Shows:
1. **Flight Segments**
   - Departure/arrival times and airports
   - Terminal information
   - Aircraft details
   - Layover durations

2. **Passenger Amenities** (NEW!)
   ```
   CABIN AMENITIES
   ✓ WiFi (Paid)          ✓ Power (Available)      ✓ Seat Pitch (30")
   
   BAGGAGE ALLOWANCE
   ✓ 1 Checked            ✓ 1 Carry-on
   ```

3. **Detailed Breakdown**
   - Fare basis codes
   - Fare breakdown by passenger
   - Taxes and fees
   - Fare conditions (refundable/changeable)

## 📊 Data Sources

### From API Response:
```javascript
// Logo
flight.raw.owner.logo_symbol_url

// City Names
segment.departure.cityName
segment.arrival.cityName

// Amenities
flight.raw.slices[0].segments[0].passengers[0].cabin.amenities
  ├── wifi: { available, cost }
  ├── power: { available }
  └── seat: { pitch, legroom }

// Baggage
flight.raw.slices[0].segments[0].passengers[0].baggages
  ├── { type: "checked", quantity: 1 }
  └── { type: "carry_on", quantity: 1 }
```

## 🎯 User Flow

```
1. User searches for flights
   ↓
2. Results displayed with new card design
   ↓
3. User clicks "View details" or "Check baggage"
   ↓
4. Modal opens showing:
   - Flight segments with times
   - Passenger amenities (WiFi, Power, Seat)
   - Baggage allowance
   - Fare breakdown
   ↓
5. User clicks "Select This Flight"
   ↓
6. Navigate to /flights/booking
```

## 🎨 Styling Classes

### FlightCard.scss
- `.flight-card` - Card container with hover effects
- `.airline-logo-container` - Logo with scale animation
- `.price-section` - Price display styling
- `.btn-select` - Select button with hover effects

### Responsive Design
- Desktop: Two-column layout (time/logo | price/actions)
- Mobile: Stacked layout with centered elements

## 🔧 Component Props

### FlightCard
```jsx
<FlightCard
  flight={flightObject}      // Flight offer data
  onSelect={handleSelect}    // Called when "Select" clicked
  onViewDetails={handleView} // Called when "View details" clicked
  isSelected={false}         // Highlight if selected
/>
```

### FlightDetailsModal
```jsx
<FlightDetailsModal
  flight={flightObject}      // Flight offer data
  onClose={handleClose}      // Close modal
  onSelect={handleSelect}    // Select from modal
/>
```

## ✨ Animations

- **Card Hover**: Lifts 2px with enhanced shadow
- **Logo Hover**: Scales to 1.05x
- **Button Hover**: Scales to 1.05x with shadow
- **Smooth Transitions**: 0.3s ease on all effects

## 📱 Mobile Optimizations

- Text alignment adjusts (center on mobile)
- Logo stays centered
- Button full-width on small screens
- Modal scrollable on mobile

## 🚀 Performance

- Images lazy-loaded
- Error handling for missing logos
- Graceful fallback for missing data
- Optimized re-renders with React keys

## 🧪 Test Checklist

- [ ] Airline logo displays correctly
- [ ] Times and cities show properly
- [ ] Price formatted with currency
- [ ] "View details" opens modal
- [ ] Modal shows amenities section
- [ ] Baggage info displays
- [ ] "Select" button navigates to booking
- [ ] Hover effects work smoothly
- [ ] Mobile layout responsive
- [ ] Missing data handled gracefully

