/**
 * Response Utilities
 * Standardized API response helpers for consistent formatting
 */

class ApiResponse {
    constructor(res) {
        this.res = res;
    }

    // Success response
    success(data = {}, message = 'Success', statusCode = 200) {
        return this.res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        });
    }

    // Created response (201)
    created(data = {}, message = 'Created successfully') {
        return this.success(data, message, 201);
    }

    // Error response
    error(message = 'An error occurred', statusCode = 400, errors = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString()
        };

        if (errors) {
            response.errors = errors;
        }

        return this.res.status(statusCode).json(response);
    }

    // Not found response
    notFound(message = 'Resource not found') {
        return this.error(message, 404);
    }

    // Unauthorized response
    unauthorized(message = 'Please sign in to continue') {
        return this.error(message, 401);
    }

    // Forbidden response
    forbidden(message = 'You do not have permission to perform this action') {
        return this.error(message, 403);
    }

    // Validation error
    validationError(message = 'Please check your input', errors = null) {
        return this.error(message, 422, errors);
    }

    // Server error
    serverError(message = 'An unexpected error occurred. Please try again later.') {
        return this.error(message, 500);
    }

    // Paginated response
    paginated(data, pagination, message = 'Success') {
        return this.res.status(200).json({
            success: true,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        });
    }
}

// Middleware to attach response helper to res object
export const responseHelper = (req, res, next) => {
    res.api = new ApiResponse(res);
    next();
};

export default ApiResponse;
