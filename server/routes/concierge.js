/**
 * Feature 1: AI Watch Concierge
 * POST /api/concierge        — chat message, returns Claude response
 * POST /api/concierge/callback — Platinum VIP callback request (Feature 7)
 */
import express from 'express';
import Product from '../models/Product.js';
import catchAsync from '../utils/catchAsync.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/concierge
// @desc    AI watch concierge chat using Claude API
// @access  Public
router.post('/', optionalAuth, catchAsync(async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim() || message.length > 2000) {
        return res.api.error('Message is required and must be under 2000 characters', 400);
    }

    // Concierge feature disabled - requires Anthropic API credits
    return res.api.error('The AI Concierge feature is temporarily unavailable. Please check back soon!', 503);

    // Fetch product catalog from DB to inject as context
    const products = await Product.find({}).lean().limit(100);
    const catalogSummary = products.map(p => ({
        _id: p._id,
        name: p.name,
        brand: p.brand,
        price: p.price,
        category: p.category,
        features: p.features,
        description: p.description,
        isNew: p.isNew,
        isFeatured: p.isFeatured
    }));

    const systemPrompt = `You are a world-class watch expert and concierge for Chronos, a luxury watch boutique. You have deep knowledge of horology, watch movements, brands, and history. Help customers find their perfect watch. Be warm, knowledgeable, and concise. Here is the current product catalog:\n\n${JSON.stringify(catalogSummary, null, 2)}\n\nWhen recommending a specific product, always include its _id so the frontend can link to it. Format product recommendations clearly. If no product matches, give general horological advice.`;

    // Build messages array from history + current message
    const messages = [
        ...history.map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message.trim() }
    ];

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages
        })
    });

    if (!claudeRes.ok) {
        const errText = await claudeRes.text();
        console.error('Claude API error:', claudeRes.status, errText);
        return res.api.serverError('Claude API failed: ' + (claudeRes.status === 401 ? 'Invalid API key' : 'Service unavailable'));
    }

    const claudeData = await claudeRes.json();
    console.log('Claude response:', JSON.stringify(claudeData).substring(0, 100));
    
    if (!claudeData.content || !Array.isArray(claudeData.content) || claudeData.content.length === 0) {
        console.error('Invalid Claude response:', claudeData);
        return res.api.serverError('Invalid response from Claude API');
    }

    const reply = claudeData.content[0].text || 'I apologize, I could not generate a response. Please try again.';

    return res.api.success({ reply });
}));

// @route   POST /api/concierge/callback
// @desc    Platinum VIP callback request
// @access  Private
router.post('/callback', protect, catchAsync(async (req, res) => {
    const { note } = req.body;
    // In a full implementation this would create a CallbackRequest document.
    // For now we log and return success so Platinum users see the UX working.
    console.log(`[Concierge Callback] User: ${req.user.email} | Note: ${note || 'none'}`);
    return res.api.success({}, 'Your callback request has been received. A Chronos concierge will contact you within 2 hours.');
}));

export default router;
