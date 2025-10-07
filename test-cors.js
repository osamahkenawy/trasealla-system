/**
 * CORS Test Script
 * Run this to test if your backend CORS configuration is working
 * 
 * Usage: node test-cors.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BACKEND_URL = 'http://localhost:5001';
const FRONTEND_ORIGIN = 'http://localhost:3000';

// Test endpoints
const endpoints = [
  '/api/auth/login',
  '/api/contact',
  '/api/users'
];

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = client.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testCORS() {
  console.log('🔍 Testing CORS Configuration...\n');
  console.log(`Frontend Origin: ${FRONTEND_ORIGIN}`);
  console.log(`Backend URL: ${BACKEND_URL}\n`);

  for (const endpoint of endpoints) {
    const url = `${BACKEND_URL}${endpoint}`;
    console.log(`📡 Testing: ${endpoint}`);
    
    try {
      // Test OPTIONS request (preflight)
      console.log('  🔄 Testing OPTIONS (preflight)...');
      const optionsResponse = await makeRequest(url, 'OPTIONS');
      
      const corsHeaders = {
        'access-control-allow-origin': optionsResponse.headers['access-control-allow-origin'],
        'access-control-allow-methods': optionsResponse.headers['access-control-allow-methods'],
        'access-control-allow-headers': optionsResponse.headers['access-control-allow-headers'],
        'access-control-allow-credentials': optionsResponse.headers['access-control-allow-credentials']
      };

      console.log('  📋 CORS Headers:');
      Object.entries(corsHeaders).forEach(([key, value]) => {
        if (value) {
          console.log(`    ✅ ${key}: ${value}`);
        } else {
          console.log(`    ❌ ${key}: Not set`);
        }
      });

      // Test actual request
      console.log('  🔄 Testing actual request...');
      const actualResponse = await makeRequest(url, 'GET');
      console.log(`  📊 Status: ${actualResponse.statusCode}`);
      
      if (actualResponse.statusCode === 200 || actualResponse.statusCode === 401) {
        console.log('  ✅ Request successful (CORS working)');
      } else {
        console.log('  ⚠️  Request failed, but CORS might be working');
      }

    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('🎯 CORS Test Summary:');
  console.log('✅ = CORS header present and correct');
  console.log('❌ = CORS header missing or incorrect');
  console.log('⚠️  = Request failed but CORS might be working');
  console.log('\n💡 If you see ❌ for any headers, update your backend CORS configuration.');
}

// Run the test
testCORS().catch(console.error);
