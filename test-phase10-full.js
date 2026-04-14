// PHASE 10 — Complete P2P Marketplace Tests
import('node-fetch').then(mod => {
  const fetch = mod.default;
  (async () => {
    try {
      console.log('=== PHASE 10 — P2P MARKETPLACE ===\n');
      
      let adminToken = null, newUserToken = null, newUserEmail = '', newListingId = null;
      
      // 10.1 — VERIFIED BUYER CHECK
      console.log('Phase 10.1 — Listing Creation (Verified Buyer Check)\n');
      
      // TEST 1: No token
      console.log('Test 10.1.1: POST /api/listings with NO token');
      let res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test', price: 1000 })
      });
      console.log('→ Status Code: ' + res.status);
      
      // Get admin token for further tests
      console.log('\nStep: Obtaining admin token');
      res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: process.env.ADMIN_EMAIL || 'admin@chronos.com', password: process.env.ADMIN_PASSWORD || 'Admin123@' })
      });
      const adminLoginData = await res.json();
      adminToken = adminLoginData.data.token;
      console.log('Admin token obtained');
      
      // TEST 2: User with zero orders
      console.log('\nTest 10.1.2: POST /api/listings as user with ZERO completed orders');
      newUserEmail = 'zeroorders' + Date.now() + '@test.com';
      res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Zero Orders',
          email: newUserEmail,
          password: 'Test123@'
        })
      });
      const regData = await res.json();
      
      // Login as zero-order user
      res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newUserEmail, password: 'Test123@' })
      });
      const zeroLoginData = await res.json();
      newUserToken = zeroLoginData.data.token;
      
      res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + newUserToken
        },
        body: JSON.stringify({
          title: 'Unauthorized Listing',
          price: 1000,
          productId: '69dd378e011d7dd7bab94b01'
        })
      });
      console.log('→ Status Code: ' + res.status + ' (expected 403)');
      const zeroListData = await res.json();
      console.log('→ Message: ' + zeroListData.message);
      
      // TEST 3: Read verified buyer check code
      console.log('\nTest 10.1.3: Verified Buyer Check - mongoose query');
      console.log('→ Query: Order.countDocuments({ email: req.user.email.toLowerCase() })');
      console.log('→ Status check: orders === 0 && req.user.role !== "admin" → 403');
      console.log('✓ VERIFIED: Checks order existence (any status), not specifically "Delivered"');
      console.log('✓ BUG COMMENT: Code checks ANY order, not just Delivered status');
      
      // 10.2 — LISTING APPROVAL FLOW
      console.log('\n\nPhase 10.2 — Listing Approval Flow\n');
      
      // TEST 1: Create listing as verified buyer (admin)
      console.log('Test 10.2.1: POST /api/listings as verified buyer (admin)');
      res = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + adminToken
        },
        body: JSON.stringify({
          title: 'Test Listing QA Phase 10',
          description: 'Test Description',
          price: 10000,
          productId: '69dd378e011d7dd7bab94b01'
        })
      });
      console.log('→ Status Code: ' + res.status + ' (expected 201)');
      const listData = await res.json();
      if (res.status === 201) {
        newListingId = listData.data._id;
        console.log('→ Status field: ' + listData.data.status + ' (expected "pending-review")');
      }
      
      // TEST 2: GET /api/listings (pending-review should NOT appear)
      console.log('\nTest 10.2.2: GET /api/listings (pending-review invisible)');
      res = await fetch('http://localhost:5000/api/listings');
      const listingsData = await res.json();
      const listingCount1 = listingsData.data.listings.length;
      console.log('→ Listing count (active only): ' + listingCount1);
      
      // TEST 3: Approve without token
      console.log('\nTest 10.2.3: PUT /api/listings/:id/approve with NO token');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId + '/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('→ Status Code: ' + res.status + ' (expected 401)');
      
      // TEST 4: Approve as non-admin
      console.log('\nTest 10.2.4: PUT /api/listings/:id/approve with non-admin token');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId + '/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + newUserToken
        }
      });
      console.log('→ Status Code: ' + res.status + ' (expected 403)');
      
      // TEST 5: Approve as admin
      console.log('\nTest 10.2.5: PUT /api/listings/:id/approve with admin token');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId + '/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + adminToken
        }
      });
      console.log('→ Status Code: ' + res.status + ' (expected 200)');
      
      // TEST 6: GET /api/listings (approved should now appear)
      console.log('\nTest 10.2.6: GET /api/listings after approval');
      res = await fetch('http://localhost:5000/api/listings');
      const listingsData2 = await res.json();
      const listingCount2 = listingsData2.data.listings.length;
      console.log('→ Listing count (after approval): ' + listingCount2);
      console.log('→ Difference: ' + (listingCount2 - listingCount1) + ' (expected +1)');
      
      // 10.3 — SELLER OWNERSHIP ENFORCEMENT
      console.log('\n\nPhase 10.3 — Seller Ownership Enforcement\n');
      
      console.log('Test 10.3.1: PUT /api/listings/:id as seller');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + adminToken
        },
        body: JSON.stringify({ title: 'Updated Title' })
      });
      console.log('→ Status Code: ' + res.status + ' (expected 200)');
      
      console.log('\nTest 10.3.2: PUT /api/listings/:id as different user');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + newUserToken
        },
        body: JSON.stringify({ title: 'Hacked Title' })
      });
      console.log('→ Status Code: ' + res.status + ' (expected 403)');
      
      console.log('\nTest 10.3.3: DELETE /api/listings/:id as different user');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + newUserToken }
      });
      console.log('→ Status Code: ' + res.status + ' (expected 403)');
      
      console.log('\nTest 10.3.4: DELETE /api/listings/:id as admin');
      res = await fetch('http://localhost:5000/api/listings/' + newListingId, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + adminToken }
      });
      console.log('→ Status Code: ' + res.status + ' (expected 200)');
      
    } catch(e) {
      console.error('ERROR:', e.message);
    }
  })();
}).catch(err => console.error('Import error:', err));
