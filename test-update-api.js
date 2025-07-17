// Test script to verify the update profile API endpoint
// Run this with Node.js to test the API

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = 'http://3.7.210.24:9001';
const UPDATE_ENDPOINT = '/api/v1/profile/update-details';

// Test token (you'll need to replace this with a valid token)
const TEST_TOKEN = 'your-test-token-here';

// Test data based on the API specification
const TEST_UPDATE_DATA = {
  "firstName": "Sourav",
  "lastName": "Mandal",
  "mobile": "648364844",
  "patients": [
    {
      "id": 6,
      "fname": "Rittik",
      "lname": "Mandal",
      "gender": "Male",
      "dob": "2015-09-10",
      "patientMedicalHistory": "Asthma",
      "familyMedicalHistory": "Diabetes"
    }
  ]
};

function testUpdateAPI() {
  console.log('🧪 Testing Update Profile API Endpoint...');
  console.log(`📍 URL: ${API_BASE_URL}${UPDATE_ENDPOINT}`);
  console.log(`🔑 Token: ${TEST_TOKEN ? 'Provided' : 'Missing'}`);
  console.log(`📦 Data:`, JSON.stringify(TEST_UPDATE_DATA, null, 2));
  console.log('');

  if (!TEST_TOKEN || TEST_TOKEN === 'your-test-token-here') {
    console.log('❌ Please provide a valid token in the TEST_TOKEN variable');
    console.log('💡 You can get a token by logging into the application');
    return;
  }

  const postData = JSON.stringify(TEST_UPDATE_DATA);

  const options = {
    hostname: '3.7.210.24',
    port: 9001,
    path: UPDATE_ENDPOINT,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${TEST_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
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
        
        if (res.statusCode === 200) {
          console.log('');
          console.log('🎉 Update API is working correctly!');
        } else {
          console.log('');
          console.log('⚠️  Update API returned non-200 status');
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

  req.write(postData);
  req.end();
}

// Run the test
testUpdateAPI(); 