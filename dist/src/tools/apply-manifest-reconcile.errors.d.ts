/**
 * @fileoverview `describeReconcileError()` — the M2 error-taxonomy prose
 *               generator for `apply_manifest_reconcile`.
 * @module @skillsmith/mcp-server/tools/apply-manifest-reconcile.errors
 *
 * Modeled on `StuckLockError` (`packages/core/src/config/owned-lock.acquire.ts`):
 * "`reason` is a stable discriminant for mechanical triage (never
 * prose-matching); the message embeds the manual unstick procedure
 * verbatim." Every `ManifestReconcileErrorCode` message is generated HERE,
 * from the code plus its context, so code and prose cannot drift apart —
 * and each message embeds the exact next remediation command inline.
 */
import { type StuckLockReason } from '@skillsmith/core';
import type { ManifestReconcileErrorCode } from './apply-manifest-reconcile.types.js';
export interface ReconcileErrorContext {
    name?: string;
    manifestKey?: string;
    /** H9: the other key found when `key_shape_ambiguous` fires. */
    otherKey?: string;
    id?: string;
    source?: string;
    path?: string;
    /**
     * lock_timeout only: the underlying `StuckLockError.reason` (SMI-6735
     * adversarial-review finding 1). Reported to the caller as a stable
     * discriminant, and used to select the reason-specific remedy clause below.
     *
     * It no longer selects a VERB (SMI-6764). Three attempts to derive one from
     * this field failed, the last structurally: `reclaim_unavailable` depends on
     * whether the reclaim lock is busy or orphaned, `unreclaimable_legacy` on
     * whether the legacy holder is alive, `reclaim_disabled` on whether a
     * differently-configured peer exists, and `held` on whether the holder was
     * ever probed — none of which this value carries. (`held` was added to that
     * list in round 5; the four rounds before it all read `held` as determined.)
     * A remedy clause can say "it depends, on this"; a verb cannot.
     */
    lockReason?: StuckLockReason;
    /**
     * lock_timeout only, present when `lockReason === 'reclaim_unavailable'`:
     * the second file `owned-lock.ts`'s own module docstring documents as the
     * accepted mitigation for its R1 residual risk (a `SIGKILL` inside the
     * reclaim critical section orphans `<lock>.reclaim`) — naming ONLY the
     * main lock path here would leave that orphan permanently un-diagnosable.
     */
    reclaimPath?: string;
    ledgerEntryId?: string;
    /** entry_changed: the value recorded at write time vs. what is on disk now. */
    recordedValue?: unknown;
    currentValue?: unknown;
    /** revert_ambiguous: candidate ledger entry ids. */
    candidateIds?: string[];
    /** ledger_version_unsupported. */
    found?: number;
    expected?: number;
    /** underlying error message, when wrapping a caught error. */
    detail?: string;
}
/**
 * Generate the human-readable message for a `ManifestReconcileErrorCode`,
 * embedding the exact next command a caller should run.
 */
export declare function describeReconcileError(code: ManifestReconcileErrorCode, ctx?: ReconcileErrorContext): string;
//# sourceMappingURL=apply-manifest-reconcile.errors.d.ts.map