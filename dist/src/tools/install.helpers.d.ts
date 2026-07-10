/**
 * @fileoverview Install Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/install.helpers
 */
import type { ToolContext } from '../context.js';
import { parseRepoUrl, type ParsedRepoUrl } from '@skillsmith/core';
import { type SkillManifest, type ParsedSkillId, type RegistrySkillInfo } from './install.types.js';
export { parseRepoUrl, type ParsedRepoUrl };
/**
 * Acquire a file lock for manifest operations
 * SMI-1533: Prevents race conditions during concurrent installs
 */
export declare function acquireManifestLock(): Promise<void>;
/**
 * Release the manifest lock
 */
export declare function releaseManifestLock(): Promise<void>;
/**
 * Load or create manifest
 */
export declare function loadManifest(): Promise<SkillManifest>;
/**
 * Save manifest
 * SMI-1533: Uses atomic write pattern with lock
 */
export declare function saveManifest(manifest: SkillManifest): Promise<void>;
/**
 * SMI-1533: Safely update manifest with locking
 * Prevents race conditions during concurrent install operations
 */
export declare function updateManifestSafely(updateFn: (manifest: SkillManifest) => SkillManifest): Promise<void>;
/**
 * Parse skill ID or URL to get components
 * SMI-1491: Added isRegistryId flag to detect registry skill IDs vs direct GitHub URLs
 */
export declare function parseSkillId(input: string): ParsedSkillId;
/**
 * Look up skill in registry to get repo_url
 * SMI-1491: Enables install to work with registry IDs like "author/skill-name"
 *
 * Follows API-first pattern: tries live API, falls back to local DB
 */
export declare function lookupSkillFromRegistry(skillId: string, context: ToolContext): Promise<RegistrySkillInfo | null>;
/**
 * SMI-3221: Detect git-crypt encrypted content fetched from GitHub.
 * raw.githubusercontent.com serves encrypted bytes for repos using git-crypt.
 * The magic header is \x00GITCRYPT (hex 00474954435259505400).
 */
export declare function assertNotEncrypted(content: string, filePath: string): void;
/**
 * Fetch file from GitHub
 * SMI-1491: Added optional branch parameter to use branch from repo_url
 */
export declare function fetchFromGitHub(owner: string, repo: string, filePath: string, branch?: string): Promise<string>;
/** Validation result for SKILL.md */
export interface SkillMdValidation {
    valid: boolean;
    errors: string[];
}
/**
 * Validate SKILL.md content
 */
export declare function validateSkillMd(content: string): SkillMdValidation;
/**
 * Generate post-install tips
 */
export declare function generateTips(skillName: string): string[];
/**
 * SMI-1788: Optimization info type for tips generation
 * SMI-1803: Exported for external use
 */
export interface OptimizationInfoForTips {
    optimized: boolean;
    subSkills?: string[];
    subagentGenerated?: boolean;
    subagentPath?: string;
    tokenReductionPercent?: number;
    originalLines?: number;
    optimizedLines?: number;
}
/**
 * SMI-1788: Generate post-install tips with optimization info
 */
export declare function generateOptimizedTips(skillName: string, optimizationInfo: OptimizationInfoForTips, claudeMdSnippet?: string): string[];
export { hashContent, type ModificationResult, detectModifications, createSkillBackup, storeOriginal, loadOriginal, cleanupOldBackups, getBackupsDir, } from './install.conflict-helpers.js';
//# sourceMappingURL=install.helpers.d.ts.map