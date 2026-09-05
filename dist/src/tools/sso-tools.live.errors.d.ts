/**
 * @fileoverview Typed error classes for the live `team-sso-manage` client
 * @module @skillsmith/mcp-server/tools/sso-tools.live.errors
 * @see SMI-6204 (Wave 3 of SMI-6200): split out of `sso-tools.live.ts` (mirroring
 *      `rbac-tools.types.ts`/`rbac-tools.stub.ts`'s split from `rbac-tools.ts`) to keep that file
 *      under the 500-line `audit:standards` budget once the 2026-08-28 integration-bug fixes
 *      (correcting `set`/`get`/`claim_domain`/`verify_domain` against `team-sso-manage`'s real
 *      response shapes) pushed it to 534 lines.
 *
 * One class per mapped status/error code in `sso-tools.live.ts`'s `throwMappedError()` (task D5),
 * plus a catch-all. Never constructed with raw GoTrue text — see that function's own header for
 * the "never leak raw GoTrue text" convention these classes exist to enforce structurally.
 */
/** HTTP 401 — no session, or the stored session has expired/been revoked. */
export declare class SsoAuthError extends Error {
    constructor(message?: string);
}
/** HTTP 400 `invalid_role_mapping` (or any other authored 400 refusal). */
export declare class SsoValidationError extends Error {
    constructor(message: string);
}
/** The DNS TXT record the caller must publish, carried by {@link SsoDomainNotVerifiedError}. */
export interface SsoDomainNotVerifiedDetails {
    domain: string;
    recordName: string;
    recordType: string;
    recordValue: string;
}
/**
 * HTTP 409 `domain_not_verified` — `set` was attempted (or the reverify sweep tripped) before the
 * domain's ownership was proven. Carries the exact TXT record so the MCP tool response can render
 * it, per the Wave 3 plan's `set` refusal requirement ("refuses with an actionable message naming
 * the exact TXT record").
 */
export declare class SsoDomainNotVerifiedError extends Error {
    readonly details: SsoDomainNotVerifiedDetails;
    constructor(details: SsoDomainNotVerifiedDetails, message: string);
}
/** HTTP 409 `domain_verified_by_another_team` — the partial-unique-index loser (Wave 3 Step 1). */
export declare class SsoDomainClaimedByAnotherTeamError extends Error {
    constructor(message: string);
}
/**
 * HTTP 409 `domain_verification_failed` — the DNS TXT record was missing or didn't match
 * (added 2026-08-28: this status/error-code pair was previously unhandled by `throwMappedError`
 * and fell through to the generic `SsoServiceUnavailableError`, misreporting an ordinary
 * "not propagated yet" outcome as a fake service outage). The edge function's `message` here is
 * safe to surface verbatim — it names only the requesting team's own domain/token/found-records,
 * never another team's data, unlike `domain_verified_by_another_team`'s sibling case.
 */
export declare class SsoDomainVerificationFailedError extends Error {
    constructor(message: string);
}
/**
 * HTTP 404 `domain_not_claimed` — `verify_domain` called before `claim_domain` for this domain
 * (added 2026-08-28: previously unhandled, fell through to `default` and misreported as a
 * service outage). Message is safe to surface verbatim — authored, names only the caller's own
 * domain.
 */
export declare class SsoDomainNotClaimedError extends Error {
    constructor(message: string);
}
/** HTTP 501 `sso_expire_unavailable` — `expire_stale_sso_members()` is a Wave 4 deliverable. */
export declare class SsoExpireUnavailableError extends Error {
    constructor(message: string);
}
/**
 * Catch-all for 500/502/503 and network-level transport failures. `status === 0` marks the
 * transport-failure case (no HTTP response was ever received) — its `detail`, when present,
 * originates locally (Node's `fetch()` error message), never from GoTrue or the edge function, so
 * including it does not violate the "never leak raw GoTrue text" rule the status-code branches
 * enforce.
 */
export declare class SsoServiceUnavailableError extends Error {
    constructor(status: number, detail?: string);
}
//# sourceMappingURL=sso-tools.live.errors.d.ts.map