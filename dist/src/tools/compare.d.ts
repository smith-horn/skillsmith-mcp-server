/**
 * @fileoverview MCP Skill Compare Tool for comparing two skills
 * @module @skillsmith/mcp-server/tools/compare
 * @see SMI-743: Add MCP Tool skill_compare
 * @see SMI-791: Wire compare tool to SkillRepository
 *
 * Compares two skills across multiple dimensions:
 * - Quality scores
 * - Trust tiers
 * - Features and capabilities
 * - Dependencies
 * - Size and complexity
 *
 * @example
 * // Compare two skills with context
 * const result = await executeCompare({
 *   skill_a: 'getsentry/commit',
 *   skill_b: 'microsoft/playwright-cli'
 * }, context);
 * console.log(result.recommendation);
 */
import type { ToolContext } from '../context.js';
import type { CompareResponse } from './compare.types.js';
export type { CompareInput, CompareResponse, SkillSummary, SkillDifference, } from './compare.types.js';
export { compareInputSchema, compareToolSchema } from './compare.types.js';
export declare const executeCompare: (input: {
    skill_a: string;
    skill_b: string;
}, context: ToolContext) => Promise<CompareResponse>;
/**
 * Format comparison results for terminal display
 */
export declare function formatComparisonResults(response: CompareResponse): string;
//# sourceMappingURL=compare.d.ts.map