/**
 * @fileoverview skill_outdated MCP tool — check installed skills for updates and dependency status
 * @module @skillsmith/mcp-server/tools/outdated
 * @see SMI-3138: Wave 5 — Dependency intelligence outdated tool
 *
 * Reads the local manifest (~/.skillsmith/manifest.json), hashes each installed
 * SKILL.md, and compares against the latest content hash in skill_versions.
 * Optionally includes dependency satisfaction status from skill_dependencies.
 *
 * Tier gate: Community (null feature flag — no license required).
 *
 * Hash display: truncated to 8 chars for human readability (full hash stored).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
/**
 * Input schema for skill_outdated tool
 */
export declare const outdatedInputSchema: z.ZodObject<{
    /** Include dependency satisfaction status in results (default: true) */
    include_deps: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    include_deps: boolean;
}, {
    include_deps?: boolean | undefined;
}>;
export type OutdatedInput = z.infer<typeof outdatedInputSchema>;
/**
 * Dependency satisfaction details for a single skill
 */
export interface DependencyStatus {
    total: number;
    satisfied: string[];
    missing: string[];
}
/**
 * Per-skill outdated information returned by the tool
 */
export interface OutdatedSkillInfo {
    /** Registry skill identifier (e.g. "author/skill-name") */
    id: string;
    /** 8-char prefix of the locally-installed content hash */
    installed_hash: string;
    /** 8-char prefix of the latest registry hash */
    latest_hash: string;
    /** Status of the skill: current, outdated, or unknown (no registry data) */
    status: 'current' | 'outdated' | 'unknown';
    /** Semver from the latest version record, if available */
    semver: string | null;
    /** Dependency satisfaction details (omitted when include_deps is false) */
    dependencies?: DependencyStatus;
    /**
     * SMI-5407: Present when manifest entry lacks a `source` URL. Directs the
     * user to `sklx audit sources` / `skill_recover_source` to recover.
     */
    hint?: string;
}
/**
 * Summary counts for the outdated check
 */
export interface OutdatedSummary {
    total_installed: number;
    outdated: number;
    up_to_date: number;
    unknown: number;
    missing_deps: number;
}
/**
 * Response from skill_outdated tool
 */
export interface OutdatedResponse {
    skills: OutdatedSkillInfo[];
    summary: OutdatedSummary;
}
/**
 * MCP tool definition for skill_outdated
 */
export declare const outdatedToolSchema: {
    name: "skill_outdated";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            include_deps: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare const executeOutdated: (input: {
    include_deps: boolean;
}, context: ToolContext) => Promise<OutdatedResponse>;
//# sourceMappingURL=outdated.d.ts.map