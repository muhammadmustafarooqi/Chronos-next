import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Middleware imports
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import errorHandler from './middleware/error.js';
import requestLogger from './middleware/logger.js';
import { responseHelper } from './utils/ApiResponse.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import cache from './utils/cache.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customerRoutes from './routes/customers.js';
import wishlistRoutes from './routes/wishlist.js';
import adminRoutes from './routes/admin.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ==============================================
// CORE MIDDLEWARE
// ==============================================

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ==============================================
// SECURITY & PERFORMANCE
// ==============================================

// Set security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Compress all responses
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Response helper
app.use(responseHelper);

// Request logging (development)
if (process.env.NODE_ENV !== 'production') {
    app.use(requestLogger);
}

// ==============================================
// RATE LIMITING
// ==============================================

// Apply general API rate limiting
app.use('/api', apiLimiter);

// Stricter limits for auth endpoints
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ==============================================
// API ROUTES
// ==============================================

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// ==============================================
// UTILITY ENDPOINTS
// ==============================================

// Enhanced health check
app.get('/api/health', (req, res) => {
    const uptime = process.uptime();
    const uptimeFormatted = {
        days: Math.floor(uptime / 86400),
        hours: Math.floor((uptime % 86400) / 3600),
        minutes: Math.floor((uptime % 3600) / 60),
        seconds: Math.floor(uptime % 60)
    };

    res.json({
        success: true,
        status: 'healthy',
        message: 'Chronos API is running',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: uptimeFormatted,
        timestamp: new Date().toISOString(),
        cache: cache.stats()
    });
});

// Cache management endpoint (admin only in production)
app.post('/api/cache/clear', (req, res) => {
    cache.clear();
    res.json({
        success: true,
        message: 'Cache cleared successfully'
    });
});

// ==============================================
// ERROR HANDLING
// ==============================================

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        suggestion: 'Please check the API documentation for available endpoints'
    });
});

// Global error handler
app.use(errorHandler);

// ==============================================
// SERVER STARTUP
// ==============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    const divider = '═'.repeat(50);
    console.log(`
╔${divider}╗
║                                                  ║
║   🕐 CHRONOS LUXURY WATCHES API                  ║
║                                                  ║
║   ✓ Server running on port ${PORT}                    ║
║   ✓ Environment: ${(process.env.NODE_ENV || 'development').padEnd(14)}             ║
║   ✓ API URL: http://localhost:${PORT}                 ║
║                                                  ║
║   Features:                                      ║
║   • Request logging with timing                  ║
║   • Rate limiting protection                     ║
║   • Response caching                             ║
║   • Standardized error handling                  ║
║                                                  ║
╚${divider}╝
    `);
});

// ==============================================
// GRACEFUL SHUTDOWN
// ==============================================

const gracefulShutdown = (signal) => {
    console.log(`\n⚠ ${signal} received. Starting graceful shutdown...`);

    server.close(() => {
        console.log('✓ HTTP server closed');
        console.log('✓ All connections terminated');
        console.log('👋 Goodbye!');
        process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
        console.error('✗ Forced shutdown due to timeout');
        process.exit(1);
    }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('✗ Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;
