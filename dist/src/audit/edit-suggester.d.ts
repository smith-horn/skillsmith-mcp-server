/**
 * @fileoverview Edit-suggester core (SMI-4589 Wave 3 Steps 2-3).
 * @module @skillsmith/mcp-server/audit/edit-suggester
 *
 * Takes the semantic-collision flags from Wave 1's `InventoryAuditResult`
 * and produces `RecommendedEdit[]` — templated, deterministic prose-edit
 * suggestions. No LLM calls. No fuzziness.
 *
 * Per-template gate (ratified 2026-05-01): v1 ships only
 * `add_domain_qualifier` (4.10/5 from GPT-5.4 reviewer-#2 scoring). The
 * other two templates (`narrow_scope` 1.70/5, `reword_trigger_verb`
 * 2.35/5) FAILED the gate and are NOT shipped in any form — neither as
 * auto-apply nor as `manual_review`. They route to SMI-4593 for
 * reauthoring. Test cases 2-3 in `edit-suggester.test.ts` assert empty
 * output for collisions that would have matched those failing templates,
 * guarding against accidental re-registration before the gate clears.
 *
 * Dispatch pattern (plan §1):
 *   1. Walk `result.semanticCollisions[]`, collect unique file paths
 *      across the surviving template's `applies()` checks.
 *   2. `await Promise.all(uniqueFilePaths.map(fs.readFile))` — single
 *      parallel read phase. Latency budget is linear in unique-files,
 *      not templates × collisions.
 *   3. Iterate flags; for each, walk templates pre-sorted by descending
 *      `priority`; first `applies()` true wins; `generate()` is
 *      synchronous over the cached `fileContent`.
 *   4. Filter null results (template matched but generate() couldn't
 *      synthesize a valid edit — e.g. file content drifted).
 *
 * Plan: docs/internal/implementation/smi-4589-edit-suggester.md §1, §Steps 2-3.
 */
import type { InventoryAuditResult } from './collision-detector.types.js';
import type { EditTemplate, EditTemplatePattern, RecommendedEdit } from './edit-suggester.types.js';
/**
 * Run the edit-suggester over an `InventoryAuditResult`'s semantic
 * collisions. Returns `RecommendedEdit[]` — one per flag that matches a
 * registered template AND whose template successfully synthesized a
 * non-empty edit.
 *
 * Order of returned edits: same as `result.semanticCollisions[]` input
 * order. Tests assert this stability so PR diffs in the audit-report
 * markdown are deterministic.
 *
 * I/O: reads each unique referenced file ONCE, in parallel, before
 * iterating templates. Templates see only `fileContent` strings, not
 * paths — keeps templates pure and unit-testable without fixtures on
 * disk.
 *
 * Failure model: any per-flag template error (fileRead failure, snippet
 * locate failure, `generate()` returning null) skips that flag silently.
 * The other flags still produce edits. An empty
 * `result.semanticCollisions[]` short-circuits with no I/O.
 */
export declare function runEditSuggester(result: InventoryAuditResult, opts?: {
    templateOverrides?: ReadonlyArray<EditTemplate>;
}): Promise<RecommendedEdit[]>;
/**
 * Public registry-key accessor. Re-exports the pattern strings so the
 * apply-path registry (`edit-applier.ts`) can import a single source of
 * truth instead of stringly-typed literals.
 */
export declare const V1_TEMPLATE_PATTERNS: ReadonlyArray<EditTemplatePattern>;
//# sourceMappingURL=edit-suggester.d.ts.map