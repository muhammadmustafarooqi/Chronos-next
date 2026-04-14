import express from 'express';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    
    return res.api.success({
        wishlist: user.wishlist || []
    });
}));

// @route   POST /api/wishlist/:productId
// @desc    Add product to wishlist
// @access  Private
router.post('/:productId', protect, catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return res.api.notFound('Product not found');
    }

    const user = await User.findById(req.user._id);

    // Check if already in wishlist
    if (user.wishlist.includes(req.params.productId)) {
        return res.api.error('Product already in wishlist', 400);
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    return res.api.success({
        wishlist: updatedUser.wishlist || []
    }, 'Added to wishlist');
}));

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', protect, catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
        id => id.toString() !== req.params.productId
    );
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    return res.api.success({
        wishlist: updatedUser.wishlist || []
    }, 'Removed from wishlist');
}));

// @route   POST /api/wishlist/toggle/:productId
// @desc    Toggle product in wishlist
// @access  Private
router.post('/toggle/:productId', protect, catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return res.api.notFound('Product not found');
    }

    const user = await User.findById(req.user._id);
    const isInWishlist = user.wishlist.includes(req.params.productId);

    if (isInWishlist) {
        user.wishlist = user.wishlist.filter(
            id => id.toString() !== req.params.productId
        );
    } else {
        user.wishlist.push(req.params.productId);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    return res.api.success({
        wishlist: updatedUser.wishlist || [],
        action: isInWishlist ? 'removed' : 'added'
    }, isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
}));

export default router;
