# Axios Quick Reference Guide

## 🚀 Quick Start

### 1. Make API Requests

```javascript
import axiosInstance from '@/plugins/axios';

// GET
const response = await axiosInstance.get('users');
console.log(response.data);

// POST
const response = await axiosInstance.post('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// PUT
await axiosInstance.put('users/1', { name: 'Jane' });

// DELETE
await axiosInstance.delete('users/1');
```

### 2. Using in Components

```javascript
'use client';

import { useAuthContext } from '@/context/useAuthContext';

export default function MyComponent() {
  const { axiosInstance } = useAuthContext();
  
  const fetchData = async () => {
    const response = await axiosInstance.get('users');
    return response.data;
  };
}
```

### 3. Error Handling

```javascript
try {
  const response = await axiosInstance.get('users');
  console.log(response.data);
} catch (error) {
  if (error.response) {
    // Server error (4xx, 5xx)
    console.error('Error:', error.response.data.message);
  } else if (error.request) {
    // Network error
    console.error('Network error');
  } else {
    console.error('Error:', error.message);
  }
}
```

## 📋 Common Patterns

### Fetch List with Pagination

```javascript
const fetchUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('users', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Create Resource

```javascript
const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post('users', userData);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Update Resource

```javascript
const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Delete Resource

```javascript
const deleteUser = async (userId) => {
  try {
    await axiosInstance.delete(`users/${userId}`);
    return true;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

### Upload File

```javascript
const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axiosInstance.post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percent = (progressEvent.loaded / progressEvent.total) * 100;
        console.log(`Upload: ${percent}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

## 🎯 Using with React Hooks

### useEffect Example

```javascript
import { useEffect, useState } from 'react';
import axiosInstance from '@/plugins/axios';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('users');
        setUsers(response.data.users);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Custom Hook

```javascript
// hooks/useApi.js
import { useState, useCallback } from 'react';
import axiosInstance from '@/plugins/axios';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = { method, url };
      if (data) config.data = data;
      
      const response = await axiosInstance.request(config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
}

// Usage
export default function MyComponent() {
  const { request, loading, error } = useApi();
  
  const handleSubmit = async () => {
    try {
      await request('POST', 'users', { name: 'John' });
      alert('Success!');
    } catch (err) {
      // Error is already set in state
    }
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## 🔄 Response Structure

Axios automatically parses JSON and provides:

```javascript
{
  data: { ... },         // Response body
  status: 200,           // HTTP status
  statusText: 'OK',      // Status text
  headers: { ... },      // Response headers
  config: { ... },       // Request config
  request: { ... }       // XMLHttpRequest
}
```

Access data directly:
```javascript
const response = await axiosInstance.get('users');
const users = response.data.users;  // Direct access
```

## ⚡ Advanced Usage

### Request Cancellation

```javascript
import axios from 'axios';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

try {
  const response = await axiosInstance.get('users', {
    cancelToken: source.token
  });
} catch (error) {
  if (axios.isCancel(error)) {
    console.log('Request canceled');
  }
}

// Cancel the request
source.cancel('Operation canceled by user');
```

### Custom Headers

```javascript
await axiosInstance.get('users', {
  headers: {
    'Custom-Header': 'value'
  }
});
```

### Timeout

```javascript
await axiosInstance.get('users', {
  timeout: 5000 // 5 seconds
});
```

### Response Type

```javascript
// For binary data
await axiosInstance.get('file.pdf', {
  responseType: 'blob'
});

// For text
await axiosInstance.get('data.txt', {
  responseType: 'text'
});
```

## 🛡️ Authentication is Automatic

✅ **No need to manually add tokens!**

The interceptor automatically:
- Adds `Authorization: Bearer <token>` to every request
- Refreshes token if expired (401/403 error)
- Retries failed request with new token
- Redirects to login if refresh fails

Just make requests normally:
```javascript
await axiosInstance.get('protected-route');
// Token is automatically included!
```

## 📝 Important Notes

1. **Base URL is pre-configured**
   ```javascript
   // Don't include base URL in requests
   // ❌ Wrong
   await axiosInstance.get('http://localhost:5001/api/users');
   
   // ✅ Correct
   await axiosInstance.get('users');
   ```

2. **Response data is in `response.data`**
   ```javascript
   // ❌ Wrong
   const users = await axiosInstance.get('users');
   
   // ✅ Correct
   const response = await axiosInstance.get('users');
   const users = response.data;
   ```

3. **Errors are in `error.response`**
   ```javascript
   catch (error) {
     // Server errors
     console.log(error.response.data);
     console.log(error.response.status);
     
     // Network errors
     console.log(error.request);
     
     // Other errors
     console.log(error.message);
   }
   ```

## 🎨 API Endpoints Constants

Define and use endpoints:

```javascript
// utils/api.js
export const API_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  PRODUCTS: '/products',
};

// In components
import { API_ENDPOINTS } from '@/utils/api';

await axiosInstance.get(API_ENDPOINTS.USERS);
await axiosInstance.get(API_ENDPOINTS.USER_BY_ID(123));
```

## 🔍 Debugging

### Log All Requests

```javascript
axiosInstance.interceptors.request.use(
  config => {
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  }
);
```

### Log All Responses

```javascript
axiosInstance.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.config.url);
    return response;
  }
);
```

## 💡 Pro Tips

1. **Use async/await** instead of `.then()` for cleaner code

2. **Always use try/catch** for error handling

3. **Create custom hooks** for reusable API logic

4. **Use loading states** for better UX

5. **Handle errors gracefully** with user-friendly messages

6. **Use TypeScript** for better type safety (optional)

7. **Monitor Network tab** during development

## 🚀 You're Ready!

Start making API calls with automatic authentication:

```javascript
import axiosInstance from '@/plugins/axios';

const getData = async () => {
  const response = await axiosInstance.get('your-endpoint');
  return response.data;
};
```

That's it! The interceptor handles everything else. 🎉
