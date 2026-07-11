/**
 * @fileoverview Detector-composition helpers for `runInventoryAudit`
 *               (SMI-5536 Wave 2B split — extracted to keep
 *               `run-inventory-audit.ts` under the 500-line CI gate after
 *               wiring in the rot detector).
 * @module @skillsmith/mcp-server/audit/run-inventory-audit.detectors
 *
 * Two independent pieces of composition logic live here:
 *   1. `buildRenameSuggestions` — turn each `ExactCollisionFlag` into a
 *      `RenameSuggestion` (Wave 2 rename engine plumbing).
 *   2. `dedupeAgentPackCollisions` — self-exempt the dual-path Skillsmith
 *      Agent pack from exact-collision flags (SMI-5456 Wave 1 Step 5).
 *
 * Both are pure functions of an `InventoryAuditResult` (+ inventory, for
 * #1) — no IO beyond the content-hash read `dedupeAgentPackCollisions`
 * needs to prove dual-path identity.
 */
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { InventoryAuditResult } from './collision-detector.types.js';
import type { RenameSuggestion } from './rename-engine.types.js';
/**
 * Build a `RenameSuggestion[]` from each `ExactCollisionFlag`. We pick the
 * **most-recently-installed** entry (mtime descending) as the rename
 * target — matches plan §259 default-entry tiebreak. Falls back to the
 * first entry when mtime is missing.
 *
 * Author / packDomain are left null for v1 — chain falls through to the
 * `local-` prefix path (`local-foo`, `local-foo-<shortHash>`). Wave 4 PR 5
 * extends this with manifest lookups for richer prefixes.
 */
export declare function buildRenameSuggestions(result: InventoryAuditResult, fullInventory: ReadonlyArray<InventoryEntry>): RenameSuggestion[];
/**
 * SMI-5456 Wave 1 Step 5 (plan §6): drop an exact-collision flag when it is
 * the dual-path Skillsmith Agent pack colliding with itself.
 *
 * Dedupe key is name+content-hash, NOT name alone: a flag is dropped only
 * when EVERY entry in it is `kind: 'skill'`, has `identifier ===
 * AGENT_PACK_SKILL_NAME` ('skillsmith-agent'), AND shares an identical
 * SHA-256 of its `source_path` file content. The content-hash check is the
 * load-bearing part — a namespace-squatting skill hand-named
 * "skillsmith-agent" with DIFFERENT content must still be flagged (that is
 * exactly the collision detector's job); only a genuine byte-identical
 * dual-path copy (which the installer guarantees per-release, per
 * `AgentInstallResult` P-5 "Dual-path pack copies" invariant) is self-exempt.
 *
 * A read/hash failure on any entry (e.g. a symlink race) is treated as
 * "cannot prove identity" — the flag is KEPT (fail toward showing the
 * finding, never toward silently hiding a real collision).
 *
 * Exported (not just used internally) so it is directly unit-testable
 * without invoking the full `runInventoryAudit` pipeline, which writes to
 * the real `~/.skillsmith/audits/` (no test-isolation override exists for
 * that path today — see `run-inventory-audit.dedup.test.ts`'s header).
 */
export declare function dedupeAgentPackCollisions(result: InventoryAuditResult): InventoryAuditResult;
//# sourceMappingURL=run-inventory-audit.detectors.d.ts.map