import Product from '../models/Product.js';
import Auction from '../models/Auction.js';
import Drop from '../models/Drop.js';
import Warranty from '../models/Warranty.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import { calculateTier } from '../utils/vipUtils.js';

const watches = [
    // ULTRA-LUXURY (140k+)
    {
        name: "Royal Oak Perpetual Calendar",
        brand: "Audemars Piguet",
        price: 145000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Luxury",
        description: "A masterpiece of horology. The iconic Royal Oak with perpetual calendar.",
        features: ["Perpetual Calendar", "Moon Phase", "Self-Winding"],
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
        description: "The iconic Nautilus design with dual time zone functionality.",
        features: ["Dual Time Zone", "Self-Winding", "Date"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Grand Complications",
        brand: "Vacheron Constantin",
        price: 155000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Luxury",
        description: "Timepiece of the highest sophistication with chronograph.",
        features: ["Chronograph", "Minute Repeater", "Perpetual Calendar"],
        isNew: true,
        isFeatured: true,
        isRentable: false
    },

    // UPPER-TIER LUXURY (30k-60k)
    {
        name: "Daytona Cosmograph",
        brand: "Rolex",
        price: 35000,
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80"],
        category: "Racing",
        description: "The ultimate tool watch. Used by professional racers.",
        features: ["Chronograph", "Tachymeter", "Self-Winding"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Submariner Tropical",
        brand: "Rolex",
        price: 32000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Diver",
        description: "Deep-sea diving watch. Rated to 4,000 meters.",
        features: ["Dive Watch", "Helium Escape", "Date"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Aquanaut Jumbo",
        brand: "Patek Philippe",
        price: 64000,
        images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Sport",
        description: "The modern adventure watch with integrated rubber strap.",
        features: ["Waterproof 300m", "Self-Winding", "Scratch-Resistant"],
        isNew: true,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Seamaster Planet Ocean",
        brand: "Omega",
        price: 28000,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Diver",
        description: "Professional diving instrument. Rated to 6,000 meters.",
        features: ["Dive Watch", "GMT", "Chronograph"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Breitling Navitimer",
        brand: "Breitling",
        price: 12000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Pilot",
        description: "The legendary pilot's watch with slide rule.",
        features: ["Chronograph", "Slide Rule", "UTC"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },

    // MID-TIER LUXURY (8k-20k)
    {
        name: "Speedmaster Moonwatch",
        brand: "Omega",
        price: 7500,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Heritage",
        description: "The watch that participated in all six lunar missions.",
        features: ["Chronograph", "Manual Winding", "Tachymeter"],
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
        features: ["Quartz", "Gold", "Manual Winding"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Datejust 36",
        brand: "Rolex",
        price: 9500,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Dress",
        description: "The timeless classic. One of the most successful watches ever made.",
        features: ["Date Window", "Self-Winding", "Waterproof"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Carrera Automatic",
        brand: "Tag Heuer",
        price: 8200,
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80"],
        category: "Racing",
        description: "Independent watchmaking with motorsport heritage.",
        features: ["Chronograph", "Tachymeter", "Date"],
        isNew: true,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Seamaster Aqua Terra",
        brand: "Omega",
        price: 15400,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Sport",
        description: "Unique linen dial pattern inspired by sailcloth.",
        features: ["Self-Winding", "Date", "Waterproof"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Daytona in White Gold",
        brand: "Rolex",
        price: 58000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Racing",
        description: "Premium white gold version of the legendary Daytona.",
        features: ["Gold", "Chronograph", "Tachymeter"],
        isNew: true,
        isFeatured: true,
        isRentable: false
    },

    // CONTEMPORARY LUXURY (5k-8k)
    {
        name: "Presage Cocktail Time",
        brand: "Seiko",
        price: 4800,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Dress",
        description: "Sophisticated dress watch inspired by golden age cocktail culture.",
        features: ["Automatic", "Calendar", "Water-Resistant"],
        isNew: true,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Orient Bambino",
        brand: "Orient",
        price: 3200,
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1999&q=80"],
        category: "Vintage",
        description: "Classic automatic with vintage-inspired design.",
        features: ["Automatic", "Date", "Leather Strap"],
        isNew: false,
        isFeatured: false,
        isRentable: true
    },
    {
        name: "Glycine Airman",
        brand: "Glycine",
        price: 6200,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Pilot",
        description: "Classic pilot's watch since 1953.",
        features: ["GMT", "Automatic", "Date"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Tissot PRX",
        brand: "Tissot",
        price: 5600,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Sport",
        description: "Modern architectural design inspired by vintage PRX.",
        features: ["Sapphire", "Titanium", "Waterproof"],
        isNew: true,
        isFeatured: true,
        isRentable: true
    },

    // EXCLUSIVE SPORTSWEAR (3k-6k)
    {
        name: "Hublot Classic Fusion",
        brand: "Hublot",
        price: 16000,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Sport",
        description: "Fusion of tradition and innovation.",
        features: ["Sapphire", "Titanium", "Scratch-Resistant"],
        isNew: true,
        isFeatured: true,
        isRentable: false
    },
    {
        name: "Audemars Piguet Code 11.59",
        brand: "Audemars Piguet",
        price: 62000,
        images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Sport",
        description: "Contemporary reimagining of the Royal Oak.",
        features: ["Octagonal Case", "Self-Winding", "Water-Resistant"],
        isNew: true,
        isFeatured: false,
        isRentable: false
    },
    {
        name: "Longines HydroConquest",
        brand: "Longines",
        price: 7200,
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=988&q=80"],
        category: "Diver",
        description: "Professional diving watch with 300m water resistance.",
        features: ["Dive Watch", "Automatic", "Date"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Zenith Chronomaster",
        brand: "Zenith",
        price: 9800,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Racing",
        description: "High-frequency chronograph from legendary watchmaker.",
        features: ["Chronograph", "High Frequency", "Automatic"],
        isNew: true,
        isFeatured: true,
        isRentable: false
    },
    {
        name: "IWC Portuguese",
        brand: "IWC",
        price: 18500,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Dress",
        description: "Timeless elegance with chronograph complications.",
        features: ["Chronograph", "Date", "Automatic"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Chopard Mille Miglia",
        brand: "Chopard",
        price: 11200,
        images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Racing",
        description: "Italian racing car inspired luxury sports watch.",
        features: ["Chronograph", "GMT", "Automatic"],
        isNew: true,
        isFeatured: false,
        isRentable: true
    },

    // COLLECTOR EDITIONS (2k-4k)
    {
        name: "Grand Seiko Spring Drive",
        brand: "Grand Seiko",
        price: 8900,
        images: ["https://images.unsplash.com/photo-1622434641406-a158123450f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1408&q=80"],
        category: "Dress",
        description: "Japanese horological masterpiece with Spring Drive technology.",
        features: ["Spring Drive", "Date", "Water-Resistant"],
        isNew: true,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Frederique Constant Classics",
        brand: "Frederique Constant",
        price: 5400,
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=1999&q=80"],
        category: "Dress",
        description: "Swiss-made elegance at accessible luxury price.",
        features: ["Automatic", "Date", "Sapphire"],
        isNew: false,
        isFeatured: true,
        isRentable: true
    },
    {
        name: "Sinn 556 Pilot",
        brand: "Sinn",
        price: 3800,
        images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=2360&q=80"],
        category: "Pilot",
        description: "German-made tool watch with exceptional durability.",
        features: ["Automatic", "Date", "Water-Resistant"],
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
