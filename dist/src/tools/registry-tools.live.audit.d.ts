/**
 * @fileoverview Audit trail for private-registry writes (ADR-129)
 * @module @skillsmith/mcp-server/tools/registry-tools.live.audit
 * @see SMI-5882: red-team assessment, What Changes §4a — attribution absent on the MCP path
 * @see SMI-5822: a shared team license key identifies a team, not a person
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT `published_by`.
 *
 * `private_registry_skills.published_by` is now server-derived from `auth.uid()`
 * (migration 20260729000000). On the MCP/CLI publish path there is no user JWT — the caller
 * presents `SKILLSMITH_LICENSE_KEY`, which resolves to a *team*, never a *person* — so
 * `auth.uid()` is NULL and the column stays NULL, rendered as `'unknown'`.
 *
 * That is the correct outcome and is deliberately not "fixed" by writing something plausible
 * into the column. A fabricated `published_by` would be indistinguishable from a real one once
 * written, which is precisely the failure mode of the forgery vector the same migration closes.
 * `license_keys.user_id` is not a usable substitute either: a team's resolvable key is the single
 * row the checkout webhook created for the *purchaser*, then shared with the team, so it names the
 * buyer rather than the caller.
 *
 * So instead of guessing the principal, this module records the principal that is actually
 * known — the team, plus a one-way fingerprint of which license key was presented — as an
 * `audit_logs` row. Before this, there were zero `audit_logs` writes on any private-registry path,
 * so an Enterprise customer asking "who published this" had no answer at all. They now have a
 * bounded one: which key, which team, which skill, when.
 *
 * ONE ACTOR PER PATH, NEVER THE WRONG ONE (cross-provider review finding #3).
 *
 * `deprecate`/`undeprecate` run through the signed-in user's own JWT (SMI-5822), so the license
 * key did **not** authorize them — `private_registry_skills_admin_update` did, against a real
 * `auth.uid()`. Writing `license_key:<fingerprint>` as the `actor` for those rows named a
 * credential that had no say in the decision, which is a materially misleading security record.
 * The `actor` is therefore chosen by `authPath`: the JWT's own subject on the `user_jwt` path,
 * the key fingerprint on the `license_key` path. When the JWT path cannot yield a subject the
 * row says `user_jwt:unknown` — explicitly unattributed, never attributed to the wrong principal.
 * The fingerprint is still recorded in `metadata` on both paths, because "which key was present"
 * stays useful for correlation even when it is not the authorizing credential.
 *
 * Fail-soft by construction: an audit write must never turn a successful publish into a failed
 * one. Failures are logged to stderr (the MCP transport's log channel) and swallowed.
 */
/** Registry write operations worth an audit row. Reads are deliberately not audited. */
export type RegistryAuditOperation = 'publish' | 'deprecate' | 'undeprecate';
/**
 * Which credential authorized the call.
 * - `license_key`: the shared team license key (team-scoped, no per-user identity).
 * - `user_jwt`: the signed-in user's own token, so RLS authorized it against a real `auth.uid()`.
 */
export type RegistryAuditAuthPath = 'license_key' | 'user_jwt';
export interface RegistryAuditEvent {
    operation: RegistryAuditOperation;
    teamId: string;
    skillId: string;
    version?: string;
    result: 'success' | 'denied' | 'not_found' | 'error';
    authPath: RegistryAuditAuthPath;
    /**
     * The authenticated user's id (the JWT `sub`), on the `user_jwt` path only. Null/absent means
     * no subject could be read from the presented token — recorded as explicitly unattributed
     * rather than backfilled with the license-key actor, which did not authorize the call.
     */
    actorUserId?: string | null;
    /** Short reason for a non-success result. Never include credential material. */
    detail?: string;
}
/**
 * One-way fingerprint of the presented license key.
 *
 * Correlates rows written by the same key (and matches nothing else) without storing the key or
 * anything that could be replayed. Returns null when no key is readable, so an absent credential
 * is recorded as absent rather than as some default bucket.
 */
export declare function licenseKeyFingerprint(licenseKey?: string): string | null;
/**
 * Read the `sub` (user id) claim out of a Supabase access token, for audit attribution.
 *
 * Deliberately does NOT verify the signature, and must never be used to authorize anything. It is
 * only ever called on a token this process is *already presenting* to PostgREST, which verifies
 * the signature itself before RLS resolves `auth.uid()` from the same claim. So for a row whose
 * `result` is `success` or `denied`, the value recorded here is the identity the database actually
 * evaluated; for `error` it is the identity that was claimed. Either way it is strictly more
 * accurate than naming a license key that authorized nothing.
 *
 * @param accessToken - a Supabase user access token (`skillsmith login`, SMI-4402)
 * @returns the `sub` claim, or null when the token is not a decodable three-part JWT
 */
export declare function accessTokenSubject(accessToken: string): string | null;
/**
 * Write one `audit_logs` row for a private-registry mutation.
 *
 * Never throws: the caller's operation has already succeeded or failed on its own terms, and an
 * audit-transport problem must not change that outcome.
 */
export declare function recordRegistryAudit(event: RegistryAuditEvent): Promise<void>;
//# sourceMappingURL=registry-tools.live.audit.d.ts.map