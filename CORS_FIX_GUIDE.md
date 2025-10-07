# CORS Error Fix Guide

## Problem
You're getting a CORS error: `strict-origin-when-cross-origin`. This happens when your frontend (Next.js app) tries to make requests to your backend API, but the backend doesn't allow cross-origin requests.

## Root Cause
CORS (Cross-Origin Resource Sharing) is a security feature implemented by web browsers. When your frontend runs on `http://localhost:3000` (or your domain) and tries to access your backend on `http://localhost:5001`, the browser blocks the request unless the backend explicitly allows it.

## Solution: Backend CORS Configuration

### For Express.js Backend

Add this to your backend server configuration:

```javascript
// In your main server file (app.js, server.js, or index.js)
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',        // Next.js development server
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
  optionsSuccessStatus: 200 // For legacy browser support
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Your other middleware and routes...
```

### For Fastify Backend

```javascript
// In your main server file
const fastify = require('fastify')({ logger: true });

// Register CORS plugin
await fastify.register(require('@fastify/cors'), {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://yourdomain.com',
    'https://admin.yourdomain.com'
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
  ]
});
```

### For NestJS Backend

```typescript
// In your main.ts file
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourdomain.com',
      'https://admin.yourdomain.com'
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
    exposedHeaders: ['Authorization']
  });
  
  await app.listen(5001);
}
bootstrap();
```

### For Django Backend

```python
# Install django-cors-headers
# pip install django-cors-headers

# In settings.py
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
]

MIDDLEWARE = [
    # ... other middleware
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://yourdomain.com",
    "https://admin.yourdomain.com",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_ALL_ORIGINS = False  # Set to True only for development

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'timezone',
]
```

### For Laravel Backend

```php
// Install fruitcake/laravel-cors
// composer require fruitcake/laravel-cors

// In config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://yourdomain.com',
        'https://admin.yourdomain.com'
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

## Frontend Configuration (Already Done)

Your frontend is already configured correctly:

```javascript
// src/plugins/axios.js
const options = {
  baseURL: 'http://localhost:5001/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'timezone': getTimezone()
  },
  withCredentials: false, // Correct for CORS
  timeout: 10000
};
```

## Testing CORS Configuration

### 1. Check if CORS headers are present:

```bash
# Test with curl
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:5001/api/auth/login
```

You should see headers like:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### 2. Test in browser console:

```javascript
// Open browser console on your frontend
fetch('http://localhost:5001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(response => console.log('Success:', response))
.catch(error => console.log('CORS Error:', error));
```

## Common Issues and Solutions

### Issue 1: "Access to fetch at '...' from origin '...' has been blocked by CORS policy"

**Solution**: Add your frontend origin to the backend CORS allowed origins list.

### Issue 2: "Request header field authorization is not allowed by Access-Control-Allow-Headers"

**Solution**: Add 'Authorization' to the allowed headers list in your backend CORS configuration.

### Issue 3: "Response to preflight request doesn't pass access control check"

**Solution**: Make sure your backend handles OPTIONS requests properly and returns the correct CORS headers.

### Issue 4: Still getting CORS errors after configuration

**Solutions**:
1. Restart your backend server after making CORS changes
2. Clear browser cache and cookies
3. Check if you're using the correct origin URLs
4. Verify that the CORS middleware is applied before your routes

## Development vs Production

### Development
```javascript
// Allow localhost origins
origin: [
  'http://localhost:3000',
  'http://localhost:3001'
]
```

### Production
```javascript
// Allow your actual domains
origin: [
  'https://yourdomain.com',
  'https://admin.yourdomain.com'
]
```

## Security Considerations

1. **Never use wildcard origins in production**:
   ```javascript
   // ❌ DON'T DO THIS IN PRODUCTION
   origin: '*'
   
   // ✅ DO THIS INSTEAD
   origin: ['https://yourdomain.com']
   ```

2. **Use HTTPS in production**:
   ```javascript
   origin: [
     'https://yourdomain.com',  // ✅ HTTPS
     'http://localhost:3000'    // ✅ Only for development
   ]
   ```

3. **Limit allowed methods and headers**:
   ```javascript
   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Only what you need
   allowedHeaders: ['Content-Type', 'Authorization'] // Only what you need
   ```

## Quick Fix for Development

If you need a quick fix for development only (NOT for production):

```javascript
// ❌ ONLY FOR DEVELOPMENT - NOT SECURE FOR PRODUCTION
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
```

## Next Steps

1. **Update your backend** with the appropriate CORS configuration
2. **Restart your backend server**
3. **Test the API calls** from your frontend
4. **Check browser network tab** to see if CORS headers are present
5. **Update production CORS** when deploying

The CORS error should be resolved once you properly configure your backend server to allow requests from your frontend origin.