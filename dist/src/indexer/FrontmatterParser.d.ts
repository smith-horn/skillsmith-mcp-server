/**
 * @fileoverview FrontmatterParser - YAML frontmatter parsing for SKILL.md files
 * @module @skillsmith/mcp-server/indexer/FrontmatterParser
 * @see SMI-1829: Split LocalIndexer.ts to comply with 500-line governance limit
 *
 * Provides YAML frontmatter parsing functionality extracted from LocalIndexer
 * for better modularity and governance compliance.
 *
 * Parity: supabase/functions/indexer/frontmatter-parser.ts
 */
/**
 * Parsed SKILL.md frontmatter fields
 */
export interface SkillFrontmatter {
    name: string | null;
    description: string | null;
    author: string | null;
    tags: string[];
    version: string | null;
    triggers: string[];
    /** SMI-2759: Source repository URL (parity with SkillParser in core) */
    repository: string | null;
    /** SMI-2759: Homepage URL — parsed for parity; not yet surfaced in API responses */
    homepage: string | null;
    /** SMI-2760: Compatibility tags (platform/IDE/LLM); stored in Wave 3a migration */
    compatibility: string[];
}
/**
 * Parse SKILL.md frontmatter to extract metadata.
 *
 * Supports YAML frontmatter delimited by `---` lines.
 * Extracts name, description, author, tags, version, and triggers.
 * Handles multi-line values: folded block (>-/>), literal block (|/|-),
 * and plain multi-line scalars.
 *
 * @param content - Content of the SKILL.md file
 * @returns Parsed frontmatter fields
 */
export declare function parseFrontmatter(content: string): SkillFrontmatter;
//# sourceMappingURL=FrontmatterParser.d.ts.map