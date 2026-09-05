/**
 * @fileoverview Supabase client singleton for MCP server
 * @module @skillsmith/mcp-server/tools/supabase-client
 * @see SMI-3914: Wave 0 Shared Infrastructure
 * @see SMI-6109: env-override-with-fallback for the anon-key client paths
 *
 * @supabase/supabase-js is an optional peer dep — dynamic import.
 * Clients are lazy-initialized on first use and cached for the process lifetime.
 * Call resetSupabaseClients() in tests to clear cached instances.
 */
/**
 * Get the Supabase anon-key client (lazy singleton).
 * Uses SUPABASE_URL/SUPABASE_ANON_KEY when set, else the production defaults (SMI-6109).
 */
export declare function getSupabaseClient(): Promise<unknown>;
/**
 * Get the Supabase service-role client (lazy singleton).
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars. No fallback (SMI-6109) — unlike
 * the anon-key paths above, this credential must never default to a value baked into source.
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
 * Uses SUPABASE_URL/SUPABASE_ANON_KEY when set, else the production defaults (SMI-6109) — same
 * fallback as getSupabaseClient() above.
 *
 * @param accessToken - a Supabase user access token (from `skillsmith login`)
 */
export declare function getSupabaseUserClient(accessToken: string): Promise<unknown>;
/**
 * Check if Supabase is configured (real SUPABASE_URL + SUPABASE_ANON_KEY env vars present).
 *
 * Deliberately NOT affected by the anon-key fallback above (SMI-6109) — see that comment for why.
 *
 * Cross-provider review correction (SMI-6109): this means the fallback does NOT make the private
 * registry usable with zero Supabase config. `registry-tools.ts`'s own module-load service
 * selection AND its `resolveTeamId()` both still gate on this exact flag, so a customer with
 * neither `SUPABASE_URL` nor `SUPABASE_ANON_KEY` set gets the in-memory STUB service, never
 * reaching `getMemberUserClient()`/the fallback at all — by design, so a genuinely unconfigured
 * host still gets fast, offline-safe stub behavior instead of a live network call against a
 * license key that was never set up. The fallback's real, narrower benefit: once a customer HAS
 * set both vars (the expected Team/Enterprise setup — see the README), a *later* drift where one
 * of the two is missing in some specific execution context (e.g. propagated inconsistently to an
 * MCP subprocess) degrades gracefully instead of failing, and — matching
 * packages/core/src/api/utils.ts's identical DEFAULT_BASE_URL pattern — the anon-key surface never
 * needs a bespoke "not configured" error path of its own.
 */
export declare function isSupabaseConfigured(): boolean;
/** Reset clients (for testing) */
export declare function resetSupabaseClients(): void;
//# sourceMappingURL=supabase-client.d.ts.map