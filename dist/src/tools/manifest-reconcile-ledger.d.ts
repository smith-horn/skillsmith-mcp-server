/**
 * @fileoverview Atomic reader/writer for the manifest-reconcile ledger
 *               (SMI-6343 Wave 4, C7).
 * @module @skillsmith/mcp-server/tools/manifest-reconcile-ledger
 *
 * Persists `~/.skillsmith/manifest-reconcile-ledger.json` — see
 * `manifest-reconcile-ledger.types.ts`'s module header for why this is a
 * NEW ledger rather than a reuse of `undo_apply`'s session stack.
 *
 * Atomicity: every write goes through `<path>.tmp.<random>` + `fs.rename`
 * (mirrors `namespace-overrides.ts`'s per-call-unique-tmp shape — a fixed
 * `<path>.tmp` would race two concurrent writers on the rename target). On
 * read, a missing file degrades gracefully to an empty ledger; malformed
 * JSON surfaces as a typed `manifest.reconcile.ledger_malformed`
 * discriminator; a higher-than-supported `version` returns
 * `manifest.reconcile.ledger_version_unsupported` rather than a silent
 * empty ledger.
 *
 * No advisory file lock: like `namespace-overrides.json`, this ledger is
 * written at human-initiated-repair cadence, not install-hot-path
 * cadence, and the atomic rename makes a torn read impossible. The
 * MANIFEST itself is still protected by `ManifestManager`'s real lock —
 * this ledger only records what that locked write did.
 */
import { type ManifestReconcileLedger, type ManifestReconcileLedgerEntry, type ManifestReconcileMutatingAction, type ReadReconcileLedgerResult } from './manifest-reconcile-ledger.types.js';
export interface ReconcileLedgerPathOptions {
    /** Override the ledger path (default `~/.skillsmith/manifest-reconcile-ledger.json`). */
    ledgerPath?: string;
}
/**
 * Read the ledger from disk and return a tagged union. Missing file ->
 * `{ kind: 'ok', ledger: <empty> }`. Malformed JSON ->
 * `{ kind: 'manifest.reconcile.ledger_malformed', reason }`.
 * `version > CURRENT_LEDGER_VERSION` ->
 * `{ kind: 'manifest.reconcile.ledger_version_unsupported', found, expected }`.
 */
export declare function readReconcileLedgerResult(opts?: ReconcileLedgerPathOptions): Promise<ReadReconcileLedgerResult>;
/**
 * Convenience wrapper: returns the ledger directly, collapsing the
 * `malformed` branch to an empty ledger plus a `console.warn`. A
 * higher-version file still bubbles a thrown error — silently emptying a
 * higher-version ledger would corrupt forward-compat.
 */
export declare function readReconcileLedger(opts?: ReconcileLedgerPathOptions): Promise<ManifestReconcileLedger>;
/**
 * Write the ledger atomically: `<path>.<random>.tmp` + `fs.rename`.
 * Creates the parent directory on first run.
 */
export declare function writeReconcileLedger(ledger: ManifestReconcileLedger, opts?: ReconcileLedgerPathOptions): Promise<void>;
/**
 * Append a new entry to the ledger and persist it. Returns the full
 * entry (including the generated `id`/`appliedAt`) so the caller can echo
 * `ledgerEntryId` back to the caller for a later precise `revert`.
 */
export declare function appendReconcileLedgerEntry(input: {
    manifestPath: string;
    manifestKey: string;
    name: string;
    client: string;
    action: ManifestReconcileMutatingAction;
    beforeState: Record<string, unknown>;
    afterState: Record<string, unknown> | null;
    reason: string;
}, opts?: ReconcileLedgerPathOptions): Promise<ManifestReconcileLedgerEntry>;
/**
 * Remove a ledger entry by id and persist the result. Used by a
 * successful revert (C7's idempotency: the entry being gone is what makes
 * a second revert of the same id a no-op success rather than an error).
 */
export declare function removeReconcileLedgerEntry(entryId: string, opts?: ReconcileLedgerPathOptions): Promise<void>;
/**
 * Find every ledger entry matching `(name, client, manifestPath)`,
 * most-recent-first. Used by `revert` when the caller supplies
 * `name`/`client` instead of an explicit `ledgerEntryId` — see
 * `apply-manifest-reconcile.ts`'s revert action for the disambiguation
 * policy this feeds (0 matches -> idempotent no-op, 1 -> revert it, 2+ ->
 * `manifest.reconcile.revert_ambiguous`). Filtering on `manifestPath` too
 * (not just `name`/`client`) matters under ADR-139: the same `(name,
 * client)` pair can be reconciled independently at global AND workspace
 * scope, and a by-name revert must only ever match entries from the
 * SAME manifest the caller's own scope resolution points at.
 */
export declare function findReconcileLedgerEntriesFor(ledger: ManifestReconcileLedger, name: string, client: string, manifestPath: string): ManifestReconcileLedgerEntry[];
//# sourceMappingURL=manifest-reconcile-ledger.d.ts.map