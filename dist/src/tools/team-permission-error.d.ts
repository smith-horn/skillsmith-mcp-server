/**
 * @fileoverview The one structured permission-denial shape every team-permission surface returns
 * @module @skillsmith/mcp-server/tools/team-permission-error
 * @see SMI-6203 (Wave 2 of SMI-6200): live RBAC service on `has_team_permission()`
 * @see SMI-6202 (Wave 1): `team_permission_grants` + the five resolver functions
 *
 * WHY THIS IS ITS OWN MODULE, AND NOT PART OF `rbac-tools.types.ts`.
 *
 * The Wave 2 plan specifies this shape once, deliberately, so no call site invents its own copy:
 * `{ success: false, error: { code: 'permission_denied', permission, message } }`, with the CLI
 * and the website both rendering `error.message` verbatim. Two consumers already exist
 * (`rbac-tools.live.ts`, `rbac-tools.ts`) and a third arrives in Wave 3 — `sso-tools.live.ts`,
 * gated on `team:manage_sso`. Having the SSO tools import a permission shape out of
 * `rbac-tools.types.ts` would be a domain inversion, and copying the sentence into a second file
 * is exactly how two surfaces end up disagreeing about what a refusal says. One module, imported
 * by all of them.
 *
 * A CUSTOMER MUST NEVER SEE A RAW SQLSTATE, AND MUST NEVER SEE A RAW POSTGRES REFUSAL EITHER.
 *
 * Every gate in Wave 1's migration raises `42501`, but they do not all mean the same thing, and
 * one of them is not even ours: Postgres itself raises `42501` with messages like
 * `permission denied for table team_permission_grants`, which names internal schema objects. So
 * {@link toPermissionDeniedError} maps by an ALLOWLIST, not by passthrough:
 *
 *  - `permission_denied` (the exact text `has_team_permission()`'s callers raise) → the standard
 *    sentence naming the permission the operation required.
 *  - One of the three owner-protection refusals `set_team_member_role()` raises → that refusal's
 *    own text, which is authored copy and strictly more useful than the generic sentence
 *    ("cannot change the team owner's role" tells the caller something the generic one cannot).
 *  - Any other `42501`, from any source → the standard sentence. Fails SAFE: if the migration's
 *    copy is ever reworded, the allowlist stops matching and the caller gets the generic sentence
 *    rather than a leaked internal message.
 */
/** The literal every permission refusal carries, so consumers can switch on one value. */
export declare const PERMISSION_DENIED_CODE: "permission_denied";
/**
 * The structured error body. `permission` names the permission the operation REQUIRED (not one the
 * caller holds), so a UI can offer "ask an admin to grant `<permission>`" without parsing prose.
 */
export interface PermissionDeniedError {
    code: typeof PERMISSION_DENIED_CODE;
    permission: string;
    message: string;
}
/** The full refusal envelope, for a surface that returns rather than throws. */
export interface PermissionDeniedResult {
    success: false;
    error: PermissionDeniedError;
}
/**
 * The one sentence. Specified in the Wave 2 plan (Step 4) and rendered verbatim by the CLI, the
 * MCP tool output, and the website — do not reword it at a call site.
 */
export declare function permissionDeniedMessage(permission: string): string;
/**
 * A permission refusal raised as an exception, so a service method can `throw` it and a handler can
 * map it in one place.
 *
 * The stub service throws this directly (its in-memory gates mirror the SQL ones); the live service
 * constructs it from a PostgREST `42501`. Both therefore reach the tool layer identically, which is
 * the point — a test asserting on a refusal must not be able to tell stub from live.
 */
export declare class TeamPermissionDeniedError extends Error {
    readonly code: "permission_denied";
    readonly permission: string;
    constructor(permission: string, message?: string);
    toErrorShape(): PermissionDeniedError;
}
/**
 * Map any thrown/returned error to the structured refusal shape, or `null` when it is not a
 * permission refusal at all (so the caller can surface it as an ordinary error instead of
 * mislabelling an outage as a denial).
 *
 * @param err - a {@link TeamPermissionDeniedError}, a PostgREST error object, or anything else
 * @param requiredPermission - the permission the attempted operation needs; used for `permission`
 *        and for the generic message. The caller always knows this statically, so it is a required
 *        argument rather than something guessed out of the error text.
 */
export declare function toPermissionDeniedError(err: unknown, requiredPermission: string): PermissionDeniedError | null;
/** True when `error` is the structured refusal rather than a plain validation string. */
export declare function isPermissionDeniedError(error: unknown): error is PermissionDeniedError;
/**
 * The display string for a tool result's `error` field, which is `string` for input-validation
 * failures and {@link PermissionDeniedError} for refusals. One helper so every renderer (CLI, MCP
 * text output, website) gets the same text without repeating the narrowing.
 */
export declare function permissionErrorText(error: string | PermissionDeniedError | undefined): string;
//# sourceMappingURL=team-permission-error.d.ts.map