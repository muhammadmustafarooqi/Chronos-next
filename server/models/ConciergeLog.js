import mongoose from 'mongoose';

const conciergeLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messageCount: { type: Number, default: 1 },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('ConciergeLog', conciergeLogSchema);
