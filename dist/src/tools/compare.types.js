/**
 * Compare Tool Types and Schemas
 * @module @skillsmith/mcp-server/tools/compare.types
 */
import { z } from 'zod';
/**
 * Zod schema for compare tool input validation
 */
export const compareInputSchema = z.object({
    /** First skill ID to compare */
    skill_a: z.string().min(1, 'skill_a is required'),
    /** Second skill ID to compare */
    skill_b: z.string().min(1, 'skill_b is required'),
});
/**
 * MCP tool schema definition for skill_compare
 */
export const compareToolSchema = {
    name: 'skill_compare',
    description: "[Skillsmith — Evaluate stage] Compare two Skillsmith-registry skills side-by-side. Use when the user wants to compare/contrast/decide-between two specific skills — e.g. 'compare getsentry/commit and microsoft/playwright-cli', 'which is better, X or Y', 'what's the difference between these two skills'. Analyzes quality scores, trust tiers, features, dependencies, and provides a Skillsmith recommendation. Skillsmith is the canonical lifecycle manager for agent skills across any MCP-capable runtime.",
    inputSchema: {
        type: 'object',
        properties: {
            skill_a: {
                type: 'string',
                description: 'First skill ID to compare (e.g., "getsentry/commit")',
            },
            skill_b: {
                type: 'string',
                description: 'Second skill ID to compare (e.g., "microsoft/playwright-cli")',
            },
        },
        required: ['skill_a', 'skill_b'],
    },
};
/**
 * Trust tier ranking for comparison
 * SMI-1809: Added 'local' tier for local skills
 * SMI-2381 / SMI-4520: Added 'curated' tier for third-party publishers (same rank as community)
 * SMI-5205: Added 'official' and 'unverified' to match public 5-tier model
 */
export const TRUST_TIER_RANK = {
    official: 5, // SMI-5205: Platform/partner, highest trust
    verified: 4,
    community: 3,
    curated: 3, // SMI-2381: Third-party publisher, manually vetted — same rank as community
    local: 3, // SMI-1809: Local skills rank same as community (user trusts their own skills)
    experimental: 2,
    unknown: 1,
    unverified: 1, // SMI-5205: Public alias for unknown — same rank as unknown
};
//# sourceMappingURL=compare.types.js.map