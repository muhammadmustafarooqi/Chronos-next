/**
 * Global error handler middleware
 * Provides standardized error responses
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    if (process.env.NODE_ENV !== 'production') {
        console.error(`❌ Error: ${err.message}`);
        if (err.stack) console.error(err.stack);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        let message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        
        if (field === 'email') {
            message = 'This email address is already registered. Please sign in instead.';
        }

        return res.status(409).json({
            success: false,
            message,
            duplicateField: field
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({
            success: false,
            message: `Validation Error: ${message}`,
            errors: err.errors
        });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Your session token is invalid. Please sign in again.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Your session has expired. Please sign in again.'
        });
    }

    // Default Error
    const statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || 'A server error occurred. Our concierge team has been notified.'
    };

    if (process.env.NODE_ENV !== 'production') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;
