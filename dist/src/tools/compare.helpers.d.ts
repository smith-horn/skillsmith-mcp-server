/**
 * Compare Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/compare.helpers
 */
import type { ApiSearchResult } from '@skillsmith/core';
import type { ExtendedSkill, SkillSummary, SkillDifference, DbSkillRecord } from './compare.types.js';
/**
 * Convert skill to summary
 */
export declare function toSummary(skill: ExtendedSkill): SkillSummary;
/**
 * Generate comparison differences
 */
export declare function generateDifferences(skillA: ExtendedSkill, skillB: ExtendedSkill): SkillDifference[];
/**
 * Generate recommendation based on comparison
 */
export declare function generateRecommendation(skillA: ExtendedSkill, skillB: ExtendedSkill, differences: SkillDifference[]): {
    recommendation: string;
    winner: 'a' | 'b' | 'tie';
};
/**
 * Convert database skill to extended skill format
 *
 * Note: Dependencies are not currently stored in the database schema.
 * Features are inferred from tags for now.
 */
export declare function dbSkillToExtended(dbSkill: DbSkillRecord): ExtendedSkill;
/**
 * Convert an API-sourced skill (registry search/get result) to extended
 * skill format.
 *
 * SMI-5896: sibling to dbSkillToExtended, added so skill_compare can render
 * an API-resolved skill through the same comparison logic used for a
 * local-DB one — resolveSkillApiFirst (packages/core) now tries the registry
 * API first, so compare needs an API-shape converter it previously never had.
 *
 * Category resolution mirrors get-skill.ts's API-path preference (the API's
 * `categories[0]`, falling back to tag inference) rather than inventing a
 * third category-resolution strategy for this one call site.
 *
 * Note: the registry API does not return per-skill dependency data for
 * compare's purposes — always `[]` here too, mirroring dbSkillToExtended's
 * "reserved for future use" comment.
 */
export declare function apiSkillToExtended(apiSkill: ApiSearchResult): ExtendedSkill;
/**
 * Pad string to specified length
 */
export declare function padEnd(str: string, length: number): string;
/**
 * Format score as visual bar
 */
export declare function formatScoreBar(score: number, width: number): string;
//# sourceMappingURL=compare.helpers.d.ts.map