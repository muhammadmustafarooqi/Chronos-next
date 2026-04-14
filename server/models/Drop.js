import mongoose from 'mongoose';

const dropSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    dropName: String,
    description: String,
    releaseDate: {
        type: Date,
        required: true
    },
    goldPlusEarlyAccessHours: {
        type: Number,
        default: 48
    },
    quantity: Number,
    status: {
        type: String,
        enum: ['scheduled', 'gold-access', 'live', 'sold-out', 'cancelled'],
        default: 'scheduled'
    },
    bannerImage: String
}, {
    timestamps: true
});

export default mongoose.model('Drop', dropSchema);
