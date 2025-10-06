# Quick Start Guide - Authentication Setup

## 🚀 Getting Started in 3 Steps

### Step 1: Configure Environment

Create a `.env.local` file in the root directory:

```bash
# Copy this content to .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Step 2: Install Dependencies (if not already done)

```bash
npm install
# or
yarn install
# or
bun install
```

### Step 3: Run the Application

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The app will be available at `http://localhost:3000`

## 🔐 Testing Authentication

### 1. Access the Application

Open your browser and go to: `http://localhost:3000`

You'll be automatically redirected to `/auth/sign-in`

### 2. Login

Use your backend credentials to log in. The form expects:
- Email address
- Password (minimum 6 characters)

### 3. What Happens After Login?

✅ Token is saved to localStorage  
✅ Token is set as HTTP cookie  
✅ User data is stored  
✅ You're redirected to `/dashboards`  

### 4. Try Accessing Protected Routes

All these routes now require authentication:
- `/dashboards` - Main dashboard
- `/base-ui/*` - UI components
- `/forms/*` - Form pages
- `/tables/*` - Table pages
- `/icons/*` - Icon pages
- `/apex-chart` - Charts
- `/maps/*` - Maps
- `/services/*` - Services

### 5. Logout

Click your profile icon in the top right → Click "Logout"

You'll be redirected back to `/auth/sign-in`

## 🧪 Testing Scenarios

### Test 1: Unauthenticated Access
1. Open browser in incognito mode
2. Navigate to `http://localhost:3000/dashboards`
3. ✅ Should redirect to `/auth/sign-in`

### Test 2: Successful Login
1. Go to `/auth/sign-in`
2. Enter valid credentials
3. Submit form
4. ✅ Should see success message
5. ✅ Should redirect to `/dashboards`

### Test 3: Invalid Credentials
1. Go to `/auth/sign-in`
2. Enter invalid credentials
3. Submit form
4. ✅ Should see error message
5. ✅ Should stay on login page

### Test 4: Already Logged In
1. Login successfully
2. Try to access `/auth/sign-in` again
3. ✅ Should redirect to `/dashboards`

### Test 5: Token Persistence
1. Login successfully
2. Close browser
3. Open browser again
4. Navigate to `http://localhost:3000`
5. ✅ Should redirect to `/dashboards` (still logged in)

### Test 6: Logout
1. While logged in, click profile dropdown
2. Click "Logout"
3. ✅ Should clear all tokens
4. ✅ Should redirect to `/auth/sign-in`
5. Try accessing `/dashboards`
6. ✅ Should redirect back to `/auth/sign-in`

## 📡 API Integration Checklist

Make sure your backend has:

- [ ] **Login Endpoint**: `POST /api/auth/login`
  ```json
  Request: { "email": "user@example.com", "password": "password123" }
  Response: {
    "success": true,
    "data": {
      "user": { "id": 1, "name": "John", "email": "john@example.com", "role": "admin" },
      "token": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
  ```

- [ ] **Refresh Token Endpoint**: `POST /api/auth/refresh`
  ```json
  Request: { "refreshToken": "eyJhbGc..." }
  Response: {
    "success": true,
    "data": {
      "token": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
  ```

- [ ] **Protected Endpoints**: Accept `Authorization: Bearer <token>` header

- [ ] **CORS**: Allow requests from `http://localhost:3000`

## 🛠️ Using Auth in Your Components

### Example 1: Display User Info

```jsx
'use client';

import { useAuthContext } from '@/context/useAuthContext';

export default function UserGreeting() {
  const { user } = useAuthContext();
  
  return <h1>Welcome, {user?.name}!</h1>;
}
```

### Example 2: Conditional Rendering

```jsx
'use client';

import { useAuthContext } from '@/context/useAuthContext';

export default function AdminPanel() {
  const { isAuthenticated, role } = useAuthContext();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  if (role !== 'admin') {
    return <p>Admin access required</p>;
  }
  
  return <div>Admin Panel Content</div>;
}
```

### Example 3: Logout Button

```jsx
'use client';

import { useAuthContext } from '@/context/useAuthContext';

export default function LogoutButton() {
  const { logout } = useAuthContext();
  
  return (
    <button onClick={logout} className="btn btn-danger">
      Logout
    </button>
  );
}
```

### Example 4: Fetch User Data

```jsx
'use client';

import { get } from '@/utils/api';
import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await get('/users');
        setUsers(data.users);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    
    fetchUsers();
  }, []);
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## 🔍 Debugging Tips

### Check if Token is Saved

Open browser console:
```javascript
// Check localStorage
localStorage.getItem('trasealla_token')

// Check cookies
document.cookie
```

### Check Authentication State

```javascript
// In any component
const { user, token, isAuthenticated } = useAuthContext();
console.log({ user, token, isAuthenticated });
```

### Network Issues

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Check the request to `/api/auth/login`
5. Verify:
   - Status: Should be 200
   - Response format matches expected structure
   - Token is present in response

### Common Issues

**Issue**: "Cannot read property 'name' of null"
- **Solution**: User not authenticated yet. Use optional chaining: `user?.name`

**Issue**: Stuck on login page after successful login
- **Solution**: Check if redirect is working. Verify `getRedirectPath()` logic

**Issue**: Token expired immediately
- **Solution**: Check token expiration time on backend (should be at least 1 hour)

**Issue**: 401 errors on API requests
- **Solution**: Verify `Authorization` header is being sent with `Bearer <token>`

## 📚 Additional Resources

- **Full Documentation**: See `AUTHENTICATION.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Code Examples**: Check the actual implementation files

## 🎯 Next Steps

1. ✅ Configure `.env.local` with your API URL
2. ✅ Start the dev server
3. ✅ Test login with your backend
4. ✅ Explore protected routes
5. ✅ Customize for your needs
6. 📖 Read full documentation for advanced features

## 💡 Pro Tips

1. **Development**: Use browser DevTools to inspect tokens and cookies
2. **Testing**: Use incognito mode to test unauthenticated flows
3. **Security**: Never expose tokens in console.log in production
4. **Debugging**: Enable verbose logging during development
5. **Performance**: Token refresh happens automatically - no need to handle manually

## 🤝 Need Help?

1. Check `AUTHENTICATION.md` for detailed documentation
2. Review `IMPLEMENTATION_SUMMARY.md` for architecture details
3. Look at the implemented components for code examples
4. Check browser console for error messages

---

**Ready to go!** 🚀 Start by configuring your `.env.local` file and testing the login flow.
