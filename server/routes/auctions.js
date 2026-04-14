import express from 'express';
import Auction from '../models/Auction.js';
import Order from '../models/Order.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// GET /api/auctions
router.get('/', optionalAuth, catchAsync(async (req, res) => {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;
    
    // Auto-update ended auctions before fetching
    await Auction.updateMany(
        { status: 'live', endTime: { $lte: new Date() } },
        { $set: { status: 'ended' } }
    );
    await Auction.updateMany(
        { status: 'upcoming', startTime: { $lte: new Date() }, endTime: { $gt: new Date() } },
        { $set: { status: 'live' } }
    );

    const auctions = await Auction.find(query).populate('product', 'name images price brand model').sort('endTime');
    return res.api.success({ auctions });
}));

// GET /api/auctions/:id
router.get('/:id', optionalAuth, catchAsync(async (req, res) => {
    const auction = await Auction.findById(req.params.id)
        .populate('product', 'name images price description features specifications brand model')
        .populate('bids.user', 'name');
    
    if (!auction) return res.api.notFound('Auction not found');
    
    // Check state
    if (auction.status === 'live' && new Date() > new Date(auction.endTime)) {
        auction.status = 'ended';
        // Auto-assign winner if needed
        if (auction.bids.length > 0 && auction.currentPrice >= (auction.reservePrice || 0)) {
            auction.winner = auction.bids[0].user;
            auction.winnerName = auction.bids[0].customerName;
        }
        await auction.save();
    }
    
    return res.api.success({ auction });
}));

// POST /api/auctions (admin)
router.post('/', protect, adminOnly, catchAsync(async (req, res) => {
    const auction = await Auction.create(req.body);
    return res.api.created({ auction });
}));

// PUT /api/auctions/:id (admin)
router.put('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const auction = await Auction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.api.success({ auction });
}));

// DELETE /api/auctions/:id (admin)
router.delete('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    await Auction.findByIdAndDelete(req.params.id);
    return res.api.success(null, 'Auction deleted');
}));

// POST /api/auctions/:id/end (admin) manually end
router.post('/:id/end', protect, adminOnly, catchAsync(async (req, res) => {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.api.notFound();

    auction.status = 'ended';
    auction.endTime = new Date();
    
    if (auction.bids.length > 0) {
        const topBid = auction.bids[0];
        if (topBid.amount >= (auction.reservePrice || 0)) {
            auction.winner = topBid.user;
            auction.winnerName = topBid.customerName;

            // Optional: Create an Order
            try {
                // Populate product to get image
                await auction.populate('product', 'name images price');
                await Order.create({
                    user: topBid.user,
                    customerName: topBid.customerName,
                    email: req.user.email, // using admin email here as placeholder since user email isn't in bid, would fetch user normalise
                    phone: '',
                    items: [{
                        product: auction.product._id,
                        name: auction.product.name,
                        price: topBid.amount,
                        quantity: 1,
                        image: auction.product.images?.[0] || ''
                    }],
                    totalAmount: topBid.amount,
                    shippingAddress: { street: 'TBD', city: 'TBD', state: 'TBD', zipCode: 'TBD' },
                    paymentMethod: 'invoice',
                    status: 'Pending'
                });
            } catch (err) {
                console.error("Order creation failed on auction end:", err);
            }
        }
    }
    
    await auction.save();
    return res.api.success({ auction }, 'Auction ended successfully');
}));

export default router;
