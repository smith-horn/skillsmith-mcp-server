/**
 * @fileoverview Supabase client singleton for MCP server
 * @module @skillsmith/mcp-server/tools/supabase-client
 * @see SMI-3914: Wave 0 Shared Infrastructure
 *
 * @supabase/supabase-js is an optional peer dep — dynamic import.
 * Clients are lazy-initialized on first use and cached for the process lifetime.
 * Call resetSupabaseClients() in tests to clear cached instances.
 */
/**
 * Get the Supabase anon-key client (lazy singleton).
 * Requires SUPABASE_URL and SUPABASE_ANON_KEY env vars.
 */
export declare function getSupabaseClient(): Promise<unknown>;
/**
 * Get the Supabase service-role client (lazy singleton).
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 */
export declare function getSupabaseAdminClient(): Promise<unknown>;
/** Check if Supabase is configured (env vars present) */
export declare function isSupabaseConfigured(): boolean;
/** Reset clients (for testing) */
export declare function resetSupabaseClients(): void;
//# sourceMappingURL=supabase-client.d.ts.map