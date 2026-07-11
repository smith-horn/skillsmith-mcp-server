/**
 * @fileoverview Continuous-audit email digest — client-side push orchestrator
 *               (SMI-5541 Wave 2C Stage 2, Option 1).
 * @module @skillsmith/mcp-server/audit/audit-notify
 *
 * Bridges the local audit engine (`runSecurityAudit`, which lives here because
 * the scan runs where the content is — ADR-124) to the `@skillsmith/core`
 * push client (`sendAuditDigest`). Two entry points:
 *
 *   - `buildAuditDigestPayload` — pure map from a `RunSecurityAuditResult` into
 *     the compact `AuditDigestPushPayload` the edge function accepts (counts
 *     from the summary; the findings list sorted strongest-first and capped).
 *   - `maybeAutoNotifyAudit` — the throttled, deduped, non-throwing background
 *     run wired into MCP-server startup. Consent is enforced SERVER-side; this
 *     only rate-limits (≤ 1×/day) and suppresses re-emailing an identical
 *     security picture (client-side dedup on the findings hash).
 */
import { type AuditDigestPushPayload } from '@skillsmith/core';
import type { RunSecurityAuditResult } from './security-audit.types.js';
/**
 * Hard cap on findings listed in a pushed digest. Matches the edge function's
 * `MAX_FINDINGS` — the counts in the payload still reflect the FULL set, so a
 * user with 60 issues sees "60 issues" with the 50 strongest listed.
 */
export declare const MAX_DIGEST_FINDINGS = 50;
/**
 * Map a full audit result into the compact push payload. Pure: no I/O.
 *
 * Counts come from the run summary (the true totals); the findings list is
 * sorted strongest-first and capped at {@link MAX_DIGEST_FINDINGS}. Only the
 * identifier / kind / verdict travel (control-sanitized), plus a CONTENT-FREE
 * synthesized reason ({@link digestReason}) — never the audit's excerpt-bearing
 * reason, never `source_path`, never raw skill content.
 */
export declare function buildAuditDigestPayload(result: RunSecurityAuditResult): AuditDigestPushPayload;
/**
 * Stable dedup hash of a digest. Folds in the summary COUNTS as well as the
 * (top-50) findings, so a change confined below the findings cap — e.g. a
 * sub-50 skill escalating suspicious→malicious — still changes the hash and
 * re-alerts. Exported so the CLI (`--email`) records the SAME hash the
 * background auto-run uses, keeping the two channels from re-emailing an
 * identical digest.
 */
export declare function hashDigest(payload: Pick<AuditDigestPushPayload, 'hostile' | 'malicious' | 'suspicious' | 'findings'>): string;
/** Outcome of a background auto-notify attempt (for logging/tests). */
export interface MaybeAutoNotifyResult {
    /** Did we actually POST to `audit-notify`? (false = skipped before the network.) */
    attempted: boolean;
    /** Did the server report an email was dispatched? */
    sent: boolean;
    /**
     * Why we stopped, when informative: `nothing_to_report` | `deduped` | a
     * server reason (`not_consented` | `email_not_verified` | ...).
     */
    reason?: string;
}
/** Options for {@link maybeAutoNotifyAudit} (injectable clock for tests). */
export interface MaybeAutoNotifyOptions {
    /** Current epoch ms; defaults to `Date.now()`. */
    now?: number;
}
/**
 * Background continuous-audit digest push for MCP-server startup.
 *
 * Fire-and-forget contract: NEVER throws (all errors swallowed → logged →
 * `null`), so it is safe to call un-awaited from the startup path. Returns
 * `null` when it does nothing (disabled / throttled / not logged in / errored);
 * otherwise a {@link MaybeAutoNotifyResult}.
 *
 * Guards, in order:
 *   1. `SKILLSMITH_AUDIT_EMAIL_DISABLE=1` opts out entirely.
 *   2. 24h throttle (reuses `shouldAutoPush`) — bounds the scan to ≤ 1×/day.
 *   3. No stored session → skip WITHOUT advancing the throttle, so the first
 *      startup after `skillsmith login` tries promptly (rather than backing off
 *      a full day from a pointless logged-out attempt).
 *   4. Nothing to report → record a clean state, no network.
 *   5. Identical findings to the last email → back off, no re-email (dedup).
 *
 * Consent + verified-email are enforced SERVER-side; a `not_consented` response
 * advances only the throttle (not the dedup hash), so a later opt-in re-pushes.
 *
 * @see SMI-5541
 */
export declare function maybeAutoNotifyAudit(opts?: MaybeAutoNotifyOptions): Promise<MaybeAutoNotifyResult | null>;
//# sourceMappingURL=audit-notify.d.ts.map