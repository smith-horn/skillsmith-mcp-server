/**
 * @fileoverview Conflict Resolution Helper Functions for Skill Updates
 * @module @skillsmith/mcp-server/tools/install.conflict-helpers
 * @see SMI-1865
 *
 * Split from install.helpers.ts per governance code review (file size > 500 lines)
 */
/**
 * SMI-1865: Get base directory for skill backups.
 *
 * Uses a function instead of constant to support HOME overrides in tests.
 * SMI-4578: routes through canonical install path so default-client
 * backup directory follows the central path table.
 */
export declare function getBackupsDir(): string;
/**
 * SMI-1865: Compute SHA-256 hash of content for modification detection
 */
export declare function hashContent(content: string): string;
/**
 * SMI-1865: Result of modification detection
 */
export interface ModificationResult {
    /** Whether the file has been modified since installation */
    modified: boolean;
    /** SHA-256 hash of the current content */
    currentHash: string;
    /** SHA-256 hash of the original content at install time */
    originalHash: string;
}
/**
 * SMI-1865: Detect if a skill has been modified since installation
 * @param installPath - Path to the installed skill directory
 * @param originalHash - SHA-256 hash of the original SKILL.md at install time
 * @returns ModificationResult indicating if the skill has been modified
 */
export declare function detectModifications(installPath: string, originalHash: string): Promise<ModificationResult>;
/**
 * SMI-1865: Create a timestamped backup of a skill before update
 * @param skillName - Name of the skill (used for directory naming)
 * @param installPath - Current install path of the skill
 * @param reason - Reason for creating the backup (e.g., 'pre-update', 'conflict')
 * @returns Path to the created backup directory
 */
export declare function createSkillBackup(skillName: string, installPath: string, reason: string): Promise<string>;
/**
 * SMI-4589 Wave 3: Create a timestamped backup of a single prose file before
 * an edit-applier mutation (CLAUDE.md or SKILL.md). Reuses `getBackupsDir()`
 * for path resolution to keep prose backups co-located with skill backups
 * and inside the canonical install root — `audit-history.ts`'s 30-day GC
 * sweep covers this directory tree without further configuration.
 *
 * Path shape (decision #10): `<getBackupsDir()>/<basename(filePath)>/<timestamp>_<reason>/<basename(filePath)>`.
 * The leading `<basename>` segment groups all prose backups for the same
 * file alongside whichever skill or CLAUDE.md the file lives in; the inner
 * `<basename>` mirrors `createSkillBackup`'s shape so `cleanupOldBackups`
 * walks both surfaces uniformly.
 *
 * Failure mode: throws `Error` on any I/O failure. The caller
 * (`applyRecommendedEdit`) maps the throw to `error: 'edit.backup_failed'`
 * so the file-mutation step never runs without a valid backup.
 *
 * @param filePath - Absolute path to the prose file (e.g. SKILL.md, CLAUDE.md)
 * @param reason - Reason for the backup (canonical: `'prose-edit'`)
 * @returns `{ backupPath }` — absolute path to the created backup directory
 */
export declare function createProseBackup(filePath: string, reason: string): Promise<{
    backupPath: string;
}>;
/**
 * SMI-1865: Store the original content of a skill at install time
 * Used for three-way merge during conflict resolution
 * @param skillName - Name of the skill
 * @param content - Original SKILL.md content
 * @param metadata - Additional metadata to store (version, source, etc.)
 */
export declare function storeOriginal(skillName: string, content: string, metadata: Record<string, unknown>): Promise<void>;
/**
 * SMI-1865: Load the original SKILL.md content stored at install time
 * @param skillName - Name of the skill
 * @returns Original content, or null if not found
 */
export declare function loadOriginal(skillName: string): Promise<string | null>;
/**
 * SMI-1865: Clean up old backups, keeping only the most recent ones
 * Never deletes the .original directory
 * @param skillName - Name of the skill
 * @param keepCount - Number of most recent backups to keep (default: 3)
 */
export declare function cleanupOldBackups(skillName: string, keepCount?: number): Promise<void>;
//# sourceMappingURL=install.conflict-helpers.d.ts.map