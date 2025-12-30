import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import validate, { schemas } from '../middleware/validate.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(schemas.register), catchAsync(async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
        return res.api.error('This email is already registered. Please login.', 400);
    }

    // Create user
    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || ''
    });

    const token = generateToken(user._id);

    return res.api.created({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isAdmin: user.role === 'admin'
        },
        token
    }, 'Account created successfully. Welcome to Chronos.');
}));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(schemas.login), catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Check for admin credentials (hardcoded as in original)
    if (email === 'admin@gmail.com' && password === 'Admin123@') {
        let admin = await User.findOne({ email: 'admin@gmail.com' });

        if (!admin) {
            admin = await User.create({
                name: 'System Admin',
                email: 'admin@gmail.com',
                password: password,
                role: 'admin'
            });
        }

        const token = generateToken(admin._id);

        return res.api.success({
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: 'admin',
                isAdmin: true
            },
            token
        }, 'Administrative access granted.');
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        return res.api.error('Invalid credentials. Please check your email and password.', 401);
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.api.error('Invalid credentials. Please check your email and password.', 401);
    }

    const token = generateToken(user._id);

    return res.api.success({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            isAdmin: user.role === 'admin'
        },
        token
    }, 'Welcome back to Chronos Luxe.');
}));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
        return res.api.notFound('User session not found.');
    }

    return res.api.success({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            wishlist: user.wishlist,
            isAdmin: user.role === 'admin'
        }
    });
}));

// @route   PUT /api/auth/update
// @desc    Update user profile
// @access  Private
router.put('/update', protect, catchAsync(async (req, res) => {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    return res.api.success({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            isAdmin: user.role === 'admin'
        }
    }, 'Your profile has been updated successfully.');
}));

export default router;
