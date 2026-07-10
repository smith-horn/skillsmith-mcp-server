/**
 * @fileoverview LocalIndexer - Scans and indexes skills from ~/.claude/skills/
 * @module @skillsmith/mcp-server/indexer/LocalIndexer
 * @see SMI-1809: Local skill indexing for MCP server
 *
 * Provides local skill discovery by scanning the user's skills directory,
 * parsing SKILL.md files for metadata, and returning searchable skill objects.
 *
 * @example
 * const indexer = new LocalIndexer();
 * const skills = await indexer.index();
 * console.log(`Indexed ${skills.length} local skills`);
 */
import { type SkillFrontmatter } from './FrontmatterParser.js';
/**
 * Local skill metadata extracted from SKILL.md
 */
export interface LocalSkill {
    /** Unique ID: local/{name} */
    id: string;
    /** Skill name from frontmatter or directory name */
    name: string;
    /** Description from frontmatter */
    description: string | null;
    /** Author from frontmatter (defaults to "local") */
    author: string;
    /** Tags from frontmatter */
    tags: string[];
    /** Calculated quality score (0-100) */
    qualityScore: number;
    /** Trust tier is always "local" for local skills */
    trustTier: 'local';
    /** Source identifier */
    source: 'local';
    /** Full path to the skill directory */
    path: string;
    /** Whether SKILL.md was found */
    hasSkillMd: boolean;
    /** Last modified timestamp */
    lastModified: string | null;
    /** SMI-2759: Source repository URL from frontmatter */
    repository: string | null;
    /** SMI-2760: Compatibility tags from frontmatter */
    compatibility?: string[];
}
/**
 * LocalIndexer class for scanning and indexing local skills
 */
export declare class LocalIndexer {
    private skillsDir;
    private cachedSkills;
    private lastIndexTime;
    private cacheTtl;
    /**
     * Create a new LocalIndexer
     * @param skillsDir - Custom skills directory (defaults to ~/.claude/skills/)
     * @param cacheTtl - Cache TTL in milliseconds (defaults to 60000 = 1 minute)
     */
    constructor(skillsDir?: string, cacheTtl?: number);
    /**
     * Calculate quality score for a local skill.
     *
     * Scoring is based on:
     * - Presence of SKILL.md file (20 points)
     * - Has name in frontmatter (10 points)
     * - Has description (20 points)
     * - Description length up to 200 chars (15 points)
     * - Has tags (15 points)
     * - Tag count up to 5 (15 points)
     * - Has author (5 points)
     *
     * @param frontmatter - Parsed frontmatter
     * @param hasSkillMd - Whether SKILL.md exists
     * @returns Quality score from 0-100
     */
    calculateQualityScore(frontmatter: SkillFrontmatter, hasSkillMd: boolean): number;
    /**
     * Index a single skill directory.
     *
     * SMI-4587 PR #4 / NEW-E-2: delegates the per-skill metadata extraction
     * to the new `indexLocalSkill` core helper. This keeps the LocalIndexer
     * focused on directory traversal + caching, and lets the namespace-audit
     * `bootstrapUnmanagedSkills` callback share the same code path. The
     * MCP-side `parseFrontmatter` (richer than the core fallback) is injected
     * so behaviour stays identical to pre-refactor.
     *
     * @param skillDir - Path to the skill directory
     * @param dirName - Name of the directory
     * @returns LocalSkill object or null if directory should be skipped
     */
    indexSkillDir(skillDir: string, _dirName: string): LocalSkill | null;
    /**
     * Internal method that performs the actual indexing.
     * Called by both index() and indexSync() to avoid code duplication.
     *
     * @param force - Force re-index even if cache is valid
     * @returns Array of LocalSkill objects
     * @see SMI-1834: Refactor to reduce code duplication
     */
    private _performIndex;
    /**
     * Index all skills in the skills directory.
     *
     * Scans ~/.claude/skills/ for subdirectories, parses SKILL.md files,
     * and returns an array of LocalSkill objects.
     *
     * @param force - Force re-index even if cache is valid
     * @returns Promise resolving to array of LocalSkill objects
     */
    index(force?: boolean): Promise<LocalSkill[]>;
    /**
     * Synchronous version of index for use in non-async contexts.
     *
     * @param force - Force re-index even if cache is valid
     * @returns Array of LocalSkill objects
     */
    indexSync(force?: boolean): LocalSkill[];
    /**
     * Clear the internal cache.
     * Forces re-indexing on next call to index().
     */
    clearCache(): void;
    /**
     * Get the skills directory path.
     */
    getSkillsDir(): string;
    /**
     * Search local skills by query.
     *
     * Performs case-insensitive search across name, description, and tags.
     *
     * @param query - Search query string
     * @param skills - Array of skills to search (optional, uses cached if not provided)
     * @returns Filtered array of matching skills
     */
    search(query: string, skills?: LocalSkill[]): LocalSkill[];
}
/**
 * Get the default LocalIndexer instance.
 * Creates one if it doesn't exist.
 */
export declare function getLocalIndexer(): LocalIndexer;
/**
 * Reset the default LocalIndexer instance (for testing).
 */
export declare function resetLocalIndexer(): void;
//# sourceMappingURL=LocalIndexer.d.ts.map