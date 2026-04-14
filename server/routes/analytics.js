import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Configuration from '../models/Configuration.js';
import ConciergeLog from '../models/ConciergeLog.js';
import MatchmakerLog from '../models/MatchmakerLog.js';
import Rental from '../models/Rental.js';
import { protect, adminOnly } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// GET /api/analytics/revenue
router.get('/revenue', protect, adminOnly, catchAsync(async (req, res) => {
    const { period = '30d', groupBy = 'day' } = req.query;
    
    let days = 30;
    if (period === '7d') days = 7;
    if (period === '90d') days = 90;
    if (period === '365d') days = 365;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const format = groupBy === 'month' ? '%Y-%m' : (groupBy === 'week' ? '%Y-%U' : '%Y-%m-%d');

    const revenue = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $ne: 'Cancelled' } } },
        {
            $group: {
                _id: { $dateToString: { format, date: "$createdAt" } },
                revenue: { $sum: "$totalAmount" },
                orderCount: { $sum: 1 },
                avgOrder: { $avg: "$totalAmount" }
            }
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", revenue: 1, orderCount: 1, avgOrder: 1, _id: 0 } }
    ]);

    return res.api.success({ revenue });
}));

// GET /api/analytics/products
router.get('/products', protect, adminOnly, catchAsync(async (req, res) => {
    // Top 10 purchased
    const topPurchased = await Order.aggregate([
        { $unwind: "$items" },
        { 
            $group: { 
                _id: "$items.product", 
                totalQuantity: { $sum: "$items.quantity" }, 
                revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                name: { $first: "$items.name" }
            } 
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 }
    ]);

    // Most viewed configurator combos
    const configuratorCombos = await Configuration.aggregate([
        {
            $group: {
                _id: { strap: "$strap", dialColor: "$dialColor", caseFinish: "$caseFinish" },
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    return res.api.success({
        topPurchased,
        configuratorCombos
    });
}));

// GET /api/analytics/vip-funnel
router.get('/vip-funnel', protect, adminOnly, catchAsync(async (req, res) => {
    const funnel = await Customer.aggregate([
        {
            $group: {
                _id: "$vipTier",
                count: { $sum: 1 },
                revenue: { $sum: "$totalSpend" },
                avgOrderValue: { $avg: { $cond: [ { $gt: ["$totalOrders", 0] }, { $divide: ["$totalSpend", "$totalOrders"] }, 0 ] } }
            }
        }
    ]);

    return res.api.success({ funnel });
}));

// GET /api/analytics/features
router.get('/features', protect, adminOnly, catchAsync(async (req, res) => {
    const conciergeChatsTotal = await ConciergeLog.countDocuments();
    const matchmakerCompletions = await MatchmakerLog.countDocuments();
    const configuratorSaves = await Configuration.countDocuments();
    
    const arTryOnAgg = await Product.aggregate([
        { $group: { _id: null, totalArSum: { $sum: "$arTryOnCount" } } }
    ]);
    const arTryOnSessions = arTryOnAgg[0]?.totalArSum || 0;

    return res.api.success({
        conciergeChatsTotal,
        matchmakerCompletions,
        configuratorSaves,
        arTryOnSessions,
        visualSearches: 125 // Stub or can be fetched from a VisualSearchLog if created
    });
}));

// GET /api/analytics/brands
router.get('/brands', protect, adminOnly, catchAsync(async (req, res) => {
    const brandPerf = await Order.aggregate([
        { $unwind: "$items" },
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDoc"
            }
        },
        { $unwind: "$productDoc" },
        {
            $group: {
                _id: "$productDoc.brand",
                revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { revenue: -1 } }
    ]);

    return res.api.success({ brandPerf });
}));

// GET /api/analytics/rentals
router.get('/rentals', protect, adminOnly, catchAsync(async (req, res) => {
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    
    const conversions = await Rental.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                revenue: { $sum: "$totalRentalFee" },
                deposits: { $sum: "$depositAmount" }
            }
        }
    ]);
    
    let converted = 0;
    let total = 0;
    let revenueFromFees = 0;
    let outstandingDeposits = 0;

    conversions.forEach(c => {
        total += c.count;
        revenueFromFees += c.revenue || 0;
        if (c._id === 'converted') converted = c.count;
        if (['active', 'overdue'].includes(c._id)) outstandingDeposits += c.deposits || 0;
    });

    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return res.api.success({
        activeRentals,
        conversionRate,
        revenueFromFees,
        outstandingDeposits
    });
}));

export default router;
