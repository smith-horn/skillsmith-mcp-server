/**
 * Compare Tool Types and Schemas
 * @module @skillsmith/mcp-server/tools/compare.types
 */
import { z } from 'zod';
import type { MCPSkill as Skill, MCPTrustTier as TrustTier, ScoreBreakdown } from '@skillsmith/core';
/**
 * Zod schema for compare tool input validation
 */
export declare const compareInputSchema: z.ZodObject<{
    /** First skill ID to compare */
    skill_a: z.ZodString;
    /** Second skill ID to compare */
    skill_b: z.ZodString;
}, "strip", z.ZodTypeAny, {
    skill_a: string;
    skill_b: string;
}, {
    skill_a: string;
    skill_b: string;
}>;
/**
 * Input type derived from Zod schema
 */
export type CompareInput = z.infer<typeof compareInputSchema>;
/**
 * Summary of a skill for comparison
 */
export interface SkillSummary {
    /** Skill identifier */
    id: string;
    /** Skill name */
    name: string;
    /** Brief description */
    description: string;
    /** Author */
    author: string;
    /** Quality score (0-100) */
    quality_score: number;
    /** Score breakdown by category */
    score_breakdown: ScoreBreakdown | null;
    /** Trust tier */
    trust_tier: TrustTier;
    /** Category */
    category: string;
    /** Tags */
    tags: string[];
    /** Version if available */
    version: string | null;
    /** Dependencies */
    dependencies: string[];
}
/**
 * Difference between skills
 */
export interface SkillDifference {
    /** Field being compared */
    field: string;
    /** Value from skill A */
    a_value: unknown;
    /** Value from skill B */
    b_value: unknown;
    /** Winner if applicable */
    winner?: 'a' | 'b' | 'tie';
}
/**
 * Comparison response
 */
export interface CompareResponse {
    /** Summaries of both skills */
    comparison: {
        a: SkillSummary;
        b: SkillSummary;
    };
    /** List of differences between skills */
    differences: SkillDifference[];
    /** Recommendation text */
    recommendation: string;
    /** Overall winner if determinable */
    winner: 'a' | 'b' | 'tie';
    /** Performance timing */
    timing: {
        totalMs: number;
    };
}
/**
 * MCP tool schema definition for skill_compare
 */
export declare const compareToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skill_a: {
                type: string;
                description: string;
            };
            skill_b: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
/**
 * Extended skill type with comparison metadata
 */
/**
 * SMI-3135: Omit Skill.dependencies (now DependencyDeclaration) and replace
 * with string[] for the compare response shape.
 */
export type ExtendedSkill = Omit<Skill, 'dependencies'> & {
    dependencies: string[];
    features: string[];
};
/**
 * Trust tier ranking for comparison
 * SMI-1809: Added 'local' tier for local skills
 * SMI-2381 / SMI-4520: Added 'curated' tier for third-party publishers (same rank as community)
 * SMI-5205: Added 'official' and 'unverified' to match public 5-tier model
 */
export declare const TRUST_TIER_RANK: Record<TrustTier, number>;
/**
 * Database skill record type
 */
export interface DbSkillRecord {
    id: string;
    name: string;
    description: string | null;
    author: string | null;
    repoUrl: string | null;
    qualityScore: number | null;
    trustTier: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=compare.types.d.ts.map