/**
 * @fileoverview Frontmatter-rewrite helpers for the rename engine
 *               (SMI-4588 Wave 2 Step 3, PR #2).
 * @module @skillsmith/mcp-server/audit/rename-engine.helpers
 *
 * **Frontmatter rewrite only.** Backup is owned by the canonical
 * `createSkillBackup` helper at `tools/install.conflict-helpers.ts`; the
 * caller (`rename-engine.ts`) invokes it BEFORE delegating frontmatter work
 * here. Plan §1 Edit 4 rule is binding — do NOT add a backup writer to this
 * file.
 *
 * The rewrite uses careful line-replacement of the `name:` field rather
 * than a full YAML re-emit. This preserves comments, block-scalar shapes,
 * and formatting nuances that a re-emit would lose. Round-trip parsing via
 * `parseYamlFrontmatter` validates the rewrite before returning.
 *
 * Plan: docs/internal/implementation/smi-4588-rename-engine-ledger-install.md §1.
 */
/**
 * Frontmatter rewrite errors. Discriminated by `kind` so callers can
 * handle each case without parsing strings.
 */
export type FrontmatterRewriteError = {
    kind: 'no_frontmatter';
    message: string;
} | {
    kind: 'no_name_field';
    message: string;
} | {
    kind: 'multiple_name_fields';
    message: string;
} | {
    kind: 'verification_failed';
    message: string;
};
export type FrontmatterRewriteResult = {
    ok: true;
    content: string;
} | {
    ok: false;
    error: FrontmatterRewriteError;
};
/**
 * Rewrite the YAML `name:` field in a SKILL.md frontmatter block,
 * preserving comments, block-scalar/array shapes, and surrounding lines.
 *
 * Constraints:
 *
 * - The `name:` field MUST appear exactly once at the top level of the
 *   frontmatter. Multiple matches return `multiple_name_fields` (signals
 *   either a malformed file or a nested mapping the simple line-replace
 *   strategy can't safely handle).
 * - Quoted values (`name: "old"` / `name: 'old'`) are preserved with their
 *   original quote style.
 * - Inline comments (`name: old  # comment`) are preserved.
 * - Round-trip verified via `parseYamlFrontmatter` post-rewrite.
 *
 * The rewrite is careful by design — re-emitting via a YAML library would
 * destroy comments, alter block-scalar markers, and inflate the diff
 * surface for review.
 */
export declare function rewriteFrontmatterName(skillMd: string, newName: string): FrontmatterRewriteResult;
//# sourceMappingURL=rename-engine.helpers.d.ts.map