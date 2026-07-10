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
import { IncomingMessage, ServerResponse } from 'http';
/**
 * Webhook server configuration for IP extraction
 */
export interface WebhookServerConfig {
    /**
     * GitHub webhook secret for signature verification
     */
    secret: string;
    /**
     * Whether to trust X-Forwarded-For headers (default: false)
     * SMI-682: Must be explicitly enabled for security
     */
    trustProxy?: boolean;
    /**
     * List of trusted proxy IPs (optional, for enhanced security)
     * SMI-682: When set, X-Forwarded-For is only trusted from these IPs
     */
    trustedProxies?: string[];
}
/**
 * Rate limiter state (SMI-681: Added cleanup timer for memory leak prevention)
 */
export interface RateLimiterState {
    requests: Map<string, number[]>;
    limit: number;
    window: number;
    cleanupTimer?: ReturnType<typeof setInterval>;
}
/**
 * Create rate limiter with automatic cleanup (SMI-681)
 * @param limit - Maximum requests per window
 * @param windowMs - Window duration in milliseconds
 */
export declare function createRateLimiter(limit: number, windowMs: number): RateLimiterState;
/**
 * Destroy rate limiter and clean up resources (SMI-681)
 */
export declare function destroyRateLimiter(state: RateLimiterState): void;
/**
 * Check if request is rate limited
 */
export declare function isRateLimited(limiter: RateLimiterState, ip: string): boolean;
/**
 * Get client IP from request (SMI-682: Added trusted proxy validation)
 * @param req - Incoming HTTP request
 * @param config - Server configuration with trust proxy settings
 */
export declare function getClientIp(req: IncomingMessage, config: WebhookServerConfig): string;
/**
 * Read request body with size limit
 */
export declare function readBody(req: IncomingMessage, maxSize: number): Promise<string>;
/**
 * Send JSON response
 */
export declare function sendJson(res: ServerResponse, statusCode: number, data: Record<string, unknown>): void;
//# sourceMappingURL=webhook-helpers.d.ts.map