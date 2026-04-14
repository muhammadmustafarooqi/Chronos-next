import mongoose from 'mongoose';

const rentalSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    customerName: String,
    email: String,
    phone: String,
    rentalPeriodDays: {
        type: Number,
        enum: [7, 14, 30],
        required: true
    },
    dailyRate: Number,
    depositAmount: Number,
    totalRentalFee: Number,
    creditTowardPurchase: Number,
    startDate: Date,
    endDate: Date,
    returnShippingLabel: String,
    status: {
        type: String,
        enum: ['pending', 'active', 'returned', 'converted', 'overdue'],
        default: 'pending'
    },
    convertedToOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    damageNotes: String,
    depositRefunded: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model('Rental', rentalSchema);
