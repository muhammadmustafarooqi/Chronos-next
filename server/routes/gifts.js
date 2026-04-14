/**
 * Feature 8: Virtual Gifting Suite Routes
 * GET /api/gifts/:token — public gift reveal endpoint (no price/buyer info)
 */
import express from 'express';
import Order from '../models/Order.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// @route   GET /api/gifts/:token
// @desc    Retrieve gift reveal data by token (public, safe — no price or buyer info)
// @access  Public
router.get('/:token', catchAsync(async (req, res) => {
    const { token } = req.params;

    const order = await Order.findOne({ giftRevealToken: token }).lean();

    if (!order || !order.isGift) {
        return res.api.notFound('Gift reveal not found or has expired.');
    }

    // Return only safe info — no price, no buyer identity
    const firstItem = order.items?.[0];
    return res.api.success({
        gift: {
            watchName: firstItem?.name || 'A Luxury Timepiece',
            watchImage: firstItem?.image || '',
            giftMessage: order.giftMessage || '',
            giftWrap: order.giftWrap || false,
        }
    });
}));

export default router;
