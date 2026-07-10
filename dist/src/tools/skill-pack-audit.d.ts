/**
 * @fileoverview skill_pack_audit MCP tool — detect version drift in a skill pack
 * @module @skillsmith/mcp-server/tools/skill-pack-audit
 * @see SMI-2905: Skill registry version drift detection
 *
 * Scans a skill pack directory (pack_path/skills/{name}/SKILL.md), reads each
 * skill's bundled version: frontmatter, and compares it against the latest
 * semver recorded in the local skill_versions registry cache.
 *
 * Status values:
 *  - current          — bundled version matches registry
 *  - outdated         — registry has a newer version
 *  - ahead            — bundled version is newer than registry cache
 *  - no_registry_data — skill not found in local skill_versions cache
 *  - missing_version  — SKILL.md has no valid version: field
 *
 * Tier gate: Individual (version_tracking feature flag).
 * Community users see a graceful license error response, never a hard throw.
 */
import { z } from 'zod';
import type { NamespaceFlag, TriggerQuality } from './skill-pack-audit.types.js';
import type { ToolContext } from '../context.js';
/**
 * Input schema for skill_pack_audit tool
 */
export declare const skillPackAuditInputSchema: z.ZodObject<{
    pack_path: z.ZodString;
    check_trigger_quality: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    pack_path: string;
    check_trigger_quality: boolean;
}, {
    pack_path: string;
    check_trigger_quality?: boolean | undefined;
}>;
export type SkillPackAuditInput = z.input<typeof skillPackAuditInputSchema>;
/**
 * Drift status for a single skill in the pack
 */
export type PackSkillStatus = 'current' | 'outdated' | 'ahead' | 'no_registry_data' | 'missing_version';
/**
 * Per-skill audit result
 */
export interface PackSkillEntry {
    /** Skill name from SKILL.md frontmatter (falls back to directory name) */
    name: string;
    /** Version string from the pack's SKILL.md frontmatter, or null if absent */
    bundledVersion: string | null;
    /** Latest semver from the local skill_versions registry cache, or null */
    registryVersion: string | null;
    /** Registry skill identifier (e.g. "author/skill-name") or null if not found */
    skillId: string | null;
    /** Drift status */
    status: PackSkillStatus;
}
/**
 * Full response from skill_pack_audit tool
 */
export interface SkillPackAuditResponse {
    /** Resolved absolute path to the pack */
    packPath: string;
    /** Total number of skills found in the pack */
    skillCount: number;
    /** Number of skills where bundled version differs from registry (outdated + ahead) */
    driftCount: number;
    /** Number of skills not found in the local registry cache */
    noRegistryDataCount: number;
    /** Per-skill audit results, sorted alphabetically by name */
    skills: PackSkillEntry[];
    /**
     * SMI-4124: Trigger-quality analysis across the pack (generic trigger words
     * in skill names/descriptions). Present when `check_trigger_quality` is `true`
     * (default). Omitted when the caller explicitly opts out.
     */
    triggerQuality?: TriggerQuality;
    /**
     * SMI-4124: Namespace-quality flag on the pack itself. Present (possibly
     * `null`) when `check_trigger_quality` is `true`. `null` = clean pack name.
     * Omitted when the caller opts out.
     */
    namespaceQuality?: NamespaceFlag | null;
}
/**
 * MCP tool definition for skill_pack_audit
 */
export declare const skillPackAuditToolSchema: {
    name: "skill_pack_audit";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            pack_path: {
                type: string;
                description: string;
            };
            check_trigger_quality: {
                type: string;
                default: boolean;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const executeSkillPackAudit: (input: {
    pack_path: string;
    check_trigger_quality?: boolean | undefined;
}, context: ToolContext) => Promise<SkillPackAuditResponse>;
//# sourceMappingURL=skill-pack-audit.d.ts.map