/**
 * @fileoverview `undo_apply` MCP tool (SMI-5456 Wave 1 Step 3 / SMI-5470).
 * @module @skillsmith/mcp-server/tools/undo-apply
 *
 * Session-scoped undo for the apply-family tools (PRD §7 trust loop /
 * §10 exclusion 9 — the one new tool the "no agent-only MCP tools" rule
 * deliberately excepts). "Session-scoped" means: only applies made by THIS
 * running MCP server process are undoable — see `apply-session.helpers.ts`
 * for the in-process stack this tool reads from and mutates.
 *
 * Restore procedure per changeset, most-recent-first:
 *   1. Scope fence — the target must resolve (post-symlink) under the
 *      user's home directory, reusing the SMI-4287 root-confinement helper
 *      (`resolveSafeRealpath`). Test isolation is an explicit opt-in seam
 *      (`UNDO_SCOPE_TEST_ROOT_ENV_VAR`, unset in every real deployment) —
 *      NOT a blanket `os.tmpdir()` carve-out on the production fence. See
 *      that constant's doc comment for the SMI-4691 precedent this mirrors.
 *   2. Never-clobber guard — the target's CURRENT content hash must match
 *      the journaled `after_hash`. A mismatch means the file changed since
 *      the apply (a user edit, or something else entirely) and undo refuses
 *      rather than overwriting it.
 *   3. Backup-integrity guard — the backup file's content hash must match
 *      the journaled `before_hash` BEFORE anything is written, so a
 *      corrupt/mismatched backup is caught before it can clobber the
 *      target (not just after).
 *   4. Atomic write — `<target>.<random>.undo-tmp` + `fs.rename`.
 *   5. Journal an `'undo'` record and drop the changeset from the session
 *      stack (only on success — a refused undo leaves the stack untouched
 *      so a retry after e.g. restoring the backup file can still work).
 */
import { z } from 'zod';
import type { UndoApplyResponse } from './undo-apply.types.js';
export declare const undoApplyInputSchema: z.ZodEffects<z.ZodObject<{
    count: z.ZodOptional<z.ZodNumber>;
    suggestion_id: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    count?: number | undefined;
    suggestion_id?: string | undefined;
}, {
    count?: number | undefined;
    suggestion_id?: string | undefined;
}>, {
    count?: number | undefined;
    suggestion_id?: string | undefined;
}, {
    count?: number | undefined;
    suggestion_id?: string | undefined;
}>;
/**
 * MCP tool schema for `undo_apply`. Hand-written JSON Schema mirroring
 * {@link undoApplyInputSchema} so the tool is client-discoverable via
 * ListTools. Keep in sync with the Zod schema.
 */
export declare const undoApplyToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            count: {
                type: string;
                description: string;
            };
            suggestion_id: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
/**
 * Test-only additional confinement root, honored ONLY when explicitly set.
 * Mirrors `SKILLSMITH_CACHE_DIR_OVERRIDE` (SMI-4691, `@skillsmith/core`'s
 * `config/index.ts`) and this same commit's `SKILLSMITH_JOURNAL_DIR`
 * (`@skillsmith/core/journal/path.ts`): an explicit opt-in env-var test
 * seam, not a blanket `os.tmpdir()` carve-out baked into the production
 * scope fence. `os.tmpdir()` (e.g. `/tmp`) is a shared, often
 * world-writable directory on multi-user systems — accepting it
 * unconditionally as a valid undo-restore root would have widened the
 * SMI-4287 fence for every real deployment, not just tests, for a
 * marginal test-isolation gain that `process.env.HOME` mutation already
 * covers on every platform this tool actually ships on (Docker/Linux —
 * see `getConfigDir()`'s doc comment for the macOS `os.homedir()` caveat
 * this constant exists to route around on the rare host-side run).
 * Unset (and therefore inert) in every real deployment.
 */
export declare const UNDO_SCOPE_TEST_ROOT_ENV_VAR = "SKILLSMITH_UNDO_SCOPE_TEST_ROOT";
export declare const undoApply: (input: unknown) => Promise<UndoApplyResponse>;
//# sourceMappingURL=undo-apply.d.ts.map