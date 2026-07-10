/**
 * @fileoverview Aggregate-only server telemetry for the consumer namespace
 *               audit (SMI-4587 Wave 1 Step 8a, decision #7).
 * @module @skillsmith/mcp-server/tools/namespace-audit/telemetry
 *
 * Emits a single `telemetry:namespace_audit_complete` event per audit run
 * via the existing `events` edge function. Aggregate-only by design — the
 * payload contains COUNTS and RESOLUTION COUNTERS but never `auditId`,
 * file paths, identifiers, skill names, or any other free-form text from
 * the user's filesystem (decision #7 in plan).
 *
 * Why a dedicated emitter (not `emitInstallEvent`):
 *   - `emitInstallEvent` is shaped around a different event kind
 *     (`event: 'skill_install'`) with install-specific metadata.
 *   - The audit is best-effort like installs; we keep its silent-failure
 *     semantics but with our own actor + payload contract.
 *
 * Payload shape (exact):
 *   {
 *     event: 'namespace_audit_complete',
 *     anonymous_id: hmac_sha256(API_KEY) hex | null,
 *     metadata: {
 *       tier:           'community' | 'individual' | 'team' | 'enterprise',
 *       audit_mode:     'preventative' | 'power_user' | 'governance',
 *       collisions: { exact: number, generic: number, semantic: number },
 *       resolved_auto:    number,
 *       resolved_manual:  number,
 *       resolved_skipped: number,
 *       user_id?:       string | null   // hashed actor proxy when caller wants it
 *     }
 *   }
 *
 * The emitter is a no-op when:
 *   - `audit_mode === 'off'` (the detector also short-circuits)
 *   - `SKILLSMITH_TELEMETRY=0|false|off`
 *
 * Network failures are swallowed — telemetry must never break an audit run.
 */
import type { AuditMode, Tier } from '@skillsmith/core/config/audit-mode';
import type { InventoryAuditResult } from '../../audit/collision-detector.types.js';
export interface AuditCompleteContext {
    /** Subscription tier of the caller. */
    tier: Tier;
    /**
     * Resolved audit mode. `'off'` is accepted but causes the emitter to
     * short-circuit (decision #7 defense-in-depth) — the detector should
     * already have skipped this call entirely.
     */
    audit_mode: AuditMode;
    /** Counters emitted by Wave 2's rename engine. Wave 1 always 0. */
    resolved_auto: number;
    resolved_manual: number;
    resolved_skipped: number;
    /**
     * Optional opaque caller identifier (already-hashed by the caller).
     * Pass `null` to omit. Wave 1 callers pass `null`.
     */
    user_id?: string | null;
}
export interface AuditCompleteTelemetryOptions {
    /**
     * API key override for tests. Defaults to `SKILLSMITH_API_KEY`. When
     * neither this nor the env var is set, `anonymous_id` is `null`.
     */
    apiKey?: string | null;
    /** Override the events endpoint. Defaults to `SKILLSMITH_API_URL`. */
    apiUrl?: string;
    /** Test seam: inject a fetch implementation. Defaults to global `fetch`. */
    fetchImpl?: typeof fetch;
}
/**
 * Emit the `telemetry:namespace_audit_complete` event for one audit run.
 *
 * Best-effort: never throws, never blocks the caller. Returns the
 * stringified payload that was attempted (or `null` when the emitter
 * short-circuited) so tests can assert on the wire body without re-
 * stringifying the request.
 */
export declare function emitAuditCompleteEvent(result: InventoryAuditResult, ctx: AuditCompleteContext, opts?: AuditCompleteTelemetryOptions): Promise<string | null>;
//# sourceMappingURL=telemetry.d.ts.map