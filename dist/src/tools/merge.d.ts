/**
 * @fileoverview Three-Way Merge Algorithm for Skill Update Conflict Resolution
 * @module @skillsmith/mcp-server/tools/merge
 * @see SMI-1866
 *
 * Uses LCS-based diff3 algorithm for accurate conflict detection.
 * Handles insertions and deletions properly without false positives.
 */
import type { MergeResult } from './install.types.js';
/**
 * Result of computing a diff between two text contents
 */
export interface DiffResult {
    /** Line numbers that were added (1-indexed) */
    additions: number[];
    /** Line numbers that were deleted (1-indexed) */
    deletions: number[];
    /** Line numbers that remained unchanged (1-indexed) */
    unchanged: number[];
}
/**
 * Compute a line-by-line diff between base and target content
 * Uses LCS for accurate change detection
 *
 * @param base - The original/base content
 * @param target - The modified content to compare against
 * @returns DiffResult with line numbers for additions, deletions, and unchanged
 */
export declare function computeDiff(base: string, target: string): DiffResult;
/**
 * Perform a three-way merge between base, local, and upstream versions
 *
 * Uses LCS-based diff3 algorithm:
 * 1. Find common lines between base and each version
 * 2. Identify hunks (regions of change) for each version
 * 3. Merge hunks, detecting conflicts only when both sides modify the same region
 *
 * For conflicts, inserts standard Git-style conflict markers:
 * ```
 * <<<<<<< LOCAL
 * {local content}
 * =======
 * {upstream content}
 * >>>>>>> UPSTREAM
 * ```
 *
 * @param base - The common ancestor (original content at install time)
 * @param local - The user's modified version
 * @param upstream - The new version from the skill author
 * @returns MergeResult with merged content and any conflicts
 */
export declare function threeWayMerge(base: string, local: string, upstream: string): MergeResult;
//# sourceMappingURL=merge.d.ts.map