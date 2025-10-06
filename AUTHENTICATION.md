# Authentication System Documentation

This document explains how the authentication system works in the Trasealla Admin Panel.

## Overview

The application uses a token-based authentication system with the following features:

- JWT token authentication
- Automatic token refresh
- Protected routes via middleware
- Persistent sessions using localStorage and cookies
- Role-based access control

## Architecture

### Components

1. **Auth Utilities** (`src/utils/auth.js`)
   - Token management functions
   - localStorage operations
   - Token validation and decoding
   - Authenticated fetch wrapper with auto-refresh

2. **Auth Context** (`src/context/useAuthContext.jsx`)
   - Global authentication state management
   - Login/logout functions
   - User information access
   - Cookie synchronization for middleware

3. **Middleware** (`src/middleware.js`)
   - Route protection
   - Automatic redirects based on authentication status
   - Token verification from cookies

4. **Protected Route Component** (`src/components/ProtectedRoute.jsx`)
   - Client-side route protection
   - Role-based access control
   - Loading states

5. **Sign In Component** (`src/app/(other)/auth/sign-in/components/SignIn.jsx`)
   - Login form with validation
   - API integration
   - Error handling
   - Success feedback

## Authentication Flow

### Login Process

1. User enters credentials on sign-in page
2. Form validation occurs
3. API request sent to `/api/auth/login`
4. On success:
   - Tokens saved to localStorage
   - Token set as HTTP cookie
   - User data stored
   - Redirect to dashboard based on role
5. On failure:
   - Error message displayed
   - Form remains accessible

### Protected Routes

#### Middleware Protection (Server-side)

The middleware runs on every request and:
1. Checks for `trasealla_token` cookie
2. Identifies route type (public/protected)
3. Redirects unauthenticated users to sign-in
4. Redirects authenticated users away from auth pages

Protected routes include:
- `/dashboards`
- `/base-ui/*`
- `/forms/*`
- `/tables/*`
- `/icons/*`
- `/apex-chart/*`
- `/maps/*`
- `/services/*`

Public routes include:
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/reset-password`
- `/auth/lock-screen`
- `/error-pages/*`

#### Client Protection

Use the `ProtectedRoute` component for additional client-side protection:

```jsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <YourComponent />
    </ProtectedRoute>
  );
}
```

### Token Refresh

The system automatically handles token refresh:

1. When an API request returns 401 (Unauthorized)
2. The `authenticatedFetch` function attempts to refresh the token
3. Using the refresh token from localStorage
4. If successful, retries the original request
5. If refresh fails, user is logged out

### Logout Process

1. User clicks logout in ProfileDropdown
2. `logout()` function called from auth context
3. All auth data cleared from localStorage
4. Token cookie removed
5. Redirect to sign-in page

## Usage Examples

### Using Auth Context

```jsx
'use client';

import { useAuthContext } from '@/context/useAuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuthContext();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Requests

```jsx
import { get, post } from '@/utils/api';

// GET request
const fetchUsers = async () => {
  try {
    const data = await get('/users');
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// POST request
const createUser = async (userData) => {
  try {
    const data = await post('/users', userData);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
  }
};
```

### Using Authenticated Fetch Directly

```jsx
import { authenticatedFetch } from '@/utils/auth';

const response = await authenticatedFetch('http://localhost:5001/api/users', {
  method: 'GET',
});

const data = await response.json();
```

## Storage Structure

### localStorage

```javascript
{
  "trasealla_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "trasealla_refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "trasealla_user": "{\"id\":1,\"name\":\"John Doe\",\"email\":\"john@example.com\",\"role\":\"admin\"}",
  "trasealla_user_role": "admin"
}
```

### Cookies

```
trasealla_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; Expires=...
```

## API Integration

### Expected API Response Format

#### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Token Refresh Endpoint

**POST** `/api/auth/refresh`

Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Security Considerations

1. **Token Storage**: Tokens are stored in both localStorage (for client access) and HTTP cookies (for middleware)

2. **Token Expiration**: The system checks token expiration and refreshes automatically

3. **HTTPS**: In production, ensure all API requests use HTTPS

4. **Cookie Settings**: Cookies use `SameSite=Lax` to prevent CSRF attacks

5. **XSS Protection**: Keep dependencies updated and sanitize user inputs

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Troubleshooting

### Issue: User keeps getting logged out

**Solution**: Check if:
- API returns valid tokens
- Token expiration time is reasonable
- Refresh token endpoint is working

### Issue: Middleware not protecting routes

**Solution**: Ensure:
- Token is set as cookie (check `document.cookie`)
- Middleware matcher includes the route
- Cookie name matches exactly: `trasealla_token`

### Issue: API requests fail with 401

**Solution**: Verify:
- Token is not expired
- Authorization header is set correctly: `Bearer <token>`
- Backend accepts the token format

## Future Enhancements

- [ ] Remember me functionality
- [ ] Multi-factor authentication
- [ ] Session timeout warnings
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
- [ ] Email verification
- [ ] Social authentication (Google, Facebook, etc.)

## Support

For issues or questions, please contact the development team.
