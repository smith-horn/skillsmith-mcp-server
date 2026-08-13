/**
 * @fileoverview Audit trail for private-registry writes (ADR-129)
 * @module @skillsmith/mcp-server/tools/registry-tools.live.audit
 * @see SMI-5882: red-team assessment, What Changes §4a — attribution absent on the MCP path
 * @see SMI-5822: a shared team license key identifies a team, not a person
 *
 * WHY THIS EXISTS, AND WHY IT IS NOT `published_by`.
 *
 * `private_registry_skills.published_by` is server-derived from `auth.uid()` (migration
 * 20260729000000). **`publish` itself now runs on the `user_jwt` path** (SMI-5949 Wave 2 Step 2,
 * D-7) — a real signed-in user's own Supabase JWT, not `SKILLSMITH_LICENSE_KEY` — precisely so
 * `auth.uid()` resolves to a person and `published_by` lands non-NULL. That is a deliberate
 * credential move, not an incidental one: D-6's self-approval check (`review_private_registry_
 * submission()`) can only refuse a submitter approving their own work if it can name the
 * submitter, and a shared team license key never could. `license`/`content_read` still exist as
 * distinct auth paths on OTHER private-registry operations — `list`/`get`/`getNamespace` remain
 * license-key (team-scoped, no person needed); `deprecate`/`undeprecate`/`getContent` were already
 * `user_jwt` before this change (SMI-5822/SMI-5905).
 *
 * A pre-D-7 service-role publish (an old client, or any path that still presented only a license
 * key) left `published_by` NULL, and this module's job was to record what WAS known — the team,
 * plus a one-way fingerprint of which license key was presented — rather than fabricate a
 * plausible-looking actor. That reasoning still holds for every operation that remains
 * license-key-scoped; it just no longer describes `publish`. `license_keys.user_id` was never a
 * usable substitute either way: a team's resolvable key is the single row the checkout webhook
 * created for the *purchaser*, then shared with the team, so it names the buyer rather than the
 * caller.
 *
 * Before this module existed, there were zero `audit_logs` writes on any private-registry path,
 * so an Enterprise customer asking "who published this" had no answer at all. `publish` now has
 * an exact one (a real `actorUserId`, same as `deprecate`/`undeprecate`); the license-key-scoped
 * operations still have the bounded one this module was built for: which key, which team, which
 * skill, when.
 *
 * ONE ACTOR PER PATH, NEVER THE WRONG ONE (cross-provider review finding #3).
 *
 * `deprecate`/`undeprecate`/`publish` all run through the signed-in user's own JWT, so the license
 * key does **not** authorize them — `private_registry_skills_admin_update` /
 * `private_registry_skills_member_insert` do, against a real `auth.uid()`. Writing
 * `license_key:<fingerprint>` as the `actor` for those rows would name a credential that had no
 * say in the decision, which is a materially misleading security record. The `actor` is therefore
 * chosen by `authPath`: the JWT's own subject on the `user_jwt` path, the key fingerprint on the
 * `license_key` path. When the JWT path cannot yield a subject the row says `user_jwt:unknown` —
 * explicitly unattributed, never attributed to the wrong principal. The fingerprint is still
 * recorded in `metadata` on both paths, because "which key was present" stays useful for
 * correlation even when it is not the authorizing credential.
 *
 * Fail-soft by construction: an audit write must never turn a successful publish into a failed
 * one. Failures are logged to stderr (the MCP transport's log channel) and swallowed.
 */
/**
 * Registry operations worth an audit row.
 *
 * Metadata reads (`list`/`get`) are still deliberately not audited — they carry no file bytes.
 * `content_read` (SMI-5905 Wave 3) is: it is the operation that hands a team's packaged skill
 * content to a caller, so it gets the same coverage the mutations do. `event_type` and `action`
 * are byte-identical to what the `private-registry-get` Edge Function writes
 * (supabase/functions/private-registry-get/access.ts), so both transports land in one queryable
 * stream and neither can be audited without the other showing up in the same query.
 *
 * `approve`/`reject` (SMI-5949 Wave 2 Step 4, D-5) are the two terminal decisions
 * `review_private_registry_submission()` can write. `submissions` (the read side, D-5's other RPC)
 * is deliberately NOT here — it is a metadata read like `list`/`get`, not a mutation.
 */
export type RegistryAuditOperation = 'publish' | 'deprecate' | 'undeprecate' | 'content_read' | 'approve' | 'reject';
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
    /**
     * SMI-5905 Wave 3: which of the two user-client getters authorized this call —
     * `getAdminUserClient()` or `getMemberUserClient()`. Recorded so the "no call site may use the
     * wrong one" invariant is observable in the audit trail itself, not only in a unit test.
     * Absent on the license-key path, which has no user role at all.
     */
    authRole?: 'admin' | 'member';
    /** Short reason for a non-success result. Never include credential material. */
    detail?: string;
    /** Number of files handed to the caller. Count ONLY — never the filenames, never the bytes. */
    fileCount?: number;
    /** The row's stored content_hash. A digest of SKILL.md, not the content itself. */
    contentHash?: string | null;
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