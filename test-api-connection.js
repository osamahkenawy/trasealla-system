/**
 * API Connection Test
 * Test the actual API connection from your frontend
 */

const axios = require('axios');

async function testAPIConnection() {
  console.log('🔍 Testing API Connection...\n');
  
  const baseURL = 'http://localhost:5001/api';
  
  try {
    // Test 1: Basic connection
    console.log('📡 Test 1: Basic API connection...');
    const response = await axios.get(`${baseURL}/auth/login`, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log('✅ API is reachable');
    console.log(`   Status: ${response.status}`);
    console.log(`   Headers:`, Object.keys(response.headers));
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Connection refused - Backend server is not running');
      console.log('   Make sure your backend server is running on http://localhost:5001');
    } else if (error.response) {
      console.log('✅ API is reachable (got response)');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || 'No message'}`);
    } else if (error.code === 'ENOTFOUND') {
      console.log('❌ Host not found - Check your API URL');
    } else {
      console.log('❌ Error:', error.message);
    }
  }

  try {
    // Test 2: CORS preflight
    console.log('\n📡 Test 2: CORS preflight...');
    const response = await axios.options(`${baseURL}/auth/login`, {
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('✅ CORS preflight successful');
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    if (error.response) {
      console.log('✅ CORS preflight responded');
      console.log(`   Status: ${error.response.status}`);
    } else {
      console.log('❌ CORS preflight failed:', error.message);
    }
  }

  try {
    // Test 3: Login endpoint
    console.log('\n📡 Test 3: Login endpoint...');
    const response = await axios.post(`${baseURL}/auth/login`, {
      email: 'test@test.com',
      password: 'test123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('✅ Login endpoint working');
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    if (error.response) {
      console.log('✅ Login endpoint responded');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data?.message || 'No message'}`);
    } else {
      console.log('❌ Login endpoint failed:', error.message);
    }
  }

  console.log('\n🎯 Summary:');
  console.log('✅ = Working correctly');
  console.log('❌ = Issue found');
  console.log('\n💡 If you see ❌ errors, check:');
  console.log('   1. Backend server is running on http://localhost:5001');
  console.log('   2. CORS is properly configured');
  console.log('   3. API endpoints are correct');
}

// Run the test
testAPIConnection().catch(console.error);
