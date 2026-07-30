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
/**
 * Build a Supabase client bound to a specific end-user's access token (SMI-5882 / SMI-5822).
 *
 * Deliberately NOT a singleton: the returned client carries one user's JWT in its headers, so
 * caching it process-wide would let a later caller inherit an earlier caller's identity — the
 * exact confusion this path exists to remove.
 *
 * Requests made through it reach PostgREST as the `authenticated` role with `auth.uid()` resolved
 * from the token, so row-level security (e.g. `private_registry_skills_admin_update`) is the thing
 * that authorizes them, rather than app-level logic that can drift from the policy.
 *
 * @param accessToken - a Supabase user access token (from `skillsmith login`)
 */
export declare function getSupabaseUserClient(accessToken: string): Promise<unknown>;
/** Check if Supabase is configured (env vars present) */
export declare function isSupabaseConfigured(): boolean;
/** Reset clients (for testing) */
export declare function resetSupabaseClients(): void;
//# sourceMappingURL=supabase-client.d.ts.map