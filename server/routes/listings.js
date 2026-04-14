import express from 'express';
import Listing from '../models/Listing.js';
import Order from '../models/Order.js';
import Warranty from '../models/Warranty.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// GET /api/listings
router.get('/', optionalAuth, catchAsync(async (req, res) => {
    const { brand, condition, minPrice, maxPrice, hasWarranty } = req.query;
    let query = { status: 'active' };
    
    if (brand) query.brand = new RegExp(brand, 'i');
    if (condition) query.condition = condition;
    if (hasWarranty === 'true') query.hasWarranty = true;
    
    if (minPrice || maxPrice) {
        query.askingPrice = {};
        if (minPrice) query.askingPrice.$gte = Number(minPrice);
        if (maxPrice) query.askingPrice.$lte = Number(maxPrice);
    }

    const listings = await Listing.find(query).populate('product');
    return res.api.success({ listings });
}));

// GET /api/listings/my
router.get('/my', protect, catchAsync(async (req, res) => {
    const listings = await Listing.find({ seller: req.user._id }).populate('product');
    return res.api.success({ listings });
}));

// GET /api/listings/:id
router.get('/:id', optionalAuth, catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(
        req.params.id, 
        { $inc: { views: 1 } }, 
        { new: true }
    ).populate('product').populate('seller', 'name createdAt');
    
    if (!listing) return res.api.notFound('Listing not found');
    return res.api.success({ listing });
}));

// POST /api/listings
router.post('/', protect, catchAsync(async (req, res) => {
    // Basic verification - check if user has completed purchases (Delivered status only)
    const orders = await Order.countDocuments({ email: req.user.email.toLowerCase(), status: 'Delivered' });
    if (orders === 0 && req.user.role !== 'admin') {
        return res.api.error('Only verified buyers can list items.', 403);
    }
    
    const { warrantyRef, serialNumber } = req.body;
    let isChronosVerified = false;
    let hasWarranty = false;
    
    if (serialNumber) {
        // Auto-verify if they submit a valid Chronos serial number linked to their email
        const warranty = await Warranty.findOne({ serialNumber, email: req.user.email.toLowerCase() });
        if (warranty) {
            isChronosVerified = true;
            hasWarranty = true;
            req.body.warrantyRef = warranty._id;
            req.body.product = warranty.product;
        }
    }

    const listing = await Listing.create({
        ...req.body,
        seller: req.user._id,
        sellerName: req.user.name,
        isChronosVerified,
        hasWarranty,
        status: 'pending-review'
    });
    
    return res.api.created({ listing });
}));

// PUT /api/listings/:id
router.put('/:id', protect, catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.api.notFound();
    
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.api.forbidden();
    }
    
    Object.assign(listing, req.body);
    await listing.save();
    
    return res.api.success({ listing });
}));

// DELETE /api/listings/:id
router.delete('/:id', protect, catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.api.notFound();
    
    if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.api.forbidden();
    }
    
    listing.status = 'removed';
    await listing.save();
    
    return res.api.success(null, 'Listing removed');
}));

// PUT /api/listings/:id/approve (Admin)
router.put('/:id/approve', protect, adminOnly, catchAsync(async (req, res) => {
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!listing) return res.api.notFound();
    return res.api.success({ listing });
}));

// PUT /api/listings/:id/sold (Admin)
router.put('/:id/sold', protect, adminOnly, catchAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.api.notFound();
    
    listing.status = 'sold';
    listing.escrowStatus = 'released'; // Simplification for MVP
    await listing.save();
    
    const payout = listing.askingPrice * (1 - listing.commissionRate);
    
    return res.api.success({ 
        listing, 
        payoutInfo: { 
            salePrice: listing.askingPrice, 
            commission: listing.askingPrice * listing.commissionRate, 
            payout 
        } 
    });
}));

export default router;
