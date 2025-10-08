# Car Rental System - API Specification

## 1. API Overview

### 1.1 Base Information
- **Base URL**: `https://api.carrental.com/v1`
- **API Version**: v1
- **Protocol**: HTTPS
- **Authentication**: Bearer Token (JWT)
- **Content Type**: `application/json`
- **Rate Limiting**: 1000 requests per hour per user

### 1.2 API Standards
- **RESTful Design**: Following REST principles
- **HTTP Status Codes**: Standard HTTP status codes
- **Error Handling**: Consistent error response format
- **Pagination**: Cursor-based pagination for large datasets
- **Filtering**: Query parameter-based filtering
- **Sorting**: Query parameter-based sorting

## 2. Authentication & Authorization

### 2.1 Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "drivingLicense": "DL123456789",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "status": "pending_verification",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "User registered successfully. Please verify your email."
}
```

#### POST /auth/login
Authenticate user and return access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "userId": "user_123456",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

## 3. User Management APIs

### 3.1 User Profile

#### GET /users/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "user_123456",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01",
    "drivingLicense": "DL123456789",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US"
    },
    "preferences": {
      "notifications": {
        "email": true,
        "sms": true,
        "push": true
      },
      "language": "en",
      "currency": "USD"
    },
    "loyaltyPoints": 1500,
    "membershipTier": "gold",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /users/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "US"
  },
  "preferences": {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    }
  }
}
```

## 4. Vehicle Management APIs

### 4.1 Vehicle Search

#### GET /vehicles/search
Search for available vehicles.

**Query Parameters:**
- `location` (required): Pickup location coordinates or address
- `startDate` (required): Rental start date (ISO 8601)
- `endDate` (required): Rental end date (ISO 8601)
- `vehicleType`: Vehicle category (economy, compact, midsize, fullsize, luxury, suv, van)
- `transmission`: Transmission type (automatic, manual)
- `fuelType`: Fuel type (gasoline, hybrid, electric)
- `features`: Comma-separated features (gps, bluetooth, air_conditioning)
- `priceMin`: Minimum daily price
- `priceMax`: Maximum daily price
- `sortBy`: Sort field (price, distance, rating)
- `sortOrder`: Sort order (asc, desc)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Example Request:**
```
GET /vehicles/search?location=40.7128,-74.0060&startDate=2024-02-01T10:00:00Z&endDate=2024-02-03T10:00:00Z&vehicleType=compact&priceMax=100
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicles": [
      {
        "vehicleId": "vehicle_123",
        "make": "Toyota",
        "model": "Camry",
        "year": 2023,
        "category": "midsize",
        "transmission": "automatic",
        "fuelType": "gasoline",
        "seats": 5,
        "doors": 4,
        "features": ["gps", "bluetooth", "air_conditioning", "backup_camera"],
        "images": [
          "https://cdn.carrental.com/vehicles/toyota-camry-2023-1.jpg",
          "https://cdn.carrental.com/vehicles/toyota-camry-2023-2.jpg"
        ],
        "location": {
          "address": "123 Main St, New York, NY 10001",
          "coordinates": {
            "latitude": 40.7128,
            "longitude": -74.0060
          }
        },
        "pricing": {
          "dailyRate": 89.99,
          "totalPrice": 179.98,
          "currency": "USD",
          "taxes": 18.00,
          "fees": 25.00
        },
        "availability": {
          "available": true,
          "pickupTime": "2024-02-01T10:00:00Z",
          "returnTime": "2024-02-03T10:00:00Z"
        },
        "rating": 4.5,
        "reviewCount": 127
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 95,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrevious": false
    },
    "filters": {
      "applied": {
        "location": "40.7128,-74.0060",
        "startDate": "2024-02-01T10:00:00Z",
        "endDate": "2024-02-03T10:00:00Z",
        "vehicleType": "compact",
        "priceMax": 100
      },
      "available": {
        "vehicleTypes": ["economy", "compact", "midsize", "fullsize", "luxury", "suv", "van"],
        "priceRange": {
          "min": 45.99,
          "max": 299.99
        },
        "features": ["gps", "bluetooth", "air_conditioning", "backup_camera", "sunroof"]
      }
    }
  }
}
```

#### GET /vehicles/{vehicleId}
Get detailed information about a specific vehicle.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "vehicleId": "vehicle_123",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "vin": "1HGBH41JXMN109186",
    "licensePlate": "ABC123",
    "category": "midsize",
    "transmission": "automatic",
    "fuelType": "gasoline",
    "engineSize": "2.5L",
    "seats": 5,
    "doors": 4,
    "luggageCapacity": 3,
    "features": [
      {
        "name": "gps",
        "displayName": "GPS Navigation",
        "included": true
      },
      {
        "name": "bluetooth",
        "displayName": "Bluetooth Connectivity",
        "included": true
      },
      {
        "name": "air_conditioning",
        "displayName": "Air Conditioning",
        "included": true
      },
      {
        "name": "backup_camera",
        "displayName": "Backup Camera",
        "included": true
      }
    ],
    "images": [
      {
        "url": "https://cdn.carrental.com/vehicles/toyota-camry-2023-1.jpg",
        "alt": "Toyota Camry 2023 - Front View",
        "type": "exterior"
      },
      {
        "url": "https://cdn.carrental.com/vehicles/toyota-camry-2023-2.jpg",
        "alt": "Toyota Camry 2023 - Interior View",
        "type": "interior"
      }
    ],
    "location": {
      "address": "123 Main St, New York, NY 10001",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "pickupInstructions": "Vehicle is located in parking spot A-15. Key is in the lockbox."
    },
    "pricing": {
      "dailyRate": 89.99,
      "currency": "USD",
      "pricingBreakdown": {
        "baseRate": 79.99,
        "weekendSurcharge": 10.00,
        "locationFee": 0.00
      }
    },
    "availability": {
      "available": true,
      "nextAvailableDate": "2024-02-01T10:00:00Z"
    },
    "rating": 4.5,
    "reviewCount": 127,
    "reviews": [
      {
        "reviewId": "review_123",
        "userId": "user_456",
        "rating": 5,
        "comment": "Great car, very clean and comfortable!",
        "createdAt": "2024-01-10T14:30:00Z"
      }
    ],
    "insurance": {
      "coverage": "Full coverage included",
      "deductible": 500.00,
      "additionalOptions": [
        {
          "name": "premium_insurance",
          "displayName": "Premium Insurance",
          "dailyRate": 15.99,
          "description": "Reduces deductible to $100"
        }
      ]
    }
  }
}
```

## 5. Booking Management APIs

### 5.1 Booking Operations

#### POST /bookings
Create a new booking.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "vehicleId": "vehicle_123",
  "pickupLocation": {
    "address": "123 Main St, New York, NY 10001",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  },
  "returnLocation": {
    "address": "456 Oak Ave, New York, NY 10002",
    "coordinates": {
      "latitude": 40.7589,
      "longitude": -73.9851
    }
  },
  "pickupDateTime": "2024-02-01T10:00:00Z",
  "returnDateTime": "2024-02-03T10:00:00Z",
  "driverInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "drivingLicense": "DL123456789",
    "dateOfBirth": "1990-01-01"
  },
  "additionalDrivers": [
    {
      "firstName": "Jane",
      "lastName": "Doe",
      "drivingLicense": "DL987654321",
      "dateOfBirth": "1992-05-15"
    }
  ],
  "insurance": {
    "type": "standard",
    "additionalOptions": ["premium_insurance"]
  },
  "extras": [
    {
      "name": "gps",
      "displayName": "GPS Navigation",
      "price": 0.00,
      "included": true
    },
    {
      "name": "child_seat",
      "displayName": "Child Safety Seat",
      "price": 12.99,
      "included": false
    }
  ],
  "paymentMethod": {
    "type": "credit_card",
    "cardId": "card_123456"
  },
  "specialRequests": "Please ensure the car is clean and has a full tank of gas."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "booking_789",
    "status": "confirmed",
    "vehicle": {
      "vehicleId": "vehicle_123",
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "licensePlate": "ABC123"
    },
    "pickupLocation": {
      "address": "123 Main St, New York, NY 10001",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      }
    },
    "returnLocation": {
      "address": "456 Oak Ave, New York, NY 10002",
      "coordinates": {
        "latitude": 40.7589,
        "longitude": -73.9851
      }
    },
    "pickupDateTime": "2024-02-01T10:00:00Z",
    "returnDateTime": "2024-02-03T10:00:00Z",
    "duration": {
      "days": 2,
      "hours": 48
    },
    "pricing": {
      "subtotal": 179.98,
      "taxes": 18.00,
      "fees": 25.00,
      "extras": 12.99,
      "total": 235.97,
      "currency": "USD"
    },
    "payment": {
      "method": "credit_card",
      "status": "completed",
      "transactionId": "txn_456789",
      "paidAt": "2024-01-15T14:30:00Z"
    },
    "confirmationNumber": "CR-2024-001234",
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

#### GET /bookings
Get user's booking history.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status`: Filter by booking status (pending, confirmed, active, completed, cancelled)
- `startDate`: Filter bookings from this date
- `endDate`: Filter bookings until this date
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "bookingId": "booking_789",
        "status": "confirmed",
        "vehicle": {
          "make": "Toyota",
          "model": "Camry",
          "year": 2023,
          "image": "https://cdn.carrental.com/vehicles/toyota-camry-2023-1.jpg"
        },
        "pickupDateTime": "2024-02-01T10:00:00Z",
        "returnDateTime": "2024-02-03T10:00:00Z",
        "pickupLocation": "123 Main St, New York, NY 10001",
        "returnLocation": "456 Oak Ave, New York, NY 10002",
        "totalPrice": 235.97,
        "currency": "USD",
        "confirmationNumber": "CR-2024-001234",
        "createdAt": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 45,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

#### GET /bookings/{bookingId}
Get detailed information about a specific booking.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "booking_789",
    "status": "confirmed",
    "vehicle": {
      "vehicleId": "vehicle_123",
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "licensePlate": "ABC123",
      "vin": "1HGBH41JXMN109186",
      "images": [
        "https://cdn.carrental.com/vehicles/toyota-camry-2023-1.jpg"
      ]
    },
    "pickupLocation": {
      "address": "123 Main St, New York, NY 10001",
      "coordinates": {
        "latitude": 40.7128,
        "longitude": -74.0060
      },
      "instructions": "Vehicle is located in parking spot A-15. Key is in the lockbox."
    },
    "returnLocation": {
      "address": "456 Oak Ave, New York, NY 10002",
      "coordinates": {
        "latitude": 40.7589,
        "longitude": -73.9851
      },
      "instructions": "Return vehicle to designated return area. Leave key in the lockbox."
    },
    "pickupDateTime": "2024-02-01T10:00:00Z",
    "returnDateTime": "2024-02-03T10:00:00Z",
    "duration": {
      "days": 2,
      "hours": 48
    },
    "driverInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "drivingLicense": "DL123456789"
    },
    "additionalDrivers": [
      {
        "firstName": "Jane",
        "lastName": "Doe",
        "drivingLicense": "DL987654321"
      }
    ],
    "pricing": {
      "subtotal": 179.98,
      "taxes": 18.00,
      "fees": 25.00,
      "extras": 12.99,
      "total": 235.97,
      "currency": "USD",
      "breakdown": {
        "dailyRate": 89.99,
        "days": 2,
        "baseAmount": 179.98,
        "taxRate": 0.10,
        "taxAmount": 18.00,
        "serviceFee": 15.00,
        "locationFee": 10.00,
        "extras": [
          {
            "name": "child_seat",
            "price": 12.99
          }
        ]
      }
    },
    "payment": {
      "method": "credit_card",
      "status": "completed",
      "transactionId": "txn_456789",
      "paidAt": "2024-01-15T14:30:00Z",
      "cardLast4": "1234"
    },
    "insurance": {
      "type": "standard",
      "coverage": "Full coverage included",
      "deductible": 500.00,
      "additionalOptions": [
        {
          "name": "premium_insurance",
          "displayName": "Premium Insurance",
          "price": 15.99,
          "included": true
        }
      ]
    },
    "extras": [
      {
        "name": "gps",
        "displayName": "GPS Navigation",
        "price": 0.00,
        "included": true
      },
      {
        "name": "child_seat",
        "displayName": "Child Safety Seat",
        "price": 12.99,
        "included": false
      }
    ],
    "confirmationNumber": "CR-2024-001234",
    "specialRequests": "Please ensure the car is clean and has a full tank of gas.",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T14:25:00Z",
        "note": "Booking created"
      },
      {
        "status": "confirmed",
        "timestamp": "2024-01-15T14:30:00Z",
        "note": "Payment processed successfully"
      }
    ],
    "createdAt": "2024-01-15T14:30:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

#### PUT /bookings/{bookingId}/cancel
Cancel a booking.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "reason": "Change of plans",
  "refundPreference": "original_payment_method"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bookingId": "booking_789",
    "status": "cancelled",
    "cancellationFee": 25.00,
    "refundAmount": 210.97,
    "refundMethod": "credit_card",
    "refundTransactionId": "refund_789",
    "cancelledAt": "2024-01-16T10:00:00Z",
    "refundProcessedAt": "2024-01-16T10:05:00Z"
  },
  "message": "Booking cancelled successfully. Refund will be processed within 3-5 business days."
}
```

## 6. Payment Management APIs

### 6.1 Payment Methods

#### GET /payments/methods
Get user's saved payment methods.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "methodId": "card_123456",
        "type": "credit_card",
        "brand": "visa",
        "last4": "1234",
        "expiryMonth": 12,
        "expiryYear": 2025,
        "holderName": "John Doe",
        "isDefault": true,
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "methodId": "card_789012",
        "type": "credit_card",
        "brand": "mastercard",
        "last4": "5678",
        "expiryMonth": 8,
        "expiryYear": 2026,
        "holderName": "John Doe",
        "isDefault": false,
        "createdAt": "2024-01-10T00:00:00Z"
      }
    ]
  }
}
```

#### POST /payments/methods
Add a new payment method.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "type": "credit_card",
  "cardNumber": "4111111111111111",
  "expiryMonth": 12,
  "expiryYear": 2025,
  "cvv": "123",
  "holderName": "John Doe",
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "methodId": "card_345678",
    "type": "credit_card",
    "brand": "visa",
    "last4": "1111",
    "expiryMonth": 12,
    "expiryYear": 2025,
    "holderName": "John Doe",
    "isDefault": false,
    "createdAt": "2024-01-20T15:30:00Z"
  },
  "message": "Payment method added successfully."
}
```

## 7. Error Handling

### 7.1 Error Response Format
All API errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ],
    "timestamp": "2024-01-15T14:30:00Z",
    "requestId": "req_123456"
  }
}
```

### 7.2 HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

### 7.3 Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `DUPLICATE_RESOURCE`: Resource already exists
- `PAYMENT_ERROR`: Payment processing failed
- `BOOKING_ERROR`: Booking operation failed
- `VEHICLE_UNAVAILABLE`: Vehicle not available
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVICE_UNAVAILABLE`: External service unavailable

## 8. Rate Limiting

### 8.1 Rate Limits
- **Authentication endpoints**: 5 requests per minute
- **Search endpoints**: 100 requests per hour
- **Booking endpoints**: 20 requests per hour
- **General API**: 1000 requests per hour

### 8.2 Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 9. Webhooks

### 9.1 Webhook Events
- `booking.created`: New booking created
- `booking.confirmed`: Booking confirmed
- `booking.cancelled`: Booking cancelled
- `payment.completed`: Payment processed
- `payment.failed`: Payment failed
- `vehicle.available`: Vehicle becomes available
- `vehicle.unavailable`: Vehicle becomes unavailable

### 9.2 Webhook Payload
```json
{
  "event": "booking.created",
  "timestamp": "2024-01-15T14:30:00Z",
  "data": {
    "bookingId": "booking_789",
    "userId": "user_123456",
    "vehicleId": "vehicle_123",
    "status": "pending"
  }
}
```

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Next Review: [Date + 3 months]*
