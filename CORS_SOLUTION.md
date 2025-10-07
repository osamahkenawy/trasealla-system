# CORS Error Solution

## 🚨 Problem
You're getting a CORS error: `strict-origin-when-cross-origin` when making API requests from your frontend to your backend.

## 🔍 Root Cause
Your backend server at `http://localhost:5001` is not configured to allow requests from your frontend origin (`http://localhost:3000` or your domain).

## ✅ Solution Steps

### Step 1: Update Your Backend CORS Configuration

**For Express.js/Node.js Backend:**

Add this to your backend server file (usually `app.js`, `server.js`, or `index.js`):

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',        // Next.js development
    'http://localhost:3001',        // Alternative Next.js port
    'https://yourdomain.com',       // Your production domain
    'https://admin.yourdomain.com'  // Your admin subdomain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'timezone'
  ],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware BEFORE your routes
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Your other middleware and routes...
```

**If you don't have the cors package installed:**
```bash
npm install cors
# or
yarn add cors
```

### Step 2: Restart Your Backend Server

After updating the CORS configuration:
```bash
# Stop your backend server (Ctrl+C)
# Then restart it
npm start
# or
yarn start
# or
node server.js
```

### Step 3: Test the Fix

1. **Open your browser's Developer Tools** (F12)
2. **Go to the Network tab**
3. **Try to make an API request** from your frontend
4. **Check the request headers** - you should see CORS headers in the response

### Step 4: Verify CORS Headers

In the Network tab, look for these headers in the response:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

## 🧪 Quick Test

Run this in your browser console to test CORS:

```javascript
fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(response => {
  console.log('✅ CORS working!', response);
})
.catch(error => {
  console.log('❌ CORS error:', error);
});
```

## 🔧 Alternative Backend Frameworks

### Fastify
```javascript
await fastify.register(require('@fastify/cors'), {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'timezone']
});
```

### NestJS
```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'timezone']
});
```

### Django
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com",
]
CORS_ALLOW_CREDENTIALS = True
```

## 🚨 Common Issues

### Issue 1: Still getting CORS errors after configuration
**Solution**: 
- Make sure CORS middleware is applied BEFORE your routes
- Restart your backend server
- Clear browser cache

### Issue 2: "Authorization header not allowed"
**Solution**: Add 'Authorization' to allowedHeaders:
```javascript
allowedHeaders: [
  'Content-Type',
  'Authorization',  // Add this
  'X-Requested-With',
  'Accept',
  'Origin',
  'timezone'
]
```

### Issue 3: Preflight requests failing
**Solution**: Make sure you handle OPTIONS requests:
```javascript
app.options('*', cors(corsOptions));
```

## 🔒 Security Note

**For Development Only** (NOT for production):
```javascript
// ❌ ONLY FOR DEVELOPMENT - NOT SECURE
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
```

**For Production**:
```javascript
// ✅ SECURE - Specify exact origins
origin: [
  'https://yourdomain.com',
  'https://admin.yourdomain.com'
]
```

## 📋 Checklist

- [ ] Backend CORS middleware configured
- [ ] CORS middleware applied BEFORE routes
- [ ] Backend server restarted
- [ ] Frontend origin added to allowed origins
- [ ] Authorization header added to allowed headers
- [ ] OPTIONS requests handled
- [ ] Tested in browser console
- [ ] CORS headers visible in Network tab

## 🎯 Expected Result

After implementing the CORS configuration:
- ✅ API requests work from your frontend
- ✅ No more CORS errors in browser console
- ✅ CORS headers visible in Network tab
- ✅ Authentication and other API calls function properly

The CORS error should be completely resolved once you properly configure your backend server!
