/**
 * @fileoverview Semantic-overlap pass for SMI-4587 Wave 1 Step 6.
 * @module @skillsmith/mcp-server/audit/collision-detector.semantic.helpers
 *
 * Wraps the existing {@link OverlapDetector} from `@skillsmith/core` and
 * adapts inventory entries to the `TriggerPhraseSkill` shape it expects.
 *
 * Latency invariant: this module is **only imported and exercised** when
 * the resolved audit-mode is `power_user` or `governance`. In
 * `preventative` mode the orchestrator skips this path entirely and
 * therefore never instantiates `EmbeddingService` (the load-bearing
 * 5 ms p95 invariant for the cheap mode).
 *
 * Intentional design: the orchestrator constructs `OverlapDetector` once
 * per audit run and disposes it via `close()` after this helper returns.
 * That keeps ONNX model lifetime bounded and avoids two concurrent model
 * instances on memory-constrained machines (per plan §430).
 */
import type { OverlapDetector, TriggerPhraseSkill } from '@skillsmith/core';
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { AuditId, ExactCollisionFlag, SemanticCollisionFlag } from './collision-detector.types.js';
/**
 * Adapt an {@link InventoryEntry} to the `TriggerPhraseSkill` shape that
 * `OverlapDetector` expects. Uses `source_path` as the stable id so we
 * can map detector results back to the originating inventory entries
 * via a Map keyed off `source_path`.
 *
 * Empty `triggerSurface[]` -> the entry is filtered out upstream because
 * `OverlapDetector.detectOverlap` would produce a 0-overlap result anyway
 * and the iteration cost (O(n^2)) isn't free.
 */
export declare function inventoryToTriggerPhraseSkill(entry: InventoryEntry): TriggerPhraseSkill;
/**
 * Run the semantic-overlap pass over the inventory.
 *
 * Steps:
 *   1. Build an O(1) lookup from `source_path` -> `InventoryEntry`.
 *   2. Adapt entries with non-empty `triggerSurface[]` to
 *      `TriggerPhraseSkill[]`.
 *   3. Call `OverlapDetector.findAllOverlaps` once.
 *   4. Map each non-zero overlap result back to a `SemanticCollisionFlag`,
 *      skipping pairs already flagged by the exact pass.
 *
 * Disposal of the `OverlapDetector` is the **caller's** responsibility
 * — the orchestrator does it after this function returns so it can
 * also be skipped on the cheap path without double-construction.
 */
export declare function detectSemanticCollisions(inventory: ReadonlyArray<InventoryEntry>, exactCollisions: ReadonlyArray<ExactCollisionFlag>, auditId: AuditId, detector: OverlapDetector): Promise<SemanticCollisionFlag[]>;
//# sourceMappingURL=collision-detector.semantic.helpers.d.ts.map