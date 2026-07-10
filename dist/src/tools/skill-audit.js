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
import { AdvisoryRepository } from '@skillsmith/core';
import { withTelemetry } from '@skillsmith/core/telemetry';
// ============================================================================
// Input / Output types
// ============================================================================
/**
 * Input schema for skill_audit tool
 */
export const skillAuditInputSchema = z.object({
    /** Optional filter — check only the specified skill IDs */
    skillIds: z
        .array(z.string().min(1))
        .optional()
        .describe('Specific skill IDs to audit (omit to audit all skills with advisories)'),
});
// ============================================================================
// Tool schema (MCP tool definition)
// ============================================================================
/**
 * MCP tool definition for skill_audit
 */
export const skillAuditToolSchema = {
    name: 'skill_audit',
    description: 'Check installed skills for known security advisories. ' +
        'Requires Team tier or higher (skill_security_audit feature). ' +
        'The advisory system is in early access — the Skillsmith team publishes advisories ' +
        'as security issues are identified. Run `skillsmith sync` to fetch the latest advisories.',
    inputSchema: {
        type: 'object',
        properties: {
            skillIds: {
                type: 'array',
                items: { type: 'string' },
                description: 'Specific skill IDs to audit (omit to return all skills with active advisories).',
            },
        },
        required: [],
    },
};
// ============================================================================
// Execution
// ============================================================================
/**
 * Execute the skill_audit tool.
 *
 * Reads active advisories from skill_advisories table (migration v6).
 * When the table is empty, returns an early-access message instead of
 * an empty result so users understand the system is operational but
 * advisory data has not yet been synced.
 *
 * @param input   Validated tool input
 * @param context Tool context with database connection
 * @returns SkillAuditResponse with advisory data or early-access message
 */
async function executeSkillAuditImpl(input, context) {
    const advisoryRepo = new AdvisoryRepository(context.db);
    // Fetch advisories — filter by skillIds if provided
    let advisories;
    if (input.skillIds && input.skillIds.length > 0) {
        advisories = input.skillIds.flatMap((id) => advisoryRepo.getAdvisoriesForSkill(id));
    }
    else {
        advisories = advisoryRepo.getActiveAdvisories();
    }
    // No advisories in DB
    if (advisories.length === 0) {
        return {
            advisoriesAvailable: false,
            message: 'No advisories have been published yet. This does not indicate installed ' +
                'skills have been reviewed. Run `skillsmith sync` to fetch the latest.',
        };
    }
    // Build summary counts
    const summary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
    for (const adv of advisories) {
        summary[adv.severity]++;
        summary.total++;
    }
    // Build per-advisory entries
    const entries = advisories.map((adv) => ({
        skillName: adv.skillId,
        severity: adv.severity,
        title: adv.title,
        id: adv.id,
        fixAvailable: Boolean(adv.patchedVersions),
    }));
    return {
        advisoriesAvailable: true,
        summary,
        advisories: entries,
    };
}
// SMI-5017 W2.S2: wrap at export boundary
export const executeSkillAudit = withTelemetry(executeSkillAuditImpl, {
    source: 'mcp-tool',
    extractSkillId: () => 'skill_audit',
    extractFramework: () => 'unknown',
});
//# sourceMappingURL=skill-audit.js.map