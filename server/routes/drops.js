import express from 'express';
import mongoose from 'mongoose';
import Drop from '../models/Drop.js';

import Waitlist from '../models/Waitlist.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// GET /api/drops
router.get('/', optionalAuth, catchAsync(async (req, res) => {
    const drops = await Drop.find().sort('releaseDate').populate('product');
    return res.api.success({ drops });
}));

// GET /api/drops/:id
router.get('/:id', optionalAuth, catchAsync(async (req, res) => {
    const drop = await Drop.findById(req.params.id).populate('product');
    if (!drop) return res.api.notFound();
    return res.api.success({ drop });
}));

// POST /api/drops/:id/waitlist (User joins waitlist)
router.post('/:id/waitlist', protect, catchAsync(async (req, res) => {
    const drop = await Drop.findById(req.params.id);
    if (!drop) return res.api.notFound();

    // Check if already on waitlist
    const existing = await Waitlist.findOne({ drop: drop._id, email: req.user.email });
    if (existing) {
        return res.api.error('You are already on the waitlist for this drop.', 400);
    }

    const customer = await Customer.findOne({ email: req.user.email });
    const vipTier = customer ? customer.vipTier : 'bronze';

    const waitlist = await Waitlist.create({
        drop: drop._id,
        user: req.user._id,
        email: req.user.email,
        vipTier
    });

    return res.api.success({ waitlist }, 'You have been added to the waitlist.');
}));

// GET /api/drops/:id/waitlist (Admin views waitlist sorted by VIP priority)
router.get('/:id/waitlist', protect, adminOnly, catchAsync(async (req, res) => {
    const waitlist = await Waitlist.aggregate([
        { $match: { drop: new mongoose.Types.ObjectId(req.params.id) } },
        {
            $addFields: {
                tierWeight: {
                    $switch: {
                        branches: [
                            { case: { $eq: ['$vipTier', 'platinum'] }, then: 4 },
                            { case: { $eq: ['$vipTier', 'gold'] }, then: 3 },
                            { case: { $eq: ['$vipTier', 'silver'] }, then: 2 },
                            { case: { $eq: ['$vipTier', 'bronze'] }, then: 1 }
                        ],
                        default: 0
                    }
                }
            }
        },
        { $sort: { tierWeight: -1, joinedAt: 1 } },
        {
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { 
            $project: { 
                'user.password': 0, 
                'user.address': 0,
                tierWeight: 0 
            } 
        }
    ]);

    return res.api.success({ waitlist });
}));


// POST /api/drops (Admin creates drop)
router.post('/', protect, adminOnly, catchAsync(async (req, res) => {
    const drop = await Drop.create(req.body);
    return res.api.created({ drop });
}));

// PUT /api/drops/:id (Admin updates drop)
router.put('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const drop = await Drop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.api.success({ drop });
}));

// DELETE /api/drops/:id (Admin deletes drop)
router.delete('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    await Drop.findByIdAndDelete(req.params.id);
    return res.api.success(null, 'Drop deleted');
}));

export default router;
