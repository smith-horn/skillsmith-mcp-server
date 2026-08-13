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
import { sha256Hex } from '@skillsmith/core';
import { getSupabaseAdminClient } from '../supabase-client.js';
import { readLicenseKey } from './team-resolver.js';
/** Truncated so the audit row correlates keys without being a verification oracle for one. */
const FINGERPRINT_LENGTH = 12;
/**
 * Upper bound on a decoded JWT payload, so a malformed or hostile token cannot turn this into an
 * unbounded `JSON.parse`. Real Supabase access tokens are well under 2 KB.
 */
const MAX_JWT_PAYLOAD_BYTES = 8192;
/**
 * One-way fingerprint of the presented license key.
 *
 * Correlates rows written by the same key (and matches nothing else) without storing the key or
 * anything that could be replayed. Returns null when no key is readable, so an absent credential
 * is recorded as absent rather than as some default bucket.
 */
export function licenseKeyFingerprint(licenseKey) {
    const key = readLicenseKey(licenseKey);
    if (!key)
        return null;
    return sha256Hex(key).slice(0, FINGERPRINT_LENGTH);
}
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
export function accessTokenSubject(accessToken) {
    const parts = accessToken.split('.');
    if (parts.length !== 3 || !parts[1])
        return null;
    try {
        const decoded = Buffer.from(parts[1], 'base64url').toString('utf8');
        if (decoded.length === 0 || decoded.length > MAX_JWT_PAYLOAD_BYTES)
            return null;
        const payload = JSON.parse(decoded);
        return typeof payload.sub === 'string' && payload.sub.length > 0 ? payload.sub : null;
    }
    catch {
        // A credential we cannot decode is recorded as unattributed, not as some other principal.
        return null;
    }
}
/**
 * Pick the `actor` string for one audit row.
 *
 * The authorizing credential differs per path, so the actor must too — see the module docstring.
 */
function resolveActor(event, fingerprint) {
    if (event.authPath === 'user_jwt') {
        return event.actorUserId ? `user:${event.actorUserId}` : 'user_jwt:unknown';
    }
    // No user identity exists on the license-key path — say so explicitly rather than leaving
    // `actor` NULL, which would be indistinguishable from "never recorded".
    return fingerprint ? `license_key:${fingerprint}` : 'license_key:unknown';
}
/**
 * Write one `audit_logs` row for a private-registry mutation.
 *
 * Never throws: the caller's operation has already succeeded or failed on its own terms, and an
 * audit-transport problem must not change that outcome.
 */
export async function recordRegistryAudit(event) {
    try {
        const fingerprint = licenseKeyFingerprint();
        const client = (await getSupabaseAdminClient());
        const resource = event.version
            ? `private_registry_skills/${event.teamId}/${event.skillId}@${event.version}`
            : `private_registry_skills/${event.teamId}/${event.skillId}`;
        const { error } = await client.from('audit_logs').insert({
            event_type: `private_registry:${event.operation}`,
            actor: resolveActor(event, fingerprint),
            resource,
            action: event.operation,
            result: event.result,
            metadata: {
                team_id: event.teamId,
                skill_id: event.skillId,
                version: event.version ?? null,
                auth_path: event.authPath,
                // Kept on BOTH paths: on the user_jwt path the key is no longer the actor, but "which key
                // was present when this ran" is still the only way to correlate a user's admin action with
                // the team key their session was configured with.
                license_key_fingerprint: fingerprint,
                actor_user_id: event.actorUserId ?? null,
                auth_role: event.authRole ?? null,
                // Distinguishes these rows from the `private-registry-get` Edge Function's, which write
                // the same event_type with `transport: 'edge_function'` (SMI-5905 Wave 2).
                transport: 'mcp_server',
                // Count and digest only — the content map itself is never recorded.
                file_count: event.fileCount ?? null,
                content_hash: event.contentHash ?? null,
                // Recorded per-row so a future reader can tell an unattributed row from one written
                // before published_by existed, without diffing migration timestamps.
                published_by_available: event.authPath === 'user_jwt',
                detail: event.detail ?? null,
            },
        });
        if (error) {
            console.error(`[skillsmith] private-registry audit write failed (${event.operation}): ${error.message ?? 'unknown error'}`);
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        console.error(`[skillsmith] private-registry audit write failed (${event.operation}): ${message}`);
    }
}
//# sourceMappingURL=registry-tools.live.audit.js.map