/**
 * @fileoverview Shared `runInventoryAudit` composition helper (SMI-4590 Wave 4 PR 4).
 * @module @skillsmith/mcp-server/audit/run-inventory-audit
 *
 * Composes Wave 1 (scan + detect + history) + Wave 2 (rename suggestions)
 * + Wave 3 (recommended edits) + Wave 4 PR 3 (exclusions filter) into a
 * single entry-point used by both the `skill_inventory_audit` MCP tool
 * (this PR) and the `sklx audit collisions` CLI command (PR 5).
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
 *   5. Apply `~/.skillsmith/audit-exclusions.json` filter (Wave 4 PR 3)
 *      when `applyExclusions !== false`.
 *   6. `writeAuditHistory`    (Wave 1)           — persist `result.json`.
 *   7. `writeAuditSuggestions` (this PR)          — persist `suggestions.json`
 *      (so PR 4's apply-tools can look up rename + edit by collisionId).
 *   8. Build + return the response shape.
 *
 * Tier defaults to `'community'` (cheapest fail-safe). Callers (the MCP
 * tool, the CLI) pass through their resolved tier; the session-start
 * audit hook (PR 6) passes the user's resolved tier from license info.
 */
import type { Tier } from '@skillsmith/core/config/audit-mode';
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { ExactCollisionFlag, GenericTokenFlag, InventoryAuditResult, SemanticCollisionFlag } from './collision-detector.types.js';
import type { RecommendedEdit } from './edit-suggester.types.js';
import type { RenameSuggestion } from './rename-engine.types.js';
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
//# sourceMappingURL=run-inventory-audit.d.ts.map