/**
 * SMI-1070: Stripe Webhook Endpoint
 *
 * HTTP endpoint for receiving Stripe webhooks.
 * Integrates with the existing webhook server infrastructure.
 *
 * Features:
 * - Signature verification
 * - Rate limiting (STRIPE_WEBHOOK preset)
 * - Idempotent event processing
 * - Health check endpoint
 */
import { Server } from 'http';
import type { RateLimiterState } from './webhook-endpoint.js';
/**
 * SMI-5119: the structural Stripe webhook contract is declared inline here.
 *
 * The canonical runtime class lives at `@smith-horn/enterprise/billing`
 * (`StripeWebhookHandler`) and `implements` an identical contract
 * (`StripeWebhookHandlerContract`) owned by that package; the assignability
 * test at
 * `packages/enterprise/tests/billing/StripeWebhookHandler.assignability.test.ts`
 * guards the canonical class against its contract. This endpoint consumes only
 * `handleWebhook(payload, signature)`, so it carries a structural copy rather
 * than importing across the package boundary.
 *
 * History: SMI-5044 briefly extracted this into a shared `@skillsmith/billing-types`
 * package; that package could not be published (OIDC trusted-publishing requires
 * a pre-existing npm package) and was consumed only via `import type`, so it was
 * removed. Proper cross-package contract sharing is tracked as a follow-up
 * (invert the `enterprise → @skillsmith/mcp-server/audit` dynamic-import edge).
 */
export interface StripeWebhookResult {
    success: boolean;
    message: string;
    eventId: string;
    processed: boolean;
    error?: string;
}
export interface StripeWebhookHandler {
    handleWebhook(payload: string, signature: string): Promise<StripeWebhookResult>;
}
export interface StripeWebhookServerConfig {
    /**
     * Stripe webhook signing secret
     */
    webhookSecret: string;
    /**
     * Whether to trust proxy headers
     */
    trustProxy?: boolean;
    /**
     * Trusted proxy IPs
     */
    trustedProxies?: string[];
    /**
     * Maximum request body size (default: 64KB)
     */
    maxBodySize?: number;
    /**
     * Rate limit: max requests per minute (default: 100)
     */
    rateLimit?: number;
}
export interface StripeWebhookServerOptions extends StripeWebhookServerConfig {
    /**
     * Webhook handler instance
     */
    webhookHandler: StripeWebhookHandler;
    /**
     * Logging callback
     */
    onLog?: (level: 'info' | 'warn' | 'error', message: string, data?: unknown) => void;
}
export interface StripeWebhookServer {
    server: Server;
    rateLimiter: RateLimiterState;
    stop: () => Promise<void>;
}
/**
 * Create a Stripe webhook server
 */
export declare function createStripeWebhookServer(options: StripeWebhookServerOptions): StripeWebhookServer;
/**
 * Start the Stripe webhook server
 */
export declare function startStripeWebhookServer(webhookServer: StripeWebhookServer, options?: {
    port?: number;
    host?: string;
}): Promise<void>;
/**
 * Attach SIGTERM/SIGINT shutdown handlers idempotently to the standalone
 * Stripe webhook server. Returns a `detach()` function that removes both
 * handlers, intended for the listener-count audit test.
 *
 * SMI-4694: mirrors `webhook-endpoint.ts#attachShutdownHandlers`. Same
 * risk profile (standalone daemon, supervisor re-entry possible).
 *
 * @internal Exported for the SMI-4694 listener-count audit test only; not
 * part of the public webhook surface.
 */
export declare function attachShutdownHandlers(webhookServer: StripeWebhookServer): () => void;
/**
 * Standalone entry point for Stripe webhook server
 */
export declare function main(): Promise<void>;
//# sourceMappingURL=stripe-webhook-endpoint.d.ts.map