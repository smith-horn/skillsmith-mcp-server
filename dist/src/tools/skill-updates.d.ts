/**
 * @fileoverview skill_updates MCP tool — check for registry skill updates
 * @module @skillsmith/mcp-server/tools/skill-updates
 * @see SMI-skill-version-tracking Wave 1
 *
 * Compares the locally-recorded content hash of each installed skill
 * against the most-recent hash in the skill_versions table to determine
 * whether a newer version has been synced from the registry.
 *
 * Tier gate: Individual (version_tracking feature flag).
 * Community users see a graceful license error response, never a hard throw.
 *
 * Hash display: truncated to 8 chars for human readability (full hash stored).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
/**
 * Input schema for skill_updates tool
 */
export declare const skillUpdatesInputSchema: z.ZodObject<{
    /** Optional filter — check only the specified skill IDs */
    skillIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    skillIds?: string[] | undefined;
}, {
    skillIds?: string[] | undefined;
}>;
export type SkillUpdatesInput = z.infer<typeof skillUpdatesInputSchema>;
/**
 * Per-skill update information returned by the tool
 */
export interface SkillUpdateInfo {
    /** Registry skill identifier (e.g. "author/skill-name") */
    skillId: string;
    /** 8-char prefix of the oldest recorded hash in skill_versions (earliest registry sync) */
    installedHash: string;
    /** 8-char prefix of the most-recent recorded hash (current registry state) */
    latestHash: string;
    /** Optional semver from the latest version record */
    semver: string | null;
    /** Approximate age of the latest recorded version in days */
    ageDays: number;
    /** Whether this skill is pinned (Wave 2 — always false in Wave 1) */
    pinned: boolean;
    /** Whether an update is available (latestHash !== installedHash) */
    updateAvailable: boolean;
}
/**
 * Response from skill_updates tool
 */
export interface CheckUpdatesResponse {
    /** Number of skills with updates available */
    updatesAvailable: number;
    /** Per-skill details */
    skills: SkillUpdateInfo[];
}
/**
 * MCP tool definition for skill_updates
 */
export declare const skillUpdatesToolSchema: {
    name: "skill_updates";
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
export declare const executeSkillUpdates: (input: {
    skillIds?: string[] | undefined;
}, context: ToolContext) => Promise<CheckUpdatesResponse>;
//# sourceMappingURL=skill-updates.d.ts.map