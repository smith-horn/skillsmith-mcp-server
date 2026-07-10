/**
 * @fileoverview Real IntegrationService backed by Supabase
 * @module @skillsmith/mcp-server/tools/integration-tools.service
 * @see SMI-3915: Wave 1 — Webhooks + API Keys (Real Implementation)
 *
 * Uses HMAC-SHA256 for webhook signing. API keys are hashed with SHA-256
 * before storage — raw key is returned once on creation and never persisted.
 *
 * SSRF protection via validateExternalUrl() on all outbound URLs.
 */
import type { IntegrationService } from './integration-tools.js';
/** Minimal Supabase client interface for query building */
export interface SupabaseClient {
    from(table: string): SupabaseQueryBuilder;
    rpc(fn: string, params?: Record<string, unknown>): Promise<SupabaseSingleResult>;
}
interface SupabaseQueryBuilder {
    insert(row: Record<string, unknown>): SupabaseQueryBuilder;
    update(row: Record<string, unknown>): SupabaseQueryBuilder;
    delete(): SupabaseQueryBuilder;
    select(columns?: string): SupabaseQueryBuilder;
    eq(column: string, value: unknown): SupabaseQueryBuilder;
    is(column: string, value: null): SupabaseQueryBuilder;
    order(column: string, options?: {
        ascending?: boolean;
    }): SupabaseQueryBuilder;
    single(): Promise<SupabaseSingleResult>;
    then(resolve: (value: SupabaseListResult) => void): void;
}
interface SupabaseSingleResult {
    data: Record<string, unknown> | null;
    error: {
        message: string;
    } | null;
}
interface SupabaseListResult {
    data: Record<string, unknown>[] | null;
    error: {
        message: string;
    } | null;
}
/** Hash an API key for storage (one-way) */
export declare function hashApiKey(key: string): string;
/** Compute HMAC-SHA256 signature for webhook delivery */
export declare function computeHmacSignature(secret: string, payload: string): string;
/**
 * Create a real IntegrationService backed by Supabase.
 *
 * @param supabase - Supabase client (anon or service-role)
 * @param teamId - Team ID for row-level scoping
 */
export declare function createRealIntegrationService(supabase: SupabaseClient, teamId: string): IntegrationService;
export {};
//# sourceMappingURL=integration-tools.service.d.ts.map