/**
 * @fileoverview End-to-end team resolution for private-registry tools with only SKILLSMITH_API_KEY
 * @see SMI-6080: `private_registry_publish` / `private_registry_manage` could not resolve a team
 *      from a complimentary/admin-granted API key
 *
 * Every OTHER registry-tools test mocks `./team-resolver.js` wholesale, so none of them exercise
 * the real credential-resolution chain. This file deliberately does NOT mock it: it stubs only the
 * Supabase surface underneath (`isSupabaseConfigured` + a recording `rpc()`), so
 * `readLicenseKey()` → `resolveLicenseTeamId()` → `resolve_team_from_license` runs for real and a
 * regression in the fallback fails here instead of silently passing everywhere.
 *
 * Scope: this covers TEAM RESOLUTION only — "which team is this call for". The publish / install /
 * submissions / approve / deprecate actions additionally require a signed-in user's own Supabase
 * JWT (`skillsmith login`, via `resolveUserAccessToken()`), which no team credential can supply.
 * Those user-JWT paths are covered in registry-tools.live.admin-auth.test.ts.
 */
export {};
//# sourceMappingURL=registry-tools.api-key-fallback.test.d.ts.map