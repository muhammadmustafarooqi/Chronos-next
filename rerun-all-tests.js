import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function runAllTests() {
  console.log('=== RE-RUN TEST SUITE ===\n');

  // Get token first
  console.log('Getting admin token...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@chronos.com',
      password: process.env.ADMIN_PASSWORD || 'Admin123@'
    })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token;
  console.log(`Token: ${token.substring(0,20)}...\n`);

  // RE-RUN 1
  console.log('RE-RUN 1 — Invalid Endpoint Responses');
  console.log('-'.repeat(50));
  
  const invalid1Res = await fetch('http://localhost:5000/api/auctions/notanid');
  console.log(`GET /api/auctions/notanid → Status: ${invalid1Res.status}`);

  const invalid2Res = await fetch('http://localhost:5000/api/auctions/000000000000000000000000');
  console.log(`GET /api/auctions/000000000000000000000000 → Status: ${invalid2Res.status}\n`);

  // RE-RUN 4 — Waitlist Tests (no drop dependency)
  console.log('RE-RUN 4 — Waitlist Auth & Duplicate Check');
  console.log('-'.repeat(50));

  // Get a drop
  const dropsRes = await fetch(`${BASE_URL}/drops`);
  const dropsData = await dropsRes.json();
  const drop = dropsData.data?.drops?.[0];
  
  if (!drop) {
    console.log('No drops found - skipping RE-RUN 4\n');
  } else {
    const dropId = drop._id;
    console.log(`Using drop: ${dropId}\n`);

    // Request A: No auth
    console.log('Request A: POST /api/drops/:id/waitlist WITHOUT auth');
    const noAuthRes = await fetch(`${BASE_URL}/drops/${dropId}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`Status: ${noAuthRes.status}\n`);

    // Request B: With auth (first attempt)
    console.log('Request B: POST /api/drops/:id/waitlist WITH auth (first)');
    const firstRes = await fetch(`${BASE_URL}/drops/${dropId}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const firstData = await firstRes.json();
    console.log(`Status: ${firstRes.status}`);
    if (firstRes.status === 201) {
      console.log(`Created ID: ${firstData.data?.waitlist?._id}\n`);
    } else {
      console.log(`Message: ${firstData.message}\n`);
    }

    // Request C: Duplicate attempt
    if (firstRes.status === 201) {
      console.log('Request C: POST /api/drops/:id/waitlist (duplicate, same user)');
      const dupRes = await fetch(`${BASE_URL}/drops/${dropId}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`Status: ${dupRes.status}`);
      const dupData = await dupRes.json();
      console.log(`Message: ${dupData.message}\n`);
    }
  }

  // RE-RUN 7 — Warranty Endpoints
  console.log('RE-RUN 7 — Warranty Endpoints');
  console.log('-'.repeat(50));

  const warrantyRes = await fetch(`${BASE_URL}/warranty`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const warrantyData = await warrantyRes.json();
  const warrantyCount = warrantyData.data?.warranties?.length || 0;
  console.log(`GET /api/warranty - Status: ${warrantyRes.status}, Count: ${warrantyCount}`);

  if (warrantyCount > 0) {
    const firstWarranty = warrantyData.data.warranties[0];
    const serialNumber = firstWarranty.serialNumber;
    console.log(`Sample serial: ${serialNumber}\n`);

    // Get warranty by serial
    console.log(`GET /api/warranty/${serialNumber}`);
    const detailRes = await fetch(`${BASE_URL}/warranty/${serialNumber}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Status: ${detailRes.status}\n`);

    // Fake serial (404 expected)
    console.log('GET /api/warranty/CHR-FAKE-000000');
    const fakeRes = await fetch(`${BASE_URL}/warranty/CHR-FAKE-000000`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Status: ${fakeRes.status}\n`);
  } else {
    console.log('No warranties found - creating test order first...');
    
    // Get product and create order to generate warranty
    const productsRes = await fetch(`${BASE_URL}/products`);
    const productsData = await productsRes.json();
    const product = productsData.data?.products?.[0];
    
    if (product) {
      const orderRes = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Test User',
          email: 'warranty-test@example.com',
          phone: '555-0001',
          items: [{ id: product._id, name: product.name, price: 100, quantity: 1 }],
          totalAmount: 100,
          shippingAddress: '123 Main St'
        })
      });
      console.log(`Order created: ${orderRes.status}`);
      
      // Now check warranty again
      const warranty2Res = await fetch(`${BASE_URL}/warranty`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const warranty2Data = await warranty2Res.json();
      const warranty2Count = warranty2Data.data?.warranties?.length || 0;
      console.log(`Warranties after order: ${warranty2Count}\n`);
    }
  }

  // Check public access to warranty (no auth)
  console.log('GET /api/warranty with VALID serial but NO auth header');
  const publicWarrantyRes = await fetch(`${BASE_URL}/warranty/CHR-2026-EXAMPLE`, {});
  console.log(`Status: ${publicWarrantyRes.status} (should be public or 401/403)\n`);

  console.log('=== TEST RUN COMPLETE ===');
  process.exit(0);
}

runAllTests().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
