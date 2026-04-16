// Test script to verify backend API endpoints
const BASE_URL = 'http://localhost:5000/api';

// Test health endpoint
async function testHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Test login endpoint
async function testLogin() {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login successful:', data);
      return data.token;
    } else {
      console.log('⚠️ Login response:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return null;
  }
}

// Test products endpoint
async function testProducts(token) {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/products`, { headers });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Products fetched:', data.products?.length || 0, 'products');
      return data;
    } else {
      console.error('❌ Products fetch failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Products test failed:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing WanNya Backend API...\n');

  // Test health
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ Backend server is not running. Please start it first.');
    return;
  }

  // Test login
  const token = await testLogin();

  // Test products
  await testProducts(token);

  console.log('\n🏁 Backend API tests completed!');
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  runTests();
}

export { testHealth, testLogin, testProducts, runTests };
