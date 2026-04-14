import mongoose from 'mongoose';

const warrantySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    email: String,
    serialNumber: {
        type: String,
        unique: true
    },
    purchaseDate: Date,
    warrantyExpiryDate: Date,
    nextServiceDueDate: Date,
    movementType: {
        type: String,
        enum: ['automatic', 'quartz', 'manual', 'solar']
    },
    serviceIntervalYears: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
});

export default mongoose.model('Warranty', warrantySchema);
