/**
 * Unit tests for SMI-6343 Wave 4 — manifest-reconcile ledger (C7).
 * Mirrors namespace-overrides.test.ts's coverage shape for the sibling
 * ledger this one is modeled on.
 *
 * Coverage:
 *   1. Read empty / missing file returns an empty ledger.
 *   2. Append + read round-trip preserves entries.
 *   3. `version > CURRENT_LEDGER_VERSION` returns typed
 *      `manifest.reconcile.ledger_version_unsupported` (NOT silently empty).
 *   4. Malformed JSON returns the typed
 *      `manifest.reconcile.ledger_malformed` discriminator (readLedger
 *      warns + degrades to empty).
 *   5. Atomic write semantics — no `.tmp` file remains after success.
 *   6. removeReconcileLedgerEntry is idempotent (removing twice is a no-op).
 *   7. findReconcileLedgerEntriesFor filters by (name, client, manifestPath)
 *      and sorts most-recent-first.
 */
export {};
//# sourceMappingURL=manifest-reconcile-ledger.test.d.ts.map