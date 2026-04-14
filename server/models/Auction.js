import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    startingPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    reservePrice: {
        type: Number
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'ended', 'cancelled'],
        default: 'upcoming'
    },
    minimumVipTier: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum'],
        default: 'gold'
    },
    bids: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        customerName: String,
        amount: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    winnerName: String
}, {
    timestamps: true
});

export default mongoose.model('Auction', auctionSchema);
