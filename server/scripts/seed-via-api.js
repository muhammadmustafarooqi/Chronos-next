/**
 * Seed database via direct API calls to populate test data
 * This script modifies the existing server database (if running)
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@chronos.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123@';

const seedViaAPI = async () => {
    try {
        console.log('🔄 Seeding via API...');
        
        // Step 1: Get admin token
        console.log('\n1️⃣ Getting admin token...');
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: adminEmail,
                password: adminPassword
            })
        });
        
        if (loginRes.status !== 200) {
            console.error('❌ Failed to login admin');
            console.error('   Check ADMIN_EMAIL and ADMIN_PASSWORD in server/.env');
            process.exit(1);
        }
        
        const loginData = await loginRes.json();
        const token = loginData.data.token;
        console.log('✅ Admin token obtained');
        
        // Step 2: Get products to update
        console.log('\n2️⃣ Getting products...');
        const productsRes = await fetch(`${BASE_URL}/api/products`);
        const productsData = await productsRes.json();
        const products = productsData.data.products;
        console.log(`✅ Found ${products.length} products`);
        
        // Step 3: Create rentable products via admin panel
        // Since products route might not have direct update, we'll note which ones should be rentable
        console.log('\n3️⃣ Rentable products (first 5):');
        products.slice(0, 5).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.name} (ID: ${p._id})`);
        });
        console.log('⚠️ Note: isRentable flag must be set in database directly');
        
        // Step 4: Create Drop via API
        console.log('\n4️⃣ Creating Drop...');
        const dropRes = await fetch(`${BASE_URL}/api/drops`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: products[3]._id,
                dropName: 'Speedmaster Apollo Anniversary',
                description: 'Special numbered edition drop.',
                releaseDate: new Date(Date.now() + 7 * 86400000).toISOString(),
                goldPlusEarlyAccessHours: 48,
                quantity: 50
            })
        });
        
        if (dropRes.status === 201) {
            console.log('✅ Drop created successfully');
        } else {
            console.log('⚠️ Drop creation status:', dropRes.status);
        }
        
        // Step 5: Create Auction with bronze tier
        console.log('\n5️⃣ Creating Auction with minimumVipTier: bronze...');
        const auctionRes = await fetch(`${BASE_URL}/api/auctions`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product: products[1]._id,
                startingPrice: 50000,
                currentPrice: 50000,
                startTime: new Date(Date.now() - 3600000).toISOString(),
                endTime: new Date(Date.now() + 172800000).toISOString(),
                minimumVipTier: 'bronze',
                status: 'live'
            })
        });
        
        if (auctionRes.status === 201) {
            console.log('✅ Auction with bronze tier created');
        } else {
            const errData = await auctionRes.json();
            console.log('⚠️ Auction creation status:', auctionRes.status, errData.message);
        }
        
        console.log('\n🎉 API seeding attempt completed!');
        console.log('⚠️ Note: Some data requires direct database modification (isRentable flag, admin vipTier)');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedViaAPI();
