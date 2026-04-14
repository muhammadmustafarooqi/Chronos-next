import Product from '../models/Product.js';
import Auction from '../models/Auction.js';
import Drop from '../models/Drop.js';
import Warranty from '../models/Warranty.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import { calculateTier } from '../utils/vipUtils.js';

const watches = [
    {
        name: "Royal Oak Perpetual Calendar",
        brand: "Audemars Piguet",
        price: 145000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Luxury",
        description: "A masterpiece of horology.",
        features: ["Perpetual Calendar", "Moon Phase"],
        isNew: true,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Nautilus Travel Time",
        brand: "Patek Philippe",
        price: 115000,
        images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Sport",
        description: "The iconic Nautilus design.",
        features: ["Dual Time Zone"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Daytona Cosmograph",
        brand: "Rolex",
        price: 35000,
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80"],
        category: "Racing",
        description: "The ultimate tool watch.",
        features: ["Chronograph"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Speedmaster Moonwatch",
        brand: "Omega",
        price: 7500,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Heritage",
        description: "The watch that participated in all six lunar missions.",
        features: ["Chronograph"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Tank Louis",
        brand: "Cartier",
        price: 12800,
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1999&q=80"],
        category: "Dress",
        description: "A symbol of understated elegance since 1917.",
        features: ["Quartz", "Gold"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    }
];

export const seedLogic = async () => {
    try {
        console.log('🚀 Starting seed logic...');
        const insertedProducts = await Product.insertMany(watches);
        console.log(`✅ Inserted ${insertedProducts.length} watches`);
        console.log(`✅ Products with isRentable: ${insertedProducts.filter(p => p.isRentable).length}`);

        // Create auctions including one with bronze tier
        await Auction.deleteMany({});
        await Auction.insertMany([
            {
                product: insertedProducts[0]._id,
                startingPrice: 100000,
                currentPrice: 100000,
                startTime: new Date(Date.now() - 3600000),
                endTime: new Date(Date.now() + 86400000),
                status: 'live',
                minimumVipTier: 'bronze'
            },
            {
                product: insertedProducts[1]._id,
                startingPrice: 50000,
                currentPrice: 50000,
                startTime: new Date(Date.now() + 86400000),
                endTime: new Date(Date.now() + 172800000),
                status: 'upcoming',
                minimumVipTier: 'gold'
            }
        ]);
        console.log('✅ Created 2 auctions (including 1 with minimumVipTier: bronze)');

        // Create drops with future release dates
        await Drop.deleteMany({});
        await Drop.insertMany([
            {
                product: insertedProducts[2]._id,
                dropName: "Daytona Heritage Drop",
                description: "Limited edition heritage release.",
                releaseDate: new Date(Date.now() + 7 * 86400000),
                goldPlusEarlyAccessHours: 48,
                quantity: 50,
                status: 'scheduled'
            },
            {
                product: insertedProducts[3]._id,
                dropName: "Speedmaster Apollo Anniversary",
                description: "Special numbered edition drop.",
                releaseDate: new Date(Date.now() + 14 * 86400000),
                goldPlusEarlyAccessHours: 48,
                quantity: 30,
                status: 'scheduled'
            },
            {
                product: insertedProducts[4]._id,
                dropName: "Cartier Platinum Special",
                description: "Boutique exclusive platinum edition.",
                releaseDate: new Date(Date.now() + 21 * 86400000),
                goldPlusEarlyAccessHours: 24,
                quantity: 20,
                status: 'scheduled'
            }
        ]);
        console.log('✅ Created 3 drops with future release dates');

        // Create admin user and customer with platinum VIP tier
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
        console.log(`✅ Admin user created (${adminEmail}) with Platinum VIP tier`);
        
        console.log('🎊 Seeding complete.');
    } catch (error) {
        console.error('❌ Seed logic error:', error);
    }
};
