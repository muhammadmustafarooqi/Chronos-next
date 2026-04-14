import webpush from 'web-push';
import PushSubscription from '../models/PushSubscription.js';
import dotenv from 'dotenv';
dotenv.config();

webpush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@chronos.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export async function sendPush(subscription, payload) {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (err) {
        if (err.statusCode === 410 || err.statusCode === 404) {
            // Subscription expired or not found — delete it from DB
            await PushSubscription.deleteOne({
                'subscription.endpoint': subscription.endpoint
            });
        }
        console.error('[Push Service] Send notification error:', err.message);
    }
}

export async function notifyUserByEmail(email, payload) {
    if (!email) return;
    const subs = await PushSubscription.find({ email: email.toLowerCase() });
    const promises = subs.map(sub => sendPush(sub.subscription, payload));
    await Promise.allSettled(promises);
}
