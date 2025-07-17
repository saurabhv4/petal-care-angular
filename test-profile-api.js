// Test script to verify the profile API endpoint
// Run this with Node.js to test the API

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = 'http://3.7.210.24:9001';
const PROFILE_ENDPOINT = '/api/v1/profile/fetch-user';

// Test token (you'll need to replace this with a valid token)
const TEST_TOKEN = 'your-test-token-here';

function testProfileAPI() {
  console.log('🧪 Testing Profile API Endpoint...');
  console.log(`📍 URL: ${API_BASE_URL}${PROFILE_ENDPOINT}`);
  console.log(`🔑 Token: ${TEST_TOKEN ? 'Provided' : 'Missing'}`);
  console.log('');

  if (!TEST_TOKEN || TEST_TOKEN === 'your-test-token-here') {
    console.log('❌ Please provide a valid token in the TEST_TOKEN variable');
    console.log('💡 You can get a token by logging into the application');
    return;
  }

  const options = {
    hostname: '3.7.210.24',
    port: 9001,
    path: PROFILE_ENDPOINT,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TEST_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`📋 Headers:`, res.headers);
    console.log('');

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Response received:');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.userId && response.firstName) {
          console.log('');
          console.log('🎉 API is working correctly!');
          console.log(`👤 User: ${response.firstName} ${response.lastName}`);
          console.log(`📧 Email: ${response.emailId}`);
        }
      } catch (error) {
        console.log('❌ Failed to parse JSON response:');
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request failed:');
    console.error(error);
  });

  req.end();
}

// Run the test
testProfileAPI(); 