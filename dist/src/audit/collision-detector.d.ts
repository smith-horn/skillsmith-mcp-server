/**
 * @fileoverview Three-pass collision detector for the consumer namespace
 *               audit. Wave 1 PR1+PR2 ship the exact + generic passes;
 *               PR #3 wires the semantic pass (gated by audit_mode) +
 *               unmanaged-skill bootstrap + audit-mode resolver dispatch.
 * @module @skillsmith/mcp-server/audit/collision-detector
 * @see SMI-4587
 *
 * The detector is detection-only — file mutation lives in Wave 2's
 * rename engine. Each pass is independently invocable for testing.
 *
 * Audit-mode dispatch (plan §6b):
 *   - 'off'                        -> short-circuit, empty result, no telemetry
 *   - 'preventative'               -> exact + generic only (no embedding service)
 *   - 'power_user' / 'governance'  -> + semantic-overlap pass via OverlapDetector
 *
 * Latency invariant (plan §426): in `preventative` mode the
 * `OverlapDetector` is **not instantiated** and `EmbeddingService` is
 * **not touched**. Tests assert zero invocations.
 */
import { type AuditMode } from '@skillsmith/core/config/audit-mode';
import type { Tier as AuditModeTier } from '@skillsmith/core/config/audit-mode';
import type { InventoryEntry, ScanWarning } from '../utils/local-inventory.types.js';
import type { InventoryAuditResult } from './collision-detector.types.js';
import { type BootstrapFn } from './bootstrap-unmanaged.js';
export interface DetectCollisionsOptions {
    /**
     * Pre-allocated audit id. Useful when the caller wants the id to flow
     * into telemetry / report-writer alongside the detector result.
     * Defaults to a fresh ULID.
     */
    auditId?: string;
    /**
     * Subscription tier of the caller. Drives the default audit mode via
     * {@link resolveAuditMode}. When omitted, defaults to `'community'`
     * (the cheapest fail-safe).
     */
    tier?: AuditModeTier;
    /**
     * Explicit audit-mode override (read by the caller from
     * `~/.skillsmith/config.json` `audit_mode` or `SKILLSMITH_AUDIT_MODE`).
     * When set + valid, this beats the tier default.
     */
    auditModeOverride?: AuditMode | null;
    /**
     * Bootstrap callback for unmanaged SKILL.md entries (Step 6a). Defaults
     * to a no-op until PR #4 wires the real `indexLocalSkill` core helper.
     */
    bootstrapFn?: BootstrapFn;
}
/**
 * Run the configured collision-detection passes over an inventory
 * snapshot.
 *
 * Returns an `InventoryAuditResult` whose `summary.passDurations` records
 * the wall-clock cost of each pass. The semantic pass duration is `0`
 * when the resolved audit-mode short-circuits past it (preventative /
 * off).
 */
export declare function detectCollisions(inventory: ReadonlyArray<InventoryEntry>, opts?: DetectCollisionsOptions): Promise<InventoryAuditResult>;
/**
 * Internal hook used by tests + PR #4 report writer. Returns the
 * bootstrap warnings produced by the most recent `detectCollisions`
 * call. Returns an empty array when the most recent call short-circuited
 * (`auditMode === 'off'`) or no unmanaged skills failed to bootstrap.
 */
export declare function getLastBootstrapWarnings(): ReadonlyArray<ScanWarning>;
export type { ExactCollisionFlag, GenericTokenFlag, InventoryAuditResult, SemanticCollisionFlag, } from './collision-detector.types.js';
export { detectExactCollisions, detectGenericTokenFlags } from './collision-detector.helpers.js';
export { bootstrapUnmanagedSkills, isUnmanagedSkill } from './bootstrap-unmanaged.js';
export type { BootstrapFn } from './bootstrap-unmanaged.js';
//# sourceMappingURL=collision-detector.d.ts.map