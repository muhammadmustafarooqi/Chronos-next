import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerName: String,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    watchName: String,
    brand: String,
    askingPrice: {
        type: Number,
        required: true
    },
    originalPurchasePrice: Number,
    condition: {
        type: String,
        enum: ['unworn', 'excellent', 'very-good', 'good', 'fair'],
        required: true
    },
    description: String,
    images: [{
        type: String
    }],
    serialNumber: String,
    hasWarranty: {
        type: Boolean,
        default: false
    },
    warrantyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warranty'
    },
    isChronosVerified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending-review', 'active', 'sold', 'removed'],
        default: 'pending-review'
    },
    views: {
        type: Number,
        default: 0
    },
    commissionRate: {
        type: Number,
        default: 0.05
    },
    escrowStatus: {
        type: String,
        enum: ['none', 'held', 'released', 'refunded'],
        default: 'none'
    }
}, {
    timestamps: true
});

export default mongoose.model('Listing', listingSchema);
