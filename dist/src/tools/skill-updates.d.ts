/**
 * @fileoverview skill_updates MCP tool — check for registry skill updates
 * @module @skillsmith/mcp-server/tools/skill-updates
 * @see SMI-skill-version-tracking Wave 1
 * @see SMI-6343 Wave 2 — real content-hash comparison (C1)
 *
 * Compares the manifest's recorded install/update-time content hash of each
 * installed skill against the most-recent hash in the skill_versions table
 * to determine whether a newer version has been synced from the registry.
 *
 * SMI-6343 (C1): previously compared `skill_versions`' OLDEST recorded row
 * (documented as a stand-in for "what was installed") against its LATEST
 * row — but `oldest` was never actually tied to a real install event, and
 * (pre-fix) `skill_versions.content_hash` was a metadata-proxy hash, not a
 * real SKILL.md hash, making the whole comparison structurally meaningless.
 * Now compares the manifest's own recorded `contentHash`/`originalContentHash`
 * (the real hash of what is actually installed) against the latest real
 * registry hash, via the shared `compareSkillContentHashes()` comparator so
 * this tool, `skill_outdated`, and the CLI's `skills-directory.ts` cannot
 * drift apart on what "an update is available" means.
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
    /**
     * SMI-6343: 8-char prefix of the manifest's recorded install/update-time
     * content hash (`contentHash` ?? `originalContentHash`) — the real
     * recorded installed hash. Renders as the honest placeholder `'--------'`
     * (never a stale `skill_versions` row) when the manifest has no entry for
     * this skill id — `updateAvailable` is `false` for that row too, since an
     * `unknown` comparator outcome never reports an update.
     */
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