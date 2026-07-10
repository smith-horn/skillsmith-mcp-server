/**
 * Validate Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/validate.helpers
 */
import type { ValidationError } from './validate.types.js';
/**
 * Parse YAML frontmatter from markdown content
 */
export declare function parseYamlFrontmatter(content: string): Record<string, unknown> | null;
/**
 * Check for SSRF patterns in a URL
 */
export declare function hasSsrfPattern(url: string): boolean;
/**
 * Check for path traversal patterns
 */
export declare function hasPathTraversal(path: string): boolean;
/**
 * Validate skill metadata
 */
export declare function validateMetadata(metadata: Record<string, unknown>, strict: boolean): ValidationError[];
/**
 * Detect if a skill appears to modify CLAUDE.md files.
 * Returns warnings if the skill body contains patterns suggesting CLAUDE.md modification.
 * This is a heuristic check — false positives are possible.
 */
export declare function detectClaudeMdModification(body: string): string[];
/**
 * SMI-3137: Validate dependency declarations and detect inferred MCP dependencies.
 *
 * Checks for:
 * 1. Deprecated 'composes' field (suggest migration to dependencies.skills)
 * 2. MCP tool references in skill body (suggest declaring in dependencies.platform)
 *
 * @param metadata - Parsed frontmatter metadata (may be empty object)
 * @param body - Skill body content (markdown after frontmatter)
 * @returns Array of dependency-related validation warnings
 */
export declare function validateDependencies(metadata: Record<string, unknown>, body: string): ValidationError[];
//# sourceMappingURL=validate.helpers.d.ts.map