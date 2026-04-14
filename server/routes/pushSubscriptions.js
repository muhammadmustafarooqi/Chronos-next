import express from 'express';
import PushSubscription from '../models/PushSubscription.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import catchAsync from '../utils/catchAsync.js';
import { sendPush, notifyUserByEmail } from '../utils/pushService.js';

const router = express.Router();

// POST /api/push/subscribe
router.post('/subscribe', optionalAuth, catchAsync(async (req, res) => {
    const { subscription } = req.body;
    
    // Validate subscription payload structure
    if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.api.error('Invalid subscription format. Must include endpoint and keys.', 400);
    }
    
    // If not authenticated, we just store the subscription without a user/email.
    // In a real scenario, we might want to attach a session ID, but this is simple.
    const isNewSubscription = !await PushSubscription.findOne({ 'subscription.endpoint': subscription.endpoint });
    const newSub = await PushSubscription.findOneAndUpdate(
        { 'subscription.endpoint': subscription.endpoint },
        {
            user: req.user ? req.user._id : undefined,
            email: req.user ? req.user.email.toLowerCase() : undefined,
            subscription
        },
        { upsert: true, new: true }
    );
    
    // Return 201 for new subscriptions, 200 for updates
    const statusCode = isNewSubscription ? 201 : 200;
    return res.api.success({ newSub }, 'Successfully subscribed to push notifications', statusCode);
}));

// DELETE /api/push/unsubscribe
router.delete('/unsubscribe', catchAsync(async (req, res) => {
    const { endpoint } = req.body;
    await PushSubscription.deleteOne({ 'subscription.endpoint': endpoint });
    return res.api.success(null, 'Successfully unsubscribed from push notifications');
}));

// POST /api/push/send (Admin)
router.post('/send', protect, adminOnly, catchAsync(async (req, res) => {
    const { payload, email } = req.body; // payload = { title, body, url }
    
    if (email) {
        await notifyUserByEmail(email, payload);
    } else {
        // Send to all
        const subs = await PushSubscription.find();
        const promises = subs.map(sub => sendPush(sub.subscription, payload));
        await Promise.allSettled(promises);
    }
    
    return res.api.success(null, 'Push notification(s) sent');
}));

export default router;
