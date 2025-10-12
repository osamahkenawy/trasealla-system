# ✈️ Airport API Integration - Updated

## 📋 Overview

The airport autocomplete has been updated to properly handle your actual API structure, including support for both `SingleAirport` and `AirportGroup` types.

---

## 🔌 API Endpoints

### 1. **Search Airports** (Autocomplete)
```
GET /api/airports/search?q=dubai&limit=10
```

**Response Structure:**
```json
{
    "airports": [
        {
            "__typename": "SingleAirport",
            "code": "DXB",
            "title": "Dubai",
            "country": "United Arab Emirates"
        }
    ],
    "__typename": "AirportAutocompleterResults"
}
```

### 2. **Get All Airports**
```
GET /api/airports?limit=100&active=true
```

**Response includes both SingleAirport and AirportGroup:**
```json
{
    "airports": [
        {
            "__typename": "SingleAirport",
            "code": "YYZ",
            "title": "Toronto",
            "country": "Canada"
        },
        {
            "__typename": "AirportGroup",
            "codes": ["AUH", "DXB", "SHJ"],
            "title": "United Arab Emirates",
            "country": "United Arab Emirates",
            "subAirports": [
                {
                    "code": "AUH",
                    "title": "Abu Dhabi",
                    "country": "United Arab Emirates",
                    "__typename": "SingleAirport"
                },
                {
                    "code": "DXB",
                    "title": "Dubai",
                    "country": "United Arab Emirates",
                    "__typename": "SingleAirport"
                }
            ]
        }
    ]
}
```

### 3. **Get Airport by Code**
```
GET /api/airports/DXB
```

**Response includes detailed information:**
```json
{
    "__typename": "SingleAirport",
    "code": "DXB",
    "title": "Dubai",
    "city": "Dubai",
    "country": "United Arab Emirates",
    "country_code": "AE",
    "timezone": "Asia/Dubai",
    "latitude": "25.25320000",
    "longitude": "55.36570000"
}
```

---

## 🔄 Updates Made

### 1. **flightsService.js** - Added 3 new functions

#### `searchAirports(query, limit)` - Updated
Now properly handles `AirportGroup` types by flattening subAirports:

```javascript
export const searchAirports = async (query, limit = 10) => {
  const response = await axiosInstance.get('/airports/search', {
    params: { q: query, limit }
  });
  
  // Flatten airport groups to include subAirports
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
};
```

#### `getAirportByCode(code)` - New
Get detailed airport information by IATA code:

```javascript
export const getAirportByCode = async (code) => {
  const response = await axiosInstance.get(`/airports/${code}`);
  return response.data;
};
```

**Usage:**
```javascript
const airport = await getAirportByCode('DXB');
console.log(airport.timezone); // "Asia/Dubai"
console.log(airport.city); // "Dubai"
```

#### `getAllAirports(limit, active)` - New
Get all airports with flattened groups:

```javascript
export const getAllAirports = async (limit = 100, active = true) => {
  const response = await axiosInstance.get('/airports', {
    params: { limit, active }
  });
  
  // Flatten airport groups
  // Returns all individual airports from groups
};
```

**Usage:**
```javascript
const allAirports = await getAllAirports(100, true);
// Returns flattened list of all airports
```

### 2. **AirportAutocomplete.jsx** - Enhanced Display

Now shows more detailed airport information:

**Before:**
```
DXB - Dubai
```

**After:**
```
DXB - Dubai (Dubai)
```

When city is different from title:
```
LHR - London Heathrow (London)
```

---

## 🎯 How Airport Groups Are Handled

### API Response with Groups:
```json
{
    "__typename": "AirportGroup",
    "codes": ["AUH", "DXB", "SHJ"],
    "title": "United Arab Emirates",
    "subAirports": [
        { "code": "AUH", "title": "Abu Dhabi", ... },
        { "code": "DXB", "title": "Dubai", ... },
        { "code": "SHJ", "title": "Sharjah", ... }
    ]
}
```

### After Flattening:
The service automatically extracts all subAirports so the UI receives:
```json
[
    { "code": "AUH", "title": "Abu Dhabi", "country": "United Arab Emirates" },
    { "code": "DXB", "title": "Dubai", "country": "United Arab Emirates" },
    { "code": "SHJ", "title": "Sharjah", "country": "United Arab Emirates" }
]
```

---

## 💻 Usage Examples

### 1. **Basic Airport Search**
```javascript
import { searchAirports } from '@/services/flightsService';

const results = await searchAirports('dubai', 10);
// Returns flattened list of airports matching "dubai"
```

### 2. **Get Airport Details**
```javascript
import { getAirportByCode } from '@/services/flightsService';

const airport = await getAirportByCode('DXB');
console.log(airport.timezone); // "Asia/Dubai"
console.log(airport.latitude); // "25.25320000"
```

### 3. **Load All Airports** (e.g., for a dropdown)
```javascript
import { getAllAirports } from '@/services/flightsService';

const airports = await getAllAirports(100, true);
// Returns all active airports, flattened
```

### 4. **Using in Components**
```jsx
import AirportAutocomplete from '@/components/flights/AirportAutocomplete';

<AirportAutocomplete
  label="Origin Airport"
  value={selectedAirport}
  onChange={(airport) => {
    console.log('Selected:', airport.code);
    console.log('City:', airport.city);
    console.log('Country:', airport.country);
    setSelectedAirport(airport);
  }}
/>
```

---

## 🗺️ Airport Data Structure

### Fields Available (from getAirportByCode):
```typescript
{
  __typename: "SingleAirport",
  code: string,          // IATA code (e.g., "DXB")
  title: string,         // Airport name (e.g., "Dubai")
  city: string,          // City name (e.g., "Dubai")
  country: string,       // Full country name
  country_code: string,  // ISO country code (e.g., "AE")
  timezone: string,      // IANA timezone (e.g., "Asia/Dubai")
  latitude: string,      // Latitude coordinate
  longitude: string      // Longitude coordinate
}
```

### Fields Available (from search):
```typescript
{
  __typename: "SingleAirport",
  code: string,
  title: string,
  country: string
}
```

---

## 🎨 UI Enhancements

### Airport Display Format:

**When city equals title:**
```
DXB - Dubai
```

**When city differs from title:**
```
LHR - London Heathrow (London)
LGW - London Gatwick (London)
```

**In dropdown list:**
```
✈️ DXB - Dubai
   Dubai

✈️ LHR - London Heathrow
   London
```

---

## 🔍 Search Behavior

1. **Minimum 2 characters** required to start search
2. **300ms debounce** to avoid excessive API calls
3. **Keyboard navigation** supported (arrow keys, enter, escape)
4. **Auto-grouping** by country when multiple airports match
5. **Click outside** to close dropdown

---

## 📊 Example Airport Groups in Your API

Based on your API response, these countries have airport groups:

- **India**: BLR, BOM, MAA, COK, DEL
- **Pakistan**: ISB, LHE
- **Philippines**: CEB, MNL
- **Saudi Arabia**: DMM, MED, RUH
- **Thailand**: BKK, HKT
- **United Arab Emirates**: AUH, DXB, SHJ
- **United Kingdom**: BHX, LGW, LHR, MAN

All subAirports are automatically flattened and displayed individually.

---

## ✅ Testing

### Test the Airport Search:
```bash
# 1. Start your server
npm run dev

# 2. Navigate to Flight Search
http://localhost:3000/flights/search

# 3. Test these searches:
- "dubai" → Should show DXB
- "london" → Should show LHR, LGW
- "india" → Should show BLR, BOM, MAA, COK, DEL
- "united arab" → Should show AUH, DXB, SHJ
```

### Test the API Directly:
```bash
# Search airports
curl 'http://localhost:5001/api/airports/search?q=dubai&limit=10'

# Get airport details
curl 'http://localhost:5001/api/airports/DXB'

# Get all airports
curl 'http://localhost:5001/api/airports?limit=100&active=true'
```

---

## 🐛 Troubleshooting

### Problem: Airport groups showing weird results
**Solution**: The service now automatically flattens groups. No action needed.

### Problem: City not showing in display
**Solution**: Only the `/airports/{code}` endpoint returns city. Search endpoint doesn't include it. This is expected.

### Problem: Too many results
**Solution**: Adjust the limit parameter: `searchAirports('query', 5)`

---

## 🚀 Future Enhancements

Potential improvements you could add:

1. **Cache airport data** in localStorage
2. **Recent searches** history
3. **Popular airports** at the top
4. **Airport icons/logos** for major airports
5. **Distance calculation** between airports
6. **Timezone display** in search results

---

## 📝 Summary

✅ **Updated** `searchAirports()` to handle airport groups  
✅ **Added** `getAirportByCode()` for detailed airport info  
✅ **Added** `getAllAirports()` for loading all airports  
✅ **Enhanced** airport display format  
✅ **Flattened** airport groups automatically  
✅ **Improved** user experience with better formatting  

All changes are backward compatible and work seamlessly with your existing code!

---

**Ready to use! Your airport search now fully supports the actual API structure.** ✈️

