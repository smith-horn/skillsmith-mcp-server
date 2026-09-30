/**
 * @fileoverview Registry-only team resolution — no `isSupabaseConfigured()` gate
 * @module @skillsmith/mcp-server/tools/registry-tools.team
 * @see SMI-6622: the public `@skillsmith/mcp-server` package must NEVER need Supabase env vars.
 *   `registry-tools.ts` previously gated BOTH its live/stub service selection AND its team
 *   resolution on `isSupabaseConfigured()` (`SUPABASE_URL` + `SUPABASE_ANON_KEY` both set) — so a
 *   customer running with no Supabase env got a silently-inert in-memory stub (`publish` returned
 *   `success:true` with nothing written) instead of the real, already-env-optional live path
 *   (`supabase-client.ts`'s `getSupabaseClient()`/`getSupabaseUserClient()` already fall back to a
 *   hardcoded production URL/anon key — SMI-6109 — so no Supabase env var was ever actually
 *   required to reach it).
 * @see SMI-6623: `team-resolver.ts`'s shared `resolveLicenseTeamId()`/`readLicenseKey()` stay
 *   exactly as they were — `team-workspace.ts` and other tool families still call them directly
 *   and still need their `isSupabaseConfigured()` gate / null-on-unconfigured behavior unchanged.
 *   This module is a SEPARATE, registry-only resolver `registry-tools.ts` calls INSTEAD.
 *
 * Credential resolution order (mirrors `team-resolver.ts`'s `readLicenseKey()` precedence, then
 * adds one more fallback):
 *   1. `SKILLSMITH_LICENSE_KEY` env, then `SKILLSMITH_API_KEY` env (`readLicenseKey()`, reused
 *      as-is from `team-resolver.ts` — same precedence, same "empty string counts as unset" rule).
 *   2. `~/.skillsmith/config.json`'s `apiKey` field (`getApiKey()`, `@skillsmith/core`) — the same
 *      file `skillsmith login` / an admin-granted account's CLI session already writes, so an
 *      account with no shell-exported env var (shell exports do not reach MCP subprocesses) still
 *      resolves a team without needing to hand-copy a key into MCP server config.
 *
 * Team resolution then ALWAYS runs the `resolve_team_from_license` RPC against
 * `getSupabaseClient()` (the anon-key client — SMI-6109's production fallback applies here too) —
 * never gated on `isSupabaseConfigured()`, and NEVER falls back to a placeholder/stub team id. Every
 * failure mode throws, distinguishably:
 *   - no credential anywhere (env or config.json) → a plain, actionable `Error`
 *   - the RPC call itself fails (network/transport, or a non-null `error` in its response) →
 *     {@link RegistryTeamResolutionError}, one of three {@link RegistryTeamResolutionReason}s
 *   - the RPC succeeds but resolves to no team (unknown/malformed/revoked key) → a plain `Error`
 *
 * **Guarantee, and its exact scope** (SMI-6622 round 6 PR-07): every `Error` thrown by
 * {@link resolveRegistryTeamId} has an AUTHORED `message` — a fixed string naming only the
 * credential source label (one of three closed-enum values, never upstream text). A
 * `getSupabaseClient()`/`rpc()` exception or a `rpcResult.error` object is attached ONLY as
 * `cause`, never read into a message and never logged. This covers only what THIS module throws;
 * `registry-tools.membership-check.ts` carries the equivalent guarantee for the membership probe
 * (see that file's own header), and any OTHER registry call site not touched by this PR may still
 * forward upstream text — tracked in SMI-6649. `readRegistryCredential()`/`resolveCredentialWithSource()`
 * below were checked and confirmed to never throw at all (`readLicenseKey()` is pure `process.env`
 * string logic; `getApiKey()`'s own `loadConfig()` swallows every read/parse error internally and
 * returns `{}`), so neither needed a fix.
 *
 * Team-vs-membership mismatch (a license key that resolves to team A, while the signed-in user —
 * `skillsmith login` — is actually a member of team B or no team at all) is NOT this module's
 * concern: it is a DIFFERENT identity signal, checked downstream by real RLS policies
 * (`private_registry_skills_member_read`/`_member_insert`/`_admin_update`) once
 * `registry-tools.live.ts` combines this module's resolved `teamId` with the signed-in user's own
 * JWT (`getMemberUserClient()`/`getAdminUserClient()`, `registry-tools.live.auth.ts`) — see that
 * file's own header comment for why RLS, not this module, is the enforcement point.
 */
/** Which stage of team resolution failed — a closed enum, never free text. */
export type RegistryTeamResolutionReason = 'client_unavailable' | 'transport_error' | 'rpc_error';
/**
 * Thrown when `resolve_team_from_license` could not be reached at all — a Supabase client
 * construction failure, a network/transport exception, or a non-null `error` in the RPC response.
 * Distinct from the plain `Error` thrown when the RPC succeeds but resolves to no team, so a
 * caller (or a test) can tell "we asked and the key is wrong/unknown" apart from "we could not
 * even ask." `reason` lets a caller branch without parsing `message` text; `message` is always
 * authored (see this file's header) and the upstream error, if any, is attached only as `cause`.
 */
export declare class RegistryTeamResolutionError extends Error {
    readonly reason: RegistryTeamResolutionReason;
    constructor(reason: RegistryTeamResolutionReason, message: string, options?: {
        cause?: unknown;
    });
}
/**
 * Which of the three supported places the registry credential actually came from (SMI-6622 round
 * 2 finding 3) — named in resolution results and in error text, so a confusing fail-closed result
 * (empty list, null namespace, RLS denial on publish) can say WHICH credential produced the team
 * it resolved, not just that resolution "worked."
 */
export type RegistryCredentialSource = 'env:SKILLSMITH_LICENSE_KEY' | 'env:SKILLSMITH_API_KEY' | 'config.json';
/** Human-readable label for {@link RegistryCredentialSource}, for error/result text. */
export declare function describeCredentialSource(source: RegistryCredentialSource): string;
/**
 * Read the registry team-resolution credential value only (no source label) — env first
 * (`SKILLSMITH_LICENSE_KEY` then `SKILLSMITH_API_KEY`), then `~/.skillsmith/config.json`'s `apiKey`
 * field. Exported (SMI-6622 round 2) so `registry-tools.live.audit.ts`'s `licenseKeyFingerprint()`
 * can fingerprint the SAME credential team resolution actually used — that call site previously
 * read only `readLicenseKey()` (env-only), so a config.json-only credential fingerprinted as absent
 * even though it was the credential in use.
 */
export declare function readRegistryCredential(): string | null;
/** {@link resolveRegistryTeamId}'s full result — the resolved team plus which credential source
 *  resolved it. */
export interface RegistryTeamResolution {
    teamId: string;
    source: RegistryCredentialSource;
}
/**
 * Resolve the caller's team_id for the private registry, AND which credential source resolved it
 * (SMI-6622 round 2 finding 3). See this module's header for the full credential order, no-env-gate
 * rationale, and failure-mode contract. Never returns a placeholder/stub id — every failure path
 * throws instead, naming the source where one was found.
 */
export declare function resolveRegistryTeamId(): Promise<RegistryTeamResolution>;
//# sourceMappingURL=registry-tools.team.d.ts.map