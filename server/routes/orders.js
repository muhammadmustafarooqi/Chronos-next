import express from 'express';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import Warranty from '../models/Warranty.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import validate, { schemas } from '../middleware/validate.js';
import catchAsync from '../utils/catchAsync.js';
import { calculateTier } from '../utils/vipUtils.js';
import { randomUUID } from 'crypto';
import { sendEmail } from '../utils/emailService.js';
import { notifyUserByEmail } from '../utils/pushService.js';

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
    paymentStatus: order.paymentStatus,
    deliveryTimeline: order.deliveryTimeline || [],
    isGift: order.isGift || false,
    giftMessage: order.giftMessage || '',
    giftWrap: order.giftWrap || false,
    giftRevealToken: order.giftRevealToken || null,
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
        paymentMethod = 'cod',
        isGift = false,
        giftMessage = '',
        giftWrap = false,
    } = req.body;

    // Additional check for items (already covered by validate but kept for safety)
    if (!items || items.length === 0) {
        return res.api.error('Your cart is empty. Cannot place an order.', 400);
    }

    // Format items and check stock availability
    const orderItems = [];
    for (const item of items) {
        let product = null;
        if (item.id || item._id) {
            product = await Product.findById(item.id || item._id).catch(() => null);
        }

        // Check stock if product found in DB
        if (product !== null) {
            if (product.stock !== undefined && product.stock < item.quantity) {
                return res.api.error(
                    `Sorry, "${item.name}" only has ${product.stock} unit(s) in stock. Please adjust your cart.`,
                    400
                );
            }
        }

        orderItems.push({
            product: product?._id || item.id || item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || (item.images ? item.images[0] : '')
        });
    }

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
        status: 'Pending',
        // Feature 8: Gift suite
        isGift: !!isGift,
        giftMessage: isGift ? (giftMessage || '') : '',
        giftWrap: isGift ? !!giftWrap : false,
        giftRevealToken: isGift ? randomUUID() : null,
        // Feature 7: Seed delivery timeline with first stage
        deliveryTimeline: [{
            stage: 'Order Confirmed',
            timestamp: new Date(),
            note: 'Your order has been received and is awaiting preparation.'
        }]
    });

    try {
        await sendEmail({
            to: order.email,
            subject: `Order Confirmed — ${order.orderId}`,
            template: 'orderConfirmation.html',
            variables: {
                customerName: order.customerName,
                orderId: order.orderId,
                items: order.items.map(i => `${i.name} x${i.quantity} — $${i.price}`).join('<br>'),
                totalAmount: order.totalAmount.toLocaleString(),
                shippingAddress: order.shippingAddressFormatted,
                giftRevealUrl: order.isGift ? `${process.env.FRONTEND_URL}/gift/${order.giftRevealToken}` : ''
            }
        });
    } catch (error) {
        console.error('Failed to send order email:', error);
    }

    // Decrement stock for each purchased product atomically
    for (const item of orderItems) {
        if (item.product) {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: item.product, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            );

            if (!updatedProduct) {
                // If this happens, it means someone else bought it between our initial check and now.
                // In a perfect world we'd rollback the whole order, but since we already created it,
                // we log it and proceed (best-effort consistency for this MVP).
                console.error(`🛑 Stock race condition for product ${item.product}. Order ${order.orderId} created but stock was insufficient.`);
            }

            // Feature 5: Warranty auto-creation
            try {
                const product = await Product.findById(item.product);
                if (product) {
                    const movementTypeMatch = product.features?.find(f => 
                        ['automatic', 'quartz', 'manual', 'solar'].includes(f.toLowerCase())
                    ) || 'automatic';
                    const movementType = movementTypeMatch.toLowerCase();
                    const serviceYears = { automatic: 3, manual: 3, quartz: 5, solar: 7 };
                    const serviceInterval = serviceYears[movementType] || 3;
                    
                    // Calculate warranty expiry (2 years from now, accounting for leap years)
                    const warrantyExpiryDate = new Date();
                    warrantyExpiryDate.setFullYear(warrantyExpiryDate.getFullYear() + 2);
                    
                    // Calculate next service due date (serviceInterval years from now, accounting for leap years)
                    const nextServiceDate = new Date();
                    nextServiceDate.setFullYear(nextServiceDate.getFullYear() + serviceInterval);
                    
                    await Warranty.create({
                        order: order._id,
                        product: item.product,
                        email: order.email,
                        serialNumber: `CHR-${new Date().getFullYear()}-${Math.random().toString(16).slice(2,8).toUpperCase()}`,
                        purchaseDate: new Date(),
                        warrantyExpiryDate,
                        movementType,
                        serviceIntervalYears: serviceInterval,
                        nextServiceDueDate: nextServiceDate
                    });
                }
            } catch (err) {
                console.error('Failed to create warranty:', err);
            }
        }
    }

    // Update or create customer record
    const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });

    if (existingCustomer) {
        existingCustomer.totalOrders += 1;
        existingCustomer.totalSpend += totalAmount;
        existingCustomer.lastOrderDate = new Date();
        // Feature 6: Recalculate VIP tier
        const newTier = calculateTier(existingCustomer.totalSpend);
        if (newTier !== existingCustomer.vipTier) {
            existingCustomer.vipTier = newTier;
            
            const TIER_PERKS = {
                bronze: { perks: ['Free shipping'] },
                silver: { perks: ['Free shipping', 'Early drop access'] },
                gold: { perks: ['Free shipping', 'Early drop access', 'Dedicated concierge'] },
                platinum: { perks: ['Free shipping', 'Early drop access', 'Dedicated concierge', 'Private events'] }
            };

            try {
                await sendEmail({
                    to: existingCustomer.email,
                    subject: `Welcome to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} — Your Chronos status has been upgraded`,
                    template: 'vipTierUpgrade.html',
                    variables: {
                        customerName: existingCustomer.name,
                        newTier: newTier.charAt(0).toUpperCase() + newTier.slice(1),
                        perks: TIER_PERKS[newTier]?.perks.join(', ') || 'Exclusive rewards await you.',
                        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
                    }
                });
            } catch (error) {
                console.error('Failed to send VIP upgrade email:', error);
            }

            try {
                await notifyUserByEmail(existingCustomer.email, {
                    title: 'VIP Tier Upgraded!',
                    body: `Congratulations! You are now a ${newTier.charAt(0).toUpperCase() + newTier.slice(1)} member.`,
                    url: '/profile'
                });
            } catch (error) {
                console.error('Failed to send VIP upgrade push:', error);
            }
        }
        await existingCustomer.save();
    } else {
        await Customer.create({
            user: req.user?._id || null,
            name: customerName,
            email: email.toLowerCase(),
            phone,
            totalOrders: 1,
            totalSpend: totalAmount,
            lastOrderDate: new Date(),
            vipTier: calculateTier(totalAmount)
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

// @route   POST /api/orders/:id/timeline
// @desc    Push a delivery timeline stage (Feature 7)
// @access  Private/Admin
router.post('/:id/timeline', protect, adminOnly, catchAsync(async (req, res) => {
    const { stage, note } = req.body;

    const VALID_STAGES = [
        'Order Confirmed',
        'Being Prepared',
        'Quality Checked',
        'Dispatched',
        'Out for Delivery',
        'Delivered'
    ];

    if (!stage || !VALID_STAGES.includes(stage)) {
        return res.api.error(`Invalid stage. Must be one of: ${VALID_STAGES.join(', ')}`, 400);
    }

    const order = await Order.findOneAndUpdate(
        { $or: [{ _id: req.params.id }, { orderId: req.params.id }] },
        {
            $push: {
                deliveryTimeline: {
                    stage,
                    timestamp: new Date(),
                    note: note || ''
                }
            }
        },
        { new: true }
    );

    if (!order) {
        return res.api.notFound('Order not found');
    }

    try {
        await sendEmail({
            to: order.email,
            subject: 'Your Chronos order has been updated',
            template: 'shippingUpdate.html',
            variables: {
                customerName: order.customerName,
                orderId: order.orderId,
                stage: stage,
                note: note || '',
                trackingUrl: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/profile` : 'http://localhost:3000/profile'
            }
        });
    } catch (error) {
        console.error('Failed to send timeline email:', error);
    }

    if (stage === 'Out for Delivery') {
        try {
            await notifyUserByEmail(order.email, {
                title: 'Out for Delivery',
                body: `Your Chronos order ${order.orderId} is out for delivery today.`,
                url: '/profile'
            });
        } catch (error) {}
    }

    return res.api.success({
        deliveryTimeline: order.deliveryTimeline
    }, `Delivery stage "${stage}" added successfully.`);
}));

export default router;
