/**
 * Request Validation Middleware
 * Provides reusable validation for common request patterns
 */

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation helper
const validate = (schema) => (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
        const value = req.body[field];

        // Required check
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`${rules.label || field} is required`);
            continue;
        }

        // Skip further checks if not required and empty
        if (value === undefined || value === null || value === '') continue;

        // Type check
        if (rules.type === 'email' && !emailRegex.test(value)) {
            errors.push(`Please enter a valid email address`);
        }

        if (rules.type === 'number' && (typeof value !== 'number' || isNaN(value))) {
            errors.push(`${rules.label || field} must be a number`);
        }

        // Min length
        if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
            errors.push(`${rules.label || field} must be at least ${rules.minLength} characters`);
        }

        // Max length
        if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
            errors.push(`${rules.label || field} cannot exceed ${rules.maxLength} characters`);
        }

        // Min value
        if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
            errors.push(`${rules.label || field} must be at least ${rules.min}`);
        }

        // Array check
        if (rules.isArray && !Array.isArray(value)) {
            errors.push(`${rules.label || field} must be an array`);
        }

        // Array min length
        if (rules.minItems && Array.isArray(value) && value.length < rules.minItems) {
            errors.push(`${rules.label || field} must have at least ${rules.minItems} item(s)`);
        }

        // Custom validation
        if (rules.custom && typeof rules.custom === 'function') {
            const customError = rules.custom(value, req.body);
            if (customError) errors.push(customError);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: errors.join('. ')
        });
    }

    next();
};

// Pre-defined validation schemas
export const schemas = {
    register: {
        name: { required: true, label: 'Name', minLength: 2, maxLength: 100 },
        email: { required: true, type: 'email', label: 'Email' },
        password: { required: true, label: 'Password', minLength: 6 }
    },
    login: {
        email: { required: true, type: 'email', label: 'Email' },
        password: { required: true, label: 'Password' }
    },
    createOrder: {
        customerName: { required: true, label: 'Customer name', minLength: 2 },
        email: { required: true, type: 'email', label: 'Email' },
        items: { required: true, isArray: true, minItems: 1, label: 'Order items' },
        totalAmount: { required: true, type: 'number', min: 0, label: 'Total amount' }
    },
    createProduct: {
        name: { required: true, label: 'Product name', minLength: 2 },
        brand: { required: true, label: 'Brand' },
        price: { required: true, type: 'number', min: 0, label: 'Price' },
        category: { required: true, label: 'Category' }
    }
};

export default validate;
