/**
 * Application Configuration
 * Environment-specific settings
 */

const config = {
  development: {
    api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    api_port: null, // Set if API uses a different port
  },
  production: {
    api_url: process.env.NEXT_PUBLIC_API_URL || 'https://api.trasealla.com/api',
    api_port: null,
  },
  test: {
    api_url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    api_port: null,
  }
};

export default config;
