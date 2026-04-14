import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        default: ''
    },
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpend: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'VIP'],
        default: 'Active'
    },
    lastOrderDate: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ''
    },
    // Feature 6: VIP Tier
    vipTier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'bronze'
    }
}, {
    timestamps: true
});

// Index for search
customerSchema.index({ name: 'text', email: 'text' });

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
