/**
 * @fileoverview MCP Tool for indexing local skills from ~/.claude/skills/
 * @module @skillsmith/mcp-server/tools/index-local
 * @see SMI-1809: Local skill indexing for MCP server
 *
 * Provides manual re-indexing of local skills with detailed results.
 *
 * @example
 * // Trigger re-indexing
 * const result = await executeIndexLocal({}, context);
 * console.log(`Indexed ${result.count} skills`);
 *
 * @example
 * // Force re-index (bypass cache)
 * const result = await executeIndexLocal({ force: true }, context);
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
/**
 * Tool schema for MCP
 */
export declare const indexLocalToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            force: {
                type: string;
                description: string;
            };
            skillsDir: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
/**
 * Zod schema for input validation
 */
export declare const indexLocalInputSchema: z.ZodObject<{
    force: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    skillsDir: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    force: boolean;
    skillsDir?: string | undefined;
}, {
    force?: boolean | undefined;
    skillsDir?: string | undefined;
}>;
/**
 * Input parameters for the index_local operation
 */
export interface IndexLocalInput {
    /** Force re-indexing even if cache is valid */
    force?: boolean;
    /** Custom skills directory path */
    skillsDir?: string;
}
/**
 * Summary of an indexed skill for response
 */
export interface IndexedSkillSummary {
    /** Skill ID (local/{name}) */
    id: string;
    /** Skill name */
    name: string;
    /** Quality score (0-100) */
    qualityScore: number;
    /** Whether SKILL.md was found */
    hasSkillMd: boolean;
    /** Number of tags */
    tagCount: number;
}
/**
 * Response from index_local operation
 */
export interface IndexLocalResponse {
    /** Number of skills indexed */
    count: number;
    /** Path to skills directory */
    skillsDir: string;
    /** Summary of indexed skills */
    skills: IndexedSkillSummary[];
    /** Timing information */
    timing: {
        indexMs: number;
        totalMs: number;
    };
    /** Whether result was from cache */
    fromCache: boolean;
}
export declare const executeIndexLocal: (input: IndexLocalInput, _context: ToolContext) => Promise<IndexLocalResponse>;
/**
 * Format index results for terminal/CLI display.
 *
 * @param response - Index response from executeIndexLocal
 * @returns Formatted string suitable for terminal output
 */
export declare function formatIndexLocalResults(response: IndexLocalResponse): string;
//# sourceMappingURL=index-local.d.ts.map