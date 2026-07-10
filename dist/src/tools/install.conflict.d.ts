/**
 * @fileoverview Conflict Resolution Logic for Skill Installation
 * @module @skillsmith/mcp-server/tools/install.conflict
 * @see SMI-1867
 *
 * Extracted from install.ts per governance code review (file size > 500 lines)
 */
import type { SkillManifest } from './install.types.js';
import type { ConflictAction, InstallResult } from './install.types.js';
/**
 * Result of conflict detection check
 */
export interface ConflictCheckResult {
    /** Whether to proceed with installation */
    shouldProceed: boolean;
    /** Path to backup if created */
    backupPath?: string;
    /** Early return result if installation should stop */
    earlyReturn?: InstallResult;
}
/**
 * Check for conflicts when reinstalling a skill with modifications
 *
 * @param skillName - Name of the skill being installed
 * @param installPath - Path where skill is/will be installed
 * @param manifest - Current skill manifest
 * @param conflictAction - User's chosen action (or undefined)
 * @param skillId - Skill ID for result
 * @returns ConflictCheckResult indicating how to proceed
 */
export declare function checkForConflicts(skillName: string, installPath: string, manifest: SkillManifest, conflictAction: ConflictAction | undefined, skillId: string): Promise<ConflictCheckResult>;
/**
 * Result of merge operation
 */
export interface MergeOperationResult {
    /** Whether to proceed with normal installation */
    shouldProceed: boolean;
    /** Modified content after merge (if successful clean merge) */
    mergedContent?: string;
    /** Path to backup if created */
    backupPath?: string;
    /** Early return result if installation should stop */
    earlyReturn?: InstallResult;
}
/**
 * Handle merge action for conflict resolution
 *
 * @param skillName - Name of the skill
 * @param installPath - Installation path
 * @param upstreamContent - Content fetched from upstream
 * @param manifest - Current manifest
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param skillId - Skill ID for result
 * @returns MergeOperationResult indicating how to proceed
 */
export declare function handleMergeAction(skillName: string, installPath: string, upstreamContent: string, manifest: SkillManifest, owner: string, repo: string, skillId: string): Promise<MergeOperationResult>;
//# sourceMappingURL=install.conflict.d.ts.map