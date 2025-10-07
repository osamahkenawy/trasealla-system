# API Authentication Fix

## 🐛 Issue Identified

The contacts page was giving 401 unauthorized errors and removing tokens from localStorage, causing users to be redirected to the login page.

## 🔍 Root Causes

1. **Wrong API URL**: Config was pointing to `localhost:5001` but backend is on `localhost:5000`
2. **Incorrect refresh token endpoint**: Using `/auth/external/refresh-token` instead of `/auth/refresh`
3. **Wrong request format**: Using `refresh_token` instead of `refreshToken`
4. **Response data structure mismatch**: Expected different token field names

## ✅ Fixes Applied

### **1. Fixed API Configuration**

**File**: `config/config.js`

**Before**:
```javascript
api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'
```

**After**:
```javascript
api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
```

### **2. Fixed Refresh Token Endpoint**

**File**: `src/plugins/axios.js`

**Before**:
```javascript
const response = await axios.post(getBaseUrl() + 'auth/external/refresh-token', {
  refresh_token: refreshingToken,
  client: 'PORTAL'
});
```

**After**:
```javascript
const response = await axios.post(getBaseUrl() + 'auth/refresh', {
  refreshToken: refreshingToken
});
```

### **3. Fixed Token Response Structure**

**Before**:
```javascript
const { access_token, refresh_token } = response.data;
```

**After**:
```javascript
const { token, refreshToken } = response.data.data || response.data;
```

### **4. Enhanced Error Handling**

**File**: `src/app/(admin)/contacts/components/ContactsList.jsx`

- Added token validation before API calls
- Enhanced error logging for debugging
- Proper 401 error handling with redirect
- Clear error messages for users

### **5. Added Debugging**

**File**: `src/services/contactsService.js`

- Added console logs for API calls
- Enhanced error logging
- API base URL logging

## 🧪 Testing the Fix

### **Steps to Test**

1. **Login** to the admin panel
2. **Check browser console** for any authentication errors
3. **Navigate** to Contacts page
4. **Verify** that:
   - No 401 errors in console
   - Token is not removed from localStorage
   - Contacts page loads successfully
   - API calls work properly

### **Debug Information**

The following will be logged to console:
- Current token status
- API base URL being used
- Request parameters
- Response data
- Any error details

## 🔧 API Endpoints Used

Based on your Postman collection:

```javascript
// Health check
GET http://localhost:5000/health

// Authentication
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/refresh
GET http://localhost:5000/api/auth/me

// Contacts
GET http://localhost:5000/api/contact
GET http://localhost:5000/api/contact/{id}
PUT http://localhost:5000/api/contact/{id}/status
POST http://localhost:5000/api/contact/{id}/respond
GET http://localhost:5000/api/contact/stats
```

## 🎯 Expected Behavior

### **Before Fix**
1. User clicks Contacts
2. API call fails with 401
3. Token removed from localStorage
4. User redirected to login

### **After Fix**
1. User clicks Contacts
2. API call succeeds with valid token
3. Token remains in localStorage
4. Contacts page loads with data

## 🚨 Troubleshooting

### **If Still Getting 401 Errors**

1. **Check backend is running** on `localhost:5000`
2. **Verify token format** in localStorage
3. **Check network tab** for actual API calls
4. **Verify API endpoints** match your backend

### **Debug Commands**

```javascript
// Check token in console
console.log('Token:', localStorage.getItem('trasealla_token'));

// Check API base URL
console.log('API URL:', axiosInstance.defaults.baseURL);

// Test API health
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(console.log);
```

## 📝 Files Modified

1. **`config/config.js`** - Fixed API URL
2. **`src/plugins/axios.js`** - Fixed refresh token logic
3. **`src/services/contactsService.js`** - Added debugging
4. **`src/app/(admin)/contacts/components/ContactsList.jsx`** - Enhanced error handling

## 🎉 Result

The contacts page should now:
- ✅ Load without 401 errors
- ✅ Maintain authentication tokens
- ✅ Successfully fetch contacts data
- ✅ Handle token refresh properly
- ✅ Provide clear error messages

---

**Fix Applied**: October 6, 2025  
**Status**: ✅ Ready for Testing  
**Backend URL**: `http://localhost:5000/api`
