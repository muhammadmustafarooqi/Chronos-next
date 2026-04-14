import express from 'express';
import Customer from '../models/Customer.js';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private/Admin
router.get('/', protect, adminOnly, catchAsync(async (req, res) => {
    const { search, status, sort = '-createdAt' } = req.query;

    const query = {};

    if (status && status !== 'All') query.status = status;

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const customers = await Customer.find(query).sort(sort);

    return res.api.success({
        customers: customers.map(c => ({
            id: c._id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            totalOrders: c.totalOrders,
            totalSpend: c.totalSpend,
            status: c.status,
            joinedDate: c.createdAt,
            lastOrderDate: c.lastOrderDate
        }))
    });
}));

// @route   GET /api/customers/:id
// @desc    Get single customer with order history
// @access  Private/Admin
router.get('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.api.notFound('Customer not found');
    }

    // Get customer's orders
    const orders = await Order.find({ email: customer.email }).sort('-createdAt');

    return res.api.success({
        customer: {
            id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            totalOrders: customer.totalOrders,
            totalSpend: customer.totalSpend,
            status: customer.status,
            joinedDate: customer.createdAt,
            lastOrderDate: customer.lastOrderDate,
            notes: customer.notes
        },
        orders: orders.map(o => ({
            id: o.orderId,
            totalAmount: o.totalAmount,
            status: o.status,
            date: o.createdAt
        }))
    });
}));

// @route   PUT /api/customers/:id/status
// @desc    Update customer status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, catchAsync(async (req, res) => {
    const { status } = req.body;

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!customer) {
        return res.api.notFound('Customer not found');
    }

    return res.api.success({ customer }, 'Customer status updated');
}));

// @route   DELETE /api/customers/:id
// @desc    Delete a customer
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
        return res.api.notFound('Customer not found');
    }

    return res.api.success({}, 'Customer deleted successfully');
}));

export default router;
