/**
 * @fileoverview Shared `runInventoryAudit` composition helper (SMI-4590 Wave 4 PR 4).
 * @module @skillsmith/mcp-server/audit/run-inventory-audit
 *
 * Composes Wave 1 (scan + detect + history) + Wave 2 (rename suggestions)
 * + Wave 3 (recommended edits) + Wave 4 PR 3 (exclusions filter) +
 * Wave 2B (SMI-5535 rot detection) into a single entry-point used by both
 * the `skill_inventory_audit` MCP tool (this PR) and the
 * `sklx audit collisions` CLI command (PR 5).
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §1.
 *
 * Pipeline:
 *   1. `scanLocalInventory` (Wave 1)             — scan the inventory.
 *   2. `detectCollisions`     (Wave 1)           — three-pass detector.
 *   3. Build `RenameSuggestion[]` (Wave 2 types) — one per exact collision,
 *      using `generateSuggestionChain` to pick a non-colliding name and
 *      mtime-descending tiebreak to pick which entry to rename.
 *   4. `runEditSuggester`     (Wave 3)           — recommended prose edits.
 *   5. `detectRot`            (Wave 2B, SMI-5535) — dead-ref scan over the
 *      same inventory/auditId as the collision pass (version-drift is a
 *      documented no-op scaffold — see `rot-detector.ts`'s header).
 *   6. Apply `~/.skillsmith/audit-exclusions.json` filter (Wave 4 PR 3)
 *      when `applyExclusions !== false`. Rot findings pass through the
 *      SAME filter as generic/semantic flags — an excluded entry
 *      suppresses its rot finding too.
 *   7. `writeAuditHistory`    (Wave 1)           — persist `result.json`.
 *   8. `writeAuditSuggestions` (this PR)          — persist `suggestions.json`
 *      (so PR 4's apply-tools can look up rename + edit by collisionId).
 *   9. Build + return the response shape.
 *
 * Tier defaults to `'community'` (cheapest fail-safe). Callers (the MCP
 * tool, the CLI) pass through their resolved tier; the session-start
 * audit hook (PR 6) passes the user's resolved tier from license info.
 */
import type { Tier } from '@skillsmith/core/config/audit-mode';
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { ExactCollisionFlag, GenericTokenFlag, SemanticCollisionFlag } from './collision-detector.types.js';
import type { RecommendedEdit } from './edit-suggester.types.js';
import type { RenameSuggestion } from './rename-engine.types.js';
import type { RotFinding } from './rot-detector.types.js';
import { dedupeAgentPackCollisions } from './run-inventory-audit.detectors.js';
export { dedupeAgentPackCollisions };
/**
 * Input for {@link runInventoryAudit}. All fields optional — the MCP tool
 * input schema rejects unknowns and home-dir traversal at the boundary.
 */
export interface RunInventoryAuditOptions {
    /** Gate the semantic-overlap pass (Wave 1). Defaults to `false`. */
    deep?: boolean;
    /** Override `os.homedir()`. Caller (MCP tool) Zod-validates the path. */
    homeDir?: string;
    /** Optional project CLAUDE.md to scan in addition to the user one. */
    projectDir?: string;
    /**
     * Filter collision flags whose entries match
     * `~/.skillsmith/audit-exclusions.json`. Defaults to `true`. Enterprise
     * scheduled-scan runner (PR 6) passes `false` so the governance pass
     * sees un-filtered findings for policy enforcement.
     */
    applyExclusions?: boolean;
    /**
     * Subscription tier of the caller — gates the semantic pass per the
     * audit-mode resolver. Defaults to `'community'` (preventative mode →
     * exact + generic only). The MCP tool resolves the caller tier from
     * license info before invoking; the CLI command passes through the same.
     */
    tier?: Tier;
}
/** Response shape returned to MCP / CLI callers. */
export interface RunInventoryAuditResult {
    auditId: string;
    inventory: InventoryEntry[];
    exactCollisions: ExactCollisionFlag[];
    /**
     * Wave 1's `genericFlags` (typed `GenericTokenFlag[]`). Plan §99–108
     * referenced this field as `TriggerQualityEntry[]`; the canonical Wave 1
     * type is `GenericTokenFlag`. Field name preserved per spec.
     */
    genericFlags: GenericTokenFlag[];
    semanticCollisions: SemanticCollisionFlag[];
    renameSuggestions: RenameSuggestion[];
    recommendedEdits: RecommendedEdit[];
    /** Rot findings (SMI-5535 Wave 2B) — dead-ref / version-drift signals. */
    rotFindings: RotFinding[];
    /** Absolute path to the rendered `report.md` for this audit. */
    reportPath: string;
    summary: {
        totalEntries: number;
        totalFlags: number;
        errorCount: number;
        warningCount: number;
        durationMs: number;
    };
}
/**
 * Run the full inventory audit pipeline. Single entrypoint shared by the
 * MCP `skill_inventory_audit` tool and the CLI `sklx audit collisions`
 * command.
 *
 * Stateless — every call generates a fresh `auditId` (via the detector's
 * default ULID generator) and writes the corresponding history +
 * suggestions files to `~/.skillsmith/audits/<auditId>/`.
 */
export declare function runInventoryAudit(opts?: RunInventoryAuditOptions): Promise<RunInventoryAuditResult>;
//# sourceMappingURL=run-inventory-audit.d.ts.map