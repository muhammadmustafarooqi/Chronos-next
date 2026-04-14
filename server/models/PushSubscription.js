import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: String,
    subscription: {
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    }
}, {
    timestamps: true
});

export default mongoose.model('PushSubscription', pushSubscriptionSchema);
