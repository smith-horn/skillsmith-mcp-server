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
import type { ManifestReconcileErrorCode } from './apply-manifest-reconcile.types.js';
export interface ReconcileErrorContext {
    name?: string;
    manifestKey?: string;
    /** H9: the other key found when `key_shape_ambiguous` fires. */
    otherKey?: string;
    id?: string;
    source?: string;
    path?: string;
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