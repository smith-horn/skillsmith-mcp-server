/**
 * @fileoverview Rename engine — applies confirmed namespace renames
 *               (SMI-4588 Wave 2 Step 4, PR #2).
 * @module @skillsmith/mcp-server/audit/rename-engine
 *
 * Three apply paths, gated on `RenameAction`:
 *
 * - `rename_command_file` — `~/.claude/commands/foo.md` → `<author>-foo.md`
 * - `rename_agent_file` — `~/.claude/agents/foo.md` → `<author>-foo.md`
 * - `rename_skill_dir_and_frontmatter` — rename the directory AND rewrite
 *   the SKILL.md `name:` frontmatter field.
 *
 * Plus `action: 'revert'` semantics: looks up the ledger entry by
 * `auditId`, performs the inverse rename (back to `originalIdentifier`),
 * removes the ledger entry, and restores the SKILL.md frontmatter.
 *
 * Backups are owned by the canonical `createSkillBackup` helper at
 * `tools/install.conflict-helpers.ts:87` (plan §1 Edit 4). Single-file
 * renames stage the file under a tmp directory so the helper (which
 * expects a source dir) backs up only the relevant file. Backups land in
 * `~/.claude/skills/.backups/<name>/<timestamp>_namespace-rename/`.
 *
 * Idempotency: before mutating, the engine consults the namespace-overrides
 * ledger. When the same `(skillId, originalIdentifier)` pair is already
 * in the ledger AND the on-disk filename matches the recorded
 * `renamedTo`, the call is a no-op (returns success with
 * `fromPath === toPath` and `backupPath === ''`).
 *
 * Disk-vs-ledger divergence: when the ledger has an entry but the on-disk
 * filename does NOT match `renamedTo`, the engine returns
 * `namespace.ledger.disk_divergence` rather than silently re-applying.
 *
 * Plan: docs/internal/implementation/smi-4588-rename-engine-ledger-install.md §1.
 */
import { getBackupsDir } from '../tools/install.conflict-helpers.js';
import type { ApplyRenameRequest, ApplyRenameResult } from './rename-engine.types.js';
export { generateSuggestionChain } from './suggestion-chain.js';
/**
 * Public summary prefix used by the agent / CLI to detect inline revert
 * messages. Matches plan §1 decision #10 verbatim.
 */
export declare const REVERT_SUMMARY_PREFIX = "Renamed";
/**
 * Apply (or revert) a rename. Single entrypoint for Wave 4's MCP tool.
 * Each apply path runs: idempotency check → backup → mutate → ledger
 * append → result. Revert: ledger lookup → inverse rename → ledger
 * remove → result.
 *
 * Idempotency contract: re-applying the same suggestion when the ledger
 * already records it AND on-disk state matches → returns success with
 * `fromPath === toPath` and `backupPath === ''` (no second backup).
 *
 * Disk-vs-ledger divergence: ledger entry exists but on-disk path does
 * NOT match `renamedTo` → `namespace.ledger.disk_divergence` error;
 * caller decides whether to `customName` over the divergence.
 */
export declare function applyRename(input: ApplyRenameRequest): Promise<ApplyRenameResult>;
export { getBackupsDir };
//# sourceMappingURL=rename-engine.d.ts.map