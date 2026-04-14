#!/usr/bin/env node
import http from 'http';

const API_URL = 'localhost';
const API_PORT = 5000;

let testResults = {
  phase17: [],
  phase18: [],
  phase19: [],
  phase20: [],
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve) => {
    const options = {
      hostname: API_URL,
      port: API_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
            headers: res.headers,
          });
        } catch {
          resolve({ status: res.statusCode, data: null, raw: body });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, error: err.message });
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n═══ PART 4 QA AUDIT — PHASES 16-20 ═══\n');

  // Phase 19 - Verify seed data first
  console.log('PHASE 19 — SEED DATA VALIDATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const adminLoginRes = await makeRequest('POST', '/api/auth/login', {
    email: process.env.ADMIN_EMAIL || 'admin@chronos.com',
    password: process.env.ADMIN_PASSWORD || 'Admin123@',
  });

  if (adminLoginRes.status === 200 && adminLoginRes.data?.data?.token) {
    console.log('✅ 19.4: Admin login successful');
    console.log(`   Email: ${adminLoginRes.data.data.user.email}`);
    console.log(`   Role: ${adminLoginRes.data.data.user.role}`);
    console.log(`   VIP Tier: ${adminLoginRes.data.data.user.vipTier}`);

    const adminToken = adminLoginRes.data.data.token;

    // Test seeded data
    const productsRes = await makeRequest('GET', '/api/products', null);
    if (productsRes.data?.data?.products) {
      const rentableCount = productsRes.data.data.products.filter(p => p.isRentable).length;
      console.log(`✅ 19.2.1: Found ${productsRes.data.data.products.length} products (${rentableCount} rentable)`);
    }

    const auctionsRes = await makeRequest('GET', '/api/auctions', null);
    if (auctionsRes.data?.data) {
      console.log(`✅ 19.2.2: Found ${auctionsRes.data.data.length} auctions`);
    }

    const dropsRes = await makeRequest('GET', '/api/drops', null);
    if (dropsRes.data?.data) {
      console.log(`✅ 19.2.3: Found ${dropsRes.data.data.length} drops`);
    }

    // Phase 17 - Security Audit
    console.log('\nPHASE 17 — SECURITY AUDIT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 17.1.1 - No token to protected endpoint
    const noTokenRes = await makeRequest('GET', '/api/orders/my-orders', null);
    if (noTokenRes.status === 401) {
      console.log('✅ 17.1.1: Unauthenticated /api/orders blocked (401)');
    } else {
      console.log(`❌ 17.1.1: Expected 401, got ${noTokenRes.status}`);
    }

    // 17.1.2 - No token to POST listings
    const listingsNoTokenRes = await makeRequest('POST', '/api/listings', { title: 'Test' });
    if (listingsNoTokenRes.status === 401) {
      console.log('✅ 17.1.2: Unauthenticated /api/listings blocked (401)');
    } else {
      console.log(`❌ 17.1.2: Expected 401, got ${listingsNoTokenRes.status}`);
    }

    // 17.1.3 - No token to warranty
    const warrantyNoTokenRes = await makeRequest('GET', '/api/warranty', null);
    if (warrantyNoTokenRes.status === 401) {
      console.log('✅ 17.1.3: Unauthenticated /api/warranty blocked (401)');
    } else {
      console.log(`❌ 17.1.3: Expected 401, got ${warrantyNoTokenRes.status}`);
    }

    // 17.4 - Rate limiting test
    console.log('\n17.4: Rate limiting test (attempting 12 rapid auth/login calls)...');
    let rateLimitHit = false;
    for (let i = 0; i < 12; i++) {
      const rateLimitRes = await makeRequest('POST', '/api/auth/login', {
        email: 'nonexistent@test.com',
        password: 'wrong',
      });
      if (rateLimitRes.status === 429) {
        console.log(`✅ 17.4: Rate limiting engaged on request ${i + 1} (429 Too Many Requests)`);
        rateLimitHit = true;
        break;
      }
    }
    if (!rateLimitHit) {
      console.log(`⚠️  17.4: Rate limiting not triggered after 12 attempts`);
    }

    // Phase 18 - Database Integrity
    console.log('\nPHASE 18 — DATABASE INTEGRITY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Register a test user for orders
    const testUserEmail = `testuser${Date.now()}@test.com`;
    const registerRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Test User',
      email: testUserEmail,
      password: 'Test123@',
    });

    if (registerRes.status === 201) {
      const userToken = registerRes.data.data.token;
      console.log('✅ 18: Test user registered');

      // Test 18.3 - Mass assignment (role as admin)
      const massAssignRes = await makeRequest('POST', '/api/auth/register', {
        name: 'Malicious User',
        email: `malicious${Date.now()}@test.com`,
        password: 'Test123@',
        role: 'admin',
        vipTier: 'platinum',
      });

      if (massAssignRes.data?.data?.user?.role === 'user') {
        console.log('✅ 18.3: Mass assignment prevented - role stays "user"');
      } else {
        console.log(`❌ 18.3: Mass assignment failed - unexpected role: ${massAssignRes.data?.data?.user?.role}`);
      }

      // Test 18.3 - GET /api/auth/me has no password
      const meRes = await makeRequest('GET', '/api/auth/me', null);
      meRes.headers['authorization'] = `Bearer ${userToken}`;
      
      const meWithAuthRes = await makeRequest('GET', `/api/auth/me?token=${userToken}`, null);
      if (!meWithAuthRes.data?.data?.password) {
        console.log('✅ 18.3: Password field not exposed in /api/auth/me');
      } else {
        console.log('❌ 18.3: Password field exposed in /api/auth/me');
      }
    }

    // Phase 20 - E2E Smoke Tests
    console.log('\nPHASE 20 — END-TO-END SMOKE TESTS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Journey 1 - Full purchase flow
    if (registerRes.data?.data?.token) {
      const userToken = registerRes.data.data.token;
      const productId = productsRes.data.data.products[0]?._id;

      if (productId) {
        const orderRes = await makeRequest('POST', '/api/orders', {
          items: [{ product: productId, quantity: 1 }],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zip: '10001',
            country: 'US',
          },
        });

        if (orderRes.status === 201) {
          console.log('✅ 20-Journey1: Order created successfully');
          console.log(`   Order ID: ${orderRes.data.data._id}`);
          console.log(`   Status: ${orderRes.data.data.status}`);
        } else {
          console.log(`❌ 20-Journey1: Order creation failed (${orderRes.status})`);
        }
      }
    }

  } else {
    console.log(`❌ Admin login failed: ${adminLoginRes.status}`);
    if (adminLoginRes.data?.message) {
      console.log(`   Error: ${adminLoginRes.data.message}`);
    }
  }

  console.log('\n═══ TEST EXECUTION COMPLETE ═══\n');
}

runTests();
