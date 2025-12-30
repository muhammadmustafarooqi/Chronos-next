/**
 * Request Logger Middleware
 * Beautiful, colorful request logging for development
 */

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgRed: '\x1b[41m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m'
};

const methodColors = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    PATCH: colors.yellow,
    DELETE: colors.red
};

const statusColors = (status) => {
    if (status >= 500) return colors.red;
    if (status >= 400) return colors.yellow;
    if (status >= 300) return colors.cyan;
    if (status >= 200) return colors.green;
    return colors.white;
};

const formatDuration = (ms) => {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
};

const requestLogger = (req, res, next) => {
    const startTime = process.hrtime();
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Capture response finish
    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(startTime);
        const durationMs = (seconds * 1000) + (nanoseconds / 1e6);

        const method = req.method;
        const url = req.originalUrl || req.url;
        const status = res.statusCode;

        const methodColor = methodColors[method] || colors.white;
        const statColor = statusColors(status);

        // Build log line
        const line = [
            `${colors.dim}[${timestamp}]${colors.reset}`,
            `${methodColor}${colors.bright}${method.padEnd(7)}${colors.reset}`,
            `${url}`,
            `${statColor}${status}${colors.reset}`,
            `${colors.dim}${formatDuration(durationMs)}${colors.reset}`
        ].join(' ');

        console.log(line);

        // Log slow requests
        if (durationMs > 1000) {
            console.log(`${colors.yellow}⚠ Slow request detected: ${url} took ${formatDuration(durationMs)}${colors.reset}`);
        }
    });

    next();
};

export default requestLogger;
