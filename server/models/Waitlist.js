import mongoose from 'mongoose';

const waitlistSchema = new mongoose.Schema({
    drop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drop',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    vipTier: String,
    joinedAt: {
        type: Date,
        default: Date.now
    },
    notified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Waitlist', waitlistSchema);
