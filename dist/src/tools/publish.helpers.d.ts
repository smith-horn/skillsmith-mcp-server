/**
 * Publish Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/publish.helpers
 * @see SMI-2440: MCP Publish Tool
 */
import type { PreflightResult, ReferenceWarning } from './publish.types.js';
/**
 * Validate skill path is safe (no path traversal, no shell metacharacters)
 */
export declare function validateSkillPath(skillPath: string): string | null;
/**
 * Pre-flight check for GitHub CLI availability and authentication
 */
export declare function checkGhPreflight(): PreflightResult;
/**
 * Generate SHA256 checksum of file content
 */
export declare function generateChecksum(content: string): string;
/**
 * Scan skill directory for project-specific references
 * Max 20 .md files to prevent hangs on large repos
 */
export declare function scanReferences(dirPath: string, customPatterns?: string[]): Promise<ReferenceWarning[]>;
/**
 * Write publish manifest to skill directory
 */
export declare function writeManifest(dirPath: string, manifest: Record<string, unknown>): Promise<string>;
/**
 * Create GitHub repository using gh CLI
 * Only call if pre-flight check passed
 */
export declare function createGitHubRepo(name: string, visibility: 'public' | 'private'): string | null;
/**
 * Add claude-skill topic to GitHub repo
 */
export declare function addClaudeSkillTopic(repoName: string): boolean;
/**
 * Format publish results for display
 */
export declare function formatPublishResults(success: boolean, metadata: {
    name: string;
    version: string;
    checksum: string;
    trustTier: string;
} | null, referenceWarnings: ReferenceWarning[], nextSteps: string[], repoUrl?: string, error?: string): string;
//# sourceMappingURL=publish.helpers.d.ts.map