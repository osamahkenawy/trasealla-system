# ✈️ Flight Booking API Request Format

## 🐛 Issue Fixed

**Error:** `flightOffer, travelers, and contacts are required`

**Problem:** The API requires a separate `contacts` field, but we were only sending contact information embedded in the travelers array.

---

## ✅ Correct Request Format

### POST `/api/flights/create-order`

```json
{
  "flightOffer": {
    "id": "off_0000Az8plZ22kdphFob5NQ",
    "provider": "Duffel",
    "price": { ... },
    "itineraries": [ ... ],
    "passengers": [ ... ]
  },
  "travelers": [
    {
      "id": "1",
      "travelerType": "ADULT",
      "name": {
        "firstName": "ALAA",
        "lastName": "SALEM",
        "title": "MR"
      },
      "dateOfBirth": "1995-10-25",
      "gender": "MALE",
      "contact": {
        "emailAddress": "alaa_salem@yopmail.com",
        "phones": [
          {
            "deviceType": "MOBILE",
            "countryCallingCode": "971",
            "number": "522200730"
          }
        ]
      },
      "documents": [
        {
          "documentType": "PASSPORT",
          "number": "A232333",
          "expiryDate": "2025-10-29",
          "issuanceCountry": "SY",
          "nationality": "SY",
          "holder": true
        }
      ],
      "specialRequests": {
        "meal": "VGML",
        "wheelchair": "WCHR"
      }
    }
  ],
  "contacts": {
    "email": "alaa_salem@yopmail.com",
    "phone": {
      "countryCallingCode": "971",
      "number": "522200730"
    }
  },
  "selectedSeats": {},
  "paymentMethod": "card"
}
```

---

## 🔑 Key Requirements

### 1. **flightOffer** (Required)
The complete flight offer object from the price confirmation step.

### 2. **travelers** (Required)
Array of traveler objects with:
- Personal information (name, DOB, gender)
- Contact information (embedded in traveler)
- Passport details
- Special requests

### 3. **contacts** (Required) ⚠️ NEW
**This was missing!** Separate contact object extracted from primary traveler:
```json
{
  "email": "primary_traveler@email.com",
  "phone": {
    "countryCallingCode": "971",
    "number": "501234567"
  }
}
```

### 4. **selectedSeats** (Optional)
Object mapping traveler IDs to their selected seats.

### 5. **paymentMethod** (Optional)
Payment method selected by user (card, bank, cash).

---

## 🔧 How We Extract Contacts

The `contacts` field is automatically extracted from the **primary traveler** (first traveler in the array):

```javascript
// In BookingReview.jsx and useFlightContext.jsx
const primaryTraveler = travelers[0];
const contacts = primaryTraveler ? {
  email: primaryTraveler.contact?.emailAddress || '',
  phone: {
    countryCallingCode: primaryTraveler.contact?.phones?.[0]?.countryCallingCode || '971',
    number: primaryTraveler.contact?.phones?.[0]?.number || ''
  }
} : null;
```

---

## 📁 Files Updated

### 1. `src/components/flights/BookingReview.jsx`
✅ Now extracts contacts from primary traveler before calling `onConfirmBooking`

### 2. `src/context/useFlightContext.jsx`
✅ Default booking data now includes contacts field

---

## 🧪 Test Request

```bash
curl --location 'http://localhost:5001/api/flights/create-order' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_TOKEN' \
--data '{
  "flightOffer": { ... },
  "travelers": [ ... ],
  "contacts": {
    "email": "test@example.com",
    "phone": {
      "countryCallingCode": "971",
      "number": "501234567"
    }
  },
  "selectedSeats": {},
  "paymentMethod": "card"
}'
```

---

## ✅ Validation Checklist

Before sending to API, ensure:

- [x] `flightOffer` object is present and valid
- [x] `travelers` array has at least one traveler
- [x] `contacts` object is present with email and phone
- [x] Email is valid format
- [x] Phone has countryCallingCode and number
- [x] All required traveler fields are filled
- [x] Passport details are complete

---

## 🎯 Contact Information Flow

```
User fills traveler form
         ↓
Primary traveler has contact info
         ↓
On "Confirm & Pay" click
         ↓
Extract contact from primary traveler
         ↓
Create separate "contacts" object
         ↓
Send to API with all required fields
         ↓
Booking created successfully!
```

---

## 💡 Why Separate Contacts?

The API requires contacts separately because:

1. **Primary contact** for the booking (for confirmations, updates)
2. **Different from individual traveler contacts** (each traveler might have their own)
3. **Billing/payment contact** information
4. **Flight changes and notifications** go to this contact

---

## 🚨 Common Errors

### Error: "contacts are required"
**Solution:** Ensure contacts object is included with email and phone

### Error: "Invalid email format"
**Solution:** Validate email before sending

### Error: "Phone number required"
**Solution:** Ensure phone has both countryCallingCode and number

---

## ✅ Summary

The booking request now properly includes:
1. ✅ flightOffer
2. ✅ travelers (with embedded contact info)
3. ✅ **contacts** (extracted from primary traveler) - **FIXED!**
4. ✅ selectedSeats
5. ✅ paymentMethod

**The error "flightOffer, travelers, and contacts are required" should now be resolved!** 🎉

