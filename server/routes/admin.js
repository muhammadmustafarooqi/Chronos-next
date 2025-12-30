import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { protect, adminOnly } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';
import cache from '../utils/cache.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', protect, adminOnly, catchAsync(async (req, res) => {
    // Get counts and totals
    const [
        totalProducts,
        totalOrders,
        totalCustomers,
        orders,
        recentOrders
    ] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Customer.countDocuments(),
        Order.find({}, 'totalAmount status createdAt'),
        Order.find().sort('-createdAt').limit(5).populate('user', 'name')
    ]);

    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Orders by status
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    // Revenue by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrdersData = orders.filter(o => new Date(o.createdAt) > sevenDaysAgo);

    const revenueByDay = {};
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        revenueByDay[dateStr] = 0;
    }

    recentOrdersData.forEach(order => {
        const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if (revenueByDay[dateStr] !== undefined) {
            revenueByDay[dateStr] += order.totalAmount || 0;
        }
    });

    return res.api.success({
        stats: {
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts
        },
        ordersByStatus: {
            pending: pendingOrders,
            processing: processingOrders,
            shipped: shippedOrders,
            delivered: deliveredOrders
        },
        revenueByDay: Object.entries(revenueByDay).map(([date, revenue]) => ({
            date,
            revenue
        })).reverse(),
        recentOrders: recentOrders.map(o => ({
            id: o.orderId,
            customerName: o.customerName,
            totalAmount: o.totalAmount,
            status: o.status,
            date: o.createdAt,
            items: o.items
        }))
    }, 'Dashboard statistics retrieved.');
}));

// @route   POST /api/admin/seed
// @desc    Seed database with initial products
// @access  Private/Admin
router.post('/seed', protect, adminOnly, catchAsync(async (req, res) => {
    const { watches } = req.body;

    if (!watches || !Array.isArray(watches)) {
        return res.api.error('No watches data provided');
    }

    // Clear existing products
    await Product.deleteMany({});

    // Insert new products
    const products = await Product.insertMany(watches.map(w => ({
        ...w,
        _id: undefined // Let MongoDB generate new IDs
    })));

    // Invalidate product caches
    cache.invalidatePattern('products:*');

    return res.api.success({ count: products.length }, `Successfully seeded ${products.length} luxury timepieces.`);
}));

// @route   GET /api/admin/system-status
// @desc    Get detailed system and database status
// @access  Private/Admin
router.get('/system-status', protect, adminOnly, catchAsync(async (req, res) => {
    const dbStatus = await Product.db.db.admin().serverStatus();
    
    return res.api.success({
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        dbConnection: Product.db.readyState === 1 ? 'Connected' : 'Disconnected',
        cacheStats: cache.stats()
    }, 'System status retrieved.');
}));

export default router;
