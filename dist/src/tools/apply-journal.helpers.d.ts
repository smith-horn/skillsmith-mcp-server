/**
 * @fileoverview Shared journal-write + session-apply-registration path for
 *               the apply-family tools (SMI-5456 Wave 1 Step 3 / SMI-5470).
 * @module @skillsmith/mcp-server/tools/apply-journal.helpers
 *
 * `apply_namespace_rename` and `apply_recommended_edit` both call
 * `journalApplySuccess` / `journalApplyError` at their mutation boundary
 * instead of talking to `@skillsmith/core/journal` directly — this keeps
 * the hashing + backup-file-resolution logic in one place instead of
 * duplicated across two tool files.
 *
 * `target_path` scope decision (also documented on
 * `JournalRecordFields.target_path` in `@skillsmith/core/journal`): for a
 * skill-DIRECTORY rename (`rename_skill_dir_and_frontmatter`), the journal
 * records `<newSkillDir>/SKILL.md`, not the directory. A directory has no
 * single "content hash", and the directory-path-reversal half of that
 * mutation already has a dedicated, ledger-backed mechanism
 * (`rename-engine.ts`'s `action: 'revert'`, surfaced today via
 * `apply_namespace_rename`'s `action: 'revert'` — SMI-5671; the CLI's
 * `sklx audit revert` this comment previously cited was never
 * implemented). Duplicating path-reversal here — driven only by
 * this record's fixed `target_path` field, with no companion "restore to"
 * field in the schema — would create two independent undo mechanisms for
 * the same mutation with no shared source of truth, which is precisely the
 * kind of coordination hazard the P-5 single-writer invariant exists to
 * avoid. `undo_apply` therefore restores SKILL.md's CONTENT (reverting the
 * frontmatter rewrite) but does not rename the directory back; full-path
 * reversal for a skill-dir rename remains `apply_namespace_rename`'s
 * `action: 'revert'`'s job.
 *
 * Fail-soft by design: the file mutation the user asked for has already
 * succeeded (or definitively failed) by the time these helpers run. A
 * journal I/O hiccup must never turn a successful apply into a failed tool
 * response — every call here swallows its own errors and logs to stderr.
 */
export interface JournalApplySuccessInput {
    /** `'apply_namespace_rename'` | `'apply_recommended_edit'`. */
    tool: string;
    suggestionId: string;
    /** The content-hashable file the mutation changed (see module header). */
    targetPath: string;
    /** The apply tool's pre-mutation backup dir, or `''` for an idempotent
     * re-apply OR a revert — reverts never take a fresh backup (SMI-5671:
     * the original apply's backup already covers this), so `backupRef`
     * alone can't distinguish "nothing changed" from "reverted, no fresh
     * backup needed". Use `isNoOp` for that. */
    backupRef: string;
    /** Caller-supplied approval mode, e.g. `'apply'` / `'custom'` /
     * `'apply_with_confirmation'`. */
    approval: string;
    /** SMI-5671: which direction this mutation ran — `apply_namespace_rename`'s
     * `action: 'revert'` calls this same success-journaling path as
     * `apply`/`custom`, so the journal record's `action` field can no longer
     * be hardcoded to `'apply'`. */
    action: 'apply' | 'revert';
    /** SMI-5671: the engine's own idempotency signal (`fromPath === toPath`).
     * NOT the same thing as `backupRef === ''` — a genuine (non-no-op)
     * revert also has `backupRef === ''` by design, so branching on
     * `backupRef` alone would mislabel every real revert as
     * `idempotent_no_op` in the audit trail. */
    isNoOp: boolean;
}
/**
 * Journal a successful mutation and, when a restorable backup exists,
 * register it on the session-apply stack so `undo_apply` can reach it.
 */
export declare function journalApplySuccess(input: JournalApplySuccessInput): Promise<void>;
export interface JournalApplyErrorInput {
    tool: string;
    suggestionId: string;
    targetPath: string | null;
    approval: string | null;
    /** Typed error kind from the apply engine, e.g.
     * `'namespace.rename.backup_failed'`. */
    errorKind: string;
}
/** Journal a failed mutation attempt. */
export declare function journalApplyError(input: JournalApplyErrorInput): Promise<void>;
export interface JournalUndoInput {
    tool: string;
    suggestionId: string;
    targetPath: string;
    /** File content hash immediately before the undo restore ran (i.e. the
     * applied state — should equal the original apply's `after_hash`). */
    beforeHash: string;
    /** File content hash immediately after the undo restore ran (i.e. the
     * restored state — should equal the original apply's `before_hash`). */
    afterHash: string;
}
/** Journal a successful undo restore. */
export declare function journalUndo(input: JournalUndoInput): Promise<void>;
//# sourceMappingURL=apply-journal.helpers.d.ts.map