/**
 * SMI-645: Webhook Helpers - Rate limiting and utility functions
 *
 * Extracted from webhook-endpoint.ts to reduce file size.
 *
 * Provides:
 * - Rate limiter state management
 * - IP address extraction with proxy support
 * - Request body reading with size limits
 * - JSON response utilities
 */
// ============================================================================
// Rate Limiter Functions
// ============================================================================
/**
 * Create rate limiter with automatic cleanup (SMI-681)
 * @param limit - Maximum requests per window
 * @param windowMs - Window duration in milliseconds
 */
export function createRateLimiter(limit, windowMs) {
    const state = {
        requests: new Map(),
        limit,
        window: windowMs,
    };
    // SMI-681: Periodic cleanup to prevent memory leak
    state.cleanupTimer = setInterval(() => {
        const now = Date.now();
        const windowStart = now - windowMs;
        for (const [ip, timestamps] of state.requests.entries()) {
            const valid = timestamps.filter((t) => t > windowStart);
            if (valid.length === 0) {
                state.requests.delete(ip);
            }
            else {
                state.requests.set(ip, valid);
            }
        }
    }, windowMs);
    // Don't block process exit
    if (state.cleanupTimer.unref) {
        state.cleanupTimer.unref();
    }
    return state;
}
/**
 * Destroy rate limiter and clean up resources (SMI-681)
 */
export function destroyRateLimiter(state) {
    if (state.cleanupTimer) {
        clearInterval(state.cleanupTimer);
        state.cleanupTimer = undefined;
    }
    state.requests.clear();
}
/**
 * Check if request is rate limited
 */
export function isRateLimited(limiter, ip) {
    const now = Date.now();
    const windowStart = now - limiter.window;
    // Get existing requests for this IP
    let requests = limiter.requests.get(ip) || [];
    // Filter to only requests within the window
    requests = requests.filter((time) => time > windowStart);
    // Check if over limit
    if (requests.length >= limiter.limit) {
        return true;
    }
    // Add this request
    requests.push(now);
    limiter.requests.set(ip, requests);
    return false;
}
// ============================================================================
// IP Address Functions
// ============================================================================
/**
 * Get client IP from request (SMI-682: Added trusted proxy validation)
 * @param req - Incoming HTTP request
 * @param config - Server configuration with trust proxy settings
 */
export function getClientIp(req, config) {
    // SMI-682: Only trust X-Forwarded-For if explicitly configured
    if (config.trustProxy) {
        const forwarded = req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') {
            const clientIp = forwarded.split(',')[0].trim();
            // If trustedProxies specified, verify the request came from one
            if (config.trustedProxies?.length) {
                const remoteIp = req.socket.remoteAddress;
                if (!config.trustedProxies.includes(remoteIp || '')) {
                    // Don't trust forwarded header from untrusted source
                    return remoteIp || 'unknown';
                }
            }
            return clientIp;
        }
        if (Array.isArray(forwarded) && forwarded.length > 0) {
            const clientIp = forwarded[0].split(',')[0].trim();
            // If trustedProxies specified, verify the request came from one
            if (config.trustedProxies?.length) {
                const remoteIp = req.socket.remoteAddress;
                if (!config.trustedProxies.includes(remoteIp || '')) {
                    return remoteIp || 'unknown';
                }
            }
            return clientIp;
        }
    }
    // Fall back to socket address
    return req.socket.remoteAddress || 'unknown';
}
// ============================================================================
// Request/Response Utilities
// ============================================================================
/**
 * Read request body with size limit
 */
export async function readBody(req, maxSize) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        req.on('data', (chunk) => {
            size += chunk.length;
            if (size > maxSize) {
                req.destroy();
                reject(new Error('Request body too large'));
                return;
            }
            chunks.push(chunk);
        });
        req.on('end', () => {
            resolve(Buffer.concat(chunks).toString('utf-8'));
        });
        req.on('error', reject);
    });
}
/**
 * Send JSON response
 */
export function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}
//# sourceMappingURL=webhook-helpers.js.map