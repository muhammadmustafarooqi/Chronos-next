import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chronos');
        const db = mongoose.connection.db;

        console.log('Cleaning up collections...');
        await db.collection('orders').deleteMany({});
        await db.collection('customers').deleteMany({});
        // Don't delete products, we need them for the shop

        console.log('Cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

cleanup();
