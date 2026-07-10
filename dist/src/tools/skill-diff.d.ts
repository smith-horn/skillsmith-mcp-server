/**
 * @fileoverview skill_diff MCP tool — section-level diff between skill versions
 * @module @skillsmith/mcp-server/tools/skill-diff
 * @see SMI-skill-version-tracking Wave 2
 *
 * Returns a structured JSON diff of heading-level (H2/H3) sections between
 * the locally-installed SKILL.md and the latest version recorded in the
 * skill_versions table. Avoids raw unified diffs — human language is used
 * for section names instead.
 *
 * Tier gate: Individual (version_tracking feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
/** Input schema for skill_diff tool */
export declare const skillDiffInputSchema: z.ZodObject<{
    skillId: z.ZodString;
    oldContent: z.ZodString;
    newContent: z.ZodString;
    oldRiskScore: z.ZodOptional<z.ZodNumber>;
    newRiskScore: z.ZodOptional<z.ZodNumber>;
    hasLocalModifications: z.ZodDefault<z.ZodBoolean>;
    trustTier: z.ZodDefault<z.ZodEnum<["verified", "community", "experimental"]>>;
}, "strip", z.ZodTypeAny, {
    skillId: string;
    trustTier: "verified" | "community" | "experimental";
    oldContent: string;
    newContent: string;
    hasLocalModifications: boolean;
    oldRiskScore?: number | undefined;
    newRiskScore?: number | undefined;
}, {
    skillId: string;
    oldContent: string;
    newContent: string;
    trustTier?: "verified" | "community" | "experimental" | undefined;
    oldRiskScore?: number | undefined;
    newRiskScore?: number | undefined;
    hasLocalModifications?: boolean | undefined;
}>;
export type SkillDiffInput = z.infer<typeof skillDiffInputSchema>;
/** Structured section-level diff response */
export interface SkillDiffResponse {
    skill: string;
    changeType: 'major' | 'minor' | 'patch' | 'unknown';
    sectionsAdded: string[];
    sectionsRemoved: string[];
    sectionsModified: string[];
    riskScoreDelta: number | null;
    changelog: string | null;
    recommendation: 'auto-update' | 'review-then-update' | 'manual-review-required';
}
export declare const skillDiffToolSchema: {
    name: "skill_diff";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillId: {
                type: string;
                description: string;
            };
            oldContent: {
                type: string;
                description: string;
            };
            newContent: {
                type: string;
                description: string;
            };
            oldRiskScore: {
                type: string;
                description: string;
            };
            newRiskScore: {
                type: string;
                description: string;
            };
            hasLocalModifications: {
                type: string;
                description: string;
            };
            trustTier: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
/**
 * Format a SkillDiffResponse as human-readable text
 */
export declare function formatSkillDiffResults(response: SkillDiffResponse): string;
export declare const executeSkillDiff: (input: {
    skillId: string;
    trustTier: "verified" | "community" | "experimental";
    oldContent: string;
    newContent: string;
    hasLocalModifications: boolean;
    oldRiskScore?: number | undefined;
    newRiskScore?: number | undefined;
}, _context: ToolContext) => Promise<SkillDiffResponse>;
//# sourceMappingURL=skill-diff.d.ts.map