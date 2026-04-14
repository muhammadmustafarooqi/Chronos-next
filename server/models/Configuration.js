import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    strapColor: {
        type: String,
        default: 'black-leather'
    },
    dialColor: {
        type: String,
        default: 'black'
    },
    caseFinish: {
        type: String,
        default: 'polished'
    }
}, {
    timestamps: true
});

const Configuration = mongoose.model('Configuration', configurationSchema);
export default Configuration;
