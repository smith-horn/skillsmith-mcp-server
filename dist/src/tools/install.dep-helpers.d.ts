/**
 * @fileoverview Dependency intelligence helpers for install tool
 * @module @skillsmith/mcp-server/tools/install.dep-helpers
 * @see SMI-3137: Wave 4 — Surface dependency intelligence in MCP responses
 *
 * Extracts and persists dependency data after successful skill installation.
 * Kept in a companion file to avoid pushing install.ts over the 500-line limit.
 */
import { type SkillDependencyRepository, type DependencyDeclaration } from '@skillsmith/core';
/**
 * Dependency intelligence result included in the install response.
 */
export interface DepIntelResult {
    /** Inferred MCP server names from skill content */
    dep_inferred_servers: string[];
    /** Declared dependency block from frontmatter (if present) */
    dep_declared: DependencyDeclaration | undefined;
    /** Warnings about MCP servers referenced but not configured */
    dep_warnings: string[];
}
/**
 * Extract dependency intelligence from skill content after successful install.
 *
 * @param skillMdContent - Raw SKILL.md content
 * @param metadata - Parsed frontmatter metadata (null if parsing failed)
 * @returns Dependency intelligence data to include in install response
 */
export declare function extractDepIntel(skillMdContent: string, metadata: Record<string, unknown> | null): DepIntelResult;
/**
 * Persist merged dependencies (declared + inferred) to the database.
 *
 * Best-effort: silently returns if the skill_dependencies table does not
 * exist (pre-migration databases).
 *
 * @param repo - SkillDependencyRepository instance
 * @param skillId - Skill ID to associate dependencies with
 * @param content - Raw SKILL.md content for MCP reference extraction
 * @param declared - Parsed dependency declaration from frontmatter
 */
export declare function persistDependencies(repo: SkillDependencyRepository, skillId: string, content: string, declared: DependencyDeclaration | undefined): void;
//# sourceMappingURL=install.dep-helpers.d.ts.map