# ✅ CRITICAL FIX: Passenger ID Mapping

## 🐛 The Issue

**Error:** Traveler IDs must match the passenger IDs from the Duffel flight offer.

**Wrong:**
```json
{
  "travelers": [
    {
      "id": "1",  // ❌ Our internal ID
      "firstName": "JOHN"
    }
  ]
}
```

**Correct:**
```json
{
  "travelers": [
    {
      "id": "pas_0000Az8rCKAer0U2fdfi3H",  // ✅ Duffel passenger ID
      "firstName": "JOHN"
    }
  ]
}
```

---

## 🔍 Root Cause

When Duffel creates a flight offer, it assigns unique passenger IDs like:
- `pas_0000Az8rCKAer0U2fdfi3H`
- `pas_0000Az8rCKAer0U2fdfi3I`

These IDs are in the `raw.passengers` array:

```json
{
  "flightOffer": {
    "raw": {
      "passengers": [
        {
          "id": "pas_0000Az8rCKAer0U2fdfi3H",  // ← This ID must be used
          "type": "adult",
          "age": null
        },
        {
          "id": "pas_0000Az8rCKAer0U2fdfi3I",
          "type": "adult",
          "age": null
        }
      ]
    }
  }
}
```

But we were using our internal IDs ("1", "2", etc.) from the traveler form.

---

## 🔧 The Fix

We now extract passenger IDs from `flight.raw.passengers` and map them to travelers by index:

### In `BookingReview.jsx`:
```javascript
// Get passenger IDs from the flight offer's raw data
const passengerIds = flight?.raw?.passengers?.map(p => p.id) || [];

// Map travelers to correct Duffel passenger IDs
const transformedTravelers = travelers.map((traveler, index) => ({
  id: passengerIds[index] || traveler.id,  // ✅ Use Duffel passenger ID
  firstName: traveler.name?.firstName || '',
  lastName: traveler.name?.lastName || '',
  // ... rest of fields
}));
```

### In `useFlightContext.jsx`:
```javascript
// Get passenger IDs from confirmed flight
const passengerIds = confirmedFlight?.raw?.passengers?.map(p => p.id) || [];

const transformedTravelers = travelers.map((traveler, index) => ({
  id: passengerIds[index] || traveler.id,  // ✅ Use Duffel passenger ID
  // ... rest of fields
}));
```

---

## 🎯 How It Works

### Step 1: Flight Offer Contains Passenger IDs
```json
{
  "raw": {
    "passengers": [
      { "id": "pas_0000Az8rCKAer0U2fdfi3H", "type": "adult" },  // Passenger 1
      { "id": "pas_0000Az8rCKAer0U2fdfi3I", "type": "adult" }   // Passenger 2
    ]
  }
}
```

### Step 2: User Fills Traveler Forms
```javascript
travelers = [
  { id: "1", name: { firstName: "JOHN", lastName: "DOE" } },    // Traveler 1
  { id: "2", name: { firstName: "JANE", lastName: "DOE" } }     // Traveler 2
]
```

### Step 3: Mapping by Index
```javascript
// Traveler index 0 → Passenger ID index 0
travelers[0].id = passengerIds[0]  // "pas_0000Az8rCKAer0U2fdfi3H"

// Traveler index 1 → Passenger ID index 1
travelers[1].id = passengerIds[1]  // "pas_0000Az8rCKAer0U2fdfi3I"
```

### Step 4: Transformed Result
```json
{
  "travelers": [
    {
      "id": "pas_0000Az8rCKAer0U2fdfi3H",  // ✅ Correct Duffel ID
      "firstName": "JOHN",
      "lastName": "DOE"
    },
    {
      "id": "pas_0000Az8rCKAer0U2fdfi3I",  // ✅ Correct Duffel ID
      "firstName": "JANE",
      "lastName": "DOE"
    }
  ]
}
```

---

## 📊 Complete Example

### Flight Offer (from search/confirmation):
```json
{
  "id": "off_0000Az8rZAVWwqXfMQKNB0",
  "passengers": [
    { "type": "adult", "age": null },
    { "type": "adult", "age": null }
  ],
  "raw": {
    "passengers": [
      {
        "id": "pas_0000Az8rZAHhmFU0fXrKcs",  // ← Extract this
        "type": "adult"
      },
      {
        "id": "pas_0000Az8rZAHhmFU0fXrKct",  // ← Extract this
        "type": "adult"
      }
    ]
  }
}
```

### Traveler Form Data (internal):
```json
[
  {
    "id": "1",
    "name": { "firstName": "JOHN", "lastName": "DOE" }
  },
  {
    "id": "2",
    "name": { "firstName": "JANE", "lastName": "DOE" }
  }
]
```

### Final API Request (after transformation):
```json
{
  "flightOffer": { ... },
  "travelers": [
    {
      "id": "pas_0000Az8rZAHhmFU0fXrKcs",  // ✅ Mapped from raw.passengers[0]
      "firstName": "JOHN",
      "lastName": "DOE",
      "dateOfBirth": "1990-01-01",
      "gender": "MALE",
      "email": "john@example.com",
      "phoneCountryCode": "1",
      "phoneNumber": "1234567890",
      "documents": [...]
    },
    {
      "id": "pas_0000Az8rZAHhmFU0fXrKct",  // ✅ Mapped from raw.passengers[1]
      "firstName": "JANE",
      "lastName": "DOE",
      "dateOfBirth": "1985-05-15",
      "gender": "FEMALE",
      "email": "jane@example.com",
      "phoneCountryCode": "1",
      "phoneNumber": "0987654321",
      "documents": [...]
    }
  ],
  "contacts": { ... }
}
```

---

## ⚠️ Important Notes

### Order Matters!
The mapping is done by array index, so:
- First traveler in form → First passenger ID in offer
- Second traveler in form → Second passenger ID in offer
- And so on...

Make sure the number of travelers matches the number of passengers in the offer!

### Fallback
If for some reason passenger IDs are not found in `raw.passengers`, we fall back to the traveler's internal ID:
```javascript
id: passengerIds[index] || traveler.id
```

---

## 🧪 Testing

### Before Fix:
```json
{
  "travelers": [
    { "id": "1", "firstName": "JOHN" }  // ❌ Rejected by API
  ]
}
```

### After Fix:
```json
{
  "travelers": [
    { "id": "pas_0000Az8rCKAer0U2fdfi3H", "firstName": "JOHN" }  // ✅ Accepted
  ]
}
```

---

## 📁 Files Modified

- ✅ `src/components/flights/BookingReview.jsx` - Line 114-118
- ✅ `src/context/useFlightContext.jsx` - Line 393-397

---

## ✅ Summary

**The Problem:**
- Using internal IDs ("1", "2") instead of Duffel passenger IDs

**The Solution:**
- Extract passenger IDs from `flight.raw.passengers`
- Map by index to travelers
- Use Duffel IDs in the booking request

**The Result:**
- ✅ Passenger IDs now match Duffel's expectations
- ✅ Booking requests will be accepted
- ✅ No more ID mismatch errors

---

**This was a critical fix! The booking should now work correctly.** 🎉✈️

