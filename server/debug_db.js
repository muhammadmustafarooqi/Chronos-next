import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chronos');
        const db = mongoose.connection.db;
        const products = await db.collection('products').find().toArray();
        console.log('Products:', JSON.stringify(products, null, 2));

        const orders = await db.collection('orders').find().toArray();
        console.log('Orders:', JSON.stringify(orders, null, 2));

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkProducts();
