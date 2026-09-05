/**
 * @fileoverview Execution helpers for `apply_manifest_reconcile`
 *               (SMI-6343 Wave 4).
 * @module @skillsmith/mcp-server/tools/apply-manifest-reconcile.helpers
 *
 * Split out of `apply-manifest-reconcile.ts` (500-line file gate): H9 key
 * resolution + scope contract, C8 backup guard rail, and the `verify`
 * action's live registry-comparison logic (reusing Wave 2's shared
 * comparator + `lookupSkillFromRegistry`'s offline/quota degradation
 * contract, the SAME pattern `outdated.ts` already uses).
 */
import { type SkillManifest, type SkillManifestEntry } from '@skillsmith/core';
import { CANONICAL_CLIENT, InvalidScopeValueError, UnsatisfiableWorkspaceScopeError, type ClientId } from '@skillsmith/core/install';
import type { ToolContext } from '../context.js';
import type { ApplyManifestReconcileInput, ManifestReconcileErrorCode, ManifestReconcileVerifyResult } from './apply-manifest-reconcile.types.js';
import type { ReconcileErrorContext } from './apply-manifest-reconcile.errors.js';
/**
 * Thrown from inside a synchronous `ManifestManager.updateSafely()` update
 * function (or by scope/backup preflight) to carry a typed
 * `ManifestReconcileErrorCode` out to the tool's top-level dispatcher,
 * which maps it to the response envelope via `describeReconcileError()`.
 */
export declare class ReconcileGuardError extends Error {
    readonly code: ManifestReconcileErrorCode;
    readonly ctx: ReconcileErrorContext;
    constructor(code: ManifestReconcileErrorCode, ctx?: ReconcileErrorContext);
}
export interface ReconcileScopeTarget {
    manifestPath: string;
    client: ClientId;
    scope: 'global' | 'workspace';
}
/**
 * H9: resolve the manifest path for the requested scope BEFORE any read.
 * Mirrors `uninstall_skill`'s ADR-139 scope resolution exactly (same
 * resolver, same three inputs) so `apply_manifest_reconcile` reconciles
 * the SAME manifest a workspace-scoped install/uninstall would touch.
 *
 * `InvalidScopeValueError`/`UnsatisfiableWorkspaceScopeError` propagate to
 * the caller, which maps them to `manifest.reconcile.invalid_input`.
 */
export declare function resolveReconcileScope(input: ApplyManifestReconcileInput): ReconcileScopeTarget;
/** Re-exported so the main tool file can catch these without importing core/install directly twice. */
export { InvalidScopeValueError, UnsatisfiableWorkspaceScopeError, CANONICAL_CLIENT };
/**
 * H9: derive the manifest key ONLY via `manifestKeyFor(name, client)` —
 * never by indexing `installedSkills[name]` directly — and refuse rather
 * than guess when a bare-name key exists under a DIFFERENT client (the
 * SMI-6358/6359 bare-key writer hazard this plan cannot fix but must not
 * assume away).
 *
 * Throws `ReconcileGuardError('manifest.reconcile.entry_not_found')` or
 * `ReconcileGuardError('manifest.reconcile.key_shape_ambiguous')`.
 */
export declare function resolveReconcileEntry(manifest: SkillManifest, name: string, client: ClientId): {
    key: string;
    entry: SkillManifestEntry;
};
/**
 * On `revert`, re-derive the manifest key from the LEDGER ENTRY's own
 * recorded `(name, client)` pair, never from caller input (H9) — a revert
 * cannot be aimed at a different row than the action it reverses.
 */
export declare function reconcileKeyForLedgerEntry(name: string, client: string): string;
/**
 * `drop_entry`'s own tool description and the plan's Actions table both
 * describe it as removing an entry "whose installPath no longer resolves"
 * — the implementation must actually enforce that, not just narrate it.
 * Without this check, `drop_entry` would silently orphan a healthy,
 * currently-installed skill's on-disk files by deleting only its manifest
 * record. Refuses when `installPath` still resolves to an existing
 * directory; any stat failure (ENOENT or otherwise) is treated as
 * "no longer resolves" — exactly the case this action exists for.
 */
export declare function assertDropTargetNoLongerResolves(name: string, entry: SkillManifestEntry): Promise<void>;
/**
 * C8 guard rail: assert the backup target is a regular FILE before ever
 * calling `createProseBackup`. Makes the "someone later passes the parent
 * directory (~/.skillsmith/, which holds config.json's live API key)"
 * mistake structurally impossible rather than merely unlikely — see the
 * plan's C8 subsection and the regression test asserting `config.json`
 * never appears in the backups tree.
 */
export declare function assertBackupTargetIsFile(filePath: string): Promise<void>;
/**
 * Take a pre-mutation backup of the manifest via `createProseBackup` —
 * NEVER `createSkillBackup` (C8: the latter does a recursive `readdir`+
 * copy and, if ever pointed at `~/.skillsmith/` instead of the file
 * itself, would copy `config.json`'s live API key into the backups tree).
 * `createProseBackup` is structurally incapable of this — one `copyFile`
 * of one caller-supplied path, no `readdir`, no recursion.
 */
export declare function takeManifestBackup(manifestPath: string): Promise<string>;
/**
 * Compare one manifest entry's on-disk content hash against the
 * registry's LIVE current content hash for its claimed `id`. Unlike
 * `skill_outdated`, `verify` deliberately does NOT fall back to the
 * historical `skill_versions` arm — ADR-144 §6's `verifiedAt` promotion
 * specifically requires validating against ground truth NOW, not a
 * possibly-stale cached hash (see this tool's own doc comment on the
 * `verify` action).
 *
 * Never throws — every failure mode degrades to
 * `{ verified: false, reason }`, mirroring `lookupSkillFromRegistry`'s own
 * fail-soft contract and `outdated.ts`'s H1 degradation table.
 */
export declare function verifyEntryAgainstRegistry(entry: SkillManifestEntry, context: ToolContext, onQuotaExceeded: () => void, quotaAlreadyExhausted: boolean): Promise<Omit<ManifestReconcileVerifyResult, 'name' | 'manifestKey'>>;
/**
 * `relink`'s registry-validation step: confirm the caller-supplied `id`
 * resolves to a real registry skill before writing it. `apply_manifest_
 * reconcile` never infers `source` from the lookup result (ADR-144 §3 —
 * the caller supplies BOTH `id` and `source` explicitly); this only
 * proves `id` is a genuine registry identity, not a hallucinated one.
 */
export declare function validateRelinkIdentity(id: string, context: ToolContext): Promise<{
    ok: true;
} | {
    ok: false;
    detail: string;
}>;
//# sourceMappingURL=apply-manifest-reconcile.helpers.d.ts.map