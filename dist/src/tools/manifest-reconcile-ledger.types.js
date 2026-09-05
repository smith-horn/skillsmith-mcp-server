/**
 * @fileoverview Type vocabulary for the manifest-reconcile ledger
 *               (SMI-6343 Wave 4, C7).
 * @module @skillsmith/mcp-server/tools/manifest-reconcile-ledger.types
 *
 * Schema for `~/.skillsmith/manifest-reconcile-ledger.json` — the durable,
 * cross-session revert source of truth for `apply_manifest_reconcile`.
 * Shaped field-for-field on `audit/namespace-overrides.types.ts` (the
 * `apply_namespace_rename` ledger), NOT on `undo_apply`'s in-process
 * session stack (`apply-session.helpers.ts`) or its whole-file backup
 * restore (`undo-apply.ts`) — see the plan's C7 subsection for why both
 * were rejected as the model for THIS ledger:
 *   1. `undo_apply` is session-scoped/in-process, with no cross-session
 *      persistence.
 *   2. Its never-clobber guard hashes the WHOLE target file. The manifest
 *      has seven independent writers (plan §P-5); any unrelated write
 *      between a reconcile and an attempted undo would permanently block
 *      it.
 *   3. `undo_apply`'s restore path takes no manifest lock at all.
 *
 * This ledger instead records ONE manifest key's complete before/after
 * state per entry, and `revertReconcile()` (`manifest-reconcile-ledger.ts`)
 * restores through `ManifestManager.updateSafely()` — a locked,
 * single-key merge that leaves every other manifest entry untouched, so an
 * unrelated install between a reconcile and its revert is invisible to the
 * revert rather than fatal to it.
 */
/**
 * Current ledger schema version. Bumped only when the on-disk shape
 * changes incompatibly. `version > CURRENT_LEDGER_VERSION` on read returns
 * a typed `manifest.reconcile.ledger_version_unsupported` error rather
 * than silently degrading to an empty ledger (mirrors
 * `namespace-overrides.ts`'s `readLedgerResult`).
 */
export const CURRENT_LEDGER_VERSION = 1;
//# sourceMappingURL=manifest-reconcile-ledger.types.js.map