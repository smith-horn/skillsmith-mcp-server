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
// ============================================================================
// Input / Output types
// ============================================================================
/**
 * Input schema for skill_outdated tool
 */
export const outdatedInputSchema = z.object({
    /** Include dependency satisfaction status in results (default: true) */
    include_deps: z
        .boolean()
        .optional()
        .default(true)
        .describe('Include dependency satisfaction status (default: true)'),
});
// ============================================================================
// Tool schema (MCP tool definition)
// ============================================================================
/**
 * MCP tool definition for skill_outdated
 */
export const outdatedToolSchema = {
    name: 'skill_outdated',
    description: 'Check installed skills for available updates and dependency satisfaction status. ' +
        'Reads the local manifest, hashes each installed SKILL.md, and compares against the ' +
        'latest registry state. Community tier — no license required.',
    title: 'Check Outdated Skills',
    annotations: { readOnlyHint: true, destructiveHint: false },
    inputSchema: {
        type: 'object',
        properties: {
            include_deps: {
                type: 'boolean',
                description: 'Include dependency satisfaction status (default: true)',
            },
        },
        required: [],
    },
};
// SMI-6532: the executeOutdatedImpl implementation and the withTelemetry-wrapped
// executeOutdated export now live in outdated.action.ts — re-exported here
// unchanged, matching the rbac-tools.ts / sso-tools.ts split convention (SMI-5127
// / SMI-6200 Wave 4 Step 0) so every existing caller keeps importing from this
// thin file. See outdated.action.ts's own header for the split rationale.
export { executeOutdated } from './outdated.action.js';
//# sourceMappingURL=outdated.js.map