import mongoose from 'mongoose';
import Order from './models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

const testOrder = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chronos');
        console.log('Connected to MongoDB');

        const orderData = {
            customerName: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            items: [{
                product: '6949cad4f6470630a95d600f', // Portugieser Chronograph
                name: 'Portugieser Chronograph',
                price: 8950,
                quantity: 1
            }],
            totalAmount: 8950,
            shippingAddress: {
                street: '123 Test St',
                city: 'Test City',
                state: 'TS',
                zipCode: '12345'
            },
            paymentMethod: 'cod'
        };

        const order = await Order.create(orderData);
        console.log('Order created successfully:', order.orderId);
        process.exit(0);
    } catch (error) {
        console.error('Error creating order:', error);
        process.exit(1);
    }
};

testOrder();
