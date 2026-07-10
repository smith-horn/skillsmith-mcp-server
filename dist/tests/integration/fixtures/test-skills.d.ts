/**
 * SMI-903: Comprehensive test skill fixtures
 * Provides 50+ skills across all categories and trust tiers for realistic testing
 *
 * This file aggregates skills from category-specific modules for backwards
 * compatibility with existing tests.
 */
import type { SkillRepository } from '@skillsmith/core';
import type { TestSkillData } from './skill-types.js';
export type { TestSkillData } from './skill-types.js';
export { VERIFIED_SKILLS } from './verified-skills.js';
export { TESTING_SKILLS } from './testing-skills.js';
export { DEVOPS_SKILLS } from './devops-skills.js';
export { DEVELOPMENT_SKILLS, DOCUMENTATION_SKILLS, DATABASE_SKILLS, OVERLAP_DETECTION_SKILLS, } from './development-skills.js';
export { EXPERIMENTAL_SKILLS, UNKNOWN_SKILLS } from './experimental-skills.js';
/**
 * Comprehensive test skills covering all categories and trust tiers
 * Total: 58 skills (updated for SMI-907)
 * - Categories: development, testing, documentation, devops, database, security, productivity, integration, ai-ml, other
 * - Trust tiers: verified (8), community (26), experimental (16), unknown (8)
 */
export declare const TEST_SKILLS: TestSkillData[];
/**
 * Seed all test skills into the repository
 */
export declare function seedTestSkills(repo: SkillRepository): void;
/**
 * Get skills by category for targeted testing
 */
export declare function getSkillsByCategory(category: string): TestSkillData[];
/**
 * Get skills by trust tier for targeted testing
 */
export declare function getSkillsByTrustTier(tier: 'verified' | 'community' | 'experimental' | 'unknown'): TestSkillData[];
/**
 * Summary statistics for test data validation
 */
export declare const TEST_SKILLS_STATS: {
    total: number;
    byTrustTier: {
        verified: number;
        community: number;
        experimental: number;
        unknown: number;
    };
    byCategory: {
        development: number;
        testing: number;
        documentation: number;
        devops: number;
        database: number;
        security: number;
        productivity: number;
        integration: number;
        'ai-ml': number;
    };
};
//# sourceMappingURL=test-skills.d.ts.map