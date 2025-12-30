/**
 * Global error handler middleware
 * Provides standardized error responses
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log for developer
    console.error(`❌ Error: ${err.message}`.red || `❌ Error: ${err.message}`);
    if (err.stack) console.error(err.stack.gray || err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({
            success: false,
            message: 'The requested timepiece could not be found.'
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        let field = Object.keys(err.keyValue)[0];
        let message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
        
        if (field === 'email') {
            message = 'This email address is already registered. Please sign in instead.';
        }

        return res.status(400).json({
            success: false,
            message
        });
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({
            success: false,
            message: `Please correct the following: ${message}`
        });
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Your session has expired or is invalid. Please sign in again.'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Your session has expired. Please sign in again.'
        });
    }

    // Default Error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'A server error occurred. Our concierge team has been notified.'
    });
};

export default errorHandler;
