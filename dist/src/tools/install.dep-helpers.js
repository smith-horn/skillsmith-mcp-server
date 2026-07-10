/**
 * @fileoverview Dependency intelligence helpers for install tool
 * @module @skillsmith/mcp-server/tools/install.dep-helpers
 * @see SMI-3137: Wave 4 — Surface dependency intelligence in MCP responses
 *
 * Extracts and persists dependency data after successful skill installation.
 * Kept in a companion file to avoid pushing install.ts over the 500-line limit.
 */
import { extractMcpReferences, mergeDependencies, } from '@skillsmith/core';
/**
 * Extract dependency intelligence from skill content after successful install.
 *
 * @param skillMdContent - Raw SKILL.md content
 * @param metadata - Parsed frontmatter metadata (null if parsing failed)
 * @returns Dependency intelligence data to include in install response
 */
export function extractDepIntel(skillMdContent, metadata) {
    const mcpResult = extractMcpReferences(skillMdContent);
    // Parse declared deps from metadata if present
    const declared = metadata?.dependencies ?? undefined;
    const warnings = [];
    for (const server of mcpResult.highConfidenceServers) {
        warnings.push(`MCP server '${server}' is referenced but may not be configured`);
    }
    return {
        dep_inferred_servers: mcpResult.servers,
        dep_declared: declared,
        dep_warnings: warnings,
    };
}
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
export function persistDependencies(repo, skillId, content, declared) {
    const mcpResult = extractMcpReferences(content);
    const merged = mergeDependencies(declared, mcpResult);
    if (merged.length === 0)
        return;
    // Convert MergedDependency[] to SkillDependencyRow[] for the repository
    const rows = merged.map((dep) => ({
        skill_id: skillId,
        dep_type: dep.depType,
        dep_target: dep.depTarget,
        dep_version: dep.depVersion,
        dep_source: dep.depSource,
        confidence: dep.confidence,
        metadata: dep.metadata,
    }));
    // Group by source for setDependencies calls (each call stamps a single source)
    const bySource = new Map();
    for (const row of rows) {
        const existing = bySource.get(row.dep_source) ?? [];
        existing.push(row);
        bySource.set(row.dep_source, existing);
    }
    for (const [source, sourceRows] of bySource) {
        repo.setDependencies(skillId, sourceRows, source);
    }
}
//# sourceMappingURL=install.dep-helpers.js.map