import express from 'express';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import validate, { schemas } from '../middleware/validate.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// Helper to format order for response
const formatOrder = (order) => ({
    id: order.orderId,
    _id: order._id,
    customerId: order.user?._id || order._id,
    customerName: order.customerName,
    email: order.email,
    phone: order.phone,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    date: order.createdAt,
    shippingAddress: order.shippingAddress,
    shippingAddressFormatted: order.shippingAddressFormatted ||
        `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus
});

// @route   GET /api/orders
// @desc    Get all orders (admin) or user's orders
// @access  Private
router.get('/', protect, catchAsync(async (req, res) => {
    let query = {};

    // If not admin, only show user's orders
    if (req.user.role !== 'admin') {
        query = {
            $or: [
                { user: req.user._id },
                { email: req.user.email.toLowerCase() }
            ]
        };
    }

    const orders = await Order.find(query)
        .sort('-createdAt')
        .populate('user', 'name email');

    return res.api.success({
        orders: orders.map(formatOrder)
    });
}));

// @route   GET /api/orders/my-orders
// @desc    Get current user's orders
// @access  Private
router.get('/my-orders', protect, catchAsync(async (req, res) => {
    const orders = await Order.find({
        $or: [
            { user: req.user._id },
            { email: req.user.email.toLowerCase() }
        ]
    }).sort('-createdAt');

    return res.api.success({
        orders: orders.map(order => ({
            id: order.orderId,
            _id: order._id,
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status,
            date: order.createdAt,
            shippingAddress: order.shippingAddressFormatted
        }))
    });
}));

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, catchAsync(async (req, res) => {
    const order = await Order.findOne({
        $or: [
            { _id: req.params.id },
            { orderId: req.params.id }
        ]
    }).populate('user', 'name email');

    if (!order) {
        return res.api.notFound('Order not found');
    }

    // Check if user has access to this order
    if (req.user.role !== 'admin' &&
        order.user?.toString() !== req.user._id.toString() &&
        order.email !== req.user.email) {
        return res.api.forbidden('You do not have permission to view this order');
    }

    return res.api.success({
        order: formatOrder(order)
    });
}));

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public (with optional auth)
router.post('/', optionalAuth, validate(schemas.createOrder), catchAsync(async (req, res) => {
    const {
        customerName,
        email,
        phone,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod = 'cod'
    } = req.body;

    // Additional check for items (already covered by validate but kept for safety)
    if (!items || items.length === 0) {
        return res.api.error('Your cart is empty. Cannot place an order.', 400);
    }

    // Format items and check stock if possible
    const orderItems = await Promise.all(items.map(async (item) => {
        let product = null;
        if (item.id || item._id) {
            product = await Product.findById(item.id || item._id).catch(() => null);
        }

        return {
            product: product?._id || item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || (item.images ? item.images[0] : '')
        };
    }));

    // Format shipping address
    const shippingAddressFormatted = typeof shippingAddress === 'string'
        ? shippingAddress
        : `${shippingAddress.street || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zipCode || ''}`.trim();

    // Create order
    const order = await Order.create({
        user: req.user?._id || null,
        customerName,
        email: email.toLowerCase(),
        phone,
        items: orderItems,
        totalAmount,
        shippingAddress: typeof shippingAddress === 'string'
            ? { street: shippingAddress }
            : shippingAddress,
        shippingAddressFormatted,
        paymentMethod,
        status: 'Pending'
    });

    // Update or create customer record
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });

    if (existingCustomer) {
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpend += totalAmount;
        existingCustomer.lastOrderDate = new Date();
        await existingCustomer.save();
    } else {
        await Customer.create({
            user: req.user?._id || null,
            name: customerName,
            email: email.toLowerCase(),
            phone,
            totalOrders: 1,
            totalSpend: totalAmount,
            lastOrderDate: new Date()
        });
    }

    return res.api.created({
        order: {
            id: order.orderId,
            _id: order._id,
            customerName: order.customerName,
            email: order.email,
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status,
            date: order.createdAt
        }
    }, 'Your order has been placed successfully. Thank you for choosing Chronos.');
}));

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, catchAsync(async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.api.error('Status is required');
    }

    const order = await Order.findOneAndUpdate(
        { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
        { status },
        { new: true }
    );

    if (!order) {
        return res.api.notFound('Order not found');
    }

    // Update payment status if delivered
    if (status === 'Delivered' && order.paymentMethod === 'cod') {
        order.paymentStatus = 'paid';
        await order.save();
    }

    return res.api.success({
        order: {
            id: order.orderId,
            status: order.status,
            paymentStatus: order.paymentStatus
        }
    }, `Order status updated to ${status}.`);
}));

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const order = await Order.findOneAndDelete({
        $or: [{ _id: req.params.id }, { orderId: req.params.id }]
    });

    if (!order) {
        return res.api.notFound('Order not found');
    }

    return res.api.success(null, 'Order record deleted successfully.');
}));

export default router;
