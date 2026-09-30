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
 * Uses SUPABASE_URL/SUPABASE_ANON_KEY when set, else the production defaults (SMI-6109) — except
 * under Vitest with no SUPABASE_URL, where that fallback throws instead (see the guard above).
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
 * fallback as getSupabaseClient() above, including the same test-time guard against reaching it.
 *
 * @param accessToken - a Supabase user access token (from `skillsmith login`)
 */
export declare function getSupabaseUserClient(accessToken: string): Promise<unknown>;
/**
 * Check if Supabase is configured (real SUPABASE_URL + SUPABASE_ANON_KEY env vars present).
 *
 * Deliberately NOT affected by the anon-key fallback above (SMI-6109) — see that comment for why.
 *
 * SMI-6622 correction (this flag's role narrowed — read this before assuming it gates the private
 * registry): `registry-tools.ts`'s module-load service selection and its `resolveTeamId()` used to
 * both gate on this exact flag, so a customer with neither `SUPABASE_URL` nor `SUPABASE_ANON_KEY`
 * set got the in-memory STUB service and `publish` silently returned `success:true` with nothing
 * written — the public `@skillsmith/mcp-server` package must never require Supabase env vars, and
 * the anon-key fallback above already made the live path reachable with zero config, so that gate
 * was actively wrong, not merely conservative. `registry-tools.ts` no longer reads this flag at
 * all (`registry-tools.team.ts` resolves the team unconditionally instead). This flag's remaining,
 * *narrower* role: `sso-tools`, `team-workspace`, `compliance-tools`, `integration-tools`,
 * `rbac-tools`, and `team-resolver.ts`'s own shared `resolveLicenseTeamId()` (SMI-6623 — still used
 * directly by some of those) each still gate their own (unrelated, still service-role-backed) live
 * path on it, and matching `packages/core/src/api/utils.ts`'s identical `DEFAULT_BASE_URL` pattern,
 * the anon-key surface itself never needs a bespoke "not configured" error path of its own.
 */
export declare function isSupabaseConfigured(): boolean;
/** Reset clients (for testing) */
export declare function resetSupabaseClients(): void;
//# sourceMappingURL=supabase-client.d.ts.map