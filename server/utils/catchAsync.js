/**
 * Catch Async Errors
 * Wraps asynchronous functions to catch any errors and pass them to the global error handler
 * This eliminates the need for repetitive try-catch blocks
 */
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
