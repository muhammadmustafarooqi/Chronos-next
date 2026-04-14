import mongoose from 'mongoose';

const matchmakerLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('MatchmakerLog', matchmakerLogSchema);
