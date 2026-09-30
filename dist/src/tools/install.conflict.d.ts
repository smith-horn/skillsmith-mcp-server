/**
 * @fileoverview Conflict Resolution Logic for Skill Installation
 * @module @skillsmith/mcp-server/tools/install.conflict
 * @see SMI-1867
 *
 * Extracted from install.ts per governance code review (file size > 500 lines)
 */
import type { ClientId } from '@skillsmith/core/install';
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
 * @param client - SMI-6358: which client's entry to key on
 *   (manifestKeyFor(skillName, client)) — a bare-name lookup silently reads
 *   the canonical client's entry (or nothing) for a non-canonical install,
 *   the same class of bug fixed for pin/unpin/backfill. install.ts's caller
 *   already resolves this identically for its own pre-flight lookup.
 * @returns ConflictCheckResult indicating how to proceed
 */
export declare function checkForConflicts(skillName: string, installPath: string, manifest: SkillManifest, conflictAction: ConflictAction | undefined, skillId: string, client: ClientId): Promise<ConflictCheckResult>;
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
 * @param client - SMI-6358: see checkForConflicts()'s doc comment above.
 *   NOTE: this function is not currently called from anywhere in
 *   production (verified via repo-wide grep) — the `client` param is added
 *   for correctness/consistency with checkForConflicts() so a future caller
 *   does not inherit the same bare-key bug.
 * @returns MergeOperationResult indicating how to proceed
 */
export declare function handleMergeAction(skillName: string, installPath: string, upstreamContent: string, manifest: SkillManifest, owner: string, repo: string, skillId: string, client: ClientId): Promise<MergeOperationResult>;
//# sourceMappingURL=install.conflict.d.ts.map