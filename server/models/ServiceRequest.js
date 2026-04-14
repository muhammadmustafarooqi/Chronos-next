import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
    warranty: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warranty',
        required: true
    },
    issue: String,
    requestedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['submitted', 'received', 'in-service', 'ready', 'returned'],
        default: 'submitted'
    },
    timeline: [{
        stage: String,
        timestamp: { type: Date, default: Date.now },
        note: String
    }],
    estimatedCost: Number,
    finalCost: Number,
    technicianNotes: String
}, {
    timestamps: true
});

export default mongoose.model('ServiceRequest', serviceRequestSchema);
