/**
 * @fileoverview registry-tools.team.ts — registry-only team resolution, no env gate (SMI-6622)
 * @see SMI-6622: `registry-tools.ts` must never gate service selection or team resolution on
 *      `SUPABASE_URL`/`SUPABASE_ANON_KEY`. Two independent things are exercised here:
 *
 *   1. `resolveRegistryTeamId()` itself (credential precedence: env, then
 *      `~/.skillsmith/config.json`; every failure mode; never a stub team id) — `isSupabaseConfigured`
 *      is mocked to `false` throughout this file specifically so a green run here cannot be
 *      accidentally explained by Supabase "happening" to look configured.
 *   2. `registry-tools.ts`'s module-level SERVICE selection (live by default, stub only under the
 *      `SKILLSMITH_REGISTRY_STUB` opt-in) — this half needs `vi.resetModules()` + a fresh dynamic
 *      import per test, since the singleton is computed once at module load.
 *
 * `registry-tools.api-key-fallback.test.ts` covers the SAME credential chain end-to-end through
 * the MCP tool handlers (SMI-6080); this file is the resolver's own direct/unit coverage, plus the
 * module-load service-selection tests that file doesn't attempt.
 */
export {};
//# sourceMappingURL=registry-tools.team.test.d.ts.map