import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent for an order
 */
router.post('/create-intent', protect, catchAsync(async (req, res) => {
    const { orderId } = req.body;
    
    if (!orderId) {
        return res.api.error('Order ID is required', 400);
    }

    const order = await Order.findById(orderId).populate('items.product');
    if (!order) {
        return res.api.notFound('Order not found');
    }

    // Verify order belongs to user or user is admin
    if (order.email !== req.user.email.toLowerCase() && req.user.role !== 'admin') {
        return res.api.forbidden('Access denied');
    }

    // Prevent duplicate payment intents
    if (order.paymentIntentId && order.paymentStatus === 'succeeded') {
        return res.api.error('Order already paid', 400);
    }

    try {
        let paymentIntent;

        // If payment intent already exists, retrieve it
        if (order.paymentIntentId) {
            paymentIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        } else {
            // Create new payment intent
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(order.totalPrice * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    orderId: order._id.toString(),
                    email: order.email,
                    customerName: order.customerName,
                },
                description: `Order #${order._id} - Chronos Luxury Watches`,
            });

            // Save payment intent to order
            order.paymentIntentId = paymentIntent.id;
            order.paymentStatus = 'pending';
            await order.save();
        }

        return res.api.success({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: order.totalPrice,
        });
    } catch (error) {
        console.error('[PaymentService] Failed to create payment intent:', error.message);
        return res.api.error('Failed to create payment intent', 500);
    }
}));

/**
 * POST /api/payments/confirm
 * Confirm payment after Stripe processes it
 */
router.post('/confirm', protect, catchAsync(async (req, res) => {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId || !orderId) {
        return res.api.error('Payment Intent ID and Order ID are required', 400);
    }

    try {
        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.api.error(`Payment status: ${paymentIntent.status}`, 400);
        }

        // Update order with payment confirmation
        const order = await Order.findById(orderId);
        if (!order) {
            return res.api.notFound('Order not found');
        }

        order.paymentStatus = 'succeeded';
        order.paymentIntentId = paymentIntentId;
        order.status = 'Confirmed'; // Move from Pending to Confirmed
        order.paidAt = new Date();
        await order.save();

        // Send order confirmation email
        await sendEmail({
            to: order.email,
            subject: `Order Confirmation #${order._id}`,
            template: 'orderConfirmation.html',
            variables: {
                customerName: order.customerName,
                orderId: order._id.toString(),
                totalPrice: `$${order.totalPrice.toFixed(2)}`,
                itemCount: order.items.length,
                estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                trackingLink: `https://chronos.local/orders/${order._id}`,
            },
        });

        return res.api.success({
            message: 'Payment confirmed',
            order: {
                _id: order._id,
                status: order.status,
                paymentStatus: order.paymentStatus,
                paidAt: order.paidAt,
            },
        });
    } catch (error) {
        console.error('[PaymentService] Failed to confirm payment:', error.message);
        return res.api.error('Failed to confirm payment', 500);
    }
}));

/**
 * GET /api/payments/status/:paymentIntentId
 * Get payment status
 */
router.get('/status/:paymentIntentId', protect, catchAsync(async (req, res) => {
    const { paymentIntentId } = req.params;

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return res.api.success({
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            created: paymentIntent.created,
        });
    } catch (error) {
        console.error('[PaymentService] Failed to fetch payment status:', error.message);
        return res.api.error('Failed to fetch payment status', 500);
    }
}));

/**
 * POST /api/payments/webhook
 * Stripe webhook handler (with raw body for signature verification)
 * IMPORTANT: This route should NOT use JSON body parser
 * Configure in server.js before express.json() middleware
 */
router.post('/webhook', express.raw({ type: 'application/json' }), catchAsync(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.warn('[Webhook] STRIPE_WEBHOOK_SECRET not configured');
        return res.status(400).send('Webhook secret not configured');
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('[Webhook] Signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object;
            const { orderId } = paymentIntent.metadata;

            console.log(`[Webhook] Payment succeeded for order ${orderId}`);

            // Update order status
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'succeeded',
                status: 'Confirmed',
                paidAt: new Date(),
            });

            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const { orderId, email } = paymentIntent.metadata;

            console.log(`[Webhook] Payment failed for order ${orderId}`);

            // Update order status
            const order = await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'failed',
                status: 'Payment Failed',
            });

            // Send failure notification email
            if (email) {
                await sendEmail({
                    to: email,
                    subject: `Payment Failed - Order #${orderId}`,
                    template: 'orderConfirmation.html',
                    variables: {
                        customerName: order?.customerName || 'Valued Customer',
                        orderId,
                        message: 'We could not process your payment. Please try again or contact support.',
                        totalPrice: (paymentIntent.amount / 100).toFixed(2),
                    },
                });
            }

            break;
        }

        case 'payment_intent.canceled': {
            const paymentIntent = event.data.object;
            const { orderId } = paymentIntent.metadata;

            console.log(`[Webhook] Payment canceled for order ${orderId}`);

            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'canceled',
                status: 'Canceled',
            });

            break;
        }

        case 'charge.refunded': {
            const charge = event.data.object;
            console.log(`[Webhook] Charge refunded: ${charge.id}`);

            // Find order by payment intent
            const order = await Order.findOne({ paymentIntentId: charge.payment_intent });
            if (order) {
                order.paymentStatus = 'refunded';
                order.status = 'Refunded';
                await order.save();
            }

            break;
        }

        default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
}));

export default router;
