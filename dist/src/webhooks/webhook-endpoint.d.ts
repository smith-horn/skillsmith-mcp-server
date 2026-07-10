/**
 * SMI-645: Webhook Endpoint - HTTP server for GitHub webhooks
 *
 * Provides:
 * - Express/Node.js HTTP server for receiving webhooks
 * - Signature validation middleware
 * - Rate limiting for security
 * - Event routing to WebhookHandler
 *
 * Usage:
 *   import { createWebhookServer, startWebhookServer } from './webhooks/webhook-endpoint.js';
 *
 *   const server = createWebhookServer({
 *     secret: process.env.GITHUB_WEBHOOK_SECRET,
 *     onIndexUpdate: (repoUrl, filePath) => { ... },
 *   });
 *
 *   startWebhookServer(server, { port: 3000 });
 */
import { Server } from 'http';
import { WebhookHandler, WebhookQueue, type WebhookQueueItem } from '@skillsmith/core';
import { type WebhookServerConfig } from './webhook-helpers.js';
export type { WebhookServerConfig, RateLimiterState } from './webhook-helpers.js';
export { createRateLimiter, destroyRateLimiter, isRateLimited, getClientIp, } from './webhook-helpers.js';
/**
 * Webhook server options
 */
export interface WebhookServerOptions extends WebhookServerConfig {
    /**
     * Maximum request body size in bytes (default: 1MB)
     */
    maxBodySize?: number;
    /**
     * Rate limit: max requests per window (default: 100)
     */
    rateLimit?: number;
    /**
     * Rate limit window in ms (default: 60000 = 1 minute)
     */
    rateLimitWindow?: number;
    /**
     * Callback when a skill needs to be indexed/updated
     */
    onIndexUpdate?: (item: WebhookQueueItem) => Promise<void>;
    /**
     * Callback for logging
     */
    onLog?: (level: 'info' | 'warn' | 'error', message: string, data?: unknown) => void;
    /**
     * Queue options for debouncing and retry
     */
    queueOptions?: {
        debounceMs?: number;
        maxRetries?: number;
        retryDelayMs?: number;
    };
}
/**
 * Server startup options
 */
export interface ServerStartOptions {
    /**
     * Port to listen on (default: 3000)
     */
    port?: number;
    /**
     * Host to bind to (default: '0.0.0.0')
     */
    host?: string;
}
/**
 * Webhook server instance
 */
export interface WebhookServer {
    /**
     * The underlying HTTP server
     */
    server: Server;
    /**
     * The webhook handler
     */
    handler: WebhookHandler;
    /**
     * The webhook queue
     */
    queue: WebhookQueue;
}
/**
 * Create a webhook server
 */
export declare function createWebhookServer(options: WebhookServerOptions): WebhookServer;
/**
 * Start the webhook server
 */
export declare function startWebhookServer(webhookServer: WebhookServer, options?: ServerStartOptions): Promise<void>;
/**
 * Stop the webhook server
 */
export declare function stopWebhookServer(webhookServer: WebhookServer): Promise<void>;
/**
 * Attach SIGTERM/SIGINT shutdown handlers idempotently to the standalone
 * webhook server. Returns a `detach()` function that removes both handlers,
 * intended for the listener-count audit test.
 *
 * SMI-4694: idempotent registration prevents handler accumulation if main()
 * is invoked from a supervisor that may re-enter (rare but possible). The
 * test surface relies on detach() to verify symmetric attach/detach.
 *
 * @internal Exported for the SMI-4694 listener-count audit test only; not
 * part of the public webhook surface.
 */
export declare function attachShutdownHandlers(webhookServer: WebhookServer): () => void;
/**
 * Main entry point for standalone webhook server
 */
export declare function main(): Promise<void>;
//# sourceMappingURL=webhook-endpoint.d.ts.map