#!/usr/bin/env node
/**
 * Skillsmith MCP Server
 * Provides skill discovery, installation, and management tools
 *
 * @see SMI-792: Database initialization with tool context
 * @see SMI-XXXX: First-run integration and documentation delivery
 */
import { maybeInstallMissingTier1Skills } from './onboarding/tier1-self-heal.js';
export type { StripeWebhookHandler, StripeWebhookResult, } from './webhooks/stripe-webhook-endpoint.js';
/**
 * SMI-5582: run only the SYNCHRONOUS, zero-network part of first-time setup —
 * install bundled first-party assets + docs and flip the first-run marker. Kept
 * on the blocking startup path (fast, no network) so `isFirstRun()` flips to
 * false immediately. The Tier-1 REGISTRY install (real network) runs
 * fire-and-forget via `maybeInstallMissingTier1Skills` in `main()`, never here.
 * Exported for integration testability (plan G).
 *
 * @returns Names of the bundled skills freshly installed (credited, without
 *   attribution, in the welcome message).
 */
export declare function runFirstTimeSetup(): Promise<string[]>;
export { maybeInstallMissingTier1Skills };
//# sourceMappingURL=index.d.ts.map