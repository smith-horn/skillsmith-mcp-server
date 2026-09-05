/**
 * @fileoverview `verify` action implementation for `apply_manifest_reconcile`
 *               (SMI-6343 Wave 4, C3).
 * @module @skillsmith/mcp-server/tools/apply-manifest-reconcile.verify
 *
 * Split out of `apply-manifest-reconcile.actions.ts` (500-line file gate) —
 * the Wave 4 adversarial-review fix for the async-verify-then-locked-write
 * race (see the two doc comments inside `runVerify` below) pushed the
 * combined actions file over the limit.
 */
import type { ToolContext } from '../context.js';
import type { ApplyManifestReconcileInput, ApplyManifestReconcileResponse } from './apply-manifest-reconcile.types.js';
import { type ReconcileScopeTarget } from './apply-manifest-reconcile.helpers.js';
export declare function runVerify(input: ApplyManifestReconcileInput, scopeTarget: ReconcileScopeTarget, context: ToolContext): Promise<ApplyManifestReconcileResponse>;
//# sourceMappingURL=apply-manifest-reconcile.verify.d.ts.map