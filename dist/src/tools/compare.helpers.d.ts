/**
 * Compare Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/compare.helpers
 */
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
 * Pad string to specified length
 */
export declare function padEnd(str: string, length: number): string;
/**
 * Format score as visual bar
 */
export declare function formatScoreBar(score: number, width: number): string;
//# sourceMappingURL=compare.helpers.d.ts.map