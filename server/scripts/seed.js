import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Product from '../models/Product.js';
import Auction from '../models/Auction.js';
import Drop from '../models/Drop.js';
import Warranty from '../models/Warranty.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import { calculateTier } from '../utils/vipUtils.js';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initial watch data
const watches = [
    {
        name: "Royal Oak Perpetual Calendar",
        brand: "Audemars Piguet",
        price: 145000,
        images: [
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80",
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80",
            "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"
        ],
        category: "Luxury",
        description: "A masterpiece of horology featuring a perpetual calendar complication housed within the iconic octagonal case.",
        features: ["Perpetual Calendar", "Moon Phase", "Ceramic Case", "41mm Diameter", "Self-Winding", "50m Water Resistant"],
        isNew: true,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Nautilus Travel Time",
        brand: "Patek Philippe",
        price: 115000,
        images: [
            "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80",
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"
        ],
        category: "Sport",
        description: "The iconic Nautilus design with dual time zone functionality for the modern traveler.",
        features: ["Dual Time Zone", "Date Display", "Steel Case", "40.5mm Diameter", "Automatic Movement", "120m Water Resistant"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Daytona Cosmograph",
        brand: "Rolex",
        price: 35000,
        images: [
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80",
            "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
        ],
        category: "Racing",
        description: "The ultimate tool watch for those with a passion for driving and speed.",
        features: ["Chronograph", "Tachymetric Scale", "Oystersteel", "40mm Diameter", "Perpetual Movement", "100m Water Resistant"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Speedmaster Moonwatch",
        brand: "Omega",
        price: 7500,
        images: [
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80",
            "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
        ],
        category: "Heritage",
        description: "The watch that participated in all six lunar missions. An icon of space exploration.",
        features: ["Chronograph", "Manual Winding", "Hesalite Crystal", "42mm Diameter", "NASA Certified", "50m Water Resistant"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Tank Louis",
        brand: "Cartier",
        price: 12800,
        images: [
            "https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1999&q=80",
            "https://images.unsplash.com/photo-1619134778706-7015533a6150?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
        ],
        category: "Dress",
        description: "A symbol of understated elegance since 1917. The rectangular case design that revolutionized watchmaking.",
        features: ["Quartz Movement", "18k Gold Case", "Leather Strap", "Small Model", "Sapphire Crystal", "30m Water Resistant"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Submariner Date",
        brand: "Rolex",
        price: 10250,
        images: [
            "https://images.unsplash.com/photo-1539874754764-5a96559165b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2430&q=80",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80"
        ],
        category: "Diver",
        description: "The reference among divers' watches. Engineered for underwater exploration.",
        features: ["300m Water Resistance", "Date Display", "Cerachrom Bezel", "41mm Diameter", "Automatic Movement", "Oyster Bracelet"],
        isNew: true,
        isFeatured: false
    },
    {
        name: "Overseas Ultra-Thin",
        brand: "Vacheron Constantin",
        price: 89000,
        images: [
            "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
        ],
        category: "Luxury",
        description: "Ultra-thin elegance meets sporty sophistication. A masterpiece that transcends time.",
        features: ["Ultra-Thin Case", "Interchangeable Straps", "Steel & Gold", "40mm Diameter", "Automatic Movement", "50m Water Resistant"],
        isNew: true,
        isFeatured: true
    },
    {
        name: "Portugieser Chronograph",
        brand: "IWC",
        price: 8950,
        images: [
            "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80",
            "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
        ],
        category: "Classic",
        description: "Classical elegance with a contemporary edge. Clean dial and refined proportions.",
        features: ["Chronograph", "Small Seconds", "Steel Case", "41mm Diameter", "Automatic Movement", "30m Water Resistant"],
        isNew: true,
        isFeatured: true
    },
    {
        name: "Big Bang Unico",
        brand: "Hublot",
        price: 24500,
        images: [
            "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80"
        ],
        category: "Sport",
        description: "The art of fusion. Bold, innovative, and unapologetically different.",
        features: ["Flyback Chronograph", "Skeleton Dial", "Titanium Case", "42mm Diameter", "In-House Movement", "100m Water Resistant"],
        isNew: false,
        isFeatured: false
    },
    {
        name: "Heritage Snowflake",
        brand: "Grand Seiko",
        price: 6200,
        images: [
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80",
            "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
        ],
        category: "Luxury",
        description: "Inspired by the snow-covered mountains of Japan. Perfect smooth sweep seconds hand.",
        features: ["Spring Drive Movement", "Titanium Case", "Snowflake Texture Dial", "41mm Diameter", "Power Reserve Indicator", "100m Water Resistant"],
        isNew: true,
        isFeatured: true
    },
    {
        name: "Explorer II",
        brand: "Rolex",
        price: 9500,
        images: [
            "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80",
            "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2574&q=80"
        ],
        category: "Explorer",
        description: "Built for endurance and exploration. The ideal companion for extreme conditions.",
        features: ["GMT Function", "Oystersteel", "42mm Diameter", "Chromalight Display", "Fixed Bezel", "100m Water Resistant"],
        isNew: false,
        isFeatured: true
    },
    {
        name: "Seamaster Planet Ocean",
        brand: "Omega",
        price: 6500,
        images: [
            "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
            "https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"
        ],
        category: "Diver",
        description: "A professional-grade divers' watch paying homage to Omega's maritime legacy.",
        features: ["600m Water Resistance", "Helium Escape Valve", "Liquidmetal Bezel", "43.5mm Diameter", "Co-Axial Master Chronometer", "Rubber Strap"],
        isNew: false,
        isFeatured: false
    }
];

const seedDB = async () => {
    try {
        // Connect to MongoDB with in-memory fallback
        let uri = process.env.MONGODB_URI;
        
        if (!uri || uri === 'memory://') {
            console.log('🔄 Starting In-Memory MongoDB...');
            const mongoServer = await MongoMemoryServer.create({
                instance: { dbName: 'chronos' }
            });
            uri = mongoServer.getUri();
            console.log(`✨ In-Memory MongoDB started`);
        }
        
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert new products
        const insertedProducts = await Product.insertMany(watches);
        console.log('✅ Successfully inserted ' + insertedProducts.length + ' watches');

        // Log inserted products
        insertedProducts.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p.name} - $${p.price.toLocaleString()}`);
        });

        console.log('🔄 Seeding Phase 2 features...');

        // 2. Auctions
        await Auction.deleteMany({});
        await Auction.insertMany([
            {
                product: insertedProducts[0]._id,
                startingPrice: 100000,
                currentPrice: 100000,
                reservePrice: 120000,
                startTime: new Date(Date.now() - 3600000), // 1 hour ago
                endTime: new Date(Date.now() + 86400000), // tomorrow
                status: 'live',
                minimumVipTier: 'bronze',
                bids: []
            },
            {
                product: insertedProducts[1]._id,
                startingPrice: 90000,
                currentPrice: 90000,
                startTime: new Date(Date.now() + 86400000),
                endTime: new Date(Date.now() + 172800000),
                status: 'upcoming',
                minimumVipTier: 'silver'
            },
            {
                product: insertedProducts[2]._id,
                startingPrice: 20000,
                currentPrice: 25000,
                startTime: new Date(Date.now() - 172800000),
                endTime: new Date(Date.now() - 86400000),
                status: 'ended',
                minimumVipTier: 'gold'
            }
        ]);
        console.log('✅ Seeded 3 auctions (including 1 with minimumVipTier: bronze)');

        // 3. Drops
        await Drop.deleteMany({});
        await Drop.insertMany([
            {
                product: insertedProducts[3]._id,
                dropName: "Speedmaster Apollo Anniversary",
                description: "Special numbered edition drop.",
                releaseDate: new Date(Date.now() + 7 * 86400000),
                goldPlusEarlyAccessHours: 48,
                quantity: 50,
                status: 'scheduled'
            },
            {
                product: insertedProducts[4]._id,
                dropName: "Cartier Platinum Special",
                description: "Boutique exclusive platinum edition.",
                releaseDate: new Date(Date.now() + 14 * 86400000),
                goldPlusEarlyAccessHours: 24,
                quantity: 20,
                status: 'scheduled'
            },
            {
                product: insertedProducts[5]._id,
                dropName: "Submariner Heritage Release",
                description: "Limited edition heritage collection.",
                releaseDate: new Date(Date.now() + 21 * 86400000),
                goldPlusEarlyAccessHours: 48,
                quantity: 30,
                status: 'scheduled'
            }
        ]);
        console.log('✅ Seeded 3 drops with future release dates');

        // 4. Admin User and Customer with Platinum VIP Tier
        // Customize these credentials in server/.env if needed
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@chronos.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123@';
        
        await User.deleteMany({ email: adminEmail });
        await Customer.deleteMany({ email: adminEmail });
        
        const adminUser = await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });
        
        // Create admin customer record with platinum VIP tier (totalSpend >= 20000)
        await Customer.create({
            user: adminUser._id,
            name: 'Admin User',
            email: adminEmail,
            phone: '555-0000',
            totalOrders: 5,
            totalSpend: 25000,
            vipTier: calculateTier(25000),
            status: 'VIP',
            lastOrderDate: new Date()
        });
        console.log(`✅ Created admin user (${adminEmail}) with Platinum VIP tier`);
        console.log(`   📌 Change password immediately after first login for security!`);
        
        // 5. Seed user (for warranty/order testing)
        await User.deleteMany({ email: 'seed@chronos.com' });
        await Customer.deleteMany({ email: 'seed@chronos.com' });
        await Order.deleteMany({ email: 'seed@chronos.com' });
        await Warranty.deleteMany({ email: 'seed@chronos.com' });
        
        const dummyUser = await User.create({
            name: 'Seed User',
            email: 'seed@chronos.com',
            password: 'password123',
            role: 'user'
        });
        
        const dummyOrder = await Order.create({
            user: dummyUser._id,
            customerName: dummyUser.name,
            email: dummyUser.email,
            items: [
                { product: insertedProducts[5]._id, name: insertedProducts[5].name, price: insertedProducts[5].price, quantity: 1 }
            ],
            totalAmount: insertedProducts[5].price,
            status: 'Delivered',
            shippingAddress: { street: '123 Seed Ave', city: 'Mock City', state: 'NY', zipCode: '10001' }
        });
        
        await Warranty.create({
            order: dummyOrder._id,
            product: insertedProducts[5]._id,
            email: dummyUser.email,
            serialNumber: `CHR-${new Date().getFullYear()}-SEED01`,
            purchaseDate: new Date(),
            warrantyExpiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
            movementType: 'automatic',
            serviceIntervalYears: 3,
            nextServiceDueDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)
        });
        console.log('✅ Seeded seed user, order, and warranty record');

        console.log('\n🎉 Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
