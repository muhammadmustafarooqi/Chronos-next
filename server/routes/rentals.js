import express from 'express';
import Rental from '../models/Rental.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// GET /api/rentals
router.get('/', protect, catchAsync(async (req, res) => {
    let query = {};
    if (req.user.role !== 'admin') {
        const customer = await Customer.findOne({ email: req.user.email });
        query.customer = customer?._id || req.user._id; 
    }

    const rentals = await Rental.find(query).populate('product');
    return res.api.success({ rentals });
}));

// GET /api/rentals/:id
router.get('/:id', protect, catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate('product');
    if (!rental) return res.api.notFound('Rental not found');

    if (req.user.role !== 'admin') {
        const customer = await Customer.findOne({ email: req.user.email });
        if (rental.customer.toString() !== customer?._id?.toString() && rental.email !== req.user.email) {
            return res.api.forbidden();
        }
    }
    return res.api.success({ rental });
}));

// POST /api/rentals
router.post('/', protect, catchAsync(async (req, res) => {
    const { productId, rentalPeriodDays, phone } = req.body;
    
    // Max 1 active rental per customer
    const activeRental = await Rental.findOne({ 
        email: req.user.email, 
        status: { $in: ['pending', 'active', 'overdue'] } 
    });
    if (activeRental) {
        return res.api.error('You already have an active rental.', 400);
    }

    const product = await Product.findById(productId);
    if (!product || !product.isRentable) {
        return res.api.error('Product is not available for rent.', 400);
    }

    let dailyRateRatio = 0;
    if (rentalPeriodDays === 7) dailyRateRatio = 0.015;
    else if (rentalPeriodDays === 14) dailyRateRatio = 0.012;
    else if (rentalPeriodDays === 30) dailyRateRatio = 0.010;
    else return res.api.error('Invalid rental period. Must be 7, 14, or 30 days', 400);

    const dailyRate = product.price * dailyRateRatio;
    const totalRentalFee = dailyRate * rentalPeriodDays;
    const depositAmount = product.price * 0.20;
    const creditTowardPurchase = totalRentalFee * 0.80;
    
    let customer = await Customer.findOne({ email: req.user.email });
    if (!customer) {
        customer = await Customer.create({
            user: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: phone || '',
            totalOrders: 0,
            totalSpend: 0
        });
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + rentalPeriodDays * 24 * 60 * 60 * 1000);

    const rental = await Rental.create({
        product: product._id,
        customer: customer._id,
        customerName: req.user.name,
        email: req.user.email,
        phone: phone || customer.phone,
        rentalPeriodDays,
        dailyRate,
        depositAmount,
        totalRentalFee,
        creditTowardPurchase,
        startDate,
        endDate,
        status: 'pending' // pending until admin activates / ships it
    });

    return res.api.created({ rental });
}));

// PUT /api/rentals/:id/return (admin marks as returned)
router.put('/:id/return', protect, adminOnly, catchAsync(async (req, res) => {
    const rental = await Rental.findByIdAndUpdate(req.params.id, { status: 'returned' }, { new: true });
    if (!rental) return res.api.notFound();
    return res.api.success({ rental });
}));

// PUT /api/rentals/:id/damage (admin logs damage)
router.put('/:id/damage', protect, adminOnly, catchAsync(async (req, res) => {
    const { notes } = req.body;
    const rental = await Rental.findByIdAndUpdate(req.params.id, { damageNotes: notes }, { new: true });
    if (!rental) return res.api.notFound();
    return res.api.success({ rental });
}));

// PUT /api/rentals/:id/convert (admin converts rental to purchase)
router.put('/:id/convert', protect, adminOnly, catchAsync(async (req, res) => {
    const rental = await Rental.findById(req.params.id).populate('product');
    if (!rental) return res.api.notFound();
    if (rental.status === 'converted') return res.api.error('Already converted', 400);

    const product = rental.product;
    const purchasePrice = product.price - rental.creditTowardPurchase;

    const order = await Order.create({
        user: rental.customer, // This might be Customer id. But it relies on `user: req.user._id` in schema
        customerName: rental.customerName,
        email: rental.email,
        phone: rental.phone,
        items: [{
            product: product._id,
            name: product.name,
            price: purchasePrice, // Applied credit
            quantity: 1,
            image: product.images?.[0] || ''
        }],
        totalAmount: purchasePrice,
        shippingAddress: { street: 'Converted from Rental', city: '', state: '', zipCode: '' },
        paymentMethod: 'invoice',
        status: 'Delivered'
    });

    rental.status = 'converted';
    rental.convertedToOrderId = order._id;
    await rental.save();

    return res.api.success({ rental, order });
}));

export default router;
