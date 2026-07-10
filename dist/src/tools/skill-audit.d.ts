/**
 * @fileoverview skill_audit MCP tool — check skills for security advisories
 * @module @skillsmith/mcp-server/tools/skill-audit
 * @see SMI-skill-version-tracking Wave 3
 *
 * Returns a summary of active security advisories for installed skills.
 * Advisories are published by the Skillsmith team as security issues
 * are identified.
 *
 * Tier gate: Team (skill_security_audit feature flag).
 * Community and Individual users receive a graceful license error response.
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
/**
 * Input schema for skill_audit tool
 */
export declare const skillAuditInputSchema: z.ZodObject<{
    /** Optional filter — check only the specified skill IDs */
    skillIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    skillIds?: string[] | undefined;
}, {
    skillIds?: string[] | undefined;
}>;
export type SkillAuditInput = z.infer<typeof skillAuditInputSchema>;
/**
 * Per-advisory summary entry in the audit response
 */
export interface AdvisoryEntry {
    /** Registry skill identifier */
    skillName: string;
    /** Advisory severity */
    severity: 'low' | 'medium' | 'high' | 'critical';
    /** Short advisory title */
    title: string;
    /** Advisory identifier (SSA-YYYY-NNN format) */
    id: string;
    /** Whether a patched version is available */
    fixAvailable: boolean;
}
/**
 * Advisory count summary by severity
 */
export interface AdvisorySummary {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
}
/**
 * Response from skill_audit tool
 */
export interface SkillAuditResponse {
    /** Whether advisories data is available */
    advisoriesAvailable: boolean;
    /** Message when no advisories are in the database */
    message?: string;
    /** Counts by severity (only present when advisoriesAvailable: true) */
    summary?: AdvisorySummary;
    /** Per-advisory details (only present when advisoriesAvailable: true) */
    advisories?: AdvisoryEntry[];
}
/**
 * MCP tool definition for skill_audit
 */
export declare const skillAuditToolSchema: {
    name: "skill_audit";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillIds: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
        };
        required: never[];
    };
};
export declare const executeSkillAudit: (input: {
    skillIds?: string[] | undefined;
}, context: ToolContext) => Promise<SkillAuditResponse>;
//# sourceMappingURL=skill-audit.d.ts.map