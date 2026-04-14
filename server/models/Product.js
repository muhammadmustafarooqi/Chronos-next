import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['Luxury', 'Sport', 'Classic', 'Diver', 'Pilot', 'Racing', 'Heritage', 'Dress', 'Explorer', 'Exotic']
    },
    description: {
        type: String,
        default: ''
    },
    features: [{
        type: String
    }],
    isNew: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 1,
        min: 0
    },
    marketValue: {
        type: Number,
        default: null
    },
    isRentable: {
        type: Boolean,
        default: false
    },
    viewCount: {
        type: Number,
        default: 0
    },
    arTryOnCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    suppressReservedKeysWarning: true
});

// Index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
