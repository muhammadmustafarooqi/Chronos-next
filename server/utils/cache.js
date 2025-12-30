/**
 * Simple In-Memory Cache
 * Provides caching for frequently accessed data to reduce database load
 */

class Cache {
    constructor() {
        this.store = new Map();
        this.timers = new Map();
    }

    /**
     * Get cached value
     * @param {string} key - Cache key
     * @returns {any} Cached value or undefined
     */
    get(key) {
        const item = this.store.get(key);
        if (!item) return undefined;

        // Check if expired
        if (item.expiry && Date.now() > item.expiry) {
            this.delete(key);
            return undefined;
        }

        return item.value;
    }

    /**
     * Set cache value
     * @param {string} key - Cache key
     * @param {any} value - Value to cache
     * @param {number} ttlSeconds - Time to live in seconds (default: 5 minutes)
     */
    set(key, value, ttlSeconds = 300) {
        // Clear any existing timer
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
        }

        const expiry = Date.now() + (ttlSeconds * 1000);
        this.store.set(key, { value, expiry });

        // Set auto-cleanup timer
        const timer = setTimeout(() => {
            this.delete(key);
        }, ttlSeconds * 1000);

        this.timers.set(key, timer);
    }

    /**
     * Delete cached value
     * @param {string} key - Cache key
     */
    delete(key) {
        this.store.delete(key);
        if (this.timers.has(key)) {
            clearTimeout(this.timers.get(key));
            this.timers.delete(key);
        }
    }

    /**
     * Clear all cached values
     */
    clear() {
        this.store.clear();
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
    }

    /**
     * Get cache statistics
     */
    stats() {
        return {
            size: this.store.size,
            keys: Array.from(this.store.keys())
        };
    }

    /**
     * Invalidate cache by pattern
     * @param {string} pattern - Pattern to match (supports * wildcard)
     */
    invalidatePattern(pattern) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        const keysToDelete = [];

        this.store.forEach((_, key) => {
            if (regex.test(key)) {
                keysToDelete.push(key);
            }
        });

        keysToDelete.forEach(key => this.delete(key));
        return keysToDelete.length;
    }
}

// Create singleton instance
const cache = new Cache();

// Cache middleware factory
export const cacheMiddleware = (keyGenerator, ttlSeconds = 300) => {
    return (req, res, next) => {
        const key = typeof keyGenerator === 'function' 
            ? keyGenerator(req) 
            : keyGenerator;

        const cached = cache.get(key);

        if (cached) {
            console.log(`📦 Cache HIT: ${key}`);
            return res.json(cached);
        }

        console.log(`📭 Cache MISS: ${key}`);

        // Store original json method
        const originalJson = res.json.bind(res);

        // Override json method to cache response
        res.json = (data) => {
            if (res.statusCode === 200 && data.success !== false) {
                cache.set(key, data, ttlSeconds);
            }
            return originalJson(data);
        };

        next();
    };
};

export default cache;
