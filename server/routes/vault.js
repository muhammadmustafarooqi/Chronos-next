/**
 * Feature 5: Collection Vault Routes
 * GET /api/vault/:customerId — aggregate purchased watches with market values
 */
import express from 'express';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/vault/:customerId
// @desc    Get a customer's collection vault (purchased watch portfolio)
// @access  Private for prices, Public (read-only) for watch list
router.get('/:customerId', optionalAuth, catchAsync(async (req, res) => {
    const { customerId } = req.params;
    const isOwner = req.user && (
        req.user._id.toString() === customerId ||
        req.user.email === customerId
    );
    const isAdmin = req.user?.role === 'admin';
    const canSeePrices = isOwner || isAdmin;

    // Find all delivered orders for this customer
    const orders = await Order.find({
        $or: [
            { user: customerId },
            { email: customerId }
        ],
        status: { $in: ['Delivered', 'Shipped', 'Processing', 'Pending'] }
    }).sort('-createdAt').lean();

    if (!orders.length) {
        return res.api.success({ vault: [], totalPurchaseValue: 0, totalMarketValue: 0 });
    }

    // Build vault entries — one entry per order item, hydrated with current product data
    const vaultEntries = [];
    for (const order of orders) {
        for (const item of order.items) {
            const currentProduct = item.product
                ? await Product.findById(item.product).select('name brand images marketValue price').lean()
                : null;

            vaultEntries.push({
                orderItemId: item._id,
                orderId: order.orderId,
                orderDate: order.createdAt,
                productId: item.product,
                name: item.name,
                brand: currentProduct?.brand || '',
                image: item.image || currentProduct?.images?.[0] || '',
                pricePaid: canSeePrices ? item.price : null,
                currentMarketValue: canSeePrices ? (currentProduct?.marketValue || item.price) : null,
                percentChange: canSeePrices && currentProduct?.marketValue
                    ? parseFloat((((currentProduct.marketValue - item.price) / item.price) * 100).toFixed(2))
                    : null,
            });
        }
    }

    const totalPurchaseValue = canSeePrices
        ? vaultEntries.reduce((sum, e) => sum + (e.pricePaid || 0), 0)
        : null;

    const totalMarketValue = canSeePrices
        ? vaultEntries.reduce((sum, e) => sum + (e.currentMarketValue || 0), 0)
        : null;

    return res.api.success({
        vault: vaultEntries,
        totalPurchaseValue,
        totalMarketValue,
        isPublicView: !canSeePrices,
    });
}));

export default router;
