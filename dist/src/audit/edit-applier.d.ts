/**
 * @fileoverview Edit-applier — file-mutation path for `RecommendedEdit` (SMI-4589 Wave 3 Step 5).
 * @module @skillsmith/mcp-server/audit/edit-applier
 *
 * `applyRecommendedEdit` mutates a SKILL.md or CLAUDE.md file in-place
 * after the per-template gate has cleared. The mutation flow:
 *
 *   1. Registry guard — reject `pattern`s not in `APPLY_TEMPLATE_REGISTRY`.
 *   2. Stale-before guard — verify file content at `lineRange` matches
 *      the recorded `before` snippet byte-for-byte.
 *   3. Backup — `createProseBackup(filePath, 'prose-edit')`.
 *   4. Atomic write — write to `<filePath>.tmp` then `fs.rename`.
 *   5. Ledger append — `appendOverride` + `writeLedger` (Wave 2 PR #1).
 *   6. Return `EditApplyResult` with the inline revert summary
 *      (decision #10).
 *
 * Per-template gate (ratified 2026-05-01): `APPLY_TEMPLATE_REGISTRY` is
 * a literal allowlist containing only `'add_domain_qualifier'` in v1
 * (4.10/5 from GPT-5.4 reviewer-#2 scoring). Synthetic edits with
 * `pattern: 'narrow_scope'` or `'reword_trigger_verb'` are rejected with
 * `error: 'edit.template_not_in_apply_registry'` and mutate nothing —
 * the regression guard test asserts this. SMI-4593 reauthors the failing
 * templates; when their bodies clear the per-template gate, that issue
 * extends this allowlist.
 *
 * Plan: docs/internal/implementation/smi-4589-edit-suggester.md §5.
 */
import type { EditApplyResult } from './edit-applier.types.js';
import type { EditTemplatePattern, RecommendedEdit } from './edit-suggester.types.js';
/**
 * Allowlist of template patterns whose `apply_with_confirmation` mode is
 * registered for file mutation. Per the per-template gate ratified
 * 2026-05-01, only `add_domain_qualifier` (4.10/5) ships in v1.
 *
 * SMI-4593 extends this set when the failing templates clear the gate
 * post-reauthoring. Plan §6 mandates plan-review verifies this set
 * matches `goal_6.per_template_gate.verdicts` PASS templates exactly.
 *
 * Type-narrow: declared as `ReadonlySet<EditTemplatePattern>` so the
 * runtime check can't drift from the type union.
 */
export declare const APPLY_TEMPLATE_REGISTRY: ReadonlySet<EditTemplatePattern>;
export interface ApplyRecommendedEditOptions {
    /**
     * FK into `~/.skillsmith/audits/<auditId>/result.json`. Persisted in
     * the ledger entry so revert can re-derive the original collision
     * context.
     */
    auditId: string;
    /**
     * Apply mode. Only `'apply_with_confirmation'` triggers mutation; any
     * other value is rejected by registry guard ahead of mutation. The
     * argument is preserved for forward-compat with v2 LLM-driven mode.
     */
    mode: 'apply_with_confirmation';
}
/**
 * Apply a `RecommendedEdit` to disk. The agent calls this after
 * surfacing the edit + receiving user confirmation. Atomic — failure
 * before mutation leaves the file untouched; failure during mutation
 * leaves the original file in place via tmp-file + rename semantics.
 */
export declare function applyRecommendedEdit(edit: RecommendedEdit, opts: ApplyRecommendedEditOptions): Promise<EditApplyResult>;
//# sourceMappingURL=edit-applier.d.ts.map