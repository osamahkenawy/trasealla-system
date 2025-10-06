# Axios Interceptor Integration

This document explains the axios-based authentication system with automatic token refresh.

## 🎯 Overview

The application now uses **axios with interceptors** for API requests, providing:
- Automatic token attachment to requests
- Automatic token refresh on 401/403 errors
- Better error handling
- Unified API request management

## 📁 File Structure

```
├── config/
│   └── config.js                 # Environment configuration
├── src/
│   ├── plugins/
│   │   ├── Auth.js              # Authentication helper functions
│   │   └── axios.js             # Axios instance with interceptors
│   ├── context/
│   │   └── useAuthContext.jsx   # Auth context (updated to use axios)
│   └── utils/
│       └── api.js               # API utilities (fetch + axios)
```

## 🔧 Configuration

### 1. Environment Config (`config/config.js`)

```javascript
{
  development: {
    api_url: 'http://localhost:5001/api',
    api_port: null
  },
  production: {
    api_url: 'https://api.trasealla.com/api',
    api_port: null
  }
}
```

Update `NEXT_PUBLIC_API_URL` in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 🔐 Authentication Plugin (`src/plugins/Auth.js`)

Provides helper functions for authentication:

### Key Functions

```javascript
// Get portal name
getPortal() // Returns: 'admin'

// Get/Set items in localStorage
getItem(key)
setItem(key, value)

// Get auth token
getAuthToken(portal) // Returns: 'Bearer <token>'

// Save auth session
saveAuthSession({ token, refreshToken, user }, portal)

// Clear auth session
clearAuthSession(portal)

// Get current user
getCurrentUser(portal)

// Check authentication
isAuthenticated(portal)
```

### Storage Format

The system uses a dual-storage approach:

**New Format (innov-{portal}):**
```javascript
localStorage.setItem('innov-admin', JSON.stringify({
  token: 'eyJhbGc...',
  unauthorized: false,
  userInfo: { id: 1, name: 'John', role: 'admin' }
}));
localStorage.setItem('refresh_token', 'eyJhbGc...');
localStorage.setItem('token', 'eyJhbGc...');
localStorage.setItem('portal', 'admin');
```

**Backward Compatible (trasealla):**
```javascript
localStorage.setItem('trasealla_token', 'eyJhbGc...');
localStorage.setItem('trasealla_refresh_token', 'eyJhbGc...');
localStorage.setItem('trasealla_user', JSON.stringify(user));
localStorage.setItem('trasealla_user_role', 'admin');
```

## 🔄 Axios Instance (`src/plugins/axios.js`)

### Features

1. **Automatic Token Injection**
   - Reads token from localStorage on every request
   - Adds `Authorization: Bearer <token>` header
   - Adds timezone header

2. **Automatic Token Refresh**
   - Intercepts 401/403 responses
   - Calls refresh token endpoint
   - Retries original request with new token
   - Redirects to login if refresh fails

3. **Prevents Infinite Loops**
   - Uses `_retry` flag on requests
   - Single refresh promise for concurrent requests

### Interceptor Flow

```
┌─────────────┐
│   Request   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Add Auth Token  │
│ Add Timezone    │
└──────┬──────────┘
       │
       ▼
┌──────────────┐
│  Send Request│
└──────┬───────┘
       │
       ▼
  ┌────┴─────┐
  │          │
  ▼          ▼
200 OK    401/403
  │          │
  │          ▼
  │    ┌──────────┐
  │    │ Refresh  │
  │    │  Token   │
  │    └─────┬────┘
  │          │
  │     ┌────┴────┐
  │     │         │
  │     ▼         ▼
  │  Success   Failure
  │     │         │
  │     ▼         ▼
  │  Retry    Logout
  │  Request  Redirect
  │     │
  └─────┼─────────┐
        │         │
        ▼         ▼
    ┌────────────────┐
    │Return Response │
    └────────────────┘
```

## 💻 Usage Examples

### 1. Using in Components (Recommended)

```javascript
'use client';

import { useAuthContext } from '@/context/useAuthContext';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const { axiosInstance } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axiosInstance.get('users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [axiosInstance]);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 2. Direct Import

```javascript
import axiosInstance from '@/plugins/axios';

// GET request
const response = await axiosInstance.get('users');
const users = response.data.users;

// POST request
const response = await axiosInstance.post('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT request
const response = await axiosInstance.put('users/1', {
  name: 'Jane Doe'
});

// DELETE request
await axiosInstance.delete('users/1');

// With params
const response = await axiosInstance.get('users', {
  params: { page: 1, limit: 10 }
});
```

### 3. Using API Utilities

```javascript
import { axios } from '@/utils/api';

// GET with params
const response = await axios.get('users', { page: 1, limit: 10 });

// POST
const response = await axios.post('users', { name: 'John' });

// PUT
const response = await axios.put('users/1', { name: 'Jane' });

// DELETE
await axios.delete('users/1');
```

### 4. Error Handling

```javascript
try {
  const response = await axiosInstance.get('users');
  console.log(response.data);
} catch (error) {
  if (error.response) {
    // Server responded with error status
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    console.error('Headers:', error.response.headers);
  } else if (error.request) {
    // Request made but no response
    console.error('No response received');
  } else {
    // Error setting up request
    console.error('Error:', error.message);
  }
}
```

## 🔄 Token Refresh Process

### Backend Requirements

Your refresh token endpoint should be:

**POST** `/api/auth/external/refresh-token`

**Request:**
```json
{
  "refresh_token": "eyJhbGc...",
  "client": "PORTAL"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

### How It Works

1. **Request Fails with 401/403**
   - Interceptor catches the error
   - Checks if refresh is already in progress

2. **Refresh Token Call**
   - Calls `/auth/external/refresh-token`
   - Sends refresh token from localStorage
   - Includes `client: 'PORTAL'` parameter

3. **Update Tokens**
   - Saves new access and refresh tokens
   - Updates localStorage
   - Updates session data

4. **Retry Original Request**
   - Adds new token to original request
   - Retries the request
   - Returns response

5. **On Failure**
   - Clears all localStorage
   - Redirects to `/auth/sign-in`

## 🎨 API Endpoint Examples

### Define Your Endpoints

```javascript
// src/utils/api.js
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH_TOKEN_EXTERNAL: '/auth/external/refresh-token',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,
};
```

### Use Endpoints

```javascript
import { axiosInstance, API_ENDPOINTS } from '@/utils/api';

// Get users
const response = await axiosInstance.get(API_ENDPOINTS.USERS);

// Get specific user
const userId = 123;
const response = await axiosInstance.get(API_ENDPOINTS.USER_BY_ID(userId));

// Create product
const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS, {
  name: 'New Product',
  price: 99.99
});
```

## 🔐 Security Features

1. **Token in Request Header**
   - Always sent as `Authorization: Bearer <token>`
   - Never exposed in URL

2. **Automatic Refresh**
   - Seamless token renewal
   - No user interruption

3. **Secure Storage**
   - Tokens in localStorage (HttpOnly cookies preferred for production)
   - Session data encrypted (implement if needed)

4. **Timezone Tracking**
   - All requests include user timezone
   - Helps with audit logging

5. **Logout on Failure**
   - Automatic logout if refresh fails
   - Clear all sensitive data

## 🚨 Important Notes

### Concurrent Requests

The interceptor handles multiple concurrent requests efficiently:

```javascript
// All three will use the same refresh promise if token expires
Promise.all([
  axiosInstance.get('users'),
  axiosInstance.get('products'),
  axiosInstance.get('orders')
]);
```

Only **one** refresh token request is made, and all three requests wait for it.

### Preventing Infinite Loops

The `_retry` flag prevents infinite refresh loops:

```javascript
if (originalRequest._retry) {
  // Already tried to refresh, logout instead
  localStorage.clear();
  window.location.href = '/auth/sign-in';
  return Promise.reject(error);
}
originalRequest._retry = true;
```

## 🧪 Testing

### Test Token Refresh

1. Login to the application
2. Wait for token to expire (or manually expire it)
3. Make an API request
4. Check Network tab:
   - First request: 401 error
   - Refresh token request: Success
   - Retry original request: Success

### Test Logout on Refresh Failure

1. Login to the application
2. Manually delete/corrupt refresh_token in localStorage
3. Make an API request that requires auth
4. Should automatically logout and redirect to sign-in

## 📊 Comparison: Fetch vs Axios

| Feature | Fetch (old) | Axios (new) |
|---------|-------------|-------------|
| Auto token attachment | Manual | ✅ Automatic |
| Token refresh | Manual | ✅ Automatic |
| Error handling | Complex | ✅ Simple |
| Request cancellation | AbortController | ✅ Built-in |
| Request/Response transform | Manual | ✅ Built-in |
| Progress tracking | Limited | ✅ Easy |
| Interceptors | No | ✅ Yes |

## 🎯 Migration from Fetch

If you have existing fetch-based code:

**Old (Fetch):**
```javascript
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

**New (Axios):**
```javascript
const response = await axiosInstance.get('users');
const data = response.data;
```

Much simpler! Token and headers are automatic.

## 🐛 Troubleshooting

### Issue: Token not being attached

**Check:**
1. Token is saved in localStorage as `innov-admin` or `trasealla_token`
2. Auth plugin is correctly reading the token
3. Request interceptor is running

**Debug:**
```javascript
console.log(localStorage.getItem('innov-admin'));
console.log(localStorage.getItem('token'));
```

### Issue: Infinite refresh loop

**Solution:**
- Ensure `_retry` flag is set
- Check refresh endpoint returns correct data
- Verify refresh token is valid

### Issue: CORS errors

**Solution:**
- Update backend CORS settings
- Allow Authorization header
- Allow credentials if needed

## 📝 Best Practices

1. **Always use axios instance from context or direct import**
   ```javascript
   const { axiosInstance } = useAuthContext();
   ```

2. **Handle errors appropriately**
   ```javascript
   try {
     const response = await axiosInstance.get('users');
   } catch (error) {
     // Handle error
   }
   ```

3. **Use API_ENDPOINTS constants**
   ```javascript
   axiosInstance.get(API_ENDPOINTS.USERS);
   ```

4. **Don't store tokens in state if not needed**
   - They're automatically managed
   - Use auth context for user info

5. **Monitor network tab during development**
   - Verify requests include Authorization header
   - Check refresh token flow

## 🚀 Next Steps

1. ✅ Axios is installed and configured
2. ✅ Interceptors are set up
3. ✅ Auth context uses axios
4. ✅ Backward compatible with existing code

**Ready to use!** Start making API calls with automatic authentication.
