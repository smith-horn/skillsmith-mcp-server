/**
 * @fileoverview Pure pass functions for the collision detector
 *               (SMI-4587 Wave 1 Steps 4–5).
 * @module @skillsmith/mcp-server/audit/collision-detector.helpers
 *
 * Each pass is a pure function over `InventoryEntry[]`. The orchestrator
 * (`collision-detector.ts`) wires them together. Wave 1 PR1 shipped the
 * exact-name pass; this file now also exposes the generic-token pass
 * (Step 5). Semantic pass lands in a subsequent PR.
 */
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { AuditId, ExactCollisionFlag, GenericTokenFlag } from './collision-detector.types.js';
/**
 * Stable pack-name input passed to {@link derivePackDomain} when running
 * the generic-token pass over the user's local inventory. The user's
 * `~/.claude/` install has no single pack name — using a non-suffixed
 * sentinel forces `derivePackDomain` to fall through Strategy 1 (which
 * keys off `-skills` suffixes) and rely on Strategy 2 (mode of per-entry
 * tags). Centralized here so plan + tests share the same constant.
 */
export declare const LOCAL_INVENTORY_PACK_NAME = "local-inventory";
/**
 * Normalize an identifier for case-insensitive equality. Mirrors the
 * normalization OverlapDetector applies for exact-match comparisons
 * (`OverlapDetector.ts:180-183`).
 */
export declare function normalizeIdentifier(id: string): string;
/**
 * Group entries by normalized `identifier`. Returns a Map keyed by the
 * normalized form so callers can find sets-of-2-or-more in O(n).
 */
export declare function groupByIdentifier(entries: ReadonlyArray<InventoryEntry>): Map<string, InventoryEntry[]>;
/**
 * Detect exact-name collisions across the inventory.
 *
 * A collision is two or more entries that share the same normalized
 * `identifier` (case-insensitive, trimmed). Severity is always `error`.
 *
 * Pure O(n) — single Map pass over the input. Each returned flag carries
 * a `collisionId` derived via `deriveCollisionId(auditId, entries)` so
 * Wave 2's ledger can look it up by id.
 */
export declare function detectExactCollisions(inventory: ReadonlyArray<InventoryEntry>, auditId: string): ExactCollisionFlag[];
/**
 * Detect generic-trigger-word flags across the local inventory.
 *
 * Wraps {@link detectGenericTriggerWords} (the existing skill-pack-audit
 * helper) and adapts the per-skill flag shape to this audit's
 * {@link GenericTokenFlag}. Severity is always `warning` here — even
 * skill-name hits, which the pack helper raises as `error`, are demoted
 * to `warning` because the inventory audit is detection-only and the
 * user's existing local install is grandfathered in (rename is opt-in
 * via Wave 2's apply path).
 *
 * `packDomain` is computed once over the entire inventory using
 * {@link derivePackDomain} with a stable sentinel pack name; Strategy 2
 * (mode-of-tags) is the load-bearing branch since the user's inventory
 * has no single pack name. The same `packDomain` is then passed into
 * every per-entry call, so suggestions like `${packDomain}-${token}`
 * are consistent across the report.
 */
export declare function detectGenericTokenFlags(inventory: ReadonlyArray<InventoryEntry>, auditId: AuditId): GenericTokenFlag[];
//# sourceMappingURL=collision-detector.helpers.d.ts.map