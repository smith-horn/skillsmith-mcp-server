/**
 * @fileoverview Confirms — or refuses to guess at — signed-in-user team membership (SMI-6622)
 * @module @skillsmith/mcp-server/tools/registry-tools.membership-check
 * @see registry-tools.live.ts's own header comment ("A license-key-team-vs-logged-in-user-
 *      membership mismatch..."): an empty `list`, a null `namespace`, and an RLS-denied `publish`
 *      insert are all indistinguishable, from the caller's point of view, from "the signed-in user
 *      simply is not on the team the license key/API key resolved" — RLS fails closed on a
 *      mismatch exactly the same way it fails closed on genuine absence, by design.
 *
 * This module runs ONE extra, best-effort read — a member-JWT `SELECT id FROM teams WHERE id =
 * <resolved teamId>` — ONLY on that already-ambiguous path, to turn a silent, confusing
 * empty/not-found/denied result into an actionable "you are not a member of the team resolved from
 * <source>" error when membership can be POSITIVELY ruled out.
 *
 * **Guarantee, and its exact scope**: every string {@link probeTeamMembership} or
 * {@link probeFailedMessage} can produce is authored in THIS file — never an exception `.message`,
 * a PostgREST `error.message`/`error.code`, or any other upstream text (round 6 PR-07: round 5's
 * validated error CODE was also removed — an upstream-controlled code cannot be trusted to be
 * short/safe just because it happens to match a pattern). This guarantee covers only what THIS
 * module returns; `registry-tools.team.ts` carries the equivalent guarantee for team resolution
 * (see that file's own header), and any OTHER registry call site not touched by this PR may still
 * forward upstream text — tracked in SMI-6649.
 *
 * `probeTeamMembership()` resolves the signed-in user's token exactly once, via
 * `registry-tools.live.auth.ts`'s `tryBindMemberUserClient()` — a probe-safe binder that never
 * throws and never exposes token/client-construction failure text (round 6; round 5's probe
 * resolved the token itself and then ALSO called `getMemberUserClient()`, which duplicated
 * keychain/refresh work and re-resolved it a second time).
 *
 * Every caller MUST branch on `'probe_failed'` explicitly rather than treating a missing/falsy
 * result as "safe to proceed" — see {@link membershipOverrideError}'s own doc comment for the two
 * call-site shapes this module supports (list/namespace's "never succeed on an unresolved probe"
 * vs. publish's "an already-failed RLS denial keeps its own message when the probe itself can't
 * run").
 */
import { type RegistryCredentialSource } from './registry-tools.team.js';
/** Why the probe could not determine membership either way — a closed enum, never free text. */
export type ProbeFailureReason = 'not_signed_in' | 'token_unavailable' | 'client_unavailable' | 'query_error' | 'transport_error';
export type MembershipVerdict = 'member' | 'not_member' | 'probe_failed';
export type MembershipProbeResult = {
    verdict: 'member';
} | {
    verdict: 'not_member';
} | {
    verdict: 'probe_failed';
    reason: ProbeFailureReason;
};
/**
 * Probe whether the signed-in user (their own JWT) can see the resolved team's own row — the same
 * boundary `private_registry_skills_member_read`'s policy already draws. Three DISTINCT outcomes,
 * all real: `'member'` (row visible), `'not_member'` (a clean PGRST116 — the row genuinely exists
 * per `resolve_team_from_license`, so a caller-scoped miss here means RLS is hiding it), and
 * `'probe_failed'` (the probe simply could not answer the question, for one of five closed-enum
 * reasons — see {@link ProbeFailureReason}). `'probe_failed'` is never silently folded into either
 * real answer.
 */
export declare function probeTeamMembership(teamId: string): Promise<MembershipProbeResult>;
/**
 * The actionable message for a POSITIVELY CONFIRMED non-member. Names the credential source
 * (finding 3) so the caller knows which configured credential resolved a team they are not on.
 */
export declare function nonMemberMessage(source: RegistryCredentialSource): string;
/**
 * The actionable message when the probe itself could not determine membership either way — FIXED,
 * AUTHORED text only, one per {@link ProbeFailureReason}. Never reads or forwards any exception or
 * query-error text (see this file's header). `client_unavailable` is deliberately NEUTRAL — it
 * covers non-auth client-construction failures (an invalid URL, the Vitest prod-fallback guard)
 * too, so it must not tell the caller to sign in.
 */
export declare function probeFailedMessage(reason: ProbeFailureReason): string;
/**
 * Narrow wrapper: returns an actionable message ONLY for a POSITIVELY CONFIRMED non-member —
 * `null` for both `'member'` and `'probe_failed'`. Used by `registry-tools.ts`'s `publish` catch
 * block, which is ALREADY on a `{success:false}` path (an RLS insert denial) by the time it calls
 * this — that existing, already-specific RLS error message must keep standing when the probe can't
 * run, not be replaced by a less specific "could not verify membership" message layered on top of
 * an operation that had already failed for its own, already-clear reason. Only a POSITIVE
 * non-member confirmation is worth replacing it for.
 */
export declare function confirmedNonMemberMessage(teamId: string, source: RegistryCredentialSource): Promise<string | null>;
/**
 * Broad wrapper: returns an actionable message for EITHER a confirmed non-member OR a failed
 * probe — `null` only for a confirmed member. Used by `registry-tools.manage-action.ts`'s
 * `list`/`namespace` cases, whose starting point is an AMBIGUOUS but not-yet-failed result (an
 * empty list, a null namespace) — those two must never fall through to `success:true` just because
 * the probe itself failed. A confirmed member is the ONLY verdict that leaves the original
 * ambiguous-but-legitimate result standing.
 */
export declare function membershipOverrideError(teamId: string, source: RegistryCredentialSource): Promise<string | null>;
//# sourceMappingURL=registry-tools.membership-check.d.ts.map