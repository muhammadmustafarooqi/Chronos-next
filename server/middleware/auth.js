import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import catchAsync from '../utils/catchAsync.js';

// Protect routes - verify JWT token
export const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.api.unauthorized('Your account session could not be verified. Please sign in again.');
            }

            return next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.api.unauthorized('Your session has expired. Please sign in again.');
            }
            return res.api.unauthorized('Invalid security token. Please sign in again.');
        }
    }

    if (!token) {
        return res.api.unauthorized('Please sign in to access this feature.');
    }
});

// Admin only middleware
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.api.forbidden('Administrative privileges are required for this action.');
    }
};

// Optional auth - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Token invalid or expired, but we continue as guest
            req.user = null;
        }
    }

    next();
};
