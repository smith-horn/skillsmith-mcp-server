/**
 * Telemetry Consent Gate — SMI-5019 W2.S4
 *
 * For MCP-only clients (Cursor, Continue, Copilot users without a CLI install)
 * we cannot rely on a CLI first-run prompt or a VS Code toast. Per user
 * decision U5 in the implementation plan, the consent surface is the web
 * dashboard at https://skillsmith.app/account/telemetry.
 *
 * This module supplies the MCP-side half of that flow:
 *
 *  1. On every tool call, resolve the calling anonymous_id's preference from
 *     `user_telemetry_preferences` (RLS-scoped via the same anon-key client
 *     used elsewhere in this package).
 *  2. If the row is missing, signal `consent_required:true` + the privacy URL
 *     in the response envelope so the client can prompt the user to open the
 *     dashboard.
 *  3. Cache the resolved state per process (Map keyed by anonymous_id) so
 *     repeated calls within a session don't re-query, and so two parallel
 *     calls from the same unrecognized anonymous_id observe identical state.
 *  4. Suppress telemetry writes (consult `shouldEmitTelemetry`) for that
 *     anonymous_id until the preference resolves to `enabled:true`.
 *
 * SMI-5016 (`packages/core/src/telemetry/wrap.ts`) and SMI-5017 (tool /
 * command dispatchers) are wave-sibling deliverables — this module
 * deliberately stays out of those files.
 */
/**
 * Canonical absolute URL of the consent dashboard. Must remain stable across
 * surfaces so MCP clients can deep-link to a known landing page.
 */
export declare const TELEMETRY_PRIVACY_URL = "https://skillsmith.app/account/telemetry";
/**
 * Result of resolving the consent state for a given anonymous_id.
 */
export interface ConsentState {
    /** True iff a preference row was found AND `enabled = true`. */
    enabled: boolean;
    /**
     * True iff there is no row for this anonymous_id yet (the user hasn't
     * visited the consent page). Surface this in the response envelope so the
     * client can prompt the user.
     */
    consentRequired: boolean;
    /** Stable URL to direct the user to when `consentRequired` is true. */
    privacyUrl: string;
}
/**
 * Resolve the consent state for `anonymousId`, caching the result for the
 * lifetime of the process. Concurrent calls share one in-flight query.
 *
 * Passing `null`/`undefined`/empty triggers the no-id branch — telemetry is
 * suppressed but no prompt is shown (there's nothing to link the user's
 * eventual web-dashboard choice back to).
 *
 * `fetchState` defaults to {@link fetchConsentState} and exists purely as a
 * test seam (SMI-5479) — `fetchConsentState` is written so every internal
 * error path resolves to a `DEFAULT_*` state instead of rejecting, which
 * means the eviction-on-rejection behavior below is unreachable through the
 * real fetcher today. Passing a rejecting `fetchState` in a test exercises
 * that defense-in-depth path deterministically without weakening
 * `fetchConsentState`'s own never-rejects contract.
 */
export declare function resolveConsent(anonymousId: string | null | undefined, fetchState?: (id: string) => Promise<ConsentState>): Promise<ConsentState>;
/**
 * Convenience: true iff telemetry may be emitted for this anonymous_id.
 * Wraps `resolveConsent` for callers that only need the boolean.
 */
export declare function shouldEmitTelemetry(anonymousId: string | null | undefined): Promise<boolean>;
/**
 * Invalidate the cache entry for `anonymousId`. Called by the consent page
 * after a successful save would, in a future iteration, ping an MCP refresh
 * endpoint — for now this is exposed for tests and for the explicit
 * resync-on-rotate UI in the consent page.
 */
export declare function invalidateConsentCache(anonymousId?: string): void;
/**
 * Augment an existing MCP tool response with a `consent_required` envelope
 * when the user has not yet visited the consent page.
 *
 * The MCP `CallToolResult` shape is `{ content: [{ type: 'text', text: <json> }] }`.
 * We parse `text`, splice in the consent fields, and re-serialize. If parsing
 * fails for any reason (binary content, malformed payload), we return the
 * response untouched — telemetry consent is a soft signal and must never
 * corrupt a successful tool result.
 *
 * Idempotent: calling this twice on the same response is a no-op once the
 * fields are already present.
 */
export declare function annotateResponseWithConsent<T extends {
    content?: unknown;
}>(response: T, consent: ConsentState): T;
/**
 * True iff `anonymousId` has already been annotated with `consent_required`
 * on a direct-dispatch response this process. A peek, not a mutation — pair
 * with {@link markConsentPrompted}, called only after annotation actually
 * happens, so a fail-open no-op (e.g. a non-JSON response body) never
 * consumes the one-shot prompt for a user who never actually saw it.
 */
export declare function wasConsentPrompted(anonymousId: string | null | undefined): boolean;
/**
 * Record that `anonymousId` has now been shown the `consent_required`
 * prompt on a direct-dispatch response. No-ops for a falsy id.
 */
export declare function markConsentPrompted(anonymousId: string | null | undefined): void;
/**
 * Test-only helper. Not exported from the package index.
 *
 * Clears both the consent-preference cache AND the once-per-process
 * `promptedIds` set — the two share a process-lifetime scope and every
 * existing caller of this helper wants a fully clean slate between tests.
 */
export declare function _resetConsentCacheForTests(): void;
//# sourceMappingURL=telemetry-consent.d.ts.map