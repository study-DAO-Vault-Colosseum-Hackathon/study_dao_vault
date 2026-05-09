#!/usr/bin/env node

/**
 * Admin Dashboard API Test Script
 * Run this to test if the admin endpoints are working correctly
 */

const API_BASE_URL = 'http://localhost:3000/api/auth';
const TEST_USER_ID = 'test-admin-user-123';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function testEndpoint(method, path, body = null, description = '') {
  try {
    const url = `${API_BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'x-user-id': TEST_USER_ID,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    console.log(`\n${colors.blue}Testing: ${description}${colors.reset}`);
    console.log(`${colors.yellow}${method} ${url}${colors.reset}`);

    const response = await fetch(url, options);
    const data = await response.json();

    if (response.ok) {
      console.log(`${colors.green}✓ Success (${response.status})${colors.reset}`);
      console.log('Response:', JSON.stringify(data, null, 2).slice(0, 200) + '...');
    } else {
      console.log(`${colors.red}✗ Failed (${response.status})${colors.reset}`);
      console.log('Error:', data.error || data.message);
    }

    return response.ok;
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return false;
  }
}

async function runTests() {
  console.log(`\n${colors.blue}╔══════════════════════════════════════════╗`);
  console.log(`║   Admin Dashboard API Test Suite            ║`);
  console.log(`╚══════════════════════════════════════════╝${colors.reset}`);
  console.log(`Using User ID: ${TEST_USER_ID}`);
  console.log(`Base URL: ${API_BASE_URL}`);

  const results = [];

  // Test 1: Get all users
  results.push(await testEndpoint(
    'GET',
    '/admin/users',
    null,
    'Get all users'
  ));

  console.log(`\n${colors.blue}═════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Test Summary${colors.reset}`);
  console.log(`Passed: ${results.filter(r => r).length}/${results.length}`);
  
  if (results.every(r => r)) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Some tests failed. Check the errors above.${colors.reset}`);
  }
}

// Check if Node.js fetch is available
if (typeof fetch === 'undefined') {
  console.error(`${colors.red}Error: Node.js fetch is not available. Please use Node.js 18+${colors.reset}`);
  process.exit(1);
}

runTests().catch(error => {
  console.error(`${colors.red}Test error: ${error.message}${colors.reset}`);
  process.exit(1);
});
