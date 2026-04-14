/**
 * Feature 3: Watch Configurator Routes
 * GET  /api/configurations/:id — load saved config
 * POST /api/configurations       — save a configuration, returns unique id
 */
import express from 'express';
import Configuration from '../models/Configuration.js';
import catchAsync from '../utils/catchAsync.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/configurations/:id
// @desc    Get a saved watch configuration by ID
// @access  Public
router.get('/:id', catchAsync(async (req, res) => {
    const config = await Configuration.findById(req.params.id).lean();
    if (!config) {
        return res.api.notFound('Configuration not found.');
    }
    return res.api.success({ config });
}));

// @route   POST /api/configurations
// @desc    Save a new watch configuration
// @access  Public (optional auth to attach userId)
router.post('/', optionalAuth, catchAsync(async (req, res) => {
    const { productId, strapColor, dialColor, caseFinish } = req.body;

    if (!productId) {
        return res.api.error('productId is required', 400);
    }

    const config = await Configuration.create({
        productId,
        userId: req.user?._id || null,
        strapColor: strapColor || 'black-leather',
        dialColor: dialColor || 'black',
        caseFinish: caseFinish || 'polished'
    });

    return res.api.created({ config }, 'Configuration saved successfully.');
}));

export default router;
