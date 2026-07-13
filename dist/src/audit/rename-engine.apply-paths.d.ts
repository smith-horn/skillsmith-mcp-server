/**
 * @fileoverview Apply-path helpers for the rename engine
 *               (SMI-4588 Wave 2 Step 4, PR #2).
 * @module @skillsmith/mcp-server/audit/rename-engine.apply-paths
 *
 * Path computation, backup orchestration, and summary formatting helpers
 * extracted from `rename-engine.ts` to keep the main file <500 LOC per
 * CLAUDE.md file-size enforcement (Edit 4 / SMI-1865 governance).
 *
 * **No backup writer here either** — the canonical `createSkillBackup`
 * lives in `tools/install.conflict-helpers.ts`; this file orchestrates
 * single-file staging so that helper can copy a directory worth of one
 * file. Plan §1 Edit 4 still applies.
 */
import type { OverrideRecord } from './namespace-overrides.types.js';
import type { RenameAction, RenameError, RenameSuggestion } from './rename-engine.types.js';
/**
 * Map a `RenameAction` to the `OverrideRecord.kind` field. `command` /
 * `agent` are 1:1; `rename_skill_dir_and_frontmatter` maps to `skill`.
 */
export declare function actionToKind(action: RenameAction): OverrideRecord['kind'];
/**
 * `InventoryEntry.source_path` differs by kind (see local-inventory.ts):
 * for `skill` entries it is the `SKILL.md` FILE path, not the skill
 * directory; for `command`/`agent` entries it already is the target file.
 * Every rename/backup operation needs the actual on-disk thing being
 * renamed — resolve that once here instead of re-deriving it ad hoc at
 * each call site (that duplication is exactly how this bug happened:
 * multiple sites assumed `source_path` was already the skill directory).
 */
export declare function resolveRenameTarget(suggestion: RenameSuggestion): string;
/**
 * Compute the destination path on disk for a rename. For command/agent
 * files, swap the basename (sans `.md`) with `newName.md`. For skill
 * directories, rename the directory itself (a sibling of the current one).
 */
export declare function computeDestPath(suggestion: RenameSuggestion, newName: string): string;
/**
 * `entry.meta?.author` may carry a slug like `anthropic` or a Skillsmith
 * manifest skillId like `anthropic/code-helper`. The latter is what the
 * ledger persists as `skillId`; the former is `null`. Heuristic: contains
 * `/` ⇒ skillId.
 */
export declare function deriveSkillId(suggestion: RenameSuggestion): string | null;
export declare function fsErr(reason: string): RenameError;
export declare function pathExists(target: string): Promise<boolean>;
/**
 * Run a backup before any on-disk mutation. Returns the backup directory
 * path on success; throws on failure. The error path is wrapped in a
 * typed `RenameError` by the caller.
 *
 * Backup naming: `<getBackupsDir()>/<skillName>/<timestamp>_namespace-rename/`
 * via the canonical helper (plan §1 Edit 4).
 */
export declare function runBackup(suggestion: RenameSuggestion): Promise<string>;
/**
 * Build the inline revert summary (decision #10):
 *   `"Renamed /<OLD> → /<NEW>. To undo: sklx audit revert <auditId>"`
 *
 * For skill renames (no leading `/`), the summary still uses the `/`
 * prefix per the plan's literal text — agents render it as-is.
 */
export declare function buildSummary(oldIdentifier: string, newIdentifier: string, auditId: string, action: 'apply' | 'revert'): string;
//# sourceMappingURL=rename-engine.apply-paths.d.ts.map