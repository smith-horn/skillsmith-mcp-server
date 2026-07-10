/**
 * @fileoverview Shared validation utilities for MCP tools
 * @module @skillsmith/mcp-server/utils/validation
 * @see SMI-810: Create shared validation utility
 *
 * Provides common validation functions used across MCP tools:
 * - Skill ID format validation
 * - Skill ID parsing
 * - Trust tier mapping between MCP and database types
 */
import type { TrustTier as DBTrustTier, MCPTrustTier, SkillCategory } from '@skillsmith/core';
/**
 * Validate skill ID format.
 *
 * Accepts three formats:
 * - Author/name format: `anthropic/commit`, `community/jest-helper`
 * - Source/author/name format: `github/cyanheads/git-mcp-server`, `claude-plugins/author/skill`
 * - UUID format: `550e8400-e29b-41d4-a716-446655440000`
 *
 * @param id - Skill ID to validate
 * @returns True if ID matches valid format
 *
 * @example
 * isValidSkillId('anthropic/commit') // true
 * isValidSkillId('github/cyanheads/git-mcp-server') // true
 * isValidSkillId('invalid-format') // false
 */
export declare function isValidSkillId(id: string): boolean;
/**
 * Parse a skill ID into source, author, and name components.
 *
 * Handles both 2-part (author/name) and 3-part (source/author/name) formats.
 *
 * @param id - Skill ID in author/name or source/author/name format
 * @returns Object with source (optional), author, and name, or null if invalid format
 *
 * @example
 * parseSkillId('anthropic/commit') // { author: 'anthropic', name: 'commit' }
 * parseSkillId('github/cyanheads/git-mcp-server') // { source: 'github', author: 'cyanheads', name: 'git-mcp-server' }
 * parseSkillId('invalid') // null
 */
export declare function parseSkillId(id: string): {
    source?: string;
    author: string;
    name: string;
} | null;
/**
 * Map MCP trust tier to database trust tier.
 *
 * Types are now unified: verified, community, experimental, curated, unknown, local
 * SMI-1809: Added 'local' for local skills from ~/.claude/skills/
 * SMI-2381 / SMI-4520: Added 'curated' for third-party publishers
 * SMI-5205: Added 'official' and 'unverified' to match public 5-tier model
 *
 * @param mcpTier - MCP trust tier
 * @returns Database trust tier
 */
export declare function mapTrustTierToDb(mcpTier: MCPTrustTier): DBTrustTier;
/**
 * Map database trust tier to MCP trust tier.
 *
 * Accepts string input and validates, returning 'unknown' for invalid values.
 * Types are unified: verified, community, experimental, curated, unknown, local
 * SMI-1809: Added 'local' for local skills from ~/.claude/skills/
 * SMI-2381 / SMI-4520: Added 'curated' for third-party publishers
 *
 * @param dbTier - Database trust tier (string or typed)
 * @returns MCP trust tier
 */
export declare function mapTrustTierFromDb(dbTier: DBTrustTier | string): MCPTrustTier;
/**
 * Extract skill category from tags array.
 *
 * Searches through tags to find the first valid category match.
 * Handles case-insensitive matching and common aliases.
 *
 * @param tags - Array of skill tags
 * @returns Valid SkillCategory, defaults to 'other' if no match
 *
 * @example
 * extractCategoryFromTags(['git', 'testing', 'jest']) // 'testing'
 * extractCategoryFromTags(['react', 'frontend']) // 'development'
 * extractCategoryFromTags(['random', 'tags']) // 'other'
 */
export declare function extractCategoryFromTags(tags: string[] | undefined | null): SkillCategory;
/**
 * Normalize a category name from the API into a valid SkillCategory.
 *
 * The API (via skills-get edge function) joins skill_categories and returns
 * display names from the categories table. Those names drift from the
 * lowercase SkillCategory enum in three ways:
 *   - Case: "Database" / "AI/ML" / "Other" vs "database" / "ai-ml" / "other"
 *   - Separator: "AI/ML" uses slash; enum uses dash
 *   - Pluralization: "integrations" (DB) vs "integration" (enum)
 *
 * Returns null when the input is missing or not mappable, letting the caller
 * fall back to tag-based inference without laundering garbage into the enum.
 *
 * @param name - Raw category name from API response
 * @returns Valid SkillCategory, or null when not mappable
 *
 * @example
 * normalizeApiCategory('Database')       // 'database'
 * normalizeApiCategory('AI/ML')          // 'ai-ml'
 * normalizeApiCategory('integrations')   // 'integration'
 * normalizeApiCategory('product')        // null (not in enum)
 * normalizeApiCategory(undefined)        // null
 */
export declare function normalizeApiCategory(name: string | undefined | null): SkillCategory | null;
/**
 * Get trust badge string for display.
 *
 * Returns a formatted badge string for terminal/CLI display
 * based on the skill's trust tier.
 * SMI-1809: Added 'local' badge for local skills.
 *
 * @param tier - Trust tier value
 * @returns Formatted badge string (e.g., '[VERIFIED]')
 *
 * @example
 * getTrustBadge('verified') // '[VERIFIED]'
 * getTrustBadge('community') // '[COMMUNITY]'
 * getTrustBadge('local') // '[LOCAL]'
 */
export declare function getTrustBadge(tier: MCPTrustTier): string;
/**
 * SMI-2760: Canonical IDE slug list for compatibility validation.
 * KNOWN_IDES / KNOWN_LLMS — versioned enum, updated as the ecosystem evolves.
 * To add new values: update this array and bump the SMI-2760 Linear issue.
 *
 * Note: 'vscode' = GitHub Copilot Chat (highest market share). 'codex' removed — deprecated/rebranded.
 */
export declare const KNOWN_IDES: readonly string[];
/**
 * SMI-2760: Canonical LLM slug list for compatibility validation.
 * @see KNOWN_IDES for update process.
 */
export declare const KNOWN_LLMS: readonly string[];
//# sourceMappingURL=validation.d.ts.map