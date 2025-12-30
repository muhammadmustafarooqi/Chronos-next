/**
 * Rate Limiter Middleware
 * Prevents API abuse with configurable limits
 */

class RateLimiter {
    constructor() {
        this.requests = new Map();
        
        // Clean up old entries every minute
        setInterval(() => this.cleanup(), 60000);
    }

    cleanup() {
        const now = Date.now();
        this.requests.forEach((data, key) => {
            if (now > data.resetTime) {
                this.requests.delete(key);
            }
        });
    }

    check(key, limit, windowMs) {
        const now = Date.now();
        let data = this.requests.get(key);

        if (!data || now > data.resetTime) {
            data = {
                count: 0,
                resetTime: now + windowMs
            };
        }

        data.count++;
        this.requests.set(key, data);

        return {
            allowed: data.count <= limit,
            remaining: Math.max(0, limit - data.count),
            resetTime: data.resetTime,
            total: limit
        };
    }
}

const limiter = new RateLimiter();

/**
 * Rate limit middleware factory
 * @param {Object} options - Configuration options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.max - Maximum requests per window (default: 100)
 * @param {string} options.message - Error message when limit exceeded
 * @param {Function} options.keyGenerator - Custom key generator function
 */
const rateLimit = (options = {}) => {
    const {
        windowMs = 15 * 60 * 1000, // 15 minutes
        max = 100,
        message = 'Too many requests. Please try again later.',
        keyGenerator = (req) => req.ip || req.connection.remoteAddress || 'unknown'
    } = options;

    return (req, res, next) => {
        const key = keyGenerator(req);
        const result = limiter.check(key, max, windowMs);

        // Set rate limit headers
        res.setHeader('X-RateLimit-Limit', result.total);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

        if (!result.allowed) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
            });
        }

        next();
    };
};

// Pre-configured limiters for common use cases
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15 minutes
    message: 'Too many login attempts. Please try again in 15 minutes.'
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    message: 'API rate limit exceeded. Please slow down your requests.'
});

export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per hour
    message: 'This action is rate limited. Please try again later.'
});

export default rateLimit;
