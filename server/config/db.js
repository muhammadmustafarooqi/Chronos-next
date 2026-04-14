import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        if (!uri || uri === 'memory://') {
            console.log('🔄 Starting In-Memory MongoDB...');
            const mongoServer = await MongoMemoryServer.create({
                instance: {
                    dbName: 'chronos'
                }
            });
            uri = mongoServer.getUri();
            console.log(`✨ In-Memory MongoDB started at: ${uri}`);
        }

        const conn = await mongoose.connect(uri);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        
        // Final fallback to memory server if connection fails and not already using one
        if (error.message.includes('ECONNREFUSED')) {
             console.log('⚠️ Local MongoDB not found. Retrying with In-Memory MongoDB...');
             const mongoServer = await MongoMemoryServer.create({ instance: { dbName: 'chronos' } });
             await mongoose.connect(mongoServer.getUri());
             console.log('✅ Connected to In-Memory MongoDB fallback.');
             return;
        }

        process.exit(1);
    }
};

export default connectDB;

