/**
 * Feature 4: Watch Style Matchmaker Routes
 * POST /api/matchmaker — receive quiz answers, return matched products + AI explanations
 */
import express from 'express';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router();

// Scoring engine — mirrors frontend algorithm but authoritative server-side version
const scoreProduct = (product, answers) => {
    let score = 0;

    // Occasion → category mapping
    const occasionMap = {
        everyday:  ['Sport', 'Classic', 'Diver', 'Heritage'],
        business:  ['Luxury', 'Dress', 'Classic'],
        sport:     ['Diver', 'Explorer', 'Pilot', 'Sport', 'Racing'],
        special:   ['Luxury', 'Dress', 'Exotic', 'Heritage'],
        all:       ['Luxury', 'Sport', 'Classic', 'Diver', 'Pilot', 'Racing', 'Heritage', 'Dress', 'Explorer', 'Exotic'],
    };

    // Style → category mapping
    const styleMap = {
        classic:  ['Classic', 'Heritage', 'Dress'],
        bold:     ['Sport', 'Diver', 'Racing', 'Explorer'],
        minimal:  ['Luxury', 'Dress', 'Classic'],
        vintage:  ['Heritage', 'Dress', 'Classic'],
    };

    // Movement → features keyword mapping
    const movementMap = {
        automatic: ['Automatic', 'Self-winding'],
        quartz:    ['Quartz', 'Battery'],
        manual:    ['Manual', 'Hand-wound', 'Hand Winding'],
        none:      [],
    };

    // Budget → price range mapping
    const budgetMap = {
        under1k:  { min: 0,     max: 1000 },
        '1k_5k':    { min: 1000,  max: 5000 },
        '5k_20k':   { min: 5000,  max: 20000 },
        '20k+':   { min: 20000, max: Infinity },
    };

    const occasion = answers.occasion;
    const style    = answers.style;
    const movement = answers.movement;
    const budget   = answers.budget;

    if (occasion && occasionMap[occasion]?.includes(product.category)) score += 3;
    if (style    && styleMap[style]?.includes(product.category))       score += 2;

    if (budget && budgetMap[budget]) {
        const { min, max } = budgetMap[budget];
        if (product.price >= min && product.price <= max) score += 3;
        else {
            const dist = Math.min(Math.abs(product.price - min), Math.abs(product.price - max));
            if (dist < 2000) score += 1;
        }
    }

    if (movement && movement !== 'none' && movementMap[movement] && product.features) {
        const matched = product.features.some(f =>
            movementMap[movement].some(k => f.toLowerCase().includes(k.toLowerCase()))
        );
        if (matched) score += 2;
    }

    if (product.isFeatured) score += 0.5;
    if (product.isNew)      score += 0.5;

    return score;
};

// @route   POST /api/matchmaker
// @desc    Quiz answers → matched product list with optional AI personalisation
// @access  Public
router.post('/', catchAsync(async (req, res) => {
    const { answers, brands = [] } = req.body;

    if (!answers) {
        return res.api.error('Quiz answers are required', 400);
    }

    // Build query — optionally filter by known brands
    const query = {};
    if (brands.length > 0) {
        query.brand = { $in: brands };
    }

    const products = await Product.find(query).lean();
    const scored = products
        .map(p => ({ ...p, matchScore: scoreProduct(p, answers) }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

    // Try to get AI explanations for each pick
    let recommendations = scored.map(p => ({ product: p, explanation: null }));

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (apiKey && scored.length > 0) {
        try {
            const prompt = `A customer completed a watch finder quiz with these preferences:
Occasion: ${answers.occasion || 'any'}
Style: ${answers.style || 'any'}
Movement: ${answers.movement || 'any'}
Budget: ${answers.budget || 'any'}
Known brands: ${brands.join(', ') || 'none specified'}

Based on these preferences, I've selected these watches for them:
${scored.map((p, i) => `${i + 1}. ${p.brand} ${p.name} ($${p.price?.toLocaleString()}, ${p.category})`).join('\n')}

Write a SINGLE short sentence (max 20 words) for each watch explaining why it suits this specific customer's preferences. Return ONLY a JSON array of strings, one per watch, no extra text.`;

            const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 512,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (claudeRes.ok) {
                const data = await claudeRes.json();
                const text = data.content?.[0]?.text || '[]';
                const explanations = JSON.parse(text.trim());
                recommendations = scored.map((p, i) => ({
                    product: p,
                    explanation: explanations[i] || null
                }));
            }
        } catch (e) {
            console.error('Matchmaker AI explanation error:', e.message);
            // Non-fatal — continue without AI explanations
        }
    }

    return res.api.success({ recommendations });
}));

export default router;
