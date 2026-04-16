// Simple connection test for frontend-backend integration
// Run this in browser console to test the connection

async function testBackendConnection() {
  console.log('🧪 Testing Backend Connection...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test login with mock credentials
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      }),
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginResponse.ok) {
      console.log('✅ Login successful! Token:', loginData.token);
      
      // Test products with token
      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const productsData = await productsResponse.json();
      console.log('✅ Products:', productsData);
    } else {
      console.log('⚠️ Login failed, but that\'s expected for now');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

// Auto-run when script loads
testBackendConnection();

// Also make it available globally
window.testBackendConnection = testBackendConnection;
