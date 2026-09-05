/**
 * @fileoverview Per-action implementations for `apply_manifest_reconcile`
 *               (SMI-6343 Wave 4).
 * @module @skillsmith/mcp-server/tools/apply-manifest-reconcile.actions
 *
 * Split out of `apply-manifest-reconcile.ts` (500-line file gate). Every
 * write goes through `ManifestManager.updateSafely()` — core's locked,
 * single-key read-modify-write — never a whole-file writer (C7). Every
 * write also takes a `createProseBackup` snapshot first (C8) and records a
 * ledger entry after (C7), so both the forensic backup and the durable
 * revert exist before the caller sees a success response.
 */
import type { ToolContext } from '../context.js';
import type { ApplyManifestReconcileInput, ApplyManifestReconcileResponse } from './apply-manifest-reconcile.types.js';
import { type ReconcileScopeTarget } from './apply-manifest-reconcile.helpers.js';
export { runVerify } from './apply-manifest-reconcile.verify.js';
export declare function runMarkLocal(input: ApplyManifestReconcileInput, scopeTarget: ReconcileScopeTarget, _context: ToolContext): Promise<ApplyManifestReconcileResponse>;
export declare function runRelink(input: ApplyManifestReconcileInput, scopeTarget: ReconcileScopeTarget, context: ToolContext): Promise<ApplyManifestReconcileResponse>;
export declare function runDropEntry(input: ApplyManifestReconcileInput, scopeTarget: ReconcileScopeTarget, _context: ToolContext): Promise<ApplyManifestReconcileResponse>;
export declare function runRevert(input: ApplyManifestReconcileInput, scopeTarget: ReconcileScopeTarget, _context: ToolContext): Promise<ApplyManifestReconcileResponse>;
//# sourceMappingURL=apply-manifest-reconcile.actions.d.ts.map