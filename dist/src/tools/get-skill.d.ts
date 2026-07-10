/**
 * @fileoverview MCP Get Skill Tool for retrieving detailed skill information
 * @module @skillsmith/mcp-server/tools/get-skill
 * @see {@link https://github.com/wrsmith108/skillsmith|Skillsmith Repository}
 * @see SMI-790: Wire get-skill tool to SkillRepository
 *
 * Retrieves comprehensive details for a specific skill including:
 * - Basic metadata (name, author, version, category)
 * - Quality scores with breakdown (quality, popularity, maintenance, security, documentation)
 * - Trust tier with explanation
 * - Repository link and tags
 * - Installation command
 *
 * @example
 * // Get skill by ID with context
 * const response = await executeGetSkill({ id: 'getsentry/commit' }, context);
 * console.log(response.skill.description);
 *
 * @example
 * // Format for terminal display
 * const response = await executeGetSkill({ id: 'microsoft/playwright-cli' }, context);
 * console.log(formatSkillDetails(response));
 */
import { z } from 'zod';
import { type GetSkillResponse } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
/**
 * Zod schema for get-skill input validation
 */
export declare const getSkillInputSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
/**
 * Get skill tool schema for MCP
 */
export declare const getSkillToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
/**
 * Input parameters for the get skill operation
 * @interface GetSkillInput
 */
export interface GetSkillInput {
    /** Skill ID in format "author/skill-name" or UUID */
    id: string;
}
export { formatSkillDetails } from './get-skill.format.js';
export declare const executeGetSkill: (input: GetSkillInput, context: ToolContext) => Promise<GetSkillResponse>;
//# sourceMappingURL=get-skill.d.ts.map