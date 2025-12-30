import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';
import cache, { cacheMiddleware } from '../utils/cache.js';
import catchAsync from '../utils/catchAsync.js';
import validate, { schemas } from '../middleware/validate.js';

const router = express.Router();

// Cache keys
const CACHE_KEYS = {
    FEATURED: 'products:featured',
    NEW_ARRIVALS: 'products:new-arrivals',
    CATEGORIES: 'products:categories',
    BRANDS: 'products:brands'
};

// Helper to invalidate product caches
const invalidateProductCache = () => {
    cache.invalidatePattern('products:*');
};

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, pagination
// @access  Public
router.get('/', catchAsync(async (req, res) => {
    const {
        brand,
        category,
        minPrice,
        maxPrice,
        featured,
        isNew,
        search,
        sort = '-createdAt',
        page = 1,
        limit = 50
    } = req.query;

    const query = {};

    // Filters
    if (brand && brand !== 'All') query.brand = brand;
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (isNew === 'true') query.isNew = true;

    // Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { brand: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
        Product.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
        Product.countDocuments(query)
    ]);

    return res.api.paginated(
        { products },
        {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
        },
        'Products retrieved successfully.'
    );
}));

// @route   GET /api/products/featured
// @desc    Get featured products (cached for 5 minutes)
// @access  Public
router.get('/featured', cacheMiddleware(CACHE_KEYS.FEATURED, 300), catchAsync(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8).lean();
    return res.api.success({ products });
}));

// @route   GET /api/products/new-arrivals
// @desc    Get new arrivals (cached for 5 minutes)
// @access  Public
router.get('/new-arrivals', cacheMiddleware(CACHE_KEYS.NEW_ARRIVALS, 300), catchAsync(async (req, res) => {
    const products = await Product.find({ isNew: true }).limit(8).lean();
    return res.api.success({ products });
}));

// @route   GET /api/products/categories
// @desc    Get unique categories (cached for 10 minutes)
// @access  Public
router.get('/categories', cacheMiddleware(CACHE_KEYS.CATEGORIES, 600), catchAsync(async (req, res) => {
    const categories = await Product.distinct('category');
    return res.api.success({ categories: ['All', ...categories] });
}));

// @route   GET /api/products/brands
// @desc    Get unique brands (cached for 10 minutes)
// @access  Public
router.get('/brands', cacheMiddleware(CACHE_KEYS.BRANDS, 600), catchAsync(async (req, res) => {
    const brands = await Product.distinct('brand');
    return res.api.success({ brands: ['All', ...brands] });
}));

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
        return res.api.notFound('Product not found. It may have been discontinued.');
    }

    return res.api.success({ product });
}));

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, adminOnly, validate(schemas.createProduct), catchAsync(async (req, res) => {
    const product = await Product.create(req.body);
    
    // Invalidate product caches
    invalidateProductCache();
    
    return res.api.created({ product }, 'Product catalog updated with new timepiece.');
}));

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!product) {
        return res.api.notFound('Product not found.');
    }

    // Invalidate product caches
    invalidateProductCache();

    return res.api.success({ product }, 'Product information refined successfully.');
}));

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, catchAsync(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.api.notFound('Product not found.');
    }

    // Invalidate product caches
    invalidateProductCache();

    return res.api.success(null, 'Product removed from collection.');
}));

export default router;
