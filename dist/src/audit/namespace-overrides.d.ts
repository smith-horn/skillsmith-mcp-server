/**
 * @fileoverview Atomic reader/writer for the namespace-overrides ledger
 *               (SMI-4588 Wave 2 Step 1, PR #1).
 * @module @skillsmith/mcp-server/audit/namespace-overrides
 *
 * Persists `~/.skillsmith/namespace-overrides.json` — the load-bearing
 * artifact that makes consumer-side namespace renames durable across pack
 * version bumps. Conceptually equivalent to git's `rerere` but for
 * namespace identifiers.
 *
 * Atomicity: every write goes through `<path>.tmp` + `fs.rename`. On read,
 * a missing file degrades gracefully to an empty ledger; malformed JSON
 * surfaces as a typed `namespace.ledger.malformed` discriminator (the
 * caller decides whether to log + reset, never silently). A
 * higher-than-supported `version` returns
 * `namespace.ledger.version_unsupported` rather than a silent empty
 * ledger — see plan §2 Edit 6.
 *
 * Concurrent-write boundary: last-write-wins on a single Node event loop
 * via `<path>.tmp` + `fs.rename`. Multi-process scenarios (two MCP
 * instances on the same machine) can lose one write under a tight race;
 * documented as a known limitation in the plan. If multi-process safety
 * becomes load-bearing, a future revision adds advisory locking via
 * `proper-lockfile`.
 */
import { type OverrideRecord, type OverridesLedger, type ReadLedgerResult } from './namespace-overrides.types.js';
export interface LedgerPathOptions {
    /** Override the ledger path (default `~/.skillsmith/namespace-overrides.json`). */
    ledgerPath?: string;
}
/**
 * Read the ledger from disk and return a tagged union. Missing file →
 * `{ kind: 'ok', ledger: <empty> }`. Malformed JSON →
 * `{ kind: 'namespace.ledger.malformed', reason }`. `version > CURRENT_VERSION`
 * → `{ kind: 'namespace.ledger.version_unsupported', found, expected }`.
 *
 * Callers that want the simpler "read or empty" semantics should use
 * `readLedger()` (below) which collapses the discriminator.
 */
export declare function readLedgerResult(opts?: LedgerPathOptions): Promise<ReadLedgerResult>;
/**
 * Convenience wrapper: returns the ledger directly, collapsing the
 * `malformed` branch to an empty ledger plus a `console.warn`. Higher-
 * version files still bubble a thrown error — silently empty-ing a
 * higher-version ledger would corrupt forward-compat (plan §2 Edit 6).
 *
 * For callers that need the typed discriminator, use `readLedgerResult`.
 */
export declare function readLedger(opts?: LedgerPathOptions): Promise<OverridesLedger>;
/**
 * Write the ledger atomically: `<path>.tmp` + `fs.rename`. Creates the
 * parent directory on first run with `recursive: true` (mirrors
 * audit-history.ts E-MISS-2 fix).
 */
export declare function writeLedger(ledger: OverridesLedger, opts?: LedgerPathOptions): Promise<void>;
/**
 * Pure helper: append a new override to a ledger and return a new copy.
 * Original ledger is not mutated. The caller is responsible for
 * persisting the result via `writeLedger` (separation of concerns —
 * tests can build ledgers without touching disk).
 *
 * Idempotency: if an override with the same
 * `(skillId, kind, originalIdentifier, renamedTo)` quadruple already
 * exists, the input is returned unchanged. The caller can detect the
 * no-op by reference equality (`appended === ledger`).
 */
export declare function appendOverride(ledger: OverridesLedger, override: Omit<OverrideRecord, 'id' | 'appliedAt'>): OverridesLedger;
/**
 * Pure lookup: find an override by `(skillId, kind, originalIdentifier)`.
 * `skillId` may be omitted for local/unregistered artifacts; in that case
 * only `kind` + `originalIdentifier` are matched. Returns the first match
 * or `null`.
 */
export declare function findOverride(ledger: OverridesLedger, query: {
    skillId?: string | null;
    kind?: OverrideRecord['kind'];
    originalIdentifier: string;
}): OverrideRecord | null;
//# sourceMappingURL=namespace-overrides.d.ts.map