/**
 * @fileoverview ULID-keyed audit history persistence (SMI-4587 Wave 1 Step 3).
 * @module @skillsmith/mcp-server/audit/audit-history
 *
 * Writes `~/.skillsmith/audits/<auditId>/result.json` (and, in subsequent
 * PRs, `report.md` next to it). Atomic via tmp-file + rename. The
 * directory pattern follows the existing `~/.skillsmith/<name>/`
 * convention (see CLAUDE.md "Auth" section).
 */
import type { AuditId, CollisionId, ExactCollisionFlag } from './collision-detector.types.js';
import type { InventoryAuditResult } from './collision-detector.types.js';
import type { InventoryEntry } from '../utils/local-inventory.types.js';
export interface WriteAuditHistoryResult {
    auditId: AuditId;
    resultPath: string;
    /**
     * Path where `report.md` will be written. The audit-report writer (added
     * in a subsequent PR) reuses the same per-audit directory.
     */
    reportPath: string;
}
export interface AuditHistoryOptions {
    /** Override the audits root (default `~/.skillsmith/audits`). */
    auditsDir?: string;
}
/**
 * Generate a fresh ULID-shaped `auditId`.
 *
 * Exposed so callers can pre-allocate the id and pass it into both the
 * collision detector and the writer (single source of truth for the run).
 */
export declare function newAuditId(): AuditId;
/**
 * Persist an `InventoryAuditResult` snapshot to
 * `~/.skillsmith/audits/<auditId>/result.json`. Atomic (write-tmp +
 * rename). Creates the per-audit directory with `recursive: true` so
 * first-run on a fresh install does not throw (E-MISS-2).
 *
 * Returns both `resultPath` and `reportPath` so the caller can chain a
 * report writer without re-deriving the directory.
 */
export declare function writeAuditHistory(result: InventoryAuditResult, opts?: AuditHistoryOptions): Promise<WriteAuditHistoryResult>;
/**
 * Read back a previously-written audit result. Returns `null` for an
 * unknown auditId — callers should not rely on the audit-history
 * directory being present.
 */
export declare function readAuditHistory(auditId: string, opts?: AuditHistoryOptions): Promise<InventoryAuditResult | null>;
/**
 * Derive a collision identifier from `auditId` + sorted entry paths.
 *
 * `collisionId` is the load-bearing key for Wave 2's idempotency check
 * against the `namespace-overrides.json` ledger. Changing this derivation
 * requires coordinated plan-review on both Wave 1 and Wave 2.
 *
 * E-CONF-1 special case: when any colliding entry is `kind: 'claude_md_rule'`,
 * include the entry identifier in the input string. Otherwise, multiple
 * trigger phrases extracted from the same CLAUDE.md would deduplicate via
 * `sortedEntryPaths.join(',')` and produce identical `collisionId`s for
 * distinct logical collisions.
 */
export declare function deriveCollisionId(auditId: string, entries: ReadonlyArray<InventoryEntry>): CollisionId;
/**
 * Type-narrowing helper used by the report writer (next PR) to flag
 * collisions whose entries include CLAUDE.md rules — render order +
 * caveat presentation depend on it.
 */
export declare function hasClaudeMdEntries(flag: {
    entries: InventoryEntry[];
}): boolean;
/**
 * Re-export to keep audit-related helpers reachable from one entrypoint.
 * Wave 2's apply path imports `deriveCollisionId` to look up ledger
 * entries by id.
 */
export type { ExactCollisionFlag, InventoryAuditResult };
//# sourceMappingURL=audit-history.d.ts.map