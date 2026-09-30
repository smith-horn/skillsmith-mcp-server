/**
 * @fileoverview End-to-end team resolution for private-registry tools with only SKILLSMITH_API_KEY
 * @see SMI-6080: `private_registry_publish` / `private_registry_manage` could not resolve a team
 *      from a complimentary/admin-granted API key
 * @see SMI-6622: `registry-tools.ts`'s `resolveTeamId()` now delegates to the registry-only
 *      `registry-tools.team.ts` (not `team-resolver.ts`'s `resolveLicenseTeamId()` directly), but
 *      that new module reuses `team-resolver.ts`'s `readLicenseKey()` as-is for its env-credential
 *      half — so the env-var precedence this file exercises is unchanged. Its own dedicated
 *      config.json-fallback and error-typing coverage lives in registry-tools.team.test.ts.
 *
 * Every OTHER registry-tools test mocks `./team-resolver.js` (now: `./registry-tools.team.js`)
 * wholesale, so none of them exercise the real credential-resolution chain. This file deliberately
 * does NOT mock either: it stubs only the Supabase surface underneath (`isSupabaseConfigured` + a
 * recording `rpc()`), so `readLicenseKey()` → `resolveRegistryTeamId()` → `resolve_team_from_license`
 * runs for real and a regression in the fallback fails here instead of silently passing everywhere.
 *
 * Scope: this covers TEAM RESOLUTION only — "which team is this call for". The publish / install /
 * submissions / approve / deprecate actions additionally require a signed-in user's own Supabase
 * JWT (`skillsmith login`, via `resolveUserAccessToken()`), which no team credential can supply.
 * Those user-JWT paths are covered in registry-tools.live.admin-auth.test.ts.
 */
export {};
//# sourceMappingURL=registry-tools.api-key-fallback.test.d.ts.map