# ✈️ Flight Offer Format - Complete Structure

## 📋 Important: Pass Complete Flight Offer

The `flightOffer` sent to `/api/flights/create-order` must be the **complete offer object** including all nested data, especially the `raw` field.

---

## ✅ Complete Flight Offer Structure

```json
{
  "id": "off_0000Az8rZAVWwqXfMQKNB0",
  "provider": "Duffel",
  "type": "flight-offer",
  "source": "Duffel",
  "expiresAt": "2025-10-12T19:28:51.770735Z",
  "price": {
    "currency": "USD",
    "total": 1072.18,
    "base": 908.63,
    "tax": 163.55,
    "grandTotal": 1072.18
  },
  "itineraries": [
    {
      "duration": "PT15H15M",
      "segments": [
        {
          "id": "seg_0000Az8rZAVWwqXfMQKNAy",
          "departure": {
            "iataCode": "JFK",
            "cityName": "New York",
            "at": "2025-12-15T10:50:00",
            "terminal": "2"
          },
          "arrival": {
            "iataCode": "DXB",
            "cityName": "Dubai",
            "at": "2025-12-16T11:05:00",
            "terminal": "1"
          },
          "carrierCode": "IB",
          "carrierName": "Iberia",
          "number": "3177",
          "duration": "PT15H15M",
          "distance": "11001.469171103428"
        }
      ]
    }
  ],
  "passengers": [
    {
      "type": "adult",
      "age": null
    }
  ],
  "conditions": {
    "changeBeforeDeparture": {
      "penalty_currency": null,
      "penalty_amount": null,
      "allowed": false
    },
    "refundBeforeDeparture": {
      "penalty_currency": null,
      "penalty_amount": null,
      "allowed": false
    }
  },
  "raw": {
    "intended_payment_methods": [],
    "total_emissions_kg": "611",
    "intended_services": [],
    "available_airline_credits": [],
    "payment_requirements": {
      "requires_instant_payment": false,
      "price_guarantee_expires_at": "2025-10-14T18:58:51Z",
      "payment_required_by": "2025-10-15T18:58:51Z"
    },
    "available_services": [],
    "supported_passenger_identity_document_types": [
      "passport",
      "known_traveler_number",
      "passenger_redress_number"
    ],
    "passenger_identity_documents_required": false,
    "tax_currency": "USD",
    "base_currency": "USD",
    "base_amount": "908.63",
    "supported_loyalty_programmes": [],
    "private_fares": [],
    "tax_amount": "163.55",
    "total_currency": "USD",
    "live_mode": false,
    "total_amount": "1072.18",
    "slices": [
      {
        "comparison_key": "A5xsYA==",
        "ngs_shelf": 1,
        "destination_type": "airport",
        "origin_type": "airport",
        "fare_brand_name": "Basic",
        "segments": [
          {
            "origin_terminal": "2",
            "destination_terminal": "1",
            "aircraft": null,
            "departing_at": "2025-12-15T10:50:00",
            "arriving_at": "2025-12-16T11:05:00",
            "operating_carrier": {
              "logo_symbol_url": "https://...",
              "iata_code": "IB",
              "name": "Iberia",
              "id": "arl_00009VME7DCOaPRQvNhcMu"
            },
            "marketing_carrier": { ... },
            "passengers": [
              {
                "cabin": {
                  "amenities": { ... },
                  "marketing_name": "Economy",
                  "name": "economy"
                },
                "baggages": [
                  {
                    "quantity": 1,
                    "type": "checked"
                  }
                ],
                "passenger_id": "pas_0000Az8rZAHhmFU0fXrKcs",
                "fare_basis_code": "Y20LGTN2",
                "cabin_class": "economy"
              }
            ],
            "duration": "PT15H15M",
            "destination": { ... },
            "origin": { ... },
            "id": "seg_0000Az8rZAVWwqXfMQKNAy"
          }
        ],
        "conditions": { ... },
        "duration": "PT15H15M",
        "destination": { ... },
        "origin": { ... },
        "id": "sli_0000Az8rZAVWwqXfMQKNAz"
      }
    ],
    "created_at": "2025-10-12T18:58:51.770733Z",
    "passengers": [
      {
        "loyalty_programme_accounts": [],
        "family_name": null,
        "given_name": null,
        "age": null,
        "type": "adult",
        "id": "pas_0000Az8rZAHhmFU0fXrKcs"
      }
    ],
    "conditions": { ... },
    "updated_at": "2025-10-12T18:59:23.664951Z",
    "expires_at": "2025-10-12T19:28:51.770735Z",
    "partial": false,
    "owner": {
      "logo_symbol_url": "https://...",
      "iata_code": "IB",
      "name": "Iberia",
      "id": "arl_00009VME7DCOaPRQvNhcMu"
    },
    "id": "off_0000Az8rZAVWwqXfMQKNB0"
  }
}
```

---

## 🔑 Critical Fields Required

### Top Level:
- ✅ `id` - Offer ID from Duffel
- ✅ `provider` - "Duffel"
- ✅ `type` - "flight-offer"
- ✅ `source` - "Duffel"
- ✅ `expiresAt` - Offer expiration timestamp
- ✅ `price` - Complete price object
- ✅ `itineraries` - Array of flight segments
- ✅ `passengers` - Passenger types and counts
- ✅ `conditions` - Change/refund conditions
- ✅ **`raw`** - **IMPORTANT: Complete Duffel raw data**

### Inside `raw`:
- ✅ `slices` - Complete slice data with segments, carriers, passengers
- ✅ `passengers` - Passenger IDs from Duffel
- ✅ `payment_requirements` - Payment deadlines
- ✅ `supported_passenger_identity_document_types`
- ✅ All other Duffel-specific fields

---

## 🎯 Data Flow

```
1. Search Results
   ↓ (User selects flight)
   
2. Selected Flight (from search)
   ↓ (Call confirmFlightPrice)
   
3. Confirmed Flight (with updated prices)
   ↓ (User fills traveler info)
   
4. Booking Request
   ↓ (Pass COMPLETE confirmedFlight object)
   
5. API creates order using raw data
```

---

## ✅ What We're Doing Correctly

Our implementation already passes the complete flight offer:

### In `flightsService.js`:
```javascript
// confirmFlightPrice - returns complete offer
export const confirmFlightPrice = async (flightOffer) => {
  const response = await axiosInstance.post('/flights/confirm-price', {
    flightOffer  // ✅ Complete object
  });
  return response.data;  // ✅ Returns complete confirmed offer
};

// createFlightOrder - passes complete offer
export const createFlightOrder = async (bookingData) => {
  const response = await axiosInstance.post('/flights/create-order', bookingData);
  // bookingData.flightOffer should be the complete confirmed offer
  return response.data;
};
```

### In `useFlightContext.jsx`:
```javascript
// Store confirmed flight with ALL data
setConfirmedFlight(confirmed);  // ✅ Complete object

// Pass to booking
const data = {
  flightOffer: confirmedFlight,  // ✅ Complete confirmed offer
  travelers: transformedTravelers,
  contacts: contacts
};
```

### In `BookingReview.jsx`:
```javascript
onConfirmBooking({
  flightOffer: flight,  // ✅ Complete confirmed flight
  travelers: transformedTravelers,
  contacts: contacts
});
```

---

## 🔍 Verification Checklist

Before sending to API, verify the flightOffer includes:

- [ ] `id` field present
- [ ] `raw` object present and complete
- [ ] `raw.slices` array present
- [ ] `raw.passengers` array present with IDs
- [ ] `raw.payment_requirements` present
- [ ] `price` object with all fields
- [ ] `itineraries` array present
- [ ] No fields removed or modified

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T DO THIS:
```javascript
// Don't create a new object with only some fields
const flightOffer = {
  id: flight.id,
  price: flight.price,
  // Missing raw, slices, etc.
};
```

### ✅ DO THIS:
```javascript
// Pass the complete confirmed flight object
const flightOffer = confirmedFlight;  // All data included
```

---

## 📊 Complete Request Example

```json
{
  "flightOffer": {
    "id": "off_0000Az8rZAVWwqXfMQKNB0",
    "provider": "Duffel",
    "raw": {
      "slices": [...],
      "passengers": [...],
      // ... all Duffel data
    }
    // ... all other fields
  },
  "travelers": [
    {
      "id": "1",
      "firstName": "JOHN",
      "lastName": "DOE",
      // ... transformed format
    }
  ],
  "contacts": {
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

---

## ✅ Summary

**What to send:**
1. ✅ Complete `flightOffer` from price confirmation (including `raw`)
2. ✅ Transformed `travelers` (flat format)
3. ✅ Extracted `contacts` (simple format)

**What NOT to do:**
1. ❌ Don't strip any fields from flightOffer
2. ❌ Don't remove the `raw` object
3. ❌ Don't modify the flightOffer structure

---

**Our implementation already does this correctly!** ✅

The complete flight offer (including all `raw` data) is passed from search → price confirmation → booking without any modifications. The only transformations we do are on `travelers` and `contacts` formats.

