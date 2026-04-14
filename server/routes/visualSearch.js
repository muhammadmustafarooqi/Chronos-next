import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import multer from 'multer';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

const upload = multer({ 
    storage: multer.memoryStorage(), 
    limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/visual-search
router.post('/', upload.single('image'), catchAsync(async (req, res) => {
    if (!req.file) return res.api.error('No image provided', 400);

    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
    });

    try {
        // Step 1: Claude Vision identifies the watch
        const visionResponse = await client.messages.create({
            model: 'claude-3-5-sonnet-20241022', // Updated to a better, currently supported model
            max_tokens: 500,
            messages: [{
                role: 'user',
                content: [
                    {
                        type: 'image',
                        source: { type: 'base64', media_type: mimeType, data: base64Image }
                    },
                    {
                        type: 'text',
                        text: `Analyze this watch image. Return ONLY a JSON object with:
                        {
                            "brand": "detected brand or null",
                            "style": "dress|sport|diver|pilot|racing|casual",
                            "caseColor": "silver|gold|rose-gold|black",
                            "dialColor": "black|white|blue|green|grey|champagne",
                            "estimatedPriceRange": "under-1000|1000-5000|5000-20000|20000-plus",
                            "features": ["automatic","chronograph","diver","pilot", etc]
                        }`
                    }
                ]
            }]
        });

        let watchProfile;
        try {
            const text = visionResponse.content[0].text;
            watchProfile = JSON.parse(text.replace(/```json|```/g, '').trim());
        } catch {
            return res.api.success({ products: [], message: 'Could not identify watch definitively' });
        }

        // Step 2: Query MongoDB for matches
        const query = {};
        if (watchProfile.brand && watchProfile.brand !== 'null') {
            query.brand = new RegExp(watchProfile.brand, 'i');
        }
        if (watchProfile.style) {
            const categoryMap = {
                dress: 'Dress', sport: 'Sport', diver: 'Diver',
                pilot: 'Pilot', racing: 'Racing'
            };
            if (categoryMap[watchProfile.style]) {
                query.category = categoryMap[watchProfile.style];
            }
        }
        if (watchProfile.estimatedPriceRange) {
            const priceMap = {
                'under-1000': [0, 1000],
                '1000-5000': [1000, 5000],
                '5000-20000': [5000, 20000],
                '20000-plus': [20000, 9999999]
            };
            const [min, max] = priceMap[watchProfile.estimatedPriceRange] || [0, 9999999];
            query.price = { $gte: min, $lte: max };
        }
        if (watchProfile.features?.length) {
            query.features = { $in: watchProfile.features.map(f => new RegExp(f, 'i')) };
        }

        const products = await Product.find(query).limit(8).lean();

        // Increment visual search analytics count (Feature 8)
        // Store visualSearches globally or simply track it. Assuming we add a log later or have it counted dynamically.

        return res.api.success({
            detectedProfile: watchProfile,
            products,
            message: products.length
                ? `Found ${products.length} matches`
                : 'No exact matches — showing similar styles'
        });
    } catch (err) {
        console.error("Visual search error:", err);
        return res.api.error('Failed to process image', 500);
    }
}));

export default router;
