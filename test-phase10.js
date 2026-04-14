// Phase 10 - P2P Marketplace comprehensive tests
import('node-fetch').then(mod => {
  const fetch = mod.default;
  (async () => {
    try {
      // Helper function to make requests
      const makeRequest = async (url, method = 'GET', body = null, token = null) => {
        const headers = {
          'Content-Type': 'application/json'
        };
        if (token) headers['Authorization'] = 'Bearer ' + token;
        
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);
        
        const res = await fetch(url, options);
        const data = await res.json();
        return { status: res.status, data };
      };
      
      console.log('=== PHASE 10 — P2P MARKETPLACE TESTS ===\n');
      
      // Create a new user with no orders
      console.log('Step 1: Creating new user with NO orders');
      const regRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Zero Orders User',
          email: 'zeroorders' + Date.now() + '@test.com',
          password: 'Test123@'
        })
      });
      const regData = await regRes.json();
      console.log('Registration status: ' + regRes.status);
      
      // Extract the email for login
      const zeroOrdersEmail = 'zeroorders' + Date.now() + '@test.com';
      
      // We'll use admin user for verified buyer tests
      console.log('\nStep 2: Login as admin (verified buyer)');
      const adminLoginRes = await makeRequest('http://localhost:5000/api/auth/login', 'POST', {
        email: 'admin@chronos.com',
        password: process.env.ADMIN_PASSWORD || 'Admin123@'
      });
      const adminToken = adminLoginRes.data.data.token;
      console.log('Admin token obtained');
      
      // Step 3: Test unverified buyer (zero orders) - should get 403
      console.log('\nStep 3: Attempting listing creation with ZERO completed orders');
      const zeroLoginRes = await makeRequest('http://localhost:5000/api/auth/login', 'POST', {
        email: zeroOrdersEmail,
        password: 'Test123@'
      });
      
      if (zeroLoginRes.status === 200) {
        const zeroToken = zeroLoginRes.data.data.token;
        const zeroListRes = await makeRequest('http://localhost:5000/api/listings', 'POST', {
          title: 'Test Listing',
          description: 'Test Description',
          productId: '69dd378e011d7dd7bab94b01',
          price: 5000
        }, zeroToken);
        console.log('Zero-order user listing creation status: ' + zeroListRes.status);
        console.log('Response: ' + JSON.stringify(zeroListRes.data).substring(0, 150));
      }
      
      // Step 4: Test verified buyer (admin has orders)
      console.log('\nStep 4: Creating listing as verified buyer (admin)');
      const listRes = await makeRequest('http://localhost:5000/api/listings', 'POST', {
        title: 'Test Listing - QA',
        description: 'Test Description for QA',
        productId: '69dd378e011d7dd7bab94b01',
        price: 5000
      }, adminToken);
      console.log('Admin user listing creation status: ' + listRes.status);
      console.log('Listing created - status field: ' + listRes.data.data?.status);
      
      if (listRes.status === 201) {
        const listingId = listRes.data.data._id;
        console.log('Listing ID: ' + listingId);
      }
      
    } catch(e) {
      console.error('Error:', e.message);
    }
  })();
}).catch(err => console.error('Import error:', err));
