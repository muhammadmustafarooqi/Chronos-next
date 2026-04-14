import express from 'express';
import Warranty from '../models/Warranty.js';
import ServiceRequest from '../models/ServiceRequest.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// GET /api/warranty
router.get('/', protect, catchAsync(async (req, res) => {
    let query = {};
    if (req.user.role !== 'admin') {
        const emailOptions = [req.user.email.toLowerCase()];
        query = { email: { $in: emailOptions } };
    }
    const warranties = await Warranty.find(query).populate('product', 'name images brand model category');
    return res.api.success({ warranties });
}));

// GET /api/warranty/:serialNumber
router.get('/:serialNumber', optionalAuth, catchAsync(async (req, res) => {
    const warranty = await Warranty.findOne({ serialNumber: req.params.serialNumber }).populate('product', 'name images brand model features');
    if (!warranty) return res.api.notFound('Warranty not found');
    return res.api.success({ warranty });
}));

// POST /api/warranty/:serialNumber/service
router.post('/:serialNumber/service', protect, catchAsync(async (req, res) => {
    const warranty = await Warranty.findOne({ serialNumber: req.params.serialNumber });
    if (!warranty) return res.api.notFound('Warranty not found');

    if (warranty.email !== req.user.email.toLowerCase() && req.user.role !== 'admin') {
        return res.api.forbidden();
    }

    const { issue } = req.body;
    const serviceRequest = await ServiceRequest.create({
        warranty: warranty._id,
        issue,
        timeline: [{
            stage: 'submitted',
            note: 'Your service request has been received.'
        }]
    });

    return res.api.created({ serviceRequest }, 'Service request created successfully.');
}));

// GET /api/warranty/service/:requestId
router.get('/service/:requestId', protect, catchAsync(async (req, res) => {
    const serviceRequest = await ServiceRequest.findById(req.params.requestId).populate({
        path: 'warranty',
        populate: { path: 'product', select: 'name images' }
    });
    
    if (!serviceRequest) return res.api.notFound();
    
    if (req.user.role !== 'admin' && serviceRequest.warranty.email !== req.user.email.toLowerCase()) {
        return res.api.forbidden();
    }
    
    return res.api.success({ serviceRequest });
}));

// PUT /api/warranty/service/:requestId/timeline (Admin)
router.put('/service/:requestId/timeline', protect, adminOnly, catchAsync(async (req, res) => {
    const { stage, note } = req.body;
    
    const serviceRequest = await ServiceRequest.findByIdAndUpdate(
        req.params.requestId,
        {
            status: stage,
            $push: { timeline: { stage, note } }
        },
        { new: true }
    );
    
    if (!serviceRequest) return res.api.notFound();
    
    return res.api.success({ serviceRequest });
}));

// GET /api/warranty/admin/all (Admin)
router.get('/admin/all', protect, adminOnly, catchAsync(async (req, res) => {
    const warranties = await Warranty.find().populate('product');
    return res.api.success({ warranties });
}));

export default router;
